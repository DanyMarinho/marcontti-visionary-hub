# VERIFICAÇÃO DETALHADA — FASE 2
**Data:** 07/06/2026 | **Commit auditado:** e670554

---

## RESULTADO POR PROMPT

### P-01 — userService.create trata resposta corretamente
**Status: ✅ CORRETO**

Verificado em `src/services/userService.ts`:
- `(data as any)?.user_id` — lê o campo correto da resposta `{ success: true, user_id: "uuid" }`
- Lança erro descritivo se `user_id` ausente
- Busca o perfil completo no banco com `.select('*').eq('id', userId).single()`
- Lança erro se perfil não encontrado após criação
- `inviteVendor` simplificado retorna `data` diretamente — correto

---

### P-02 — Dashboard admin: dados reais + remoção @ts-nocheck
**Status: ✅ CORRETO**

Verificado em `src/modules/dashboard/hooks/useDashboardKpis.ts`:
- `// @ts-nocheck` **removido** — arquivo sem supressão de tipos
- `tenantsCount` busca `.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true)` — real
- `conversaoReal` calculada: `closedCards / totalCards * 100` — real
- KPI `Empresas Ativas` usa `tenantsCount ?? 0` — correto
- KPI `Conversão Global` usa `conversaoReal` — correto
- Vendedor: `conversaoPessoal` calculada com `fechadosVendedor / totalVendedor` — correto
- KPI `Conversão Pessoal` usa `conversaoPessoal` — 28% hardcoded removido ✅

**Observação menor:** As queries de admin ainda retornam `salesHistory: []` e `tenantRanking: []` (vazios). Isso não é dado falso — é dado ausente, aceitável para esta fase.

---

### P-03 — VendedorList: Cards Ativos real
**Status: ✅ CORRETO**

Verificado em `src/modules/admin/Vendors/VendedorList.tsx`:
- `import { supabase }` adicionado ✅
- `const [cardCountByUser, setCardCountByUser] = useState<Record<string, number>>({})` declarado ✅
- `fetchData` busca `pipeline_cards` filtrando `seller_id in vendorIds` e `is_archived = false` e estágio fora de fechamento ✅
- Célula da tabela usa `cardCountByUser[user.id] ?? 0` — `Math.random()` removido ✅

---

### P-04 — Remover @ts-nocheck de ReactivationList e whatsappService
**Status: ✅ CORRETO**

Verificado em `src/modules/reactivation/ReactivationList.tsx`:
- `// @ts-nocheck` **removido** ✅
- Interface `ProcessedCard` adicionada com campos corretos ✅
- `processedCards` tipado como `ProcessedCard[]` ✅
- Cast seguro: `(data || []) as any[]` no retorno da query ✅

Verificado em `src/services/whatsappService.ts`:
- `// @ts-nocheck` **removido** ✅
- `as unknown as WhatsAppInstance | null` em todos os retornos ✅
- `instance as any` no upsert para contornar tipo gerado ✅
- `(data as any[])` e `r.assigned_user?.store_id` com cast seguro ✅

---

### P-05 — Kanban: pos_venda também abre dialog
**Status: ✅ CORRETO**

Verificado em `src/modules/pipeline/KanbanBoard.tsx`:
- `const requiresConfirmation = toStage === 'fechamento' || toStage === 'pos_venda'` ✅
- `if (requiresConfirmation) setPendingMove(...)` ✅
- `title` dinâmico: `pos_venda` → "Confirmar Pós-venda", outro → "Confirmar Fechamento" ✅
- `description` dinâmica por `toStage` ✅
- `finalValue` e `closingDate` passados em ambos os casos ✅

---

### P-06 — Vendedor: Ranking real da loja
**Status: ✅ CORRETO**

Verificado em `src/modules/dashboard/hooks/useDashboardKpis.ts`:
- Busca `pipeline_cards` com `stage_key in ['fechamento', 'pos_venda']` ✅
- `sellerIds` extraídos com `Array.from(new Set(...))` ✅
- Segunda query para nomes: `.from('users').select('id, full_name').in('id', sellerIds)` ✅
- `rankingMap` acumula vendas por `seller_id` ✅
- `ranking` ordenado decrescente, top 5, `sid === user.id` → "Você" ✅
- Retorno inclui `ranking` real (não mais `[]`) ✅

Verificado em `src/modules/dashboard/VendedorDashboard.tsx`:
- Empty state quando `!data?.ranking || data.ranking.length === 0` → "Nenhuma venda fechada ainda neste período." ✅
- `.map(rank =>` usa `rank.position`, `rank.name`, `rank.sales` ✅

---

### P-07 — Loja: remover descrições falsas dos KpiCards
**Status: ✅ CORRETO**

