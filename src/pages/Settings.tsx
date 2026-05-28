import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Shield, MessageSquare, Bell, Palette, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { selectedTenantId, tenants } = useAuthStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId);
  const isGlobal = selectedTenantId === 'all';

  if (isGlobal) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <SettingsIcon className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-center">Selecione uma empresa específica para gerenciar suas configurações</h2>
        <p className="text-muted-foreground text-center max-w-md">As configurações de WhatsApp, IA e Dados da Empresa são individuais para cada cliente da plataforma.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: currentTenant?.color }}
        >
          {currentTenant?.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">{currentTenant?.name}</h1>
          <p className="text-sm text-muted-foreground">Configurações da Unidade • Nicho: {currentTenant?.niche}</p>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#0a0a0a]/5">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp/IA</TabsTrigger>
          <TabsTrigger value="branding">Personalização</TabsTrigger>
          <TabsTrigger value="notifications">Alertas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store size={20} className="text-[#f97316]" /> Dados da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <Input defaultValue={currentTenant?.name} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input defaultValue={currentTenant?.ownerName} />
                </div>
                <div className="space-y-2">
                  <Label>Email Comercial</Label>
                  <Input defaultValue={`contato@${currentTenant?.name.toLowerCase().replace(/\s/g, '')}.com.br`} />
                </div>
              </div>
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} className="text-[#f97316]" /> Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cor Principal</Label>
                <div className="flex gap-4 items-center">
                  <Input type="color" defaultValue={currentTenant?.color} className="w-20 h-10 p-1" />
                  <span className="text-sm font-mono">{currentTenant?.color}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo (URL)</Label>
                <Input placeholder="https://..." />
              </div>
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90">Salvar Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-[#f97316]" /> Permissões
              </CardTitle>
              <CardDescription>Gerencie quem tem acesso a esta empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Módulo de gestão de usuários para {currentTenant?.name}.</p>
              <Button variant="outline">Adicionar Usuário à Empresa</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} className="text-[#f97316]" /> Evolution API
              </CardTitle>
              <CardDescription>Configuração de instância exclusiva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Instância</Label>
                <Input defaultValue={`${currentTenant?.name.toLowerCase().replace(/\s/g, '_')}_01`} />
              </div>
              <div className="space-y-2">
                <Label>API Key da Instância</Label>
                <Input type="password" placeholder="Chave da instância" />
              </div>
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90">Testar Conexão</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-[#f97316]" /> Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure notificações para {currentTenant?.name}.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
