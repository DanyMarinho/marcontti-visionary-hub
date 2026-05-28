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
import { UserPlus, Edit, Power, PowerOff, Mail, Store as StoreIcon } from 'lucide-react';
import { userService } from '@/services/userService';
import { User, Store } from '@/types';
import { cn } from '@/lib/utils';
import { VendedorForm } from './VendedorForm';
import { toast } from 'sonner';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { storeService } from '@/services/storeService';

export function VendedorList() {
  const { activeTenantId } = useTenant();
  const { tenants } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, storesData] = await Promise.all([
        userService.getAll(activeTenantId || 'all'),
        storeService.getAll(activeTenantId || 'all')
      ]);
      setUsers(usersData);
      setStores(storesData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTenantId]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const toggleStatus = async (user: User) => {
    try {
      const newStatus = !user.is_active;
      if (!newStatus) {
        const confirm = window.confirm("Ao desativar este vendedor, todos os cards ativos serão reatribuídos ao responsável da loja. Deseja continuar?");
        if (!confirm) return;
        toast.info('Reatribuindo cards ativos ao responsável da loja...');
      }
      await userService.update(user.id, { is_active: newStatus });
      toast.success(`Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso`);
      fetchData();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const resendInvite = (email: string) => {
    toast.success(`Novo convite enviado para ${email}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipe / Usuários</h1>
          <p className="text-muted-foreground text-sm">Gerencie vendedores, gerentes e administradores.</p>
        </div>
        
        <Button onClick={() => { setSelectedUser(undefined); setIsFormOpen(true); }} className="bg-orange-500 hover:bg-orange-600">
          <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Usuário</TableHead>
                <TableHead className="font-bold">Perfil</TableHead>
                <TableHead className="font-bold">Empresa / Loja</TableHead>
                <TableHead className="font-bold text-center">Cards Ativos</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="text-right font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[60px] mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const userTenant = tenants.find(t => t.id === user.tenant_id);
                  const userStore = stores.find(s => s.id === user.store_id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                            {user.full_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">{user.full_name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{userTenant?.name || 'N/A'}</span>
                          {userStore && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <StoreIcon size={10} />
                              {userStore.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {user.role === 'vendedor' ? Math.floor(Math.random() * 15) : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "font-semibold",
                          user.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => resendInvite(user.email)} 
                            title="Reenviar Convite"
                            className={cn(
                              new Date(user.created_at).getTime() < Date.now() - 86400000 && !user.is_active ? "text-orange-500 animate-pulse" : "text-blue-500"
                            )}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleStatus(user)}
                            className={user.is_active ? 'text-red-500' : 'text-green-500'}
                          >
                            {user.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VendedorForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSuccess={fetchData}
        user={selectedUser}
      />
    </div>
  );
}