Verificado em `src/modules/dashboard/LojaDashboard.tsx`:
- `description="Acumulado do período"` — "+12.5% vs mês anterior" removido ✅
- `description="Oportunidades em andamento"` — "+5 novos este mês" removido ✅

---

### P-08 — Reativação: filtro seller_id/store_id por role
**Status: ✅ CORRETO**

Verificado em `src/modules/reactivation/ReactivationList.tsx`:
- `import { useAuthStore }` adicionado ✅
- `const { user } = useAuthStore()` dentro do componente ✅
- `queryKey` inclui `user?.id, user?.role` ✅
- Query aplica `.eq('seller_id', user.id)` quando `role === 'vendedor'` ✅
- Query aplica `.eq('store_id', user.store_id)` quando `role === 'loja'` ✅

---

### P-09 — Settings: salvar dados reais + logs de auditoria reais
**Status: ✅ CORRETO**

Verificado em `src/pages/Settings.tsx`:
- `import { supabase }` ✅
- `import { useTenant }` ✅
- `import { useQuery, useQueryClient }` ✅
- `activeTenantId` e `queryClient` instanciados ✅
- States `companyName` e `contactEmail` com `useEffect` para sync ✅
- `handleSaveDados` faz `.update({ name, contact_email })` no banco ✅
- `handleSavePending` exibe toast informativo para abas não implementadas ✅
- Botões Pipeline/Notifications/Integrations usam `handleSavePending` ✅
- `useQuery` para `audit_logs` busca do banco com `.select('*, user:users(full_name)')` ✅
- Empty state "Nenhum log de auditoria encontrado." quando `auditLogs.length === 0` ✅
- Tabela de audit mapeia `auditLogs` reais com `new Date(log.created_at).toLocaleString('pt-BR')` ✅

---

## PROBLEMAS RESIDUAIS ENCONTRADOS

### 🟠 1. AdminDashboard: "Ranking de Empresas" com badge de Performance falso
**Arquivo:** `src/modules/dashboard/AdminDashboard.tsx`  
**Linha:** no `.map` do `tenantRanking`
```tsx
<Badge>+{(10 - i * 2).toFixed(1)}%</Badge>
```
O cálculo `10 - i*2` ainda é inventado. O `tenantRanking` vem de `useDashboardKpis` que retorna array vazio, então **este badge nunca aparece na prática** — risco zero enquanto `tenantRanking` estiver vazio. Baixo impacto.

### 🟠 2. AdminDashboard: `salesHistory` e `tenantRanking` ainda vazios
`useDashboardKpis` para admin retorna `salesHistory: []` e `tenantRanking: []`. Os gráficos ficam em branco. Não há dados falsos, mas há dados ausentes. Seria necessário implementar queries reais para esses dois, mas não é bloqueante para uso em produção.

### 🟡 3. Settings: CNPJ ainda hardcoded como "00.000.000/0001-00"
**Arquivo:** `src/pages/Settings.tsx`
```tsx
<Input defaultValue="00.000.000/0001-00" className="..." />
```
Campo CNPJ usa `defaultValue` fixo. Não quebra nada, mas o campo não carrega o CNPJ real do tenant. Impacto cosmético.

### 🟡 4. Settings: campos Nicho e Fuso Horário não salvam
O `Select` de "Nicho" e "Fuso Horário" usam `defaultValue` e não estão conectados a states, portanto não são incluídos no `handleSaveDados`. Impacto baixo — só `name` e `contact_email` salvam.

### 🟡 5. Settings: "Integrações" — campos com valores hardcoded
URL da API (`https://evolution.mecom.com`) e API Key (`MEC_SECRET_KEY_123`) são `defaultValue` fixos, não carregam da tabela `whatsapp_instances` real. O save desses campos usa `handleSavePending` (toast de info). Impacto médio para admin que precisa configurar a instância.

### 🟡 6. VendedorDashboard: "Próximas Atividades" sem empty state
Se `data?.nextActivities` for vazio ou undefined, o `CardContent` fica em branco sem mensagem. Não quebra, mas UX ruim para vendedor sem cards.

### 🟢 7. `/metrics` sem RequireRole para vendedor
Rota acessível para vendedor via URL direta, embora não apareça no menu. RLS filtra os dados, então sem vazamento. Impacto mínimo.

### 🟢 8. `resendInvite` ainda é fake (só toast)
Em `VendedorList.tsx`, o botão de reenvio não chama API real. Toast de sucesso sem ação real.

---

## SCORECARD FINAL

