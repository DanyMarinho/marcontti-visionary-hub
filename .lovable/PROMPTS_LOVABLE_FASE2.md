# PROMPTS LOVABLE — FASE 2: CORREÇÕES RESTANTES
**Data:** 07/06/2026 | **Baseado em:** auditoria pós-commit 8cdced1

---

## STATUS DO QUE A LOVABLE JÁ FEZ ✅

| Item | Verificado | Arquivo |
|------|-----------|---------|
| `src/test/setup.ts` criado | ✅ FEITO | setup.ts existe com `@testing-library/jest-dom` |
| `data-testid="admin-dashboard"` | ✅ FEITO | AdminDashboard.tsx linha 57 |
| `data-testid="loja-dashboard"` | ✅ FEITO | LojaDashboard.tsx no return |
| `data-testid="vendedor-dashboard"` | ✅ FEITO | VendedorDashboard.tsx no return |
| `pipelineCardService.moveCard` aceita `finalValue`/`closingDate` | ✅ FEITO | Parâmetros adicionados, payload correto |
| `usePipeline` passa `finalValue`/`closingDate` | ✅ FEITO | mutationFn atualizado |
| `StageConfirmationDialog` com valor + data | ✅ FEITO | Componente correto |
| `evolution-send-message` Edge Function criada | ✅ FEITO | index.ts completo |
| `ConversationView` usa Edge Function real | ✅ FEITO | Mock removido |
| `invite-user` reescrito sem `user_roles` | ✅ FEITO | Usa `auth.admin.createUser` + rollback |
| Migration RLS `wa_conversations` para vendedor | ✅ FEITO | `assigned_to = auth.uid()` |
| `LojaDashboard` histórico de vendas real | ✅ FEITO | Busca `closedCards` real do banco |

---

## O QUE AINDA FALTA — EM ORDEM DE PRIORIDADE

---

## ══════════════════════════════════════════
## PROMPT P-01 — CRÍTICO: `userService.create` trata resposta errada da `invite-user`
## ══════════════════════════════════════════

**Problema detectado no código atual:**

`invite-user/index.ts` retorna `{ success: true, user_id: "..." }` mas `userService.ts` espera `data.user.id` ou `data.id`. A linha:
```ts
const row = (data as any)?.user ?? data;
if (!row?.id) throw new Error('invite-user: invalid response');
```
vai falhar porque a resposta é `{ success: true, user_id: "abc" }` — não tem `user` nem `id` direto.

**Cole este prompt na Lovable:**

```
No arquivo `src/services/userService.ts`, o método `create` trata a resposta da Edge Function `invite-user` de forma incorreta.

A Edge Function `invite-user` retorna: `{ success: true, user_id: "uuid-do-usuario" }`

Mas o código atual tenta acessar `data?.user ?? data` e depois checa `!row?.id`, o que vai sempre lançar erro porque a resposta não tem campo `user` nem campo `id`.

Corrija o método `create` no arquivo `src/services/userService.ts` para lidar com o formato de resposta correto:

```typescript
async create(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<User> {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: {
      email: user.email,
      full_name: user.full_name,
      tenant_id: user.tenant_id,
      store_id: user.store_id ?? null,
      role: user.role,
    },
  });
  if (error) throw new Error(error.message || 'Erro ao convidar usuário');
  
  // invite-user retorna { success: true, user_id: "uuid" }
  const userId = (data as any)?.user_id;
  if (!userId) throw new Error('invite-user: resposta inválida — user_id ausente');
  
  // Buscar o perfil criado no banco para retornar o User completo
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError || !profile) {
    throw new Error('Usuário criado mas perfil não encontrado: ' + (profileError?.message || ''));
  }
  
  return profile as unknown as User;
},
```

Faça a mesma correção no método `inviteVendor`, que também chama `invite-user` e pode ter o mesmo problema de tratamento de resposta. Apenas retorne `data` diretamente em `inviteVendor` já que ele não precisa retornar o User completo.

Não altere nenhum outro arquivo.
```

**⚠️ Erro antecipado:** Se `invite-user` não estiver deployada no Supabase, o erro será `FunctionsFetchError`. Isso é problema de infra, não de código — deployar a função no painel do Supabase.

