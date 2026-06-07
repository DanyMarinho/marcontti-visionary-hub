# AUDITORIA COMPLETA DOS PERFIS — MEC Hub
**Data:** 07/06/2026 | **Base:** código atual no repositório

---

## LEGENDA
- ✅ Funcionando corretamente, sem bugs
- ⚠️ Funciona parcialmente / tem dado falso / tem problema menor
- ❌ Quebrado / não funciona / dado falso crítico
- 🔒 Segurança correta
- 🔓 Brecha de segurança

---

# PERFIL 1 — ADMIN

## Login e Autenticação
| Item | Status | Detalhe |
|------|--------|---------|
| Login com email/senha | ✅ | Supabase Auth real, sem mock |
| Carregamento do perfil `public.users` | ✅ | `useAuth.ts` busca perfil corretamente |
| Role vinda do banco (`user_role()`) | ✅ | RPC `user_role()` consultada |
| Redirecionamento para `/` após login | ✅ | `Login.tsx` usa `onAuthStateChange` |
| Guard `RequireRole` nas rotas admin | ✅ | `/tenants`, `/shops`, `/vendors`, `/projection`, `/setup/new-tenant` protegidos |
| Logout limpa localStorage e estado | ✅ | `logout()` no authStore |
| `setRole()` no-op (não permite auto-escalada) | ✅ | `setRole: () => {}` |

## Dashboard Admin (`AdminDashboard.tsx`)
| Item | Status | Detalhe |
|------|--------|---------|
| `data-testid="admin-dashboard"` | ❌ | **NÃO adicionado ainda** — elemento raiz não tem o atributo |
| KPIs: "Empresas Ativas" | ❌ | **DADO FALSO** — hardcoded `12`, não busca do banco |
| KPIs: "Vendas do Período" | ⚠️ | Busca cards reais mas soma `estimated_value` (não `final_value`) para fechados |
| KPIs: "Cards no Pipeline" | ✅ | Calculado de dados reais |
| KPIs: "Conversão Global" | ❌ | **DADO FALSO** — hardcoded `"24.2%"` |
| Gráfico "Evolução de Faturamento" | ❌ | `salesHistory: []` — array vazio, gráfico vazio |
| Gráfico "Taxa de Conversão" | ❌ | `conversionHistory: []` — array vazio, gráfico vazio |
| "Ranking de Empresas" | ❌ | `tenantRanking: []` — array vazio, tabela vazia |
| Badge "Performance" na tabela | ❌ | **DADO FALSO** — `+${(10 - i * 2).toFixed(1)}%` inventado |
| FilterBar por período funciona | ⚠️ | Período passado mas não aplicado no filtro de datas do banco |

## Gestão de Tenants (`/tenants`)
| Item | Status | Detalhe |
|------|--------|---------|
| Listagem de tenants | ✅ | Busca real do banco |
| Criar novo tenant via Wizard | ❌ | `create_full_tenant.sql` usa colunas erradas (`cnpj_cpf`, `address`, `slug`) — quebrado |
| Wizard: validação por step | ❌ | Avança sem validar campos obrigatórios |
| Wizard: navegação pós-criação | ❌ | Navega para `/dashboard` (rota inexistente) |

## Gestão de Lojas (`/shops`) e Vendedores (`/vendors`)
| Item | Status | Detalhe |
|------|--------|---------|
| Listar lojas | ✅ | Dados reais |
| Listar usuários/vendedores | ✅ | Dados reais |
| "Cards Ativos" na tabela de usuários | ❌ | **DADO FALSO** — `Math.random() * 15` para cada vendedor |
| Criar novo usuário (Edge Function) | ✅ | `invite-user/index.ts` implementado com auth + rollback |
| `invite-user`: verifica role do caller | ✅ | Validação de `admin` ou `loja` |
| `invite-user`: referenciam `user_roles` | ❌ | Usa `user_roles` table que **não existe** no schema — schema usa coluna `role` em `users` |
| Reenviar convite | ❌ | `resendInvite()` só exibe toast, não chama API |
| Desativar vendedor (`deactivateVendor`) | ✅ | Chama Edge Function `delete-user` |

