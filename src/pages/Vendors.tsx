import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Target, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const vendors = [
  { id: '1', name: 'Carlos Oliveira', shop: 'Centro', sales: 12, amount: 'R$ 780.000', meta: '90%', rank: 1, avatar: 'CO' },
  { id: '2', name: 'Ana Costa', shop: 'Centro', sales: 10, amount: 'R$ 650.000', meta: '110%', rank: 2, avatar: 'AC' },
  { id: '3', name: 'Beatriz Santos', shop: 'Sul', sales: 9, amount: 'R$ 580.000', meta: '85%', rank: 3, avatar: 'BS' },
  { id: '4', name: 'João Silva', shop: 'Sul', sales: 7, amount: 'R$ 450.000', meta: '70%', rank: 4, avatar: 'JS' },
];

export default function Vendors() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Ranking de Vendedores
        </h3>
        <Button className="bg-[#1e3a5f]">Gerenciar Equipe</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className={vendor.rank <= 3 ? "border-[#f97316]/30 shadow-md" : ""}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-muted">
                  <AvatarFallback className="bg-[#1e3a5f] text-white">{vendor.avatar}</AvatarFallback>
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
                <div className="text-lg font-bold text-[#1e3a5f] dark:text-blue-400">
                  {vendor.amount}
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vendor.rank === 1 ? 'bg-[#f97316]' : 'bg-[#1e3a5f]'} transition-all`} 
                    style={{ width: vendor.meta }}
                  />
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 h-8 text-xs hover:bg-[#1e3a5f]/5" onClick={() => {}}>
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
                   <div className="h-full bg-[#1e3a5f] transition-all" style={{ width: v.meta }} />
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