---

## ══════════════════════════════════════════
## PROMPT P-02 — CRÍTICO: Dashboard Admin com dados reais (empresas e conversão)
## ══════════════════════════════════════════

**Problema detectado:** `useDashboardKpis.ts` ainda tem `// @ts-nocheck` e dois KPIs hardcoded para admin:
- `{ title: 'Empresas Ativas', value: 12, ... }` — número fixo, não busca do banco
- `{ title: 'Conversão Global', value: '24.2%', ... }` — porcentagem inventada

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/dashboard/hooks/useDashboardKpis.ts`, faça DUAS correções:

## CORREÇÃO 1: Remover `// @ts-nocheck`
Remova a linha `// @ts-nocheck` do topo do arquivo. Se aparecerem erros TypeScript após remover, corrija-os usando tipos explícitos (não adicione `as any` desnecessário).

## CORREÇÃO 2: Admin dashboard com dados reais

No bloco `if (user?.role === 'admin' && isGlobal)`, substitua os valores hardcoded por dados reais do banco.

O bloco atual (ERRADO):
```typescript
if (user?.role === 'admin' && isGlobal) {
  return {
    kpis: [
      { title: 'Empresas Ativas', value: 12, ... },        // FALSO
      { title: 'Vendas do Período', value: `R$ ${vendas...}`, ... },  // ok
      { title: 'Cards no Pipeline', value: cardsAtivos, ... },       // ok
      { title: 'Conversão Global', value: '24.2%', ... },  // FALSO
    ],
    salesHistory: [], tenantRanking: [], conversionHistory: []
  };
}
```

Substitua por este bloco que busca dados reais:
```typescript
if (user?.role === 'admin' && isGlobal) {
  // Buscar número real de tenants ativos
  const { count: tenantsCount } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Calcular conversão real: fechados / total de cards com negociação ou acima
  const totalCards = (cards || []).length;
  const closedCards = (cards || []).filter(c => 
    c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
  ).length;
  const conversaoReal = totalCards > 0 
    ? `${Math.round((closedCards / totalCards) * 100)}%`
    : '0%';

  return {
    kpis: [
      { title: 'Empresas Ativas', value: tenantsCount ?? 0, trend: { value: 0, isPositive: true }, icon: 'Building2' },
      { title: 'Vendas do Período', value: `R$ ${vendas.toLocaleString('pt-BR')}`, trend: { value: 12.5, isPositive: true }, icon: 'DollarSign' },
      { title: 'Cards no Pipeline', value: cardsAtivos, trend: { value: 4, isPositive: true }, icon: 'GitMerge' },
      { title: 'Conversão Global', value: conversaoReal, trend: { value: 2.1, isPositive: true }, icon: 'TrendingUp' },
    ],
    salesHistory: [],
    tenantRanking: [],
    conversionHistory: [],
  };
}
```

## CORREÇÃO 3: Vendedor — conversão pessoal real

Ainda no mesmo arquivo, no bloco `if (user?.role === 'vendedor')`, o KPI de conversão está hardcoded:
```typescript
{ title: 'Conversão Pessoal', value: '28%', ... }  // FALSO
```

Substitua por cálculo real usando os `cards` já buscados:
```typescript
const totalVendedor = (cards || []).length;
const fechadosVendedor = (cards || []).filter(c => 
  c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
).length;
const conversaoPessoal = totalVendedor > 0
  ? `${Math.round((fechadosVendedor / totalVendedor) * 100)}%`
  : '0%';
```

E use `conversaoPessoal` no KPI:
```typescript
{ title: 'Conversão Pessoal', value: conversaoPessoal, trend: { value: 5, isPositive: true }, icon: 'TrendingUp' }
```