## Settings (`/settings`)
| Item | Status | Detalhe |
|------|--------|---------|
| Exige tenant selecionado | ✅ | Mostra aviso se `isGlobal` |
| "Salvar Tudo" | ❌ | **FALSO** — `setTimeout 1000ms` + toast de sucesso sem salvar nada |
| "Salvar Dados" | ❌ | **FALSO** — mesmo problema |
| "Salvar Pipeline" | ❌ | **FALSO** — não salva `pipeline_stages` |
| "Salvar Notificações" | ❌ | **FALSO** |
| "Salvar Integrações" | ❌ | **FALSO** |
| Logs de Auditoria | ❌ | **DADOS FALSOS** — array hardcoded com 5 linhas fictícias |
| Campos pré-preenchidos com dados reais | ⚠️ | Só `name`, `niche`, `contact_email` do tenant; `cnpj` está fixo como `"00.000.000/0001-00"` |

## Admin: Score Geral
**FUNCIONANDO:** 45% | **COM PROBLEMAS:** 55%
**Bloqueadores críticos para uso real:** Dashboard com 4 KPIs falsos, Settings salva em falso, Wizard quebrado, `invite-user` referencia tabela inexistente.

---

# PERFIL 2 — LOJA

## Login e Autenticação
| Item | Status | Detalhe |
|------|--------|---------|
| Login funcional | ✅ | Mesmo fluxo do admin |
| `tenant_id` e `store_id` bloqueados ao perfil | ✅ | `authStore.setUser()` trava IDs para não-admin |
| `setSelectedTenant()` bloqueado | ✅ | Retorna sem fazer nada para role `loja` |
| `setSelectedStore()` bloqueado | ✅ | Idem |
| Menu correto (sem Empresas/Lojas/Projeção) | ✅ | `Sidebar` filtra por `roles: ['loja']` |

## Dashboard Loja (`LojaDashboard.tsx`)
| Item | Status | Detalhe |
|------|--------|---------|
| `data-testid="loja-dashboard"` | ❌ | **NÃO adicionado** |
| "Vendas do Mês" | ⚠️ | Usa `final_value \|\| estimated_value` — valor correto se `final_value` foi salvo |
| "Atingimento de Meta" | ✅ | Busca `goals` real do banco |
| Descrição "+12.5% vs mês anterior" | ❌ | **DADO FALSO** — hardcoded |
| "Cards Ativos +5 novos este mês" | ❌ | **DADO FALSO** — hardcoded |
| "Reativar Agora" → navega para `/reactivation` | ✅ | Funciona |
| "Conversas Pendentes" → navega para `/whatsapp` | ✅ | Funciona |
| Gráfico "Evolução de Vendas" | ❌ | **DADO FALSO CRÍTICO** — `salesHistory` calculado multiplicando vendas atuais por 0.5/0.6/0.8/0.9/0.95/1.0 |
| Funil de Vendas | ✅ | Dados reais do banco |
| Filtro por `store_id` nas queries | ⚠️ | `LojaDashboard` usa `activeTenantId` sem filtrar por `store_id` — vê dados do tenant inteiro |

## Minha Equipe (`/team`)
| Item | Status | Detalhe |
|------|--------|---------|
| Listar equipe da loja | ⚠️ | Filtra por `activeTenantId` mas não por `store_id` — vê toda equipe do tenant |
| Criar usuário | ✅ | Chama `invite-user` (com bug da `user_roles` table) |

## WhatsApp (`/whatsapp`) — Loja
| Item | Status | Detalhe |
|------|--------|---------|
| Ver conversas do tenant | ✅ | `scope: { storeId }` passado |
| Filtro por `store_id` | ⚠️ | Filtro feito em memória (`.filter(r => r.assigned_user?.store_id === scope.storeId)`) — ineficiente |
| Enviar mensagem | ❌ | **MOCK** — `setTimeout(500ms)` finge sucesso |
| Transferir conversa | ✅ | Funciona (admin/loja apenas) |
| Resolver conversa | ✅ | Atualiza `status: 'resolved'` |
| Toggle IA por conversa | ✅ | Atualiza `ai_enabled` |
| Realtime (novas mensagens) | ✅ | `useRealtime` subscreve `postgres_changes` |

## Agente IA (`/ai-agent`)
| Item | Status | Detalhe |
|------|--------|---------|
| Carregar configuração do banco | ✅ | `agent_ia_configs` por `tenant_id` |
| Toggle ativar/desativar | ✅ | Atualiza `is_active` localmente |
| Configurar webhook URL | ✅ | Campo funcional |
| Configurar horários por dia | ✅ | `schedule` JSONB salvo corretamente |
| Salvar configurações | ✅ | `upsert` em `agent_ia_configs` |
| IA recebe mensagens via webhook | ✅ | `whatsapp-webhook/index.ts` usa Groq LLM |
| IA respeita horários | ✅ | Implementado na webhook |
| IA envia mensagem de ausência | ✅ | Fora do horário |
| Handoff para vendedor | ✅ | `[HANDOFF_VENDEDOR]` → cria card + muda `client.status` |
| Chave GROQ_API_KEY configurada? | ⚠️ | Depende de env var no Supabase — precisa ser configurada manualmente |

