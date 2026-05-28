import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Target, Calendar, Info } from 'lucide-react';

const projectionData = [
  { month: 'Mai', atual: 45000, projetado: 45000 },
  { month: 'Jun', atual: 48000, projetado: 50000 },
  { month: 'Jul', projetado: 55000 },
  { month: 'Ago', projetado: 62000 },
  { month: 'Set', projetado: 70000 },
  { month: 'Out', projetado: 75000 },
];

export default function Projection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#0a0a0a] text-white border-none">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/80">Receita Atual vs Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 48.000 / R$ 60.000</div>
            <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#f97316] w-[80%]" />
            </div>
            <p className="text-xs mt-2 text-white/60">Faltam R$ 12.000 para a meta do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projeção 3 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#f97316]">R$ 187.000</div>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
              <TrendingUp size={14} /> +15% de crescimento esperado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ticket Médio Projetado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 68.500</div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <Info size={14} /> Baseado na tendência de estoque SUV
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projeção Financeira (6 Meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorProjetado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="projetado" stroke="#f97316" fillOpacity={1} fill="url(#colorProjetado)" strokeWidth={3} />
              <Line type="monotone" dataKey="atual" stroke="#f97316" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