Salve apenas o arquivo `useDashboardKpis.ts`.
```

**⚠️ Erro antecipado:** A query de `tenantsCount` pode falhar com erro de permissão se a RLS de `tenants` não permitir admin ver todos. RLS atual tem `tenants_select: user_role() = 'admin' OR id = user_tenant_id()` — admin pode ver todos, portanto ok.

---

## ══════════════════════════════════════════
## PROMPT P-03 — ALTO: VendedorList — "Cards Ativos" com dado real
## ══════════════════════════════════════════

**Problema detectado:** `VendedorList.tsx` usa `Math.random() * 15` para mostrar cards ativos de cada vendedor — dado completamente inventado que muda a cada render.

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/admin/Vendors/VendedorList.tsx`, a coluna "Cards Ativos" usa `Math.floor(Math.random() * 15)` — isso é dado falso que muda a cada render.

Faça as seguintes alterações:

## PASSO 1: Buscar contagem real de cards por vendedor

Dentro da função `fetchData`, após buscar `usersData` e `storesData`, adicione uma busca de cards ativos agrupados por `seller_id`:

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const [usersData, storesData] = await Promise.all([
      userService.getAll(activeTenantId || 'all'),
      storeService.getAll(activeTenantId || 'all')
    ]);
    
    // Buscar contagem real de cards ativos por vendedor
    const { data: cardsData } = await supabase
      .from('pipeline_cards')
      .select('seller_id')
      .eq('is_archived', false)
      .not('stage_key', 'in', '("fechamento","pos_venda")')
      .in('seller_id', usersData.filter(u => u.role === 'vendedor').map(u => u.id));
    
    const cardCountMap: Record<string, number> = {};
    (cardsData || []).forEach(card => {
      cardCountMap[card.seller_id] = (cardCountMap[card.seller_id] || 0) + 1;
    });
    
    setCardCountByUser(cardCountMap);
    setUsers(usersData);
    setStores(storesData);
  } catch (error) {
    toast.error('Erro ao carregar dados');
  } finally {
    setLoading(false);
  }
};
```

## PASSO 2: Adicionar state para o mapa de contagem

Adicione no início da função do componente, junto com os outros states:
```typescript
const [cardCountByUser, setCardCountByUser] = useState<Record<string, number>>({});
```

Adicione também o import de `supabase` no topo do arquivo se não existir:
```typescript
import { supabase } from '@/integrations/supabase/client';
```

## PASSO 3: Usar o mapa na célula da tabela

Substitua a linha com `Math.random`:
```typescript
// ANTES (ERRADO):
{user.role === 'vendedor' ? Math.floor(Math.random() * 15) : '-'}

// DEPOIS (CORRETO):
{user.role === 'vendedor' ? (cardCountByUser[user.id] ?? 0) : '-'}
```

Não altere nenhuma outra parte do arquivo.
```

**⚠️ Erro antecipado:** Se o admin estiver em view global (`activeTenantId = 'all'`), a query de cards pode não ter `tenant_id` e retornar dados de todos os tenants. Isso é aceitável para o admin global — os cards serão de todos os tenants.

---

## ══════════════════════════════════════════
## PROMPT P-04 — ALTO: Remover `// @ts-nocheck` de `ReactivationList.tsx` e `whatsappService.ts`
## ══════════════════════════════════════════

**Problema:** Dois arquivos ainda têm `// @ts-nocheck`, tornando TypeScript cego a erros nesses módulos.

**Cole este prompt na Lovable:**

```
Remova `// @ts-nocheck` dos seguintes arquivos e corrija os erros de TypeScript que surgirem:

## Arquivo 1: `src/modules/reactivation/ReactivationList.tsx`

Remova a primeira linha `// @ts-nocheck`.

Os prováveis erros após remover:
- `cards` vai ter tipo `any[]` do Supabase — adicione tipo explícito usando `as any[]` no retorno da query (aceitável aqui)
- `card.client`, `card.seller` podem ser `null` — já tratados com `?.` no JSX, ok
- `filterGroup` state já tem tipo explícito `'all' | 'critical' | 'attention' | 'monitor'`, ok

Se aparecer erro em `card.group` porque `group` não existe no tipo do banco, adicione uma interface local:
```typescript
interface ProcessedCard {
  id: string;
  updated_at: string;
  stage_key: string;
  estimated_value: number;
  client?: { full_name?: string; phone?: string } | null;
  seller?: { full_name?: string } | null;
  idleDays: number;
  group: 'critical' | 'attention' | 'monitor' | 'normal';
  [key: string]: any;
}
```
E faça cast: `const processedCards: ProcessedCard[] = cards.map(card => { ... })`

