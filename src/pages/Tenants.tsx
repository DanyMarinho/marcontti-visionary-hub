import React from 'react';
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
import { Plus, Building2, ExternalLink, MoreVertical } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Tenants() {
  const { tenants } = useAuthStore();

  const nicheMap: Record<string, string> = {
    mecanica: 'Mecânica',
    clinica: 'Clínica',
    comercio: 'Comércio Local',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Empresas</h1>
          <p className="text-muted-foreground text-sm">Controle de clientes multi-tenant da plataforma</p>
        </div>
        <Button className="bg-[#f97316] hover:bg-[#f97316]/90">
          <Plus className="mr-2 h-4 w-4" /> Nova Empresa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Empresas</CardDescription>
            <CardTitle className="text-2xl">{tenants.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Empresas Ativas</CardDescription>
            <CardTitle className="text-2xl">{tenants.filter(t => t.status === 'ativo').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Planos Premium</CardDescription>
            <CardTitle className="text-2xl">{tenants.filter(t => t.plan === 'premium').length}</CardTitle>
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
              {tenants.map((tenant) => (
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
                    <Badge variant="secondary">{nicheMap[tenant.niche]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{tenant.owner_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{planMap[tenant.plan]}</Badge>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
