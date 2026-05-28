import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, MessageSquare, Filter } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { mockCustomers } from '../lib/mockData';

const statusMap = {
  lead: { label: 'Lead', color: 'bg-blue-500' },
  contact: { label: 'Contato', color: 'bg-yellow-500' },
  proposal: { label: 'Proposta', color: 'bg-orange-500' },
  closed: { label: 'Fechado', color: 'bg-green-500' },
  'post-sale': { label: 'Pós-venda', color: 'bg-purple-500' },
};

export default function CRM() {
  const { selectedTenantId, tenants } = useAuthStore();
  
  const filteredCustomers = selectedTenantId === 'all' 
    ? mockCustomers 
    : mockCustomers.filter(c => c.tenantId === selectedTenantId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
          <Button className="bg-[#f97316] hover:bg-[#f97316]/90">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Base de Clientes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Exibindo {filteredCustomers.length} contatos {selectedTenantId !== 'all' ? `da empresa ${tenants.find(t => t.id === selectedTenantId)?.name}` : 'de todas as empresas'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                {selectedTenantId === 'all' && <TableHead>Empresa</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </TableCell>
                  {selectedTenantId === 'all' && (
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {tenants.find(t => t.id === customer.tenantId)?.name}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge className={statusMap[customer.status as keyof typeof statusMap].color}>
                      {statusMap[customer.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="text-xs font-bold">{customer.score}</div>
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${customer.score}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Abrir WhatsApp">
                      <MessageSquare className="h-4 w-4 text-[#25D366]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