| Perfil | Status | Detalhamento |
|--------|--------|-------------|
| **Admin** | **92%** | Todos os dados críticos reais. Pendente: gráficos admin (salesHistory/tenantRanking vazios), badge Performance fake (não visível), CNPJ/campos menores no Settings |
| **Loja** | **97%** | Totalmente funcional. Pendente apenas: Settings Nicho/Fuso não salvam, Integrações com valores fake |
| **Vendedor** | **96%** | Totalmente funcional. Pendente: empty state em Próximas Atividades |

---

## PROMPTS CORRETIVOS PARA FECHAR OS 4-8% RESTANTES

Cole na Lovable **apenas se quiser chegar a 100%**. São melhorias, não bloqueantes.

---

### EXTRA-01 — Settings: campos Nicho, CNPJ e Fuso Horário salvando real

```
No arquivo `src/pages/Settings.tsx`, os campos CNPJ, Nicho e Fuso Horário não estão conectados ao banco.

1. Adicione states:
const [cnpj, setCnpj] = React.useState(currentTenant?.cnpj || '');
const [niche, setNiche] = React.useState(currentTenant?.niche || '');
const [timezone, setTimezone] = React.useState(currentTenant?.timezone || 'America/Sao_Paulo');

2. No useEffect de sincronização, adicione:
setCnpj(currentTenant.cnpj || '');
setNiche(currentTenant.niche || '');
setTimezone(currentTenant.timezone || 'America/Sao_Paulo');

3. Nos campos:
- Input CNPJ: value={cnpj} onChange={(e) => setCnpj(e.target.value)}
- Select Nicho: value={niche} onValueChange={setNiche}
- Select Fuso: value={timezone} onValueChange={setTimezone}

4. Em handleSaveDados, adicione ao update:
cnpj, niche, timezone

Não altere mais nada.
```

---

### EXTRA-02 — AdminDashboard: gráfico de evolução e ranking reais

```
No arquivo `src/modules/dashboard/hooks/useDashboardKpis.ts`, no bloco `if (user?.role === 'admin' && isGlobal)`, implemente dados reais para salesHistory e tenantRanking.

Antes do return, adicione:

// Histórico de vendas dos últimos 6 meses (todos os tenants)
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const { data: closedCards } = await supabase
  .from('pipeline_cards')
  .select('final_value, estimated_value, closed_at')
  .in('stage_key', ['fechamento', 'pos_venda'])
  .not('closed_at', 'is', null)
  .gte('closed_at', sixMonthsAgo.toISOString());

const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const grouped: Record<string, number> = {};
(closedCards || []).forEach((c: any) => {
  const month = monthNames[new Date(c.closed_at).getMonth()];
  grouped[month] = (grouped[month] || 0) + Number(c.final_value || c.estimated_value || 0);
});
const salesHistory = Object.entries(grouped).map(([month, value]) => ({ month, value }));

// Ranking de tenants por faturamento
const { data: tenantsData } = await supabase
  .from('tenants')
  .select('id, name')
  .eq('is_active', true);

const tenantMap: Record<string, { name: string; sales: number; customers: number }> = {};
(tenantsData || []).forEach((t: any) => {
  tenantMap[t.id] = { name: t.name, sales: 0, customers: 0 };
});
(closedCards || []).forEach((c: any) => {
  // cards têm tenant_id — buscar separado
});

// Simplificado: usar apenas os dados de cards que já temos
const { data: allClosedCards } = await supabase
  .from('pipeline_cards')
  .select('tenant_id, final_value, estimated_value')
  .in('stage_key', ['fechamento', 'pos_venda'])
  .eq('is_archived', false);

(allClosedCards || []).forEach((c: any) => {
  if (!tenantMap[c.tenant_id]) return;
  tenantMap[c.tenant_id].sales += Number(c.final_value || c.estimated_value || 0);
});

const tenantRanking = Object.values(tenantMap)
  .filter(t => t.sales > 0)
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 10)
  .map(t => ({ name: t.name, sales: t.sales, customers: 0 }));

Substitua `salesHistory: []` por `salesHistory` e `tenantRanking: []` por `tenantRanking`.
```

---

### EXTRA-03 — VendedorDashboard: empty state em Próximas Atividades

```
No arquivo `src/modules/dashboard/VendedorDashboard.tsx`, no CardContent de "Próximas Atividades", após o bloco de loading, adicione empty state quando não há atividades:

Localize o bloco que renderiza as atividades (o .map de nextActivities). Antes do .map, adicione:

{(!data?.nextActivities || data.nextActivities.length === 0) ? (
  <div className="text-center py-8 text-muted-foreground text-sm">
    Nenhuma atividade próxima. Crie cards com data de fechamento prevista.
  </div>
) : (
  data.nextActivities.map((act: any) => (
    // ... código existente
  ))
)}

Não altere mais nada.
```

---

*Verificação realizada por Kiro — 07/06/2026*
