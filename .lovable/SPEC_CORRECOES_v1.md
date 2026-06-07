# ESPECIFICAÇÃO DE CORREÇÕES — MEC Hub (Marcontti Visionary Hub)
**Versão:** 1.0  
**Data:** 07/06/2026  
**Responsável técnico:** Kiro (Assistente Especialista)  
**Destinatário:** Lovable AI  

---

## CONTEXTO GERAL

Este documento define **tasks obrigatórias** para corrigir bugs críticos, falhas de segurança e comportamentos incompletos identificados no projeto **MEC Hub** — plataforma SaaS multi-tenant de CRM e pipeline de vendas. Cada task tem prioridade, critérios de aceite mensuráveis e fallbacks explícitos. A Lovable deve implementar na ordem listada.

---

## INVENTÁRIO DE PROBLEMAS (Auditoria)

| # | Severidade | Área | Problema |
|---|-----------|------|---------|
| P1 | 🔴 CRÍTICO | Vitest | `src/test/setup.ts` não existe — todos os testes unitários falham na inicialização |
| P2 | 🔴 CRÍTICO | RPC Supabase | `create_full_tenant.sql` referencia colunas/tabelas inexistentes no schema real |
| P3 | 🔴 CRÍTICO | WhatsApp | `sendMessageMutation` é mock (aguarda 500ms e finge sucesso) — envio real não implementado |
| P4 | 🔴 CRÍTICO | TypeScript | `@ts-nocheck` em 3 arquivos críticos: `whatsappService.ts`, `ReactivationList.tsx`, `NewTenantWizard.tsx` |
| P5 | 🔴 CRÍTICO | Playwright | 6/6 testes falham: URLs erradas, `data-testid` ausentes, baseURL apontando para produção |
| P6 | 🟠 ALTO | Pipeline | `moveCard` ignora `finalValue` e `closingDate` passados pelo `usePipeline` — valor de fechamento nunca salvo |
| P7 | 🟠 ALTO | Admin | `userService.create` chama Edge Function `invite-user` que não existe — convite de vendedor quebrado |
| P8 | 🟠 ALTO | Wizard | Steps do `NewTenantWizard` avançam sem validar campos obrigatórios do step atual |
| P9 | 🟠 ALTO | Wizard | Após criação, navega para `/dashboard` que não existe (rota correta: `/`) |
| P10 | 🟠 ALTO | RLS | Policy `wa_conversations_select` expõe todas as conversas do tenant ao vendedor (deveria filtrar por `assigned_to`) |
| P11 | 🟠 ALTO | CRM | `clientService.getAll` não filtra por `seller_id` para role `vendedor` (defense-in-depth ausente) |
| P12 | 🟡 MÉDIO | Dashboard | `LojaDashboard` exibe dados históricos de vendas fabricados (cálculo baseado no valor atual) |
| P13 | 🟡 MÉDIO | Sidebar | Widget "Troca Rápida de Perfil" ainda presente na UI (plan.md item 10 — não concluído) |
| P14 | 🟡 MÉDIO | Deploy | `wrangler.jsonc` referencia `src/server.ts` inexistente |
| P15 | 🟡 MÉDIO | Seeds/Tests | Arquivos de seed e test usam `NEXT_PUBLIC_SUPABASE_URL` (Next.js) em vez de `VITE_SUPABASE_URL` |
| P16 | 🟡 MÉDIO | Services | `pipelineService` e `pipelineCardService` exportam objetos com o mesmo nome — colisão silenciosa |
| P17 | 🟢 BAIXO | RLS | Policy `whatsapp_instances_select_admin` tem cláusula `OR public.user_role() = 'admin'` redundante |
| P18 | 🟢 BAIXO | UX | `KpiCard` recebe strings vazias `""` como `title` e `value` durante loading |
| P19 | 🟢 BAIXO | Auth | `useAuth.ts` usa `setTimeout(..., 0)` — pode criar janela de race condition antes de user estar disponível |

---

## TASKS E CRONOGRAMA

