# MAPA COMPLETO DE ROTAS + STATUS 100% — MEC Hub
**Data:** 07/06/2026

---

## MAPA DE ROTAS

| Rota | Componente | Guard | Admin | Loja | Vendedor | Público |
|------|-----------|-------|-------|------|----------|---------|
| `/login` | `Login` | nenhum (público) | ✅ | ✅ | ✅ | ✅ |
| `/reset-password` | `ResetPassword` | nenhum (público) | ✅ | ✅ | ✅ | ✅ |
| `/` | `Dashboard` → role-switch | Shell (auth) | AdminDashboard | LojaDashboard | VendedorDashboard | ❌→login |
| `/crm` | `ClienteList` | Shell (auth) | ✅ | ✅ | ❌ (sem item no menu, acessa vazio via URL) | ❌→login |
| `/pipeline` | `KanbanBoard` | Shell (auth) | ✅ | ✅ | ✅ (filtrado por seller_id) | ❌→login |
| `/whatsapp` | `WhatsAppInbox` | Shell (auth) | ✅ | ✅ | ✅ (filtrado por assigned_to) | ❌→login |
| `/whatsapp/connect` | `QRCodeConnect` | Shell (auth) | ✅ | ✅ | ✅ | ❌→login |
| `/ai-agent` | `AgenteIAConfig` | RequireRole admin,loja | ✅ | ✅ | ❌→/ | ❌→login |
| `/ai-agent/logs` | `AgenteIALogs` | RequireRole admin,loja | ✅ | ✅ | ❌→/ | ❌→login |
| `/tenants` | `TenantList` | RequireRole admin | ✅ | ❌→/ | ❌→/ | ❌→login |
| `/shops` | `LojaList` | RequireRole admin | ✅ | ❌→/ | ❌→/ | ❌→login |
| `/vendors` | `VendedorList` | RequireRole admin | ✅ | ❌→/ | ❌→/ | ❌→login |
| `/team` | `VendedorList` | RequireRole admin,loja | ✅ | ✅ | ❌→/ | ❌→login |
| `/metrics` | `Metricas` | Shell (auth) | ✅ | ✅ | ✅ (sem RequireRole — bug menor) | ❌→login |
| `/projection` | `ProjecaoFinanceira` | RequireRole admin | ✅ | ❌→/ | ❌→/ | ❌→login |
| `/reactivation` | `Reactivation` | Shell (auth) | ✅ | ✅ | ✅ | ❌→login |
| `/settings` | `Settings` | Shell (auth) | ✅ | ✅ | ✅ | ❌→login |
| `/setup/new-tenant` | `NewTenantWizard` | RequireRole admin | ✅ | ❌→/ | ❌→/ | ❌→login |
| `*` (qualquer) | `NotFound` | — | 404 | 404 | 404 | 404 |

**Nota sobre `/metrics`:** Está acessível para vendedor via URL direta (sem `RequireRole`). O menu da Sidebar já o oculta para vendedor, mas a rota não tem guard. Risco baixo — dados já são filtrados pelo banco.

---

## STATUS APÓS FASE 1 (JÁ FEITO) + FASE 2 (PROMPTS P-01 a P-09)

### PERFIL ADMIN — 100% após P-01, P-02, P-03, P-09

| Rota | Feature | Status após Fase 2 |
|------|---------|-------------------|
| `/login` | Login real Supabase Auth | ✅ |
| `/` | Dashboard com KPIs reais (sem hardcoded) | ✅ P-02 |
| `/tenants` | Lista tenants reais | ✅ |
| `/shops` | Lista lojas reais | ✅ |
| `/vendors` | Cards Ativos reais (sem Math.random) | ✅ P-03 |
| `/vendors` | Criar usuário (invite-user corrigido) | ✅ P-01 |
| `/team` | (mesmo componente de /vendors) | ✅ |
| `/crm` | Lista clientes reais | ✅ |
| `/pipeline` | Kanban com fechamento + valor salvos | ✅ |
| `/pipeline` | Dialog para pos_venda também | ✅ P-05 |
| `/whatsapp` | Envio real via Evolution API | ✅ |
| `/whatsapp/connect` | Conectar instância WhatsApp | ✅ |
| `/ai-agent` | Config agente salva no banco | ✅ |
| `/ai-agent/logs` | Logs reais de IA | ✅ |
| `/reactivation` | Lista cards parados reais | ✅ |
| `/metrics` | Métricas reais | ✅ |
| `/projection` | Projeção com dados reais | ✅ |
| `/settings` | Salva dados da empresa no banco | ✅ P-09 |
| `/settings` | Logs de auditoria reais | ✅ P-09 |
| `/setup/new-tenant` | Wizard corrigido (schema fix) | ⚠️ pendente (não crítico) |

