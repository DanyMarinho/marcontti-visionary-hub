
# Auditoria — Perfil Vendedor

## Evidências por arquivo

Critérios: (1) filtro `seller_id`, (2) filtro `store_id`, (3) filtro `tenant_id`, (4) proteção de rota, (5) acesso cruzado, (6) troca de tenant, (7) troca de loja.

### 1) `src/store/authStore.ts`
- L22-43: `mockTenants` hardcoded (4 tenants).
- L45-54: `mockUser` hardcoded como `admin`, `tenant_id:'1'`.
- L56-86: store inicializa SEMPRE com `mockUser` (admin) — não lê sessão Supabase.
- L61-62: `selectedTenantId`/`selectedStoreId` lidos de `localStorage`, default `'all'`.
- L69-78 `setSelectedTenant` / L79 `setSelectedStore`: vendedor pode trocar tenant/loja livremente.
- L80-82 `setRole`: qualquer usuário muda a própria role no client.
- L85 `login: () => {}` / L86 `logout`: apenas limpa estado local.
- **Status:** (1)🔴 (2)🔴 (3)🔴 (4)🔴 (5)🔴 (6)🔴 (7)🔴

### 2) `useAuth.ts`
- Não existe no projeto. **Status:** 🔴 todos os critérios.

### 3) `src/hooks/useTenant.ts`
- L7 lê `selectedTenantId` do `authStore` (mutável pelo usuário).
- L15-20 `setActiveTenant`: grava em `localStorage` e invalida cache — vendedor consegue trocar tenant.
- Não compara `selectedTenantId` ao `user.tenant_id` real.
- **Status:** (3)🟡 (6)🔴 (7)n/a (4/5)🔴

### 4) `src/hooks/useStore.ts`
- L10 lê `selectedStoreId` de `authStore` (mutável).
- L24-28 `setActiveStore`: persiste qualquer storeId — vendedor troca loja.
- L14 `storeService.getAll(activeTenantId)` sem filtro `store_id = user.store_id` para vendedor.
- **Status:** (2)🔴 (7)🔴

### 5) `src/modules/pipeline/hooks/usePipeline.ts`
- L12-16: `getCards(activeTenantId, filters)` — sem `seller_id` e sem `store_id` no client.
- A segurança depende apenas da RLS (`cards_select` permite vendedor ver onde `seller_id = auth.uid()`), mas se o componente passar `seller_id` no objeto `filters`, não há garantia visível.
- L20: `moveCard` usa `user!.id` (vendedor consegue mover só os seus pela RLS, ok no servidor; client não valida).
- **Status:** (1)🟡 (2)🔴 (3)🟢 (via activeTenantId) (4)🔴 (5)🟡

### 6) `src/modules/crm/hooks/useClientes.ts`
- L11-15: `clientService.getAll(activeTenantId, ...)` — sem `seller_id`/`store_id`.
- Vendedor depende inteiramente da policy `clients_select` que permite ver clientes vinculados a `pipeline_cards` próprios — funciona, porém sem filtro explícito no client.
- L23: `create` usa `tenant_id: activeTenantId` (que vem de `selectedTenantId`, mutável) — risco de criar cliente em outro tenant se RLS não bloquear. RLS exige `loja` ou `admin` para INSERT, então vendedor NÃO pode criar — UI ainda expõe o botão.
- **Status:** (1)🔴 (2)🔴 (3)🟡 (4)🔴

### 7) `src/modules/whatsapp/WhatsAppInbox.tsx`
- L29-33: `getConversations(activeTenantId, statusFilter)` sem `seller_id`/`store_id`.
- Segurança via `wa_conversations_select` (vendedor vê se `assigned_to=auth.uid()` OU é seller de card). OK no servidor; client não filtra.
- Sem proteção de rota por role.
- **Status:** (1)🔴 (2)🔴 (3)🟢 (4)🔴

### 8) `src/modules/whatsapp/ConversationView.tsx`
- L84-102 `sellers`: SELECT em `users` por `tenant_id` (+ `store_id` se houver) — vendedor consegue listar **todos** os vendedores do tenant (filtro `store_id` só aplica se `user.store_id` truthy; RLS `users_select` permite ver se `id=auth.uid()` ou admin/loja — vendedor não obteria a lista, mas a query é feita).
- L249: botão "Transferir" exibido só para admin/loja (ok), mas painel de transferência depende da role de `authStore` (mutável).
- L113-145 `updateConvMutation` sem checar ownership.
- **Status:** (1)🔴 (2)🟡 (3)🟢 (5)🟡

### 9) `src/pages/Dashboard.tsx`
- Roteia componente por `user.role` (mockado/mutável). Sem guard server-side.
- **Status:** (4)🔴 (6/7) n/a

### 10) `src/components/layout/Sidebar.tsx`
- L67 filtra menu por `user.role` — mas role vem do mock mutável.
- L143-176: **botão "Troca Rápida de Perfil"** permite qualquer usuário virar admin no client (`setRole`).
- **Status:** (4)🔴 (5)🔴

