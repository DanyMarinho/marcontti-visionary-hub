// @ts-nocheck
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '../store/authStore';
import { useTenant } from '@/hooks/useTenant';

const statusMap: any = {
  active: { label: 'Ativo', color: 'bg-green-500' },
  lead_unidentified: { label: 'Lead Não Identificado', color: 'bg-blue-500' },
  deleted: { label: 'Deletado', color: 'bg-red-500' },
};

export default function CRM() {
  const { tenants } = useAuthStore();
  const { activeTenantId, activeTenant, isGlobal } = useTenant();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', activeTenantId, isGlobal],
    queryFn: async () => {
      let query = supabase.from('clients').select('*');
      if (!isGlobal && activeTenantId) {
        query = query.eq('tenant_id', activeTenantId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isGlobal || !!activeTenantId
  });

  const filteredCustomers = clients;

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
              Exibindo {filteredCustomers.length} contatos {!isGlobal ? `da empresa ${activeTenant?.name}` : 'de todas as empresas'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                {isGlobal && <TableHead>Empresa</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.full_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </TableCell>
                  {isGlobal && (
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {tenants.find(t => t.id === customer.tenant_id)?.name}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge className={statusMap[customer.status].color}>
                      {statusMap[customer.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                                        <Button
                      variant="ghost"
                      size="icon"
                      title="Enviar mensagem via Evolution"
                      onClick={async () => {
                        try {
                          await sendWhatsAppMessage(activeTenant.id, customer.phone, 'Olá! Como posso ajudar?');
                          // opcional: toast de sucesso
                        } catch (e) {
                          console.error(e);
                          // opcional: toast de erro
                        }
                      }}
                    >
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