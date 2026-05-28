import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Store, 
  Shield, 
  MessageSquare, 
  Bell, 
  GitMerge, 
  Settings as SettingsIcon,
  Terminal,
  Save,
  Loader2,
  Globe,
  Upload,
  Clock,
  AlertTriangle,
  Mail,
  Search,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

export default function Settings() {
  const { selectedTenantId, tenants } = useAuthStore();
  const currentTenant = tenants.find(t => t.id === selectedTenantId);
  const isGlobal = selectedTenantId === 'all';
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Configurações salvas com sucesso');
    }, 1000);
  };

  if (isGlobal) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <SettingsIcon className="w-12 h-12 text-muted-foreground animate-in spin-in-1 duration-700" />
        <h2 className="text-xl font-bold text-center text-white">Selecione uma empresa específica</h2>
        <p className="text-muted-foreground text-center max-w-md">As configurações de WhatsApp, IA e Regras de Negócio são individuais para cada cliente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg"
            style={{ backgroundColor: currentTenant?.color }}
          >
            {currentTenant?.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{currentTenant?.name}</h1>
            <p className="text-sm text-zinc-400 font-medium">Configurações da Unidade • {currentTenant?.niche}</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 gap-2" disabled={isSaving}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Salvar Tudo
        </Button>
      </div>

      <Tabs defaultValue="dados" className="w-full">
        <TabsList className="bg-zinc-950 border border-zinc-800 p-1 h-14 w-full justify-start gap-2 overflow-x-auto">
          <TabsTrigger value="dados" className="gap-2 px-4 h-11"><Store size={16} /> Dados</TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2 px-4 h-11"><GitMerge size={16} /> Pipeline</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 px-4 h-11"><Bell size={16} /> Notificações</TabsTrigger>
          <TabsTrigger value="audit" className="gap-2 px-4 h-11"><Terminal size={16} /> Auditoria</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 px-4 h-11"><MessageSquare size={16} /> Integrações</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="dados">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Dados Cadastrais</CardTitle>
                <CardDescription>Informações principais da unidade para emissão de relatórios.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Nome Fantasia</Label>
                    <Input defaultValue={currentTenant?.name} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">CNPJ</Label>
                    <Input defaultValue="00.000.000/0001-00" className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">E-mail Comercial</Label>
                    <Input defaultValue={currentTenant?.contact_email} className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Responsável</Label>
                    <Input defaultValue={currentTenant?.owner_name} className="bg-zinc-900 border-zinc-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                   <GitMerge size={20} className="text-orange-500" /> Etapas do Método MEC
                </CardTitle>
                <CardDescription>Personalize o nome das etapas para melhor adaptação ao seu nicho.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Prospecção', 'Qualificação', 'Apresentação', 'Proposta', 'Negociação', 'Fechamento', 'Pós-venda'
                ].map((stage, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-zinc-800 last:border-0">
                    <span className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-500">{i+1}</span>
                    <Input defaultValue={stage} className="flex-1 bg-zinc-900 border-zinc-800" />
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
             <Card className="bg-[#0a0a0a] border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-white">Central de Alertas</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {[
                   { label: 'Novos leads recebidos', desc: 'Notificar quando um lead entrar pelo WhatsApp.' },
                   { label: 'Cards atrasados', desc: 'Alertar sobre cards sem movimentação há mais de 3 dias.' },
                   { label: 'Relatório diário', desc: 'Enviar resumo de performance às 08:00.' },
                   { label: 'Meta atingida', desc: 'Celebrar quando uma meta for 100% concluída.' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800">
                     <div className="space-y-0.5">
                       <h4 className="text-sm font-bold text-white">{item.label}</h4>
                       <p className="text-xs text-zinc-500">{item.desc}</p>
                     </div>
                     <Switch defaultChecked={i < 2} />
                   </div>
                 ))}
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="audit">
             <Card className="bg-[#0a0a0a] border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-white">Logs de Auditoria</CardTitle>
                 <CardDescription>Rastro de todas as alterações críticas no sistema.</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center gap-4 text-xs p-3 rounded bg-zinc-900/50 border-l-2 border-orange-500">
                        <span className="text-zinc-500 font-mono shrink-0">14:2{i}:05</span>
                        <span className="font-bold text-white shrink-0">Admin</span>
                        <span className="text-zinc-400">Alterou valor do card #842 para R$ 15.000</span>
                      </div>
                    ))}
                  </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Conexões Externas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">WhatsApp / Evolution API</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium">Instância: {currentTenant?.name.toLowerCase().replace(/\s/g, '_')}_01</p>
                      </div>
                   </div>
                   <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Conectado</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