## Arquivo 2: `src/services/whatsappService.ts`

Remova a primeira linha `// @ts-nocheck`.

Os prováveis erros após remover:
- Os métodos já têm tipos de retorno explícitos (`WhatsAppInstance`, `WhatsAppMessage`, etc.) — ok
- `data as WhatsAppInstance | null` pode dar erro se o tipo do Supabase não bater exatamente. Use `data as unknown as WhatsAppInstance | null` nesses casos
- O parâmetro `scope` em `getConversations` já está tipado, ok
- `rows.filter(...)` pode reclamar de tipo — adicione `: any[]` se necessário

Não introduza nenhum novo `// @ts-nocheck`. Corrija os erros individualmente com tipos ou `as unknown as Tipo`.
```

**⚠️ Erro antecipado:** O tipo gerado do Supabase em `src/integrations/supabase/types.ts` pode não ter `whatsapp_conversations` ou pode ter nomes diferentes dos tipos manuais. Use `as unknown as Tipo` nesses casos específicos — é o padrão correto quando os tipos gerados divergem dos tipos da aplicação.

---

## ══════════════════════════════════════════
## PROMPT P-05 — ALTO: KanbanBoard — Dialog de fechamento para `pos_venda` também
## ══════════════════════════════════════════

**Problema:** `KanbanBoard.tsx` só abre o dialog de confirmação quando `toStage === 'fechamento'`. Se arrastar para `pos_venda` diretamente, move sem pedir o valor final.

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/pipeline/KanbanBoard.tsx`, dentro da função `handleDragEnd`, o dialog de confirmação de fechamento só é aberto quando `toStage === 'fechamento'`.

Mas `pos_venda` também é uma etapa de "fechamento de ciclo" que precisa registrar o valor final.

Localize este bloco:
```typescript
if (card && card.stage_key !== toStage) {
  if (toStage === 'fechamento') {
    setPendingMove({ cardId, fromStage: card.stage_key, toStage });
  } else {
    moveCard.mutate({ 
      cardId, 
      fromStage: card.stage_key, 
      toStage 
    });
  }
}
```

Substitua por:
```typescript
if (card && card.stage_key !== toStage) {
  const requiresConfirmation = toStage === 'fechamento' || toStage === 'pos_venda';
  if (requiresConfirmation) {
    setPendingMove({ cardId, fromStage: card.stage_key, toStage });
  } else {
    moveCard.mutate({ 
      cardId, 
      fromStage: card.stage_key, 
      toStage 
    });
  }
}
```

Também atualize o `title` e `description` do `StageConfirmationDialog` para ser dinâmico de acordo com o `toStage`:
```typescript
<StageConfirmationDialog
  open={!!pendingMove}
  onOpenChange={(open) => !open && setPendingMove(null)}
  title={pendingMove?.toStage === 'pos_venda' ? 'Confirmar Pós-venda' : 'Confirmar Fechamento'}
  description={
    pendingMove?.toStage === 'pos_venda'
      ? 'Registre o valor final desta venda para mover para Pós-venda.'
      : 'Parabéns pela venda! Informe o valor final para encerrar este card.'
  }
  onConfirm={(data) => {
    if (pendingMove) {
      moveCard.mutate({ 
        ...pendingMove,
        finalValue: data.value,
        closingDate: data.date
      });
      setPendingMove(null);
    }
  }}
/>
```

Não altere mais nada no arquivo.
```

---

## ══════════════════════════════════════════
## PROMPT P-06 — ALTO: VendedorDashboard — Ranking real da loja
## ══════════════════════════════════════════

**Problema:** `useDashboardKpis.ts` retorna `ranking: []` para o vendedor — o painel "Ranking da Loja" fica completamente vazio sem nenhuma mensagem.

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/dashboard/hooks/useDashboardKpis.ts`, dentro do bloco `if (user?.role === 'vendedor')`, o ranking está retornando `ranking: []`.

Adicione uma busca real de ranking dos vendedores da mesma loja do usuário logado. Adicione este código ANTES do `return` do bloco vendedor:

