import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Building2, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { mockCustomers, mockSales } from '../lib/mockData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const COLORS = ['#0a0a0a', '#f97316', '#71717a', '#a1a1aa'];

export default function Dashboard() {
  const { user, selectedTenantId, tenants } = useAuthStore();

  const isGlobal = selectedTenantId === 'all';
  const currentTenant = tenants.find(t => t.id === selectedTenantId);

  // Filter data based on selection
  const filteredCustomers = isGlobal 
    ? mockCustomers 
    : mockCustomers.filter(c => c.tenantId === selectedTenantId);
  
  const filteredSales = isGlobal 
    ? mockSales 
    : mockSales.filter(s => s.tenantId === selectedTenantId);

  // Statistics
  const totalSalesAmount = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalCustomers = filteredCustomers.length;
  const averageTicket = filteredSales.length > 0 ? totalSalesAmount / filteredSales.length : 0;
  
  // Data for charts
  const salesByMonth = [
    { name: 'Jan', sales: isGlobal ? 45000 : 5000 },
    { name: 'Fev', sales: isGlobal ? 52000 : 4500 },
    { name: 'Mar', sales: isGlobal ? 48000 : 6000 },
    { name: 'Abr', sales: isGlobal ? 61000 : 5500 },
    { name: 'Mai', sales: isGlobal ? 75000 : 8000 },
  ];

  const tenantComparison = tenants.map(t => ({
    name: t.name,
    sales: mockSales.filter(s => s.tenantId === t.id).reduce((acc, s) => acc + s.amount, 0),
    customers: mockCustomers.filter(c => c.tenantId === t.id).length
  })).sort((a, b) => b.sales - a.sales);

  const nicheData = [
    { name: 'Mecânica', value: tenants.filter(t => t.niche === 'mecanica').length },
    { name: 'Comércio', value: tenants.filter(t => t.niche === 'comercio').length },
    { name: 'Clínica', value: tenants.filter(t => t.niche === 'clinica').length },
    { name: 'Educação', value: tenants.filter(t => t.niche === 'educacao').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <LayoutDashboard className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isGlobal ? 'Visão Consolidada de Todas as Empresas' : `Dashboard: ${currentTenant?.name} (${currentTenant?.niche})`}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas {isGlobal ? 'Consolidadas' : ''}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSalesAmount.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Novos leads esta semana: +18</p>
          </CardContent>
        </Card>

        {isGlobal ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.filter(t => t.status === 'ativo').length} / {tenants.length}</div>
              <p className="text-xs text-muted-foreground">3 planos Premium, 4 Pro</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {averageTicket.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-muted-foreground">Baseado em {filteredSales.length} vendas</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta {isGlobal ? 'Geral' : ''}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isGlobal ? '78%' : '92%'}</div>
            <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[78%] transition-all" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
            <CardDescription>Comparativo de faturamento bruto</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke={isGlobal ? "#0a0a0a" : currentTenant?.color || "#f97316"} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{isGlobal ? 'Empresas por Nicho' : 'Distribuição de Clientes'}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={isGlobal ? nicheData : [
                    { name: 'Lead', value: filteredCustomers.filter(c => c.status === 'lead').length },
                    { name: 'Proposta', value: filteredCustomers.filter(c => c.status === 'proposal').length },
                    { name: 'Fechado', value: filteredCustomers.filter(c => c.status === 'closed').length },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {nicheData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {isGlobal && (
        <Card>
          <CardHeader>
            <CardTitle>Performance por Empresa</CardTitle>
            <CardDescription>Ranking de faturamento e base de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Conversão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantComparison.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>R$ {item.sales.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{item.customers}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-none">
                        {(item.sales / 5000 * 10).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTenant(tenants.find(t => t.name === item.name)?.id || 'all')}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
