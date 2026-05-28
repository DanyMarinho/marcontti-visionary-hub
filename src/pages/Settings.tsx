import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Shield, MessageSquare, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#0a0a0a]/5">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp/IA</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
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
                  <Input defaultValue="Infinda Digital" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 4004-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Email Comercial</Label>
                  <Input defaultValue="contato@infindadigital.com" />
                </div>
              </div>
              <Button className="bg-[#f97316] hover:bg-[#f97316]/90">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-[#f97316]" /> Permissões
...
                <MessageSquare size={20} className="text-[#f97316]" /> Configurações API
...
                <Bell size={20} className="text-[#f97316]" /> Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure como deseja receber alertas de novos leads e vendas.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