```typescript
// Buscar ranking de vendedores da mesma loja/tenant
const { data: rankingData } = await supabase
  .from('pipeline_cards')
  .select('seller_id, final_value, estimated_value, stage_key, seller:users!seller_id(full_name)')
  .eq('tenant_id', activeTenantId)
  .eq('is_archived', false)
  .in('stage_key', ['fechamento', 'pos_venda']);

// Agrupar por seller_id e somar vendas
const rankingMap: Record<string, { name: string; sales: number }> = {};
(rankingData || []).forEach((card: any) => {
  const sid = card.seller_id;
  const name = card.seller?.full_name || 'Desconhecido';
  const value = Number(card.final_value || card.estimated_value || 0);
  if (!rankingMap[sid]) rankingMap[sid] = { name, sales: 0 };
  rankingMap[sid].sales += value;
});

const ranking = Object.entries(rankingMap)
  .sort(([, a], [, b]) => b.sales - a.sales)
  .slice(0, 5)
  .map(([sid, entry], index) => ({
    position: index + 1,
    name: sid === user.id ? 'Você' : entry.name,
    sales: entry.sales,
  }));
```

E no `return`, substitua `ranking: []` por `ranking`.

No componente `VendedorDashboard.tsx`, adicione um empty state quando `ranking` for vazio:

Dentro do `CardContent` do "Ranking da Loja", envolva o `.map` com uma verificação:
```tsx
{(!data?.ranking || data.ranking.length === 0) ? (
  <div className="text-center py-8 text-muted-foreground text-sm">
    Nenhuma venda fechada ainda neste período.
  </div>
) : (
  data.ranking.map((rank: any) => (
    // ... código existente do map
  ))
)}
```

Altere apenas os dois arquivos: `useDashboardKpis.ts` e `VendedorDashboard.tsx`.
```

**⚠️ Erro antecipado:** O join `seller:users!seller_id(full_name)` pode falhar dependendo da versão do `@supabase/supabase-js`. Se falhar, use duas queries separadas: uma para os cards, outra para buscar os nomes com `.in('id', sellerIds)`.

---

## ══════════════════════════════════════════
## PROMPT P-07 — MÉDIO: LojaDashboard — KPIs com textos falsos corrigidos
## ══════════════════════════════════════════

**Problema:** `LojaDashboard.tsx` ainda tem duas descrições hardcoded:
- `description="+12.5% vs mês anterior"` — inventada
- `description="+5 novos este mês"` — inventada

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/dashboard/LojaDashboard.tsx`, existem duas descrições hardcoded em KpiCards que mostram dados falsos.

## CORREÇÃO 1: "Vendas do Mês" — remover comparação falsa

Localize:
```tsx
<KpiCard
  title="Vendas do Mês"
  value={...}
  description="+12.5% vs mês anterior"
  ...
```

Substitua `description="+12.5% vs mês anterior"` por `description="Acumulado do período"`.

## CORREÇÃO 2: "Cards Ativos" — remover +5 falso

Localize:
```tsx
<KpiCard
  title="Cards Ativos"
  value={kpis?.cardsAtivos || 0}
  description="+5 novos este mês"
  ...
```

Substitua `description="+5 novos este mês"` por `description="Oportunidades em andamento"`.

Não altere mais nada no arquivo.
```

---

## ══════════════════════════════════════════
## PROMPT P-08 — MÉDIO: Reativação — adicionar filtro `seller_id` para vendedor
## ══════════════════════════════════════════

**Problema:** `ReactivationList.tsx` busca todos os cards do tenant sem filtrar por `seller_id` para o perfil vendedor. A RLS já garante o isolamento, mas a query deveria ser explícita.

**Cole este prompt na Lovable:**

```
No arquivo `src/modules/reactivation/ReactivationList.tsx`, adicione suporte ao `useAuthStore` para filtrar cards por `seller_id` quando o usuário for vendedor.

## PASSO 1: Importar useAuthStore

Adicione no topo do arquivo (após os imports existentes):
```typescript
import { useAuthStore } from '@/store/authStore';
```

## PASSO 2: Usar o user dentro do componente

