import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Target, UserCircle, Clock, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const vendors = [
  { id: '1', name: 'Carlos Oliveira', shop: 'Centro', sales: 12, amount: 'R$ 780.000', meta: '90%', rank: 1, avatar: 'CO', avgResponse: 12, reactivations: 45, reactivationRate: '92%' },
  { id: '2', name: 'Ana Costa', shop: 'Centro', sales: 10, amount: 'R$ 650.000', meta: '110%', rank: 2, avatar: 'AC', avgResponse: 25, reactivations: 38, reactivationRate: '88%' },
  { id: '3', name: 'Beatriz Santos', shop: 'Sul', sales: 9, amount: 'R$ 580.000', meta: '85%', rank: 3, avatar: 'BS', avgResponse: 65, reactivations: 22, reactivationRate: '75%' },
  { id: '4', name: 'João Silva', shop: 'Sul', sales: 7, amount: 'R$ 450.000', meta: '70%', rank: 4, avatar: 'JS', avgResponse: 42, reactivations: 15, reactivationRate: '60%' },
];

export default function Vendors() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Ranking de Vendedores
        </h3>
        <Button className="bg-[#0a0a0a] hover:bg-[#0a0a0a]/90">Gerenciar Equipe</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className={vendor.rank <= 3 ? "border-[#f97316]/30 shadow-md" : ""}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-muted">
                  <AvatarFallback className="bg-[#0a0a0a] text-white">{vendor.avatar}</AvatarFallback>
                </Avatar>
                {vendor.rank === 1 && <Medal className="absolute -top-2 -right-2 text-yellow-500 fill-yellow-500 h-6 w-6" />}
                {vendor.rank === 2 && <Medal className="absolute -top-2 -right-2 text-slate-400 fill-slate-400 h-6 w-6" />}
                {vendor.rank === 3 && <Medal className="absolute -top-2 -right-2 text-amber-700 fill-amber-700 h-6 w-6" />}
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm font-bold">{vendor.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{vendor.shop}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Vendas: <strong>{vendor.sales}</strong></span>
                  <span>Meta: <strong>{vendor.meta}</strong></span>
                </div>
                <div className="text-lg font-bold text-[#0a0a0a] dark:text-orange-400">
                  {vendor.amount}
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vendor.rank === 1 ? 'bg-[#f97316]' : 'bg-[#0a0a0a]'} transition-all`} 
                    style={{ width: vendor.meta }}
                  />
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 h-8 text-xs hover:bg-[#0a0a0a]/5" onClick={() => {}}>
                Ver Perfil Detalhado
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-[#f97316]" /> Metas do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {vendors.map(v => (
              <div key={v.id} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{v.name}</div>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-[#0a0a0a] transition-all" style={{ width: v.meta }} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-blue-500" /> Relatório de Atendimento
          </CardTitle>
          <CardDescription>Métricas de tempo de resposta e reativação por vendedor</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Tempo Médio de Resposta</TableHead>
                <TableHead>Reativações (Mês)</TableHead>
                <TableHead>Taxa de Reativação</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-bold text-white">{v.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className={cn(v.avgResponse > 60 ? "text-red-500" : "text-green-500")} />
                      <span className={cn("font-medium", v.avgResponse > 60 && "text-red-500 font-bold")}>
                        {v.avgResponse} min
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{v.reactivations}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", parseInt(v.reactivationRate) < 70 ? "bg-red-500" : "bg-green-500")} 
                          style={{ width: v.reactivationRate }} 
                        />
                      </div>
                      <span className="text-[10px] text-[#888888]">{v.reactivationRate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {v.avgResponse > 60 ? (
                      <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] uppercase font-black">
                        Crítico
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500/30 text-green-500 text-[8px] uppercase font-black">
                        Excelente
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={18} className="text-orange-500" /> Conversão de Reativação
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-[#1f1f1f] border-dashed mt-2">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-white">78%</div>
              <p className="text-xs text-[#888888] uppercase tracking-widest font-bold">Média da Unidade</p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-500">124</div>
                  <div className="text-[8px] uppercase text-[#555555]">Reativados</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-red-500">32</div>
                  <div className="text-[8px] uppercase text-[#555555]">Perdidos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" /> Alertas de Ociosidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Cards Ociosos (+7 dias)</p>
                <p className="text-[10px] text-[#888888]">8 cards precisam de reatribuição ou contato</p>
              </div>
              <Button size="sm" variant="ghost" className="text-red-500 text-[10px] uppercase font-bold">Ver Todos</Button>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Atenção (+3 dias)</p>
                <p className="text-[10px] text-[#888888]">15 cards monitorados</p>
              </div>
              <Button size="sm" variant="ghost" className="text-yellow-500 text-[10px] uppercase font-bold">Monitorar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
                <div className="w-16 text-right text-sm font-bold">{v.meta}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