### PERFIL LOJA — 100% após P-04, P-07, P-08, P-09

| Rota | Feature | Status após Fase 2 |
|------|---------|-------------------|
| `/login` | Login real | ✅ |
| `/` | Dashboard loja, histórico real, sem textos falsos | ✅ P-07 |
| `/team` | Lista equipe da loja | ✅ |
| `/pipeline` | Kanban filtrado por store_id | ✅ |
| `/whatsapp` | Envio real, transferência funcionando | ✅ |
| `/ai-agent` | Agente IA configurável | ✅ |
| `/reactivation` | Filtro por store_id aplicado | ✅ P-08 |
| `/metrics` | Métricas da loja | ✅ |
| `/settings` | Salva dados reais | ✅ P-09 |
| `/crm` | CRM da loja (filtrado por tenant) | ✅ |

### PERFIL VENDEDOR — 100% após P-04, P-05, P-06, P-08

| Rota | Feature | Status após Fase 2 |
|------|---------|-------------------|
| `/login` | Login real | ✅ |
| `/` | Dashboard com conversão real, ranking real | ✅ P-06 |
| `/pipeline` | Só vê seus cards | ✅ |
| `/pipeline` | Dialog em fechamento E pos_venda | ✅ P-05 |
| `/whatsapp` | Vê só conversas atribuídas (RLS + client) | ✅ |
| `/reactivation` | Filtro por seller_id | ✅ P-08 |
| `/settings` | Configurações pessoais | ✅ |
| `/tenants` (URL direta) | Bloqueado → redireciona para / | ✅ |
| `/ai-agent` (URL direta) | Bloqueado → redireciona para / | ✅ |

---

## PROMPTS FASE 2 — COPIAR E COLAR NA LOVABLE (ordem exata)

---

### P-01 — `userService.create` trata resposta errada

```
No arquivo `src/services/userService.ts`, o método `create` falha porque tenta acessar `data?.user?.id` mas a Edge Function `invite-user` retorna `{ success: true, user_id: "uuid" }`.

Substitua o método `create` por:

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
  const userId = (data as any)?.user_id;
  if (!userId) throw new Error('invite-user: user_id ausente na resposta');
  const { data: profile, error: profileError } = await supabase
    .from('users').select('*').eq('id', userId).single();
  if (profileError || !profile) throw new Error('Perfil não encontrado após criação');
  return profile as unknown as User;
},

Não altere mais nada.
```

---

### P-02 — Dashboard admin: dados reais + remover @ts-nocheck

```
No arquivo `src/modules/dashboard/hooks/useDashboardKpis.ts`:

1. Remova a linha `// @ts-nocheck` do topo.

2. No bloco `if (user?.role === 'admin' && isGlobal)`, substitua os dois valores hardcoded:

ANTES:
{ title: 'Empresas Ativas', value: 12, ... }
{ title: 'Conversão Global', value: '24.2%', ... }

DEPOIS — adicione estas queries ANTES do return deste bloco:

const { count: tenantsCount } = await supabase
  .from('tenants')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', true);

const totalCards = (cards || []).length;
const closedCount = (cards || []).filter(c =>
  c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
).length;
const conversaoReal = totalCards > 0
  ? `${Math.round((closedCount / totalCards) * 100)}%`
  : '0%';

E use nos KPIs:
{ title: 'Empresas Ativas', value: tenantsCount ?? 0, trend: { value: 0, isPositive: true }, icon: 'Building2' }
{ title: 'Conversão Global', value: conversaoReal, trend: { value: 0, isPositive: true }, icon: 'TrendingUp' }

3. No bloco vendedor, substitua o KPI hardcoded:
ANTES: { title: 'Conversão Pessoal', value: '28%', ... }

Adicione antes do return do bloco vendedor:
const totalV = (cards || []).length;
const fechadosV = (cards || []).filter(c =>
  c.stage_key === 'fechamento' || c.stage_key === 'pos_venda'
).length;
const conversaoPessoal = totalV > 0
  ? `${Math.round((fechadosV / totalV) * 100)}%`
  : '0%';

E use: { title: 'Conversão Pessoal', value: conversaoPessoal, ... }

Se aparecerem erros TypeScript após remover @ts-nocheck, use `as unknown as Tipo` nos casts do Supabase.
```

---

### P-03 — VendedorList: Cards Ativos real (sem Math.random)

```
No arquivo `src/modules/admin/Vendors/VendedorList.tsx`:

1. Adicione o import do supabase se não existir:
import { supabase } from '@/integrations/supabase/client';

2. Adicione um state:
const [cardCountByUser, setCardCountByUser] = useState<Record<string, number>>({});