Na função `ReactivationList`, adicione logo após `useTenant()`:
```typescript
const { user } = useAuthStore();
```

## PASSO 3: Aplicar filtro na query

Na queryFn da query de cards, adicione filtro condicional:
```typescript
queryFn: async () => {
  let query = supabase
    .from('pipeline_cards')
    .select('*, client:clients(*), seller:users(*)')
    .eq('tenant_id', activeTenantId!)
    .eq('is_archived', false)
    .neq('stage_key', 'pos_venda')
    .neq('stage_key', 'fechamento');
  
  // Defense-in-depth: filtro explícito para vendedor
  if (user?.role === 'vendedor') {
    query = query.eq('seller_id', user.id);
  } else if (user?.role === 'loja' && user.store_id) {
    query = query.eq('store_id', user.store_id);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
},
```

## PASSO 4: Adicionar `user?.id` na queryKey para re-fetch ao trocar de usuário

```typescript
queryKey: ['reactivation-cards', activeTenantId, user?.id, user?.role],
```

Não altere mais nada no arquivo.
```

---

## ══════════════════════════════════════════
## PROMPT P-09 — MÉDIO: Settings — conectar saves reais (dados da empresa)
## ══════════════════════════════════════════

**Problema:** `Settings.tsx` tem todos os botões "Salvar" falsos (setTimeout + toast). Pelo menos os dados da empresa devem salvar de verdade.

**Cole este prompt na Lovable:**

```
No arquivo `src/pages/Settings.tsx`, os botões "Salvar" fazem apenas `setTimeout(1000ms)` e mostram um toast falso de sucesso, sem salvar nada no banco.

Implemente o save real para a aba "Dados da Empresa" (tab `dados`). Para as outras abas, pelo menos remova o falso "Salvar" e mostre um toast informativo.

## PASSO 1: Adicionar imports necessários

No topo do arquivo, adicione:
```typescript
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { useQueryClient } from '@tanstack/react-query';
```

## PASSO 2: Usar useTenant e useQueryClient no componente

Dentro de `export default function Settings()`, adicione:
```typescript
const { activeTenantId } = useTenant();
const queryClient = useQueryClient();
```

## PASSO 3: Substituir os states dos campos editáveis

Adicione states para os campos que devem salvar:
```typescript
const [companyName, setCompanyName] = React.useState(currentTenant?.name || '');
const [contactEmail, setContactEmail] = React.useState(currentTenant?.contact_email || '');

// Sincronizar quando currentTenant carregar
React.useEffect(() => {
  if (currentTenant) {
    setCompanyName(currentTenant.name);
    setContactEmail(currentTenant.contact_email);
  }
}, [currentTenant]);
```

## PASSO 4: Implementar handleSaveDados real

Substitua a função `handleSave` genérica por uma específica para dados da empresa:
```typescript
const handleSaveDados = async () => {
  if (!activeTenantId || activeTenantId === 'all') {
    toast.error('Selecione uma empresa primeiro');
    return;
  }
  setIsSaving(true);
  try {
    const { error } = await supabase
      .from('tenants')
      .update({
        name: companyName,
        contact_email: contactEmail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activeTenantId);
    
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['tenant', activeTenantId] });
    toast.success('Dados da empresa salvos com sucesso');
  } catch (err: any) {
    toast.error('Erro ao salvar: ' + err.message);
  } finally {
    setIsSaving(false);
  }
};
```

## PASSO 5: Atualizar os campos da aba "dados" para usar os states

No Input de "Nome Fantasia":
```tsx
<Input 
  value={companyName} 
  onChange={(e) => setCompanyName(e.target.value)}
  className="bg-zinc-900 border-zinc-800" 
/>
```

No Input de "E-mail Comercial":
```tsx
<Input 
  value={contactEmail}
  onChange={(e) => setContactEmail(e.target.value)}
  className="bg-zinc-900 border-zinc-800" 
/>
```

## PASSO 6: Conectar o botão "Salvar Dados" com a função real

Substitua `onClick={handleSave}` nos botões dentro da aba "dados" por `onClick={handleSaveDados}`.

## PASSO 7: Para as outras abas (pipeline, notifications, integrations)