### SPRINT 1 — Bloqueadores Absolutos (Prioridade: CRÍTICO)
> Executar antes de qualquer merge. Nenhuma dessas tasks pode ficar pendente.

---

#### TASK-01 — Criar arquivo de setup do Vitest
**Problema:** P1  
**Arquivo:** `src/test/setup.ts`  
**Ação:** Criar o arquivo com o conteúdo mínimo abaixo.

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
```

**Critério de aceite:**
- `npm run test` executa sem erro de `Cannot find module './src/test/setup.ts'`
- Todos os testes existentes em `src/__tests__/` rodam (mesmo que falhem por lógica)

**Fallback:** Se `@testing-library/jest-dom` não estiver instalado, adicionar ao `package.json` como devDependency.

---

#### TASK-02 — Reescrever `create_full_tenant.sql` para corresponder ao schema real
**Problema:** P2  
**Arquivo:** `supabase/functions/create_full_tenant.sql`  
**Ação:** Reescrever a função PL/pgSQL corrigindo TODOS os nomes de colunas/tabelas para corresponder ao schema das migrations.

**Mapeamento de correções obrigatórias:**

| Errado (atual) | Correto (schema real) |
|----------------|----------------------|
| `tenants.cnpj_cpf` | `tenants.cnpj` |
| `tenants.address` | ❌ coluna não existe — remover |
| `tenants.slug` | ❌ coluna não existe — remover |
| `users.name` | `users.full_name` |
| `users.password_hash` | ❌ autenticação é via Supabase Auth — remover |
| `whatsapp_numbers` | `whatsapp_instances` |
| `whatsapp_numbers.number` | `whatsapp_instances.phone_number` |
| `medical_briefings.briefing` (TEXT) | Verificar schema em `20260528060000_create_medical_briefings.sql` e adaptar |
| `security invoker` | `security definer` (a função precisa de permissão de service_role) |

**Função corrigida — estrutura esperada:**
```sql
CREATE OR REPLACE FUNCTION public.create_full_tenant(
  p_company_name TEXT,
  p_cnpj TEXT,
  p_niche TEXT,
  p_contact_email TEXT,
  p_admin_name TEXT,
  p_admin_email TEXT,
  p_store_name TEXT,
  p_store_phone TEXT,
  p_whatsapp_number TEXT,
  p_whatsapp_evolution_url TEXT,
  p_whatsapp_api_key TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tenant_id UUID;
  v_store_id  UUID;
BEGIN
  -- 1. Inserir tenant
  INSERT INTO tenants (name, cnpj, niche, contact_email)
  VALUES (p_company_name, p_cnpj, p_niche, p_contact_email)
  RETURNING id INTO v_tenant_id;

  -- 2. Inserir store
  INSERT INTO stores (tenant_id, name, phone)
  VALUES (v_tenant_id, p_store_name, p_store_phone)
  RETURNING id INTO v_store_id;

  -- 3. Inserir pipeline_stages padrão
  INSERT INTO pipeline_stages (tenant_id, stage_key, label, position)
  VALUES
    (v_tenant_id, 'prospeccao',   'Prospecção',   1),
    (v_tenant_id, 'qualificacao', 'Qualificação',  2),
    (v_tenant_id, 'apresentacao', 'Apresentação',  3),
    (v_tenant_id, 'proposta',     'Proposta',      4),
    (v_tenant_id, 'negociacao',   'Negociação',    5),
    (v_tenant_id, 'fechamento',   'Fechamento',    6),
    (v_tenant_id, 'pos_venda',    'Pós-venda',     7);

  -- 4. Inserir whatsapp_instances se fornecido
  IF p_whatsapp_number IS NOT NULL AND p_whatsapp_evolution_url IS NOT NULL THEN
    INSERT INTO whatsapp_instances (tenant_id, instance_name, evolution_url, api_key, phone_number)
    VALUES (v_tenant_id, p_company_name || '_wa', p_whatsapp_evolution_url, p_whatsapp_api_key, p_whatsapp_number);
  END IF;

  -- 5. Inserir agent_ia_config padrão
  INSERT INTO agent_ia_configs (tenant_id, is_active) VALUES (v_tenant_id, false);

  RETURN jsonb_build_object(
    'tenant_id', v_tenant_id,
    'store_id',  v_store_id,
    'admin_email', p_admin_email
  );
END;
$$;
```

**Nota:** O usuário admin deve ser criado via `supabase.auth.admin.createUser()` no frontend (Edge Function ou Lovable), não dentro da função SQL, pois requer a API Admin Key. O wizard deve:
1. Chamar `create_full_tenant(...)` para criar tenant/store/stages
2. Separadamente, chamar `supabase.functions.invoke('create-admin-user', { body: { email, tenantId, storeId } })` para criar o usuário

**Critério de aceite:**
- Função pode ser executada no Supabase SQL Editor sem erros
- `NewTenantWizard` chama a função e recebe `{ tenant_id, store_id, admin_email }` sem erros 500

**Fallback:** Se a criação do usuário admin via Edge Function for complexa, usar invite por email: `supabase.auth.admin.inviteUserByEmail(email, { data: { tenant_id, role: 'admin' } })`.

---

#### TASK-03 — Implementar envio real de mensagem no WhatsApp
**Problema:** P3  
**Arquivo:** `src/modules/whatsapp/ConversationView.tsx`  
**Ação:** Substituir o mock de `sendMessageMutation` pela chamada real à Evolution API via proxy Supabase.

**Implementação esperada:**
```typescript
const sendMessageMutation = useMutation({
  mutationFn: async (content: string) => {
    if (!activeTenantId || !client?.phone) {
      throw new Error('Tenant ou cliente não identificado');
    }
    
    // Chama a Edge Function que faz proxy para a Evolution API
    const { data, error } = await supabase.functions.invoke('evolution-send-message', {
      body: {
        tenant_id: activeTenantId,
        phone: client.phone,
        content,
      },
    });

    if (error) throw new Error(error.message || 'Falha ao enviar mensagem');

    // Salvar mensagem localmente no banco
    await supabase.from('whatsapp_messages').insert([{
      tenant_id: activeTenantId,
      client_id: clientId,
      direction: 'sent',
      content,
      processed_by_ai: false,
      timestamp: new Date().toISOString(),
    }]);

    return data;
  },
  onSuccess: () => {
    setMessage('');
    queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', activeTenantId, clientId] });
  },
  onError: (err: Error) => {
    toast.error(`Erro ao enviar: ${err.message}`);
  },
});
```

**Edge Function necessária (`supabase/functions/evolution-send-message/index.ts`):**
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { tenant_id, phone, content } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('evolution_url, api_key, instance_name, status')
      .eq('tenant_id', tenant_id)
      .single();

    if (error || !instance) {
      return new Response(JSON.stringify({ error: 'Instância WhatsApp não encontrada' }), { status: 404 });
    }

    if (instance.status !== 'connected') {
      return new Response(JSON.stringify({ error: 'WhatsApp não está conectado' }), { status: 400 });
    }

    const response = await fetch(
      `${instance.evolution_url}/message/sendText/${instance.instance_name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': instance.api_key,
        },
        body: JSON.stringify({
          number: phone.replace(/\D/g, ''),
          textMessage: { text: content },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return new Response(JSON.stringify({ error: errBody }), { status: 502 });
    }

    const result = await response.json();
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
```

**Critério de aceite:**
- Mensagem digitada no chat é enviada para o número do cliente via Evolution API
- Em caso de erro (instância desconectada, API key inválida), toast de erro exibido com mensagem útil
- Mensagem enviada aparece na lista de mensagens com `direction: 'sent'`

**Fallback:** Se a Edge Function não puder ser criada neste sprint, manter o mock mas exibir um toast de aviso: `"Envio de mensagens ainda não configurado — configure a instância WhatsApp"`.

---

#### TASK-04 — Remover `// @ts-nocheck` e corrigir erros TypeScript
**Problema:** P4  
**Arquivos:** `src/services/whatsappService.ts`, `src/modules/reactivation/ReactivationList.tsx`, `src/pages/Setup/NewTenantWizard.tsx`  
**Ação:** Remover as diretivas `// @ts-nocheck` de cada arquivo e corrigir os erros TypeScript que surgirem.

**Padrão de correção esperado por arquivo:**

1. `whatsappService.ts`: Tipar corretamente os métodos usando interfaces de `src/types/index.ts` (`WhatsAppConversation`, `WhatsAppMessage`, `WhatsAppInstance`). Substituir `any` por tipos explícitos.

2. `ReactivationList.tsx`: Tipar props de componentes, retornos de queries, e parâmetros de callbacks. Resolver inferência de tipo nas queries Supabase usando o tipo gerado `Database` de `src/integrations/supabase/types.ts`.

3. `NewTenantWizard.tsx`: Criar interface para os dados do wizard (`WizardFormData`) com todos os campos necessários. Tipar os steps e handlers.

**Critério de aceite:**
- `npx tsc --noEmit` roda sem erros nos três arquivos
- Nenhum `as any` desnecessário introduzido

**Fallback:** Se houver tipo incompatível com a lib `@supabase/supabase-js` que requeira `as any`, documentar com comentário: `// TODO: resolver após atualização do supabase-js`.

---

#### TASK-05 — Corrigir testes Playwright
**Problema:** P5  
**Arquivo:** `playwright.config.ts`, `playwright/tests/auth.spec.ts`  
**Ação:** Corrigir configuração e testes.

**`playwright.config.ts` — mudança necessária:**
```typescript
use: {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
  // ... resto igual
},
```

**`playwright/tests/auth.spec.ts` — reescrever:**
```typescript
import { test, expect } from '@playwright/test';

// Credenciais para teste (usar usuários de staging/seed, não produção)
const ADMIN    = { email: 'adm@adm.com',                    password: 'admin123' };
const SELLER   = { email: 'cardosodanielly11@gmail.com',    password: 'seller123' };
const LOJA     = { email: 'infindamidiadigital@gmail.com',  password: 'store123' };

test.describe('Autenticação — Admin', () => {
  test('admin faz login e acessa dashboard principal', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 10000 });
    await page.fill('input[name="email"]', ADMIN.email);
    await page.fill('input[name="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    // Admin vai para "/" que exibe AdminDashboard
    await expect(page).toHaveURL('/', { timeout: 15000 });
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Autenticação — Vendedor', () => {
  test('vendedor faz login e acessa seu dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', SELLER.email);
    await page.fill('input[name="password"]', SELLER.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 15000 });
    await expect(page.locator('[data-testid="vendedor-dashboard"]')).toBeVisible({ timeout: 10000 });
  });

  test('vendedor não acessa /tenants', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', SELLER.email);
    await page.fill('input[name="password"]', SELLER.password);
    await page.click('button[type="submit"]');
    await page.goto('/tenants');
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('Autenticação — Loja', () => {
  test('loja faz login e acessa seu dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', LOJA.email);
    await page.fill('input[name="password"]', LOJA.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/', { timeout: 15000 });
    await expect(page.locator('[data-testid="loja-dashboard"]')).toBeVisible({ timeout: 10000 });
  });
});
```

**Adicionar `data-testid` nos dashboards:**
- `src/modules/dashboard/AdminDashboard.tsx`: adicionar `data-testid="admin-dashboard"` no elemento raiz (`<div>` ou `<section>`)
- `src/modules/dashboard/VendedorDashboard.tsx`: adicionar `data-testid="vendedor-dashboard"`
- `src/modules/dashboard/LojaDashboard.tsx`: adicionar `data-testid="loja-dashboard"`

**Critério de aceite:**
- `npm run test:playwright` com app rodando localmente passa ≥ 4/6 testes (2 podem falhar por dados de seed não disponíveis)
- Nenhum teste falha com `timeout` por `input[name="email"]` não encontrado

---

### SPRINT 2 — Bugs de Negócio (Prioridade: ALTO)

---

#### TASK-06 — Salvar `finalValue` e `closingDate` ao fechar card do pipeline
**Problema:** P6  
**Arquivo:** `src/services/pipelineCardService.ts` (função `moveCard`)  
**Ação:** Aceitar e persistir os novos campos.

```typescript
async moveCard(
  cardId: string,
  tenantId: string,
  userId: string,
  fromStage: string,
  toStage: string,
  finalValue?: number,
  closingDate?: string
) {
  const isClosing = toStage === 'fechamento' || toStage === 'pos_venda';
  
  const updatePayload: Record<string, any> = {
    stage_key: toStage,
    updated_at: new Date().toISOString(),
  };
  
  if (isClosing) {
    updatePayload.closed_at = closingDate || new Date().toISOString();
    if (finalValue !== undefined && finalValue !== null) {
      updatePayload.final_value = finalValue;
    }
  }

  const { data, error } = await supabase
    .from('pipeline_cards')
    .update(updatePayload)
    .eq('id', cardId)
    .select()
    .single();
  
  if (error) throw error;

  await this.logHistory({
    card_id: cardId,
    tenant_id: tenantId,
    user_id: userId,
    event_type: 'stage_change',
    from_stage: fromStage,
    to_stage: toStage,
    description: `Movido de ${fromStage} para ${toStage}${isClosing && finalValue ? ` — Valor: R$ ${finalValue.toFixed(2)}` : ''}`,
  });

  return data;
}
```

**Ajuste em `usePipeline.ts`:** Passar `finalValue` e `closingDate` na chamada:
```typescript
mutationFn: ({ cardId, fromStage, toStage, finalValue, closingDate }) => 
  pipelineCardService.moveCard(cardId, activeTenantId!, user!.id, fromStage, toStage, finalValue, closingDate),
```

**Critério de aceite:**
- Ao mover um card para `fechamento`, o campo `final_value` é salvo no banco
- O histórico do card mostra o valor no log de descrição
- A projeção financeira reflete o `final_value` (não mais o `estimated_value`) para cards fechados

**Fallback:** Se a UI de KanbanBoard não exibir dialog para informar `finalValue`, criar um dialog simples antes de confirmar o move para `fechamento`:
```
"Valor final da venda: [input número] — Data de fechamento: [datepicker]"
```

---

#### TASK-07 — Criar Edge Function `invite-user` para criar vendedores
**Problema:** P7  
**Arquivo:** `supabase/functions/invite-user/index.ts` (NOVO)  
**Ação:** Criar a Edge Function que `userService.create` já espera.

```typescript
// supabase/functions/invite-user/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { email, full_name, role, tenant_id, store_id, phone } = await req.json();

    if (!email || !full_name || !role || !tenant_id) {
      return new Response(
        JSON.stringify({ error: 'email, full_name, role e tenant_id são obrigatórios' }),
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Criar usuário via Auth Admin API (envia email de convite)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false,  // Supabase envia email de confirmação
      user_metadata: { full_name, role, tenant_id, store_id },
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }

    // Criar perfil na tabela public.users
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: authUser.user.id,
      tenant_id,
      store_id: store_id || null,
      full_name,
      email,
      phone: phone || null,
      role,
      is_active: true,
    });

    if (profileError) {
      // Rollback: deletar usuário auth criado
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return new Response(JSON.stringify({ error: profileError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user_id: authUser.user.id 
    }), { status: 200 });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
```

**Critério de aceite:**
- Admin consegue criar um vendedor via formulário na UI `/vendors`
- O vendedor recebe email de acesso
- Se email já existente, retorna erro amigável: `"Este e-mail já está em uso"`
- Rollback ocorre se o insert em `public.users` falhar (usuário auth deletado)

**Fallback:** Se Edge Functions não estiverem habilitadas no projeto Lovable, usar `supabase.auth.admin.inviteUserByEmail` diretamente no cliente com `service_role` via proxy seguro.

---

#### TASK-08 — Validação por step no `NewTenantWizard`
**Problema:** P8 e P9  
**Arquivo:** `src/pages/Setup/NewTenantWizard.tsx`  
**Ação:** Implementar validação por step antes de avançar, e corrigir navegação pós-criação.

**Esquema de validação por step (usando zod):**
```typescript
// Step 1 — Dados da empresa
const step1Schema = z.object({
  company_name: z.string().min(3, 'Nome da empresa obrigatório'),
  cnpj: z.string().optional(),
  niche: z.enum(['comercio_local','mecanica','clinica','imobiliaria','restaurante','educacao','servicos','outro']),
  contact_email: z.string().email('Email inválido'),
});

// Step 2 — Dados do admin
const step2Schema = z.object({
  admin_name: z.string().min(2, 'Nome do administrador obrigatório'),
  admin_email: z.string().email('Email inválido'),
});

// Step 3 — Dados da loja
const step3Schema = z.object({
  store_name: z.string().min(2, 'Nome da loja obrigatório'),
  store_phone: z.string().optional(),
});

// Steps 4, 5 são opcionais (WhatsApp, vendedor inicial) — podem avançar sem preencher
const stepSchemas = [step1Schema, step2Schema, step3Schema, null, null, null];
```

**Lógica do botão "Próximo":**
```typescript
const handleNext = async () => {
  const schema = stepSchemas[step - 1];
  if (schema) {
    const result = schema.safeParse(formData);
    if (!result.success) {
      // Exibir erros de validação nos campos
      result.error.errors.forEach(err => {
        setFieldError(err.path[0] as string, err.message);
      });
      return; // Não avança
    }
  }
  setStep(step + 1);
};
```

**Correção da navegação:**
```typescript
// ERRADO (linha atual):
navigate('/dashboard');

// CORRETO:
navigate('/');
```

**Critério de aceite:**
- Tentativa de avançar do step 1 sem preencher `company_name` exibe erro inline no campo
- Todos os steps obrigatórios validados antes de avançar
- Após criação com sucesso, redireciona para `/` (dashboard)
- Toast de sucesso: `"Tenant [nome] criado com sucesso!"`

---

#### TASK-09 — Corrigir RLS de `whatsapp_conversations` para vendedor
**Problema:** P10  
**Arquivo:** Nova migration SQL  
**Ação:** Criar migration que atualiza a policy de select para limitar vendedores às suas conversas atribuídas.

```sql
-- supabase/migrations/20260607000001_fix_wa_conversations_seller_scope.sql

-- Remover policy genérica de tenant
DROP POLICY IF EXISTS "wa_conversations_select" ON public.whatsapp_conversations;

-- Nova policy: admin/loja vê todo o tenant; vendedor vê só as suas
CREATE POLICY "wa_conversations_select_scoped"
ON public.whatsapp_conversations FOR SELECT
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_role() IN ('admin', 'loja')
    OR assigned_to = auth.uid()
  )
);
```

**Critério de aceite:**
- Usuário com role `vendedor` só vê conversas onde `assigned_to = seu UUID`
- Usuário com role `loja` vê todas as conversas do tenant
- Admin vê todas as conversas de todos os tenants

**Fallback:** Se a migration não puder ser aplicada diretamente, aplicar via Supabase Dashboard > SQL Editor com a query acima.

---

#### TASK-10 — Filtro defense-in-depth em `clientService.getAll` para vendedor
**Problema:** P11  
**Arquivo:** `src/services/clientService.ts` + `src/modules/crm/hooks/useClientes.ts`  
**Ação:** Adicionar filtro de `seller_id` via JOIN quando o usuário for vendedor.

```typescript
// Em clientService.ts, método getAll:
async getAll(tenantId: string, page: number, pageSize: number, search: string, filters: any = {}) {
  let query = supabase
    .from('clients')
    .select('*, tags:client_tags(tag:tags(*))', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .neq('status', 'deleted');

  // Defense-in-depth: filtro explícito para vendedor
  if (filters.seller_id) {
    // Clientes que têm pelo menos um card do vendedor
    query = query.in('id', 
      supabase
        .from('pipeline_cards')
        .select('client_id')
        .eq('seller_id', filters.seller_id)
        .eq('is_archived', false)
    );
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
```

**Ajuste em `useClientes.ts`:**
```typescript
const scopedFilters: any = { ...filters };
if (user?.role === 'vendedor') {
  scopedFilters.seller_id = user.id;
}
```

**Critério de aceite:**
- Vendedor vê apenas clientes vinculados aos seus cards no pipeline
- Admin e loja veem todos os clientes do tenant (comportamento atual mantido)
- A paginação conta corretamente com o filtro aplicado

---

### SPRINT 3 — Melhorias e Limpeza (Prioridade: MÉDIO/BAIXO)

---

#### TASK-11 — Remover widget "Troca Rápida de Perfil" do Sidebar
**Problema:** P13  
**Arquivo:** `src/components/layout/Sidebar.tsx`  
**Ação:** Remover o bloco de "Troca Rápida de Perfil" (botões que chamam `setRole`).

Localizar e remover o bloco aproximado:
```tsx
{/* ❌ REMOVER este bloco inteiro */}
<div className="...">
  <p>Troca Rápida de Perfil</p>
  <Button onClick={() => setRole('admin')}>Admin</Button>
  <Button onClick={() => setRole('loja')}>Loja</Button>
  <Button onClick={() => setRole('vendedor')}>Vendedor</Button>
</div>
```

**Critério de aceite:**
- Widget não aparece mais na sidebar em nenhuma role
- Nenhum botão `setRole` chamável na UI

---

#### TASK-12 — Substituir dados históricos fabricados no `LojaDashboard`
**Problema:** P12  
**Arquivo:** `src/modules/dashboard/LojaDashboard.tsx`  
**Ação:** Buscar dados reais de vendas dos últimos 6 meses no banco.

```typescript
// Hook para histórico real de vendas
const { data: salesHistory = [] } = useQuery({
  queryKey: ['sales-history', activeTenantId, user?.store_id],
  queryFn: async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await supabase
      .from('pipeline_cards')
      .select('final_value, closed_at')
      .eq('tenant_id', activeTenantId)
      .eq('store_id', user!.store_id!)
      .in('stage_key', ['fechamento', 'pos_venda'])
      .not('closed_at', 'is', null)
      .gte('closed_at', sixMonthsAgo.toISOString());

    if (error) throw error;

    // Agrupar por mês
    const grouped = (data || []).reduce((acc: Record<string, number>, card) => {
      const month = new Date(card.closed_at!).toLocaleDateString('pt-BR', { month: 'short' });
      acc[month] = (acc[month] || 0) + (card.final_value || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, value]) => ({ month, value }));
  },
  enabled: !!activeTenantId && !!user?.store_id,
});
```

**Critério de aceite:**
- Gráfico de histórico de vendas exibe dados reais dos últimos 6 meses
- Se não houver vendas, exibe estado vazio (empty state) em vez de dados fabricados

---

#### TASK-13 — Corrigir variáveis de ambiente nos seeds e testes
**Problema:** P15  
**Arquivos:** `supabase/seed/demo_tenant.ts`, qualquer `*.test.ts` que use `NEXT_PUBLIC_SUPABASE_*`  
**Ação:** Substituir todas as ocorrências.

```typescript
// ERRADO:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// CORRETO:
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

---

#### TASK-14 — Renomear export de `pipelineService` em `pipelineCardService.ts`
**Problema:** P16  
**Arquivo:** `src/services/pipelineCardService.ts`  
**Ação:** Renomear o export para eliminar a colisão de nomes.

```typescript
// ANTES:
export const pipelineService = { ... };

// DEPOIS:
export const pipelineCardService = { ... };
```

Atualizar todos os imports que apontam para `pipelineCardService.ts`:
```typescript
// ANTES:
import { pipelineService as pipelineCardService } from '@/services/pipelineCardService';

// DEPOIS:
import { pipelineCardService } from '@/services/pipelineCardService';
```

---

#### TASK-15 — Corrigir `wrangler.jsonc` para apontar para entry point real
**Problema:** P14  
**Arquivo:** `wrangler.jsonc`  
**Ação:** Verificar qual é o entry point real do projeto e corrigir.

```jsonc
// Verificar se o campo main existe e aponta para arquivo inexistente:
// "main": "src/server.ts"  ← ERRADO (arquivo não existe)

// Se o projeto é uma SPA (não Worker), remover ou comentar "main":
// "main": "./dist/index.js"  ← Usar o output do build Vite
```

---

## ESQUEMA DE FALLBACKS GLOBAIS

Para cada funcionalidade crítica, o sistema deve ter comportamento defensivo:

### 1. Autenticação / Sessão
- Se `useAuth` não retornar usuário após 5s → redirecionar para `/login` com mensagem `"Sessão expirada"`
- Se Supabase Auth retornar erro → exibir tela de erro com botão "Tentar novamente"

### 2. Queries de dados
- Todas as queries com `useQuery` devem ter `onError` configurado no `queryClient` (global):
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      onError: (error: any) => {
        console.error('[Query Error]', error);
        // Não exibir toast para erros de autorização (403) — são esperados
        if (error?.code !== '42501' && error?.status !== 403) {
          toast.error('Erro ao carregar dados. Tente recarregar a página.');
        }
      },
    },
  },
});
```

### 3. Mutations (escrita no banco)
- Todas as mutations devem ter `onError` com toast de erro amigável
- Mutations de criação devem validar dados localmente (zod) antes de enviar ao servidor

### 4. WhatsApp / Evolution API
- Se a instância estiver desconectada: exibir badge "Desconectado" com botão "Reconectar"
- Se Evolution API retornar erro: toast de erro + log no `agent_ia_logs` com `status: 'failure'`

### 5. Permissões
- `RequireRole` já implementado em `App.tsx` — manter e não remover
- Se RLS bloquear uma query, o Supabase retorna array vazio (não erro) — comportamento esperado

---

## CRONOGRAMA SUGERIDO

| Sprint | Tasks | Prazo estimado | Risco |
|--------|-------|----------------|-------|
| Sprint 1 | TASK-01 a TASK-05 | 1–2 dias | 🔴 Alto — bloqueadores |
| Sprint 2 | TASK-06 a TASK-10 | 2–3 dias | 🟠 Médio — bugs de negócio |
| Sprint 3 | TASK-11 a TASK-15 | 1 dia | 🟡 Baixo — limpeza |

**Total estimado:** 4–6 dias de desenvolvimento Lovable

---

## CRITÉRIOS GLOBAIS DE ACEITE (Definition of Done)

Para considerar uma task concluída, os seguintes critérios DEVEM ser satisfeitos:

1. ✅ Código compila sem erros TypeScript (`npx tsc --noEmit`)
2. ✅ `npm run lint` não retorna erros (warnings são aceitáveis)
3. ✅ `npm run test` (vitest) passa — ou falha com erro de lógica, não de configuração
4. ✅ Comportamento testável manualmente no app (descrito no critério de aceite da task)
5. ✅ Nenhum `console.error` novo introduzido sem tratamento

---

## NOTA SOBRE SEGURANÇA

As correções de RLS (P10 — TASK-09) **devem ser aplicadas como migrations Supabase**, não como código frontend. O banco de dados é a última linha de defesa. O frontend só filtra para melhorar UX e performance.

As seguintes políticas já estão corretas e **NÃO devem ser modificadas**:
- `prevent_role_self_change_trg` — trigger que impede auto-escalada de role
- `users_update_self` + `users_update_admin` — atualização de perfil restrita
- `whatsapp_instances_select_admin` — chaves da API visíveis apenas para admin

---

*Documento gerado por Kiro — Assistente Especialista do Projeto MEC Hub*  
*Última atualização: 07/06/2026*
