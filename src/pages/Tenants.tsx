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
import { Plus, Building2, ExternalLink, MoreVertical, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { tenantService } from '../services/tenantService';
import { Tenant, Niche } from '../types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function Tenants() {
  const { setTenants: setStoreTenants } = useAuthStore() as any; // Using any for store update if needed, but we'll manage local state too
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
    name: '',
    niche: 'outro',
    contact_email: '',
    plan: 'basico',
    status: 'ativo',
    color: '#f97316'
  });

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

  const planMap: Record<string, string> = {
    basico: 'Básico',
    pro: 'Pro',
    premium: 'Premium'
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

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.contact_email) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      setIsSubmitting(true);
      await tenantService.create(newTenant as any);
      toast.success('Empresa criada com sucesso');
      setIsDialogOpen(false);
      setNewTenant({
        name: '',
        niche: 'outro',
        contact_email: '',
        plan: 'basico',
        status: 'ativo',
        color: '#f97316'
      });
      fetchTenants();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Erro ao criar empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Empresas</h1>
          <p className="text-muted-foreground text-sm">Controle de clientes multi-tenant da plataforma</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90">
              <Plus className="mr-2 h-4 w-4" /> Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateTenant}>
              <DialogHeader>
                <DialogTitle>Nova Empresa</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova empresa na plataforma MEC Hub.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input 
                    id="name" 
                    value={newTenant.name} 
                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                    placeholder="Ex: Marcontti Mecânica" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newTenant.contact_email} 
                    onChange={(e) => setNewTenant({...newTenant, contact_email: e.target.value})}
                    placeholder="contato@empresa.com" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="niche">Nicho</Label>
                    <Select 
                      value={newTenant.niche} 
                      onValueChange={(value: Niche) => setNewTenant({...newTenant, niche: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(nicheMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plan">Plano</Label>
                    <Select 
                      value={newTenant.plan} 
                      onValueChange={(value: any) => setNewTenant({...newTenant, plan: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Cor da Marca</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="color" 
                      type="color" 
                      value={newTenant.color} 
                      onChange={(e) => setNewTenant({...newTenant, color: e.target.value})}
                      className="w-12 h-10 p-1" 
                    />
                    <Input 
                      value={newTenant.color} 
                      onChange={(e) => setNewTenant({...newTenant, color: e.target.value})}
                      className="flex-1" 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="bg-[#f97316] hover:bg-[#f97316]/90">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cadastrar Empresa
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Empresas</CardDescription>
            <CardTitle className="text-2xl">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : tenants.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Empresas Ativas</CardDescription>
            <CardTitle className="text-2xl">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : tenants.filter(t => t.status === 'ativo').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Planos Premium</CardDescription>
            <CardTitle className="text-2xl">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : tenants.filter(t => t.plan === 'premium').length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Nicho</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Carregando empresas...
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma empresa cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: tenant.color }}
                        >
                          {tenant.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{tenant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{nicheMap[tenant.niche as Niche] || tenant.niche}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{tenant.owner_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{planMap[tenant.plan] || tenant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", tenant.status === 'ativo' ? "bg-green-500" : "bg-red-500")} />
                        <span className="text-sm capitalize">{tenant.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
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
    </div>
  );
}