Substitua `handleSave` nesses botões por uma função que mostre um toast informativo:
```typescript
const handleSavePending = () => {
  toast.info('Esta configuração será implementada em breve. Fale com o suporte.');
};
```

## PASSO 8: Logs de Auditoria — buscar dados reais

Na aba "audit", substitua o array hardcoded por uma query real:

```tsx
// Substitua o array estático por um useQuery
const { data: auditLogs = [] } = useQuery({
  queryKey: ['audit-logs', activeTenantId],
  queryFn: async () => {
    if (!activeTenantId || activeTenantId === 'all') return [];
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, user:users(full_name)')
      .eq('tenant_id', activeTenantId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  enabled: !!activeTenantId && activeTenantId !== 'all',
});
```

E no JSX da tabela de auditoria, substitua o `.map` do array fixo pelo `auditLogs.map(...)` com os campos reais: `log.created_at`, `log.user?.full_name`, `log.field_name`, `log.new_value`.

Adicione o import `useQuery` do `@tanstack/react-query` se não existir.
```

**⚠️ Erro antecipado:** `audit_logs` pode estar vazio se nenhuma ação foi auditada. Adicione empty state: "Nenhum log de auditoria encontrado."

---

## ══════════════════════════════════════════
## PROMPT P-10 — VERIFICAÇÃO FINAL DOS 3 PERFIS
## ══════════════════════════════════════════

**Cole este prompt na Lovable DEPOIS de todos os anteriores:**

```
Faça uma verificação completa dos 3 perfis após todas as correções. Para cada perfil, verifique e corrija qualquer problema restante:

## ADMIN — Checklist de verificação:
1. Login com `adm@adm.com` → redireciona para `/` → exibe `AdminDashboard` com `data-testid="admin-dashboard"` ✓
2. KPI "Empresas Ativas" busca do banco (não é 12 fixo) ✓
3. KPI "Conversão Global" calculado do banco (não é 24.2% fixo) ✓
4. Ranking de Empresas: se vazio, mostrar "Nenhuma venda registrada ainda" em vez de tabela vazia sem texto
5. Menu sidebar mostra: Dashboard Geral, Empresas, Lojas, Vendedores, CRM, Pipeline, WhatsApp, Agente IA, Reativação, Métricas, Projeção Financeira, Configurações
6. `/tenants` acessível apenas para admin → ✓ (RequireRole já implementado)
7. Settings → aba "Dados da Empresa" salva no banco → ✓ (após P-09)

## LOJA — Checklist de verificação:
1. Login com `infindamidiadigital@gmail.com` → redireciona para `/` → exibe `LojaDashboard` com `data-testid="loja-dashboard"` ✓
2. Gráfico "Evolução de Vendas" mostra dados reais (pode ser vazio se não há vendas fechadas) ✓
3. Menu NÃO mostra: Empresas, Lojas, Vendedores, Projeção Financeira
4. `/ai-agent` acessível → Agente IA salva configurações → ✓
5. WhatsApp: mensagem enviada via Evolution API (não mock) → ✓

## VENDEDOR — Checklist de verificação:
1. Login com `cardosodanielly11@gmail.com` → redireciona para `/` → exibe `VendedorDashboard` com `data-testid="vendedor-dashboard"` ✓
2. "Conversão Pessoal" calculada do banco (não é 28% fixo) ✓
3. "Ranking da Loja" busca dados reais do banco (ou mostra empty state) ✓
4. Pipeline só mostra cards do próprio vendedor → ✓
5. Ao arrastar card para "fechamento" → dialog aparece pedindo valor e data ✓
6. Ao arrastar card para "pos_venda" → dialog também aparece ✓ (após P-05)
7. Tentativa de acessar `/tenants` pela URL → redireciona para `/` ✓
8. Tentativa de acessar `/ai-agent` pela URL → redireciona para `/` ✓
9. WhatsApp: vê só conversas atribuídas a ele (via RLS + client scope) ✓