## Reativação (`/reactivation`)
| Item | Status | Detalhe |
|------|--------|---------|
| Lista cards parados | ✅ | Dados reais, `differenceInDays` correto |
| Filtros crítico/atenção/monitorar | ✅ | Funciona |
| Botão "Reativar agora" | ✅ | Abre `ReactivationModal` |
| Filtro por `store_id` para loja | ❌ | Busca todos os cards do tenant sem filtrar por `store_id` |
| `// @ts-nocheck` no arquivo | ❌ | **Ainda presente** — TypeScript cego neste componente |

## Loja: Score Geral
**FUNCIONANDO:** 60% | **COM PROBLEMAS:** 40%
**Bloqueadores críticos:** Envio de WhatsApp é mock, gráfico histórico falso, sem filtro por `store_id` em vários módulos.

---

# PERFIL 3 — VENDEDOR

## Login e Autenticação
| Item | Status | Detalhe |
|------|--------|---------|
| Login funcional | ✅ | Mesmo fluxo |
| `tenant_id` bloqueado | ✅ | Imutável para `vendedor` |
| `store_id` bloqueado | ✅ | Imutável para `vendedor` |
| Menu correto (sem CRM, sem Agente IA, sem Métricas) | ⚠️ | **CRM está visível** para admin/loja mas não para vendedor — correto. Mas "Métricas" tem `labelAlt: { vendedor: 'Minhas Metas' }` mas `roles: ['admin', 'loja']` — **vendedor não vê Métricas**, ok. |
| Botão "Troca Rápida de Perfil" | ✅ | **Removido** — não existe no código |

## Dashboard Vendedor (`VendedorDashboard.tsx`)
| Item | Status | Detalhe |
|------|--------|---------|
| `data-testid="vendedor-dashboard"` | ❌ | **NÃO adicionado** |
| "Minhas Vendas" | ✅ | Filtrado por `seller_id = user.id` no banco |
| "Minha Meta" | ✅ | Busca `goals` por `seller_id` |
| "Cards Ativos" | ✅ | Filtrado por `seller_id` |
| "Conversão Pessoal" | ❌ | **DADO FALSO** — hardcoded `"28%"` |
| "Próximas Atividades" | ✅ | Cards com `expected_close_date` filtrados por `seller_id` |
| "Ranking da Loja" | ❌ | `ranking: []` — **array vazio**, painel vazio sem aviso ao usuário |

## Pipeline (`/pipeline`) — Vendedor
| Item | Status | Detalhe |
|------|--------|---------|
| Vê apenas seus cards | ✅ | `scopedFilters.seller_id = user.id` em `usePipeline.ts` |
| RLS confirma no banco | ✅ | `cards_select` policy filtra por `seller_id = auth.uid()` |
| Criar card | ⚠️ | `CardForm` — precisa verificar se força `seller_id = user.id` |
| Mover card (drag & drop) | ✅ | Funciona |
| Dialog ao mover para "fechamento" | ✅ | `StageConfirmationDialog` implementado |
| `finalValue` passado para `moveCard` | ✅ | `KanbanBoard.tsx` passa `finalValue` e `closingDate` |
| `pipelineCardService.moveCard` salva `finalValue` | ❌ | **Bug não corrigido** — assinatura atual: `moveCard(cardId, tenantId, userId, fromStage, toStage)` — **não aceita `finalValue`** |
| `pos_venda` não abre dialog | ❌ | `KanbanBoard` só abre dialog para `fechamento`, não para `pos_venda` |

## WhatsApp (`/whatsapp`) — Vendedor
| Item | Status | Detalhe |
|------|--------|---------|
| Vê só conversas atribuídas | ⚠️ | Client-side: `scope: { sellerId: user.id }` passado. Banco: **RLS ainda não corrigida** (policy usa só `tenant_id`) |
| Enviar mensagem | ❌ | **MOCK** — ainda não implementado |
| Botão "Transferir" oculto | ✅ | Visível só para admin/loja |
| Botão "Resolver" | ✅ | Disponível para vendedor |