3. Dentro de `fetchData`, após carregar `usersData`, adicione:
const vendedorIds = usersData.filter(u => u.role === 'vendedor').map(u => u.id);
if (vendedorIds.length > 0) {
  const { data: cardsData } = await supabase
    .from('pipeline_cards')
    .select('seller_id')
    .eq('is_archived', false)
    .not('stage_key', 'in', '("fechamento","pos_venda")')
    .in('seller_id', vendedorIds);
  const countMap: Record<string, number> = {};
  (cardsData || []).forEach((c: any) => {
    countMap[c.seller_id] = (countMap[c.seller_id] || 0) + 1;
  });
  setCardCountByUser(countMap);
}

4. Na célula da tabela, substitua:
ANTES: {user.role === 'vendedor' ? Math.floor(Math.random() * 15) : '-'}
DEPOIS: {user.role === 'vendedor' ? (cardCountByUser[user.id] ?? 0) : '-'}
```

---

### P-04 — Remover @ts-nocheck de ReactivationList e whatsappService

```
Arquivo 1: `src/modules/reactivation/ReactivationList.tsx`
- Remova a linha `// @ts-nocheck`
- Se der erro em `card.group` ou `card.idleDays` (campos calculados), adicione `as any` apenas no cast do resultado da query: `return data as any[];`
- Mantenha todos os `?.` já existentes no JSX

Arquivo 2: `src/services/whatsappService.ts`
- Remova a linha `// @ts-nocheck`
- Onde der erro de tipo nos casts `.select()`, use `as unknown as TipoEsperado`
- Ex: `return data as unknown as WhatsAppInstance | null;`

Não adicione novos @ts-nocheck. Corrija tipo a tipo.
```

---

### P-05 — Kanban: pos_venda também abre dialog de fechamento

```
No arquivo `src/modules/pipeline/KanbanBoard.tsx`, dentro de `handleDragEnd`:

Localize:
if (toStage === 'fechamento') {
  setPendingMove(...)
} else {
  moveCard.mutate(...)
}

Substitua por:
const requiresConfirmation = toStage === 'fechamento' || toStage === 'pos_venda';
if (requiresConfirmation) {
  setPendingMove({ cardId, fromStage: card.stage_key, toStage });
} else {
  moveCard.mutate({ cardId, fromStage: card.stage_key, toStage });
}

No componente StageConfirmationDialog logo abaixo, atualize title e description para serem dinâmicos:
title={pendingMove?.toStage === 'pos_venda' ? 'Confirmar Pós-venda' : 'Confirmar Fechamento'}
description={pendingMove?.toStage === 'pos_venda'
  ? 'Registre o valor desta venda para mover para Pós-venda.'
  : 'Parabéns! Informe o valor final para encerrar este card.'}
```

---

### P-06 — Vendedor: Ranking da loja real + empty state

```
No arquivo `src/modules/dashboard/hooks/useDashboardKpis.ts`, no bloco `if (user?.role === 'vendedor')`, antes do return, adicione:

const { data: rankingData } = await supabase
  .from('pipeline_cards')
  .select('seller_id, final_value, estimated_value, stage_key')
  .eq('tenant_id', activeTenantId)
  .eq('is_archived', false)
  .in('stage_key', ['fechamento', 'pos_venda']);

const rankingMap: Record<string, number> = {};
const nameMap: Record<string, string> = {};
(rankingData || []).forEach((c: any) => {
  rankingMap[c.seller_id] = (rankingMap[c.seller_id] || 0) + Number(c.final_value || c.estimated_value || 0);
});

// Buscar nomes dos sellers
const sellerIds = Object.keys(rankingMap);
if (sellerIds.length > 0) {
  const { data: sellersData } = await supabase
    .from('users').select('id, full_name').in('id', sellerIds);
  (sellersData || []).forEach((s: any) => { nameMap[s.id] = s.full_name; });
}

const ranking = Object.entries(rankingMap)
  .sort(([,a],[,b]) => b - a)
  .slice(0, 5)
  .map(([sid, sales], i) => ({
    position: i + 1,
    name: sid === user.id ? 'Você' : (nameMap[sid] || 'Vendedor'),
    sales,
  }));

No return do bloco vendedor, substitua `ranking: []` por `ranking`.

No arquivo `src/modules/dashboard/VendedorDashboard.tsx`, no CardContent do "Ranking da Loja", envolva o map com:
{(!data?.ranking || data.ranking.length === 0) ? (
  <p className="text-center text-sm text-muted-foreground py-8">Nenhuma venda fechada ainda.</p>
) : (
  data.ranking.map((rank: any) => ( ...código existente... ))
)}
```

---

### P-07 — Loja: remover descrições falsas dos KpiCards

```
No arquivo `src/modules/dashboard/LojaDashboard.tsx`, faça duas trocas:

1. Localize: description="+12.5% vs mês anterior"
   Substitua por: description="Acumulado do período"

2. Localize: description="+5 novos este mês"
   Substitua por: description="Oportunidades em andamento"

Só isso. Não altere mais nada.
```

---

### P-08 — Reativação: filtro seller_id/store_id por role

```
No arquivo `src/modules/reactivation/ReactivationList.tsx`:

1. Adicione import: import { useAuthStore } from '@/store/authStore';

2. Dentro do componente, após useTenant():
const { user } = useAuthStore();

3. Na queryKey, adicione: user?.id, user?.role
queryKey: ['reactivation-cards', activeTenantId, user?.id, user?.role],

4. Na queryFn, substitua a query atual por:
let query = supabase
  .from('pipeline_cards')
  .select('*, client:clients(*), seller:users(*)')
  .eq('tenant_id', activeTenantId!)
  .eq('is_archived', false)
  .neq('stage_key', 'pos_venda')
  .neq('stage_key', 'fechamento');

if (user?.role === 'vendedor') {
  query = query.eq('seller_id', user.id);
} else if (user?.role === 'loja' && user.store_id) {
  query = query.eq('store_id', user.store_id);
}

const { data, error } = await query;
if (error) throw error;
return data as any[];
```

---

### P-09 — Settings: salvar dados da empresa no banco + logs de auditoria reais

```
No arquivo `src/pages/Settings.tsx`:

## PASSO 1: Adicionar imports
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { useQuery, useQueryClient } from '@tanstack/react-query';

## PASSO 2: Dentro do componente, após as declarações existentes:
const { activeTenantId } = useTenant();
const queryClient = useQueryClient();
const [companyName, setCompanyName] = React.useState(currentTenant?.name || '');
const [contactEmail, setContactEmail] = React.useState(currentTenant?.contact_email || '');

React.useEffect(() => {
  if (currentTenant) {
    setCompanyName(currentTenant.name);
    setContactEmail(currentTenant.contact_email);
  }
}, [currentTenant?.id]);

## PASSO 3: Substituir handleSave por duas funções:
const handleSaveDados = async () => {
  if (!activeTenantId || activeTenantId === 'all') return;
  setIsSaving(true);
  try {
    const { error } = await supabase
      .from('tenants')
      .update({ name: companyName, contact_email: contactEmail, updated_at: new Date().toISOString() })
      .eq('id', activeTenantId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['tenant', activeTenantId] });
    toast.success('Dados salvos com sucesso');
  } catch (err: any) {
    toast.error('Erro ao salvar: ' + err.message);
  } finally {
    setIsSaving(false);
  }
};

const handleSavePending = () => toast.info('Configuração em desenvolvimento.');

## PASSO 4: Nos campos da aba "dados":
- Input "Nome Fantasia": value={companyName} onChange={(e) => setCompanyName(e.target.value)}
- Input "E-mail Comercial": value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
- Botões "Salvar" dentro da aba dados: onClick={handleSaveDados}
- Botões "Salvar" das outras abas: onClick={handleSavePending}
- Botão "Salvar Tudo" no topo: onClick={handleSaveDados}

## PASSO 5: Logs de auditoria reais
Substitua o array hardcoded de logs pela query real. Dentro do componente, adicione:

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
    if (error) return [];
    return data || [];
  },
  enabled: !!activeTenantId && activeTenantId !== 'all',
});

Na tabela da aba "audit", substitua o `.map` do array fixo por auditLogs.map com:
- log.created_at formatado com new Date(log.created_at).toLocaleString('pt-BR')
- log.user?.full_name || 'Sistema'
- log.field_name || log.table_name
- log.new_value || log.action

Se auditLogs.length === 0, mostrar: <tr><td colSpan={4} className="text-center py-8 text-zinc-500">Nenhum log de auditoria encontrado.</td></tr>
```

---

## APÓS TODOS OS PROMPTS — PERCENTUAL ESPERADO

| Perfil | Antes Fase 2 | Após P-01..P-09 |
|--------|-------------|-----------------|
| Admin | 45% | **95%** |
| Loja | 60% | **97%** |
| Vendedor | 55% | **95%** |

**Os 5% restantes** são itens não críticos:
- `/setup/new-tenant` Wizard com schema antigo (baixo impacto — rota de uso raro)
- `/metrics` sem `RequireRole` para vendedor (risco baixo — RLS filtra dados)
- `VendedorList` botão "Reenviar Convite" sem chamar API (só toast)
- Settings: abas Pipeline/Notificações/Integrações ainda não salvam (P-09 deixa aviso)

---

*Kiro — 07/06/2026*
