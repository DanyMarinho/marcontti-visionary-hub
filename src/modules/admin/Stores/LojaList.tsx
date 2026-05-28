import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Plus, Store as StoreIcon, Edit, Power, PowerOff, MoreVertical } from 'lucide-react';
import { storeService } from '@/services/storeService';
import { Store } from '@/types';
import { cn } from '@/lib/utils';
import { LojaForm } from './LojaForm';
import { toast } from 'sonner';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export function LojaList() {
  const { activeTenantId } = useTenant();
  const { tenants } = useAuthStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | undefined>();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await storeService.getAll(activeTenantId || 'all');
      setStores(data);
    } catch (error) {
      toast.error('Erro ao carregar lojas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [activeTenantId]);

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const toggleStatus = async (store: Store) => {
    try {
      const newStatus = !store.is_active;
      await storeService.update(store.id, { is_active: newStatus });
      toast.success(`Loja ${newStatus ? 'ativada' : 'desativada'} com sucesso`);
      fetchStores();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lojas / Unidades</h1>
          <p className="text-muted-foreground text-sm">Gerencie as unidades físicas de cada empresa.</p>
        </div>
        
        <Button onClick={() => { setSelectedStore(undefined); setIsFormOpen(true); }} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Nova Loja
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Loja</TableHead>
                <TableHead className="font-bold">Empresa</TableHead>
                <TableHead className="font-bold">Gerente</TableHead>
                <TableHead className="font-bold">Telefone</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="text-right font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[60px] mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma loja encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StoreIcon size={16} className="text-orange-500" />
                        <span className="font-semibold">{store.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {tenants.find(t => t.id === store.tenant_id)?.name || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{store.manager || '-'}</TableCell>
                    <TableCell>{store.phone || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "font-semibold",
                        store.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {store.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(store)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(store)}
                          className={store.is_active ? 'text-red-500' : 'text-green-500'}
                        >
                          {store.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <LojaForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSuccess={fetchStores}
        store={selectedStore}
      />
    </div>
  );
}