## Reativação (`/reactivation`) — Vendedor
| Item | Status | Detalhe |
|------|--------|---------|
| Vê só seus cards | ⚠️ | RLS bloqueia no banco (correto), mas query não filtra `seller_id` explicitamente |
| `// @ts-nocheck` | ❌ | Ainda presente |

## CRM (`/crm`) — Vendedor
| Item | Status | Detalhe |
|------|--------|---------|
| Vendedor NÃO vê CRM | ✅ | `roles: ['admin', 'loja']` — rota não está no menu do vendedor |
| Se acessar `/crm` pela URL | ✅ | Sem `RequireRole` mas RLS bloqueia dados — retorna lista vazia (comportamento ok, mas sem mensagem explicativa) |

## Vendedor: Score Geral
**FUNCIONANDO:** 55% | **COM PROBLEMAS:** 45%
**Bloqueadores críticos:** `moveCard` não salva `finalValue`, envio de WhatsApp é mock, RLS do WhatsApp não filtra por vendedor.

---

# PROBLEMAS TRANSVERSAIS (afetam todos os perfis)

| # | Arquivo | Problema | Severidade |
|---|---------|---------|------------|
| T1 | `whatsappService.ts` | `// @ts-nocheck` ainda presente | 🔴 Alto |
| T2 | `ReactivationList.tsx` | `// @ts-nocheck` ainda presente | 🔴 Alto |
| T3 | `useDashboardKpis.ts` | `// @ts-nocheck` ainda presente | 🔴 Alto |
| T4 | `ConversationView.tsx` | `sendMessageMutation` ainda é mock (500ms delay) | 🔴 CRÍTICO |
| T5 | `pipelineCardService.ts` | `moveCard` não aceita nem salva `finalValue`/`closingDate` | 🔴 CRÍTICO |
| T6 | `invite-user/index.ts` | Consulta tabela `user_roles` que **não existe** no schema (schema usa coluna `role` em `users`) | 🔴 CRÍTICO |
| T7 | `AdminDashboard.tsx` | Sem `data-testid="admin-dashboard"` | 🟠 Médio |
| T8 | `LojaDashboard.tsx` | Sem `data-testid="loja-dashboard"` + gráfico de histórico falso | 🟠 Médio |
| T9 | `VendedorDashboard.tsx` | Sem `data-testid="vendedor-dashboard"` + conversão 28% hardcoded | 🟠 Médio |
| T10 | `Settings.tsx` | Todos os "Salvar" são fakes (setTimeout + toast) | 🟠 Médio |
| T11 | `Settings.tsx` | Logs de auditoria com dados hardcoded fictícios | 🟠 Médio |
| T12 | `VendedorList.tsx` | "Cards Ativos" usa `Math.random()` | 🟠 Médio |
| T13 | `useDashboardKpis.ts` | Admin: "Empresas Ativas = 12" hardcoded | 🟠 Médio |
| T14 | `useDashboardKpis.ts` | Admin: "Conversão Global = 24.2%" hardcoded | 🟠 Médio |
| T15 | `LojaDashboard.tsx` | Histórico de vendas calculado com fórmulas falsas | 🟠 Médio |
| T16 | `supabase/migrations/` | Migration de RLS do WhatsApp para vendedor não criada | 🟠 Médio |
| T17 | `NewTenantWizard.tsx` | `create_full_tenant.sql` usa schema errado | 🔴 CRÍTICO |
| T18 | `create_full_tenant.sql` | `security invoker` + colunas inexistentes | 🔴 CRÍTICO |

---

# SCORECARD GERAL POR PERFIL

## 🔴 ADMIN — 45% funcional

| Módulo | % funcional | Principal problema |
|--------|-------------|-------------------|
| Login/Auth | 100% | ✅ Sem problemas |
| Dashboard | 25% | KPIs e gráficos com dados falsos/vazios |
| Gestão de Tenants | 20% | Wizard quebrado, RPC com schema errado |
| Gestão de Lojas/Usuários | 70% | `invite-user` usa `user_roles` inexistente |
| Settings | 10% | Todos os saves são fake |
| WhatsApp | 60% | Envio mock |
| Pipeline | 80% | `finalValue` não salvo |
| Métricas | 70% | Funciona mas sem filtro de período efetivo |
| Projeção | 70% | Funciona mas usa estimated, não final_value |
| Reativação | 80% | Funcional |
| Agente IA | 85% | Funcional (depende de GROQ_API_KEY) |

---

## 🟡 LOJA — 60% funcional

