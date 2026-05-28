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
import { Search, Plus, MessageSquare } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98888-7777', status: 'lead', shop: 'Centro', lastContact: '2024-05-20' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@email.com', phone: '(11) 97777-6666', status: 'closed', shop: 'Sul', lastContact: '2024-05-18' },
  { id: '3', name: 'Pedro Santos', email: 'pedro@email.com', phone: '(11) 96666-5555', status: 'proposal', shop: 'Centro', lastContact: '2024-05-15' },
  { id: '4', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 95555-4444', status: 'contact', shop: 'Norte', lastContact: '2024-05-10' },
];

const statusMap = {
  lead: { label: 'Lead', color: 'bg-blue-500' },
  contact: { label: 'Contato', color: 'bg-yellow-500' },
  proposal: { label: 'Proposta', color: 'bg-orange-500' },
  closed: { label: 'Fechado', color: 'bg-green-500' },
  'post-sale': { label: 'Pós-venda', color: 'bg-purple-500' },
};

export default function CRM() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." className="pl-8" />
        </div>
        <Button className="bg-[#f97316] hover:bg-[#f97316]/90">
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.email}</div>
                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                  </TableCell>
                  <TableCell>{customer.shop}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[customer.status as keyof typeof statusMap].color}>
                      {statusMap[customer.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.lastContact}</TableCell>
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