## AGENTE IA — Checklist:
1. Loja/Admin acessa `/ai-agent` → carrega config do banco ✓
2. Ativa toggle → muda `is_active` localmente ✓
3. Preenche URL do webhook n8n → campo funcional ✓
4. Clica "Salvar" → salva em `agent_ia_configs` ✓
5. WhatsApp recebe mensagem → webhook dispara → Groq processa → resposta enviada via Evolution API ✓
6. `[HANDOFF_VENDEDOR]` na resposta → cria card no pipeline ✓

Se encontrar qualquer item em vermelho nos checklists acima, corrija imediatamente.
Liste o que foi verificado e o que precisou de correção.
```

---

## TABELA RESUMO — STATUS ATUAL vs APÓS PROMPTS

| Item | Antes | Após P-0X |
|------|-------|-----------|
| `userService.create` trata resposta corretamente | ❌ | ✅ P-01 |
| Admin: Empresas Ativas real | ❌ | ✅ P-02 |
| Admin: Conversão Global real | ❌ | ✅ P-02 |
| Vendedor: Conversão Pessoal real | ❌ | ✅ P-02 |
| `useDashboardKpis` sem `@ts-nocheck` | ❌ | ✅ P-02 |
| VendedorList: Cards Ativos real | ❌ | ✅ P-03 |
| `ReactivationList` sem `@ts-nocheck` | ❌ | ✅ P-04 |
| `whatsappService` sem `@ts-nocheck` | ❌ | ✅ P-04 |
| Kanban: `pos_venda` abre dialog | ❌ | ✅ P-05 |
| Vendedor: Ranking real | ❌ | ✅ P-06 |
| Loja: KPI descriptions sem texto falso | ❌ | ✅ P-07 |
| Reativação: filtro por seller/store | ❌ | ✅ P-08 |
| Settings: Save dados empresa real | ❌ | ✅ P-09 |
| Settings: Logs auditoria reais | ❌ | ✅ P-09 |

---

## ERROS QUE PODEM APARECER APÓS AS CORREÇÕES — GUIA DE RESPOSTA RÁPIDA

### Erro: "FunctionsFetchError: Failed to send a request to the Edge Function"
**Causa:** Edge Function não deployada no Supabase.
**Solução:** No Supabase Dashboard → Edge Functions → Deploy `evolution-send-message` e `invite-user`.

### Erro: "relation 'user_roles' does not exist"
**Causa:** versão antiga de `invite-user` ainda em deploy.
**Solução:** Redeploy da Edge Function com o código novo (sem `user_roles`).

### Erro: TypeScript "Property 'ranking' does not exist on type..."
**Causa:** `useDashboardKpis` retorna tipos diferentes por role.
**Solução para Lovable:**
```
No arquivo `useDashboardKpis.ts`, o hook retorna objetos com shapes diferentes dependendo da role, o que causa erros de TypeScript. Adicione um tipo de retorno explícito ou use `as any` temporariamente apenas no return statement que causa conflito.
```

### Erro: "Error: invite-user: resposta inválida — user_id ausente"
**Causa:** Edge Function `invite-user` retornou erro mas sem campo `error` no body.
**Solução para Lovable:**
```
No método `create` do `userService.ts`, adicione log de debug antes do throw:
console.error('[invite-user] resposta inesperada:', data);
```

### Erro: "invalid input syntax for type uuid" ao criar usuário
**Causa:** `store_id` sendo passado como string vazia `""` em vez de `null`.
**Solução para Lovable:**
```
No `VendedorForm.tsx` ou onde o formulário monta o payload, garanta que `store_id` seja `null` quando não selecionado, não string vazia. Substitua `store_id: formData.store_id` por `store_id: formData.store_id || null`.
```

### Erro: WhatsApp "status: 400 — WhatsApp não está conectado"
**Causa:** Instância não conectada — é comportamento esperado antes de configurar.
**Ação:** Conectar o WhatsApp via `/whatsapp/connect` antes de tentar enviar mensagens.

### Erro: Gráfico de ranking aparece vazio após P-06
**Causa:** Nenhum card fechado ainda no banco.
**Ação:** É comportamento correto — o empty state deve aparecer. Se não aparecer, o P-06 não foi aplicado corretamente.

---

*Documento gerado por Kiro — 07/06/2026*
*Use um prompt por vez. Aguarde commit antes do próximo.*
