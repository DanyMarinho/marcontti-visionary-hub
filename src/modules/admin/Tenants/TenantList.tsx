import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Building2, ExternalLink, MoreVertical, Loader2, Edit, Power, PowerOff } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import { Tenant, Niche } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';

import { cn } from '@/lib/utils';
import { TenantForm } from './TenantForm';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';

export function TenantList() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | undefined>();
  const navigate = useNavigate();
  const { setActiveTenant } = useTenant();
  const { setSelectedTenant: setStoreSelectedTenant } = useAuthStore();


  const nicheMap: Record<Niche, string> = {
    mecanica: 'Mecânica',
    clinica: 'Clínica',
    comercio_local: 'Comércio Local',
    educacao: 'Educação',
    imobiliaria: 'Imobiliária',
    restaurante: 'Restaurante',
    servicos: 'Serviços',
    outro: 'Outro'
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getAll();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedTenant(undefined);
    setIsFormOpen(true);
  };

  const toggleStatus = async (tenant: Tenant) => {
    try {
      const newStatus = tenant.status === 'ativo' ? 'inativo' : 'ativo';
      await tenantService.update(tenant.id, { status: newStatus as any });
      toast.success(`Empresa ${newStatus === 'ativo' ? 'ativada' : 'desativada'} com sucesso`);
      fetchTenants();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const handleViewDashboard = (tenant: Tenant) => {
    setActiveTenant(tenant.id);
    setStoreSelectedTenant(tenant.id);
    navigate('/');
    toast.success(`Visualizando dashboard de ${tenant.name}`);
  };

  return (

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground text-sm">Gerencie todas as empresas clientes da plataforma.</p>
        </div>
        
        <Button onClick={handleCreate} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Nova Empresa
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Empresa</TableHead>
                <TableHead className="font-bold">Nicho</TableHead>
                <TableHead className="font-bold text-center">Nº Lojas</TableHead>
                <TableHead className="font-bold text-center">Nº Vendedores</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="text-right font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[60px] mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: tenant.color }}
                        >
                          {tenant.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{tenant.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{tenant.contact_email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {nicheMap[tenant.niche as Niche] || tenant.niche}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {Math.floor(Math.random() * 3) + 1}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {Math.floor(Math.random() * 8) + 2}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "font-semibold",
                        tenant.status === 'ativo' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {tenant.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(tenant)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleStatus(tenant)} 
                          title={tenant.status === 'ativo' ? 'Desativar' : 'Ativar'}
                          className={tenant.status === 'ativo' ? 'text-red-500' : 'text-green-500'}
                        >
                          {tenant.status === 'ativo' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleViewDashboard(tenant)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" /> Ver Dashboard
                            </DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TenantForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSuccess={fetchTenants}
        tenant={selectedTenant}
      />
    </div>
  );
}