---

## Resumo
- **Raiz do vazamento:** `authStore` opera 100% em mock (`mockUser` admin), com `setRole`, `setSelectedTenant`, `setSelectedStore` livres. Toda a aplicação confia nessa fonte. RLS no banco mitiga vazamento real de dados, mas o cliente expõe UI e queries inseguras.
- Filtros `seller_id`/`store_id` NÃO existem em nenhuma query do client; toda contenção vem só da RLS.

---

## Plano de correção (Fase 1 — Vendedor)

Sem alterar design/UI. Mudanças apenas em estado, hooks e guards.

### 1. Reescrever `src/store/authStore.ts`
- Remover `mockUser`, `mockTenants`, `setRole`, `login: ()=>{}`.
- Bootstrap a partir de `supabase.auth.getUser()` + `SELECT * FROM users WHERE id = auth.uid()` (id, email, full_name, role, tenant_id, store_id, is_active).
- Carregar role de `user_roles` (já existe RPC `user_role`); preferir essa fonte.
- `logout` chama `supabase.auth.signOut()`.
- Remover `selectedTenantId`/`selectedStoreId` mutáveis; derivar de `user.tenant_id` e `user.store_id`. Manter `selectedTenantId='all'` SOMENTE para admin.
- `setSelectedTenant`/`setSelectedStore`: bloquear quando `role !== 'admin'` (ignorar chamada).
- Apagar entradas `localStorage.activeTenantId`/`activeStoreId` quando vendedor/loja.

### 2. Criar `src/hooks/useAuth.ts`
- Hook único: assina `onAuthStateChange`, popula `authStore`, expõe `{ user, isLoading, isAuthenticated, signOut }`.
- Usado no `App.tsx` para gate.

### 3. `src/hooks/useTenant.ts`
- Vendedor/loja: `activeTenantId = user.tenant_id` (imutável).
- `setActiveTenant` no-op para não-admin.

### 4. `src/hooks/useStore.ts`
- Vendedor: `activeStoreId = user.store_id` (imutável); `stores = [userStore]`.
- Loja: limitar a lojas do `tenant_id`.
- `setActiveStore` no-op para não-admin.

### 5. `usePipeline.ts`
- Quando `role==='vendedor'`: forçar `filters = { ...filters, seller_id: user.id, store_id: user.store_id }` no `getCards`.
- Quando `role==='loja'`: forçar `store_id: user.store_id`.
- Ajustar `pipelineCardService.getCards` para aplicar `.eq('seller_id', f.seller_id).eq('store_id', f.store_id)` quando presentes.

### 6. `useClientes.ts`
- Vendedor: chamar `clientService.getAll` com filtro `seller_id: user.id` (JOIN/exists em `pipeline_cards`).
- Loja: filtro `store_id`.
- Desabilitar mutações de create/update/delete na UI quando vendedor (já bloqueado por RLS; remover botões).

### 7. `WhatsAppInbox.tsx` / `whatsappService.getConversations`
- Aceitar `{ sellerId?, storeId? }` e aplicar `.eq('assigned_to', sellerId)` para vendedor; `store_id` via JOIN com `users` para loja.

### 8. `ConversationView.tsx`
- Query `sellers`: só executar quando `role` é admin/loja. Para vendedor: `enabled:false`.
- Ocultar `Transferir` e `Resolver` quando não autorizado (já parcial; revalidar com role real).

### 9. `Dashboard.tsx`
- Manter switch por role mas usar role do `users`/`user_roles` (não mock).

### 10. `Sidebar.tsx`
- **Remover** bloco "Troca Rápida de Perfil" (L143-176) — vetor de escalonamento.
- Menu já filtra por role; manter usando role real.

### 11. Guards de rota (`App.tsx` ou wrapper)
- `RequireAuth` para todas rotas privadas.
- `RequireRole(['admin'])` em: `/tenants`, `/shops`, `/vendors`, `/projection`.
- `RequireRole(['admin','loja'])` em: `/team`, `/ai-agent`, `/metrics` (parcial), `/crm` se aplicável.
- Redirecionar vendedor para `/` se acessar rota negada.

### 12. Limpeza
- Remover `localStorage.activeTenantId`/`activeStoreId` legacy no logout.
- Remover imports/usos de `mockUser`/`mockTenants`.

## Detalhes técnicos
- Não criar nova migration — RLS já está correta.
- Tabela `users` já tem `tenant_id`, `store_id`, `role`, `is_active` (campo `must_change_password` mencionado no pedido NÃO existe; ignorar nesta fase ou abrir Fase 4).
- Tipos: `User` em `src/types` deve incluir `store_id`.
- Testes manuais por role após implementar: login vendedor → confirmar (a) menu reduzido, (b) sem botão "Troca Rápida", (c) Pipeline/CRM/WhatsApp só com itens próprios, (d) tentativa de `setActiveTenant`/`setActiveStore` ignorada.