| Módulo | % funcional | Principal problema |
|--------|-------------|-------------------|
| Login/Auth | 100% | ✅ Sem problemas |
| Dashboard | 40% | Gráfico histórico falso, sem filtro store |
| Equipe | 60% | Não filtra por store_id |
| WhatsApp | 65% | Envio mock, filtro de store em memória |
| Agente IA | 85% | Funcional |
| Pipeline | 80% | `finalValue` não salvo |
| Reativação | 70% | Sem filtro store |
| Settings | 10% | Saves todos falsos |

---

## 🟡 VENDEDOR — 55% funcional

| Módulo | % funcional | Principal problema |
|--------|-------------|-------------------|
| Login/Auth | 100% | ✅ Sem problemas |
| Dashboard | 60% | Ranking vazio, conversão hardcoded |
| Pipeline | 70% | Dialog presente, mas `finalValue` não salvo |
| WhatsApp | 50% | Envio mock, RLS não restringe por seller |
| Reativação | 75% | Funcional (RLS garante isolamento) |

---

# QUANTO FALTA PARA 100%

## 🔴 CRÍTICOS — bloqueiam uso em produção (4 itens)

**[C1] `sendMessageMutation` ainda é MOCK**
Arquivo: `src/modules/whatsapp/ConversationView.tsx`
Falta: criar Edge Function `evolution-send-message` + substituir o mock por chamada real.
Estimativa: 2h

**[C2] `pipelineCardService.moveCard` não salva `finalValue`**
Arquivo: `src/services/pipelineCardService.ts`
Falta: adicionar parâmetros `finalValue?: number, closingDate?: string` e incluir no update payload.
Estimativa: 30min

**[C3] `invite-user` consulta `user_roles` table inexistente**
Arquivo: `supabase/functions/invite-user/index.ts`
Falta: substituir `.from('user_roles')` por `.from('users').select('role').eq('id', callerId).single()`.
Estimativa: 30min

**[C4] `create_full_tenant` quebrado (schema errado)**
Arquivo: `supabase/functions/create_full_tenant.sql`
Falta: reescrever toda a função com colunas corretas.
Estimativa: 1h

---

## 🟠 ALTOS — degradam a experiência, dados falsos em produção (9 itens)

**[A1] `data-testid` ausentes nos 3 dashboards** — 15min
**[A2] Gráfico histórico do LojaDashboard com dados falsos** — 1h
**[A3] Settings: todos os "Salvar" são fakes** — 3h
**[A4] KPIs admin hardcoded (empresas ativas, conversão global)** — 1h
**[A5] "Cards Ativos" no VendedorList usa Math.random()** — 30min
**[A6] RLS WhatsApp não restringe vendedor por `assigned_to`** — 30min (migration SQL)
**[A7] Logs de auditoria em Settings com dados fictícios** — 1h
**[A8] `// @ts-nocheck` em 3 arquivos** — 2h (correção de tipos)
**[A9] "Reenviar Convite" não chama API** — 30min

---

## 🟡 MÉDIOS — melhorias importantes mas não bloqueantes (5 itens)

**[M1] Filtro de `store_id` ausente no LojaDashboard e Reativação** — 1h
**[M2] "Ranking da Loja" vazio no VendedorDashboard** — 1h
**[M3] `pos_venda` não abre dialog de fechamento no Kanban** — 30min
**[M4] FilterBar de período não filtra datas efetivamente** — 1h
**[M5] Wizard de novo tenant: validação por step e navegação** — 2h

---

## RESUMO FINAL

| Perfil | Estado atual | Para 100% |
|--------|-------------|-----------|
| **Admin** | **45%** | C1+C2+C3+C4+A1+A2+A3+A4+A5+A7+A8+M1+M4+M5 |
| **Loja** | **60%** | C1+C2+A1+A2+A3+A6+A8+A9+M1+M3 |
| **Vendedor** | **55%** | C1+C2+A1+A6+A8+M2+M3 |

**Tempo estimado para 100% funcional (todos os perfis):**
- Críticos: ~4h
- Altos: ~10h
- Médios: ~6h
- **Total: ~20h de desenvolvimento Lovable**

**Para o MVP mínimo (perfis funcionando para atendimento real):**
Resolver apenas C1+C2+C3+A6 = ~3h30 de desenvolvimento.
Após isso, os 3 perfis conseguem fazer login, acessar o pipeline, o WhatsApp e o Agente IA sem dados falsos críticos.

---

*Auditoria realizada por Kiro — 07/06/2026*
