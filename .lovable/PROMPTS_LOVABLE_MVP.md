# PROMPTS EXATOS PARA A LOVABLE — MEC Hub MVP
**Objetivo:** Deixar os 3 perfis (admin, loja, vendedor) funcionais com login real, dashboards corretos e agente IA operacional para primeiros atendimentos.

**Como usar este documento:**
- Copie EXATAMENTE o texto de cada bloco `PROMPT` e cole no chat da Lovable
- Execute um prompt por vez
- Aguarde a Lovable concluir e fazer commit antes de passar para o próximo
- Após cada prompt, clique no hook "Sync Lovable → Local (git pull)" no painel Agent Hooks para atualizar sua pasta local

---

## ORDEM DE EXECUÇÃO

```
PROMPT 1 → Vitest setup (5 min)
PROMPT 2 → data-testid nos dashboards (5 min)
PROMPT 3 → Sidebar limpa + dados reais (10 min)
PROMPT 4 → Edge Function invite-user (15 min)
PROMPT 5 → WhatsApp: envio real de mensagem (20 min)
PROMPT 6 → RLS WhatsApp por vendedor (10 min)
PROMPT 7 → Pipeline: salvar valor de fechamento (10 min)
PROMPT 8 → Teste final — validação dos 3 perfis
```

---

## ─────────────────────────────────────────
## PROMPT 1 — Criar arquivo de setup do Vitest
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Crie o arquivo `src/test/setup.ts` com o seguinte conteúdo exato:

```typescript
import '@testing-library/jest-dom';
```

Este arquivo é necessário porque `vitest.config.ts` referencia `setupFiles: './src/test/setup.ts'` mas o arquivo não existe, causando falha imediata em todos os testes unitários.

Não altere nenhum outro arquivo. Apenas crie este arquivo.
```

**✅ Critério de aceite:** O arquivo `src/test/setup.ts` existe com o import de `@testing-library/jest-dom`.

---

## ─────────────────────────────────────────
## PROMPT 2 — Adicionar data-testid nos 3 dashboards
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Preciso adicionar atributos `data-testid` nos três dashboards para que os testes E2E funcionem. Faça as seguintes alterações:

**Arquivo 1: `src/modules/dashboard/AdminDashboard.tsx`**
Na função `AdminDashboard`, localize o `return (` e adicione `data-testid="admin-dashboard"` no elemento `<div className="space-y-6">` mais externo do return:

```tsx
return (
  <div className="space-y-6" data-testid="admin-dashboard">
```

**Arquivo 2: `src/modules/dashboard/LojaDashboard.tsx`**
Na função `LojaDashboard`, localize o `return (` e adicione `data-testid="loja-dashboard"` no elemento `<div className="space-y-6">` mais externo do return:

```tsx
return (
  <div className="space-y-6" data-testid="loja-dashboard">
```

**Arquivo 3: `src/modules/dashboard/VendedorDashboard.tsx`**
Na função `VendedorDashboard`, localize o `return (` e adicione `data-testid="vendedor-dashboard"` no elemento `<div className="space-y-6">` mais externo do return:

```tsx
return (
  <div className="space-y-6" data-testid="vendedor-dashboard">
```

Não altere nenhuma outra coisa nestes arquivos, apenas adicione o atributo data-testid.
```

**✅ Critério de aceite:** Cada dashboard tem seu `data-testid` no elemento raiz do return.

---

## ─────────────────────────────────────────
## PROMPT 3 — Sidebar limpa + Dashboard Loja com dados reais
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Preciso de duas correções importantes neste prompt:

## CORREÇÃO 1: Sidebar.tsx — Remover "Troca Rápida de Perfil"

No arquivo `src/components/layout/Sidebar.tsx`, verifique se existe algum bloco de botões que permita trocar de perfil/role (como botões "Admin", "Loja", "Vendedor" ou similar). Se existir, remova esse bloco inteiro. O arquivo atual já está limpo, mas confirme que não há nenhum bloco com chamadas a `setRole()` nos botões da sidebar.

Se não existir esse bloco, não altere nada na Sidebar.

## CORREÇÃO 2: LojaDashboard.tsx — Substituir dados históricos fabricados por dados reais

No arquivo `src/modules/dashboard/LojaDashboard.tsx`, localize o hook `useDashboardKpis` ou a query que gera `salesHistory`. Atualmente o código cria dados históricos FALSOS assim:

```typescript
salesHistory: [
  { month: 'Jan', value: vendas * 0.5 },
  { month: 'Fev', value: vendas * 0.6 },
  { month: 'Mar', value: vendas * 0.8 },
  { month: 'Abr', value: vendas * 0.9 },
  { month: 'Mai', value: vendas * 0.95 },
  { month: 'Jun', value: vendas },
],
```

Substitua por uma query real que busca as vendas dos últimos 6 meses agrupadas por mês. Adicione esta query DENTRO do `queryFn` existente, logo após buscar os `cards`:

```typescript
// Buscar histórico real de vendas dos últimos 6 meses
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

const { data: closedCards } = await supabase
  .from('pipeline_cards')
  .select('final_value, estimated_value, closed_at, stage_key')
  .eq('tenant_id', activeTenantId)
  .in('stage_key', ['fechamento', 'pos_venda'])
  .not('closed_at', 'is', null)
  .gte('closed_at', sixMonthsAgo.toISOString());

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const grouped: Record<string, number> = {};

(closedCards || []).forEach(card => {
  const month = monthNames[new Date(card.closed_at!).getMonth()];
  grouped[month] = (grouped[month] || 0) + Number(card.final_value || card.estimated_value || 0);
});

const salesHistory = Object.entries(grouped).map(([month, value]) => ({ month, value }));
```

E substitua a propriedade `salesHistory` fabricada por `salesHistory` (a variável calculada acima).

Se não houver dados históricos, `salesHistory` será um array vazio `[]` — isso é correto, não mostrar dados inventados.
```

**✅ Critério de aceite:** 
- Sidebar não tem botões de troca de perfil
- LojaDashboard busca histórico real do banco (array pode ser vazio se não houver dados)

---

## ─────────────────────────────────────────
## PROMPT 4 — Criar Edge Function para convidar usuários (invite-user)
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Preciso criar uma Edge Function do Supabase para que o admin consiga criar vendedores e usuários loja. Atualmente o código tenta chamar `supabase.functions.invoke('invite-user', ...)` mas essa função não existe, o que quebra a criação de usuários.

Crie o arquivo `supabase/functions/invite-user/index.ts` com o seguinte conteúdo:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, full_name, role, tenant_id, store_id, phone } = await req.json()

    if (!email || !full_name || !role || !tenant_id) {
      return new Response(
        JSON.stringify({ error: 'email, full_name, role e tenant_id são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Criar usuário no Supabase Auth (envia email de convite/confirmação)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false,
      password: Math.random().toString(36).slice(-10) + 'A1!',
      user_metadata: { full_name, role, tenant_id, store_id: store_id || null },
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar perfil na tabela public.users
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        tenant_id,
        store_id: store_id || null,
        full_name,
        email,
        phone: phone || null,
        role,
        is_active: true,
      })

    if (profileError) {
      // Rollback: deletar usuário auth criado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enviar email de reset de senha para o usuário definir a senha dele
    await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    return new Response(
      JSON.stringify({ success: true, user_id: authData.user.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

Esta Edge Function:
1. Cria o usuário no Supabase Auth
2. Cria o perfil em `public.users` com tenant_id, store_id, role corretos
3. Faz rollback do usuário Auth se o insert em `public.users` falhar
4. Envia email para o usuário definir a senha

Não altere nenhum arquivo frontend por enquanto.
```

**✅ Critério de aceite:** Arquivo `supabase/functions/invite-user/index.ts` criado com o conteúdo acima.

---

## ─────────────────────────────────────────
## PROMPT 5 — WhatsApp: implementar envio real de mensagem
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
No arquivo `src/modules/whatsapp/ConversationView.tsx`, existe um `sendMessageMutation` que é completamente FALSO — ele só aguarda 500ms e finge que enviou. Preciso substituir por envio real via Evolution API através de uma Edge Function.

## PASSO 1: Criar Edge Function

Crie o arquivo `supabase/functions/evolution-send-message/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tenant_id, phone, content } = await req.json()

    if (!tenant_id || !phone || !content) {
      return new Response(
        JSON.stringify({ error: 'tenant_id, phone e content são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar instância WhatsApp do tenant
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('evolution_url, api_key, instance_name, status')
      .eq('tenant_id', tenant_id)
      .single()

    if (instanceError || !instance) {
      return new Response(
        JSON.stringify({ error: 'Instância WhatsApp não encontrada para este tenant' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (instance.status !== 'connected') {
      return new Response(
        JSON.stringify({ error: `WhatsApp não está conectado (status: ${instance.status})` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enviar mensagem via Evolution API
    const phoneClean = phone.replace(/\D/g, '')
    const evolutionResponse = await fetch(
      `${instance.evolution_url}/message/sendText/${instance.instance_name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': instance.api_key,
        },
        body: JSON.stringify({
          number: phoneClean,
          textMessage: { text: content },
        }),
      }
    )

    if (!evolutionResponse.ok) {
      const errText = await evolutionResponse.text()
      return new Response(
        JSON.stringify({ error: `Erro na Evolution API: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await evolutionResponse.json()
    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## PASSO 2: Atualizar ConversationView.tsx

No arquivo `src/modules/whatsapp/ConversationView.tsx`, substitua o `sendMessageMutation` atual (que tem o mock com `await new Promise(resolve => setTimeout(resolve, 500))`) por este:

```typescript
const sendMessageMutation = useMutation({
  mutationFn: async (content: string) => {
    if (!activeTenantId) throw new Error('Tenant não identificado');
    if (!client?.phone) throw new Error('Número do cliente não encontrado');

    // Chamar Edge Function que faz proxy para Evolution API
    const { data, error } = await supabase.functions.invoke('evolution-send-message', {
      body: {
        tenant_id: activeTenantId,
        phone: client.phone,
        content,
      },
    });

    if (error) throw new Error(error.message || 'Falha ao enviar mensagem');
    if (data?.error) throw new Error(data.error);

    // Salvar mensagem enviada no banco
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

Também remova o comentário `// Mock sending message` e o `// In production: ...` que existem no código atual.
```

**✅ Critério de aceite:**
- Edge Function `supabase/functions/evolution-send-message/index.ts` criada
- `ConversationView.tsx` não tem mais mock de envio
- Em caso de erro (WhatsApp desconectado), aparece toast de erro com mensagem clara

---

## ─────────────────────────────────────────
## PROMPT 6 — Corrigir RLS: vendedor só vê suas próprias conversas
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Preciso corrigir uma falha de segurança no banco de dados. A política RLS da tabela `whatsapp_conversations` permite que qualquer vendedor veja TODAS as conversas do tenant, quando ele deveria ver apenas as conversas que estão atribuídas a ele (`assigned_to = auth.uid()`).

Crie uma nova migration SQL com o nome `20260608000001_fix_wa_conversations_rls_seller.sql` dentro da pasta `supabase/migrations/` com o seguinte conteúdo:

```sql
-- Fix: limitar vendedor a ver somente conversas atribuídas a ele
-- Admin e loja continuam vendo todas as conversas do tenant

DROP POLICY IF EXISTS "wa_conversations_select" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "wa_conversations_select_scoped" ON public.whatsapp_conversations;

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

Após criar a migration, aplique ela no Supabase Dashboard:
1. Vá em Database > SQL Editor no Supabase Dashboard
2. Execute o SQL acima manualmente

Não altere nenhum arquivo TypeScript/React.
```

**✅ Critério de aceite:** Migration criada. A política `wa_conversations_select_scoped` existe no banco com a condição `assigned_to = auth.uid()` para vendedores.

---

## ─────────────────────────────────────────
## PROMPT 7 — Pipeline: salvar valor final ao fechar card
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Existe um bug crítico no pipeline: quando um card é movido para a etapa "fechamento" ou "pos_venda", o valor final da venda e a data de fechamento NUNCA são salvos no banco. O `usePipeline.ts` passa `finalValue` e `closingDate` para `moveCard`, mas o `pipelineCardService.ts` ignora esses parâmetros.

## Correção no arquivo `src/services/pipelineCardService.ts`:

Localize a função `moveCard` e substitua por esta versão que aceita e salva `finalValue` e `closingDate`:

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
    if (finalValue !== undefined && finalValue !== null && finalValue > 0) {
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
    description: `Movido de ${fromStage} para ${toStage}${isClosing && finalValue ? ` — R$ ${Number(finalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}`,
  });

  return data;
},
```

## Correção no arquivo `src/modules/pipeline/hooks/usePipeline.ts`:

Localize o `moveCardMutation` e certifique-se que passa `finalValue` e `closingDate` para o serviço:

```typescript
mutationFn: ({ cardId, fromStage, toStage, finalValue, closingDate }: {
  cardId: string;
  fromStage: string;
  toStage: string;
  finalValue?: number;
  closingDate?: string;
}) =>
  pipelineCardService.moveCard(
    cardId,
    activeTenantId!,
    user!.id,
    fromStage,
    toStage,
    finalValue,
    closingDate
  ),
```

Se o KanbanBoard não exibir um dialog para informar o valor ao mover para "fechamento", adicione um dialog simples. Quando o usuário arrastar um card para a coluna "fechamento" ou "pos_venda", exiba um Dialog (modal) com:
- Campo numérico: "Valor final da venda (R$)"
- Campo data: "Data de fechamento"
- Botão "Confirmar Fechamento"
- Botão "Cancelar"

Só chamar `moveCard` após o usuário confirmar no dialog.
```

**✅ Critério de aceite:**
- Ao fechar um card, aparece dialog pedindo valor final e data
- Após confirmar, `final_value` e `closed_at` são salvos no banco
- O histórico do card mostra o valor no log

---

## ─────────────────────────────────────────
## PROMPT 8 — Validação Final: Testar os 3 perfis
## ─────────────────────────────────────────

**Copie e cole isso na Lovable:**

```
Preciso validar que os 3 perfis estão funcionando corretamente. Verifique e corrija qualquer problema nos seguintes fluxos:

## PERFIL ADMIN (email: adm@adm.com)
Login → deve ver `AdminDashboard` com `data-testid="admin-dashboard"` ✓
Menu deve mostrar: Dashboard Geral, Empresas, Lojas, Vendedores, CRM, Pipeline, WhatsApp, Agente IA, Reativação, Métricas, Projeção Financeira, Configurações
NÃO deve aparecer botões de "Troca Rápida de Perfil" na sidebar

## PERFIL LOJA (email: infindamidiadigital@gmail.com)
Login → deve ver `LojaDashboard` com `data-testid="loja-dashboard"` ✓
Menu deve mostrar: Dashboard, Minha Equipe, Pipeline, WhatsApp, Agente IA, Reativação, Métricas, Configurações
NÃO deve aparecer: Empresas, Lojas, Vendedores, Projeção Financeira

## PERFIL VENDEDOR (email: cardosodanielly11@gmail.com)
Login → deve ver `VendedorDashboard` com `data-testid="vendedor-dashboard"` ✓
Menu deve mostrar: Meu Dashboard, Meu Pipeline, WhatsApp, Reativação, Configurações
NÃO deve aparecer: Empresas, Lojas, Minha Equipe, Agente IA, Métricas, Projeção Financeira

## Verificações de segurança:
- Vendedor que tentar acessar /tenants deve ser redirecionado para /
- Vendedor que tentar acessar /ai-agent deve ser redirecionado para /
- Admin que tentar acessar /projection com role=vendedor (via URL) deve ser bloqueado pelo RequireRole

## Fluxo Agente IA (admin ou loja logado):
- Acessar /ai-agent deve mostrar AgenteIAConfig sem erros
- Deve ser possível ativar/desativar o agente IA com o Switch
- Deve ser possível salvar uma URL de webhook (ex: https://n8n.example.com/webhook/teste)
- O botão "Salvar Configurações" deve funcionar sem erros

Se encontrar algum problema nos fluxos acima, corrija agora. Liste o que verificou e o que foi corrigido.
```

**✅ Critério de aceite:** Os 3 perfis funcionam sem erros visíveis. Agente IA salva configurações.

---

## CHECKLIST FINAL ANTES DO PRIMEIRO ATENDIMENTO

Após todos os prompts executados, confirme os seguintes itens no Supabase Dashboard:

### No Supabase → Table Editor:

**1. Verificar tabela `users`**
- Deve existir pelo menos 1 usuário admin com `role = 'admin'`
- Deve existir pelo menos 1 usuário loja com `role = 'loja'` e `store_id` preenchido
- Deve existir pelo menos 1 usuário vendedor com `role = 'vendedor'` e `tenant_id` preenchido

**2. Verificar tabela `whatsapp_instances`**
- Deve existir 1 instância com `evolution_url` preenchido e `api_key` válido
- `status` deve ser `'connected'` (se ainda não estiver, conectar via /whatsapp/connect)

**3. Verificar tabela `agent_ia_configs`**
- Deve existir 1 config com o `tenant_id` correto
- `is_active` pode ser `false` até configurar o webhook do n8n

### Para conectar o WhatsApp pela primeira vez:
1. Logar como admin ou loja
2. Ir em /whatsapp/connect
3. Configurar evolution_url e api_key
4. Escanear o QR Code com o celular

### Para ativar o Agente IA:
1. Logar como admin ou loja
2. Ir em /ai-agent
3. Colar a URL do webhook do n8n no campo "URL do Webhook"
4. Configurar os horários de atendimento
5. Ativar o toggle "Ativado"
6. Clicar "Salvar Configurações"

---

## FALLBACKS — O QUE FAZER SE A LOVABLE ERRAR

### Se a Lovable não entender o prompt:
Tente com esta versão simplificada e depois complemente:
```
Foque apenas em: [descreva a parte mais importante do prompt]
Arquivo a modificar: [caminho do arquivo]
Mudança específica: [descreva só a mudança pontual]
```

### Se a Lovable introduzir erros TypeScript:
```
Você introduziu erros TypeScript no último commit. Execute `npx tsc --noEmit` e corrija todos os erros sem adicionar `// @ts-nocheck` ou `as any` desnecessários. Liste os erros encontrados e as correções aplicadas.
```

### Se a Lovable reverter mudanças anteriores:
```
IMPORTANTE: Não reverta as mudanças do commit anterior. Apenas adicione as novas mudanças sem tocar nos arquivos que já foram corrigidos: [liste os arquivos].
```

### Se o login não funcionar após as mudanças:
```
O login parou de funcionar. O fluxo correto é:
1. Usuário faz login em /login com email/senha
2. Supabase Auth autentica e retorna sessão
3. useAuth.ts chama hydrate() que busca o perfil em public.users
4. setUser() é chamado com os dados do usuário
5. Shell verifica isAuthenticated e libera o AppShell
6. Dashboard.tsx verifica user.role e renderiza o dashboard correto

Verifique se algum desses passos foi quebrado. Não altere useAuth.ts e authStore.ts sem necessidade.
```

### Se o WhatsApp der erro ao enviar:
O mais comum é a instância não estar conectada. Verifique:
```
A Edge Function evolution-send-message está retornando erro. Adicione um log de debug no catch:
console.error('[evolution-send-message] Erro:', e)

E no frontend, melhore o toast de erro para mostrar a mensagem completa:
toast.error(`Falha no envio: ${err.message}`)
```

---

*Documento gerado por Kiro — Assistente Especialista MEC Hub*
*Versão: 1.0 | Data: 07/06/2026*
