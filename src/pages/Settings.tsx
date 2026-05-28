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
          <TabsTrigger value="dados" className="gap-2 px-4 h-11"><Store size={16} /> Dados da Empresa</TabsTrigger>
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
                    <Label className="text-zinc-400">Nicho</Label>
                    <Select defaultValue={currentTenant?.niche}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mecânica">Mecânica</SelectItem>
                        <SelectItem value="Estética Automotiva">Estética Automotiva</SelectItem>
                        <SelectItem value="Motopeças">Motopeças</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label className="text-zinc-400">Fuso Horário</Label>
                    <Select defaultValue="America/Sao_Paulo">
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Logotipo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Upload size={18} className="text-zinc-500" />
                      </div>
                      <Button variant="outline" size="sm" className="h-9 border-zinc-800">Alterar Logo</Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-zinc-800">
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 gap-2" disabled={isSaving}>
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                       <GitMerge size={20} className="text-orange-500" /> Etapas do Método MEC
                    </CardTitle>
                    <CardDescription>Personalize o nome das etapas. A ordem é fixa para manter a engenharia do processo.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1 h-6">
                    <AlertTriangle size={12} /> Ordem Obrigatória
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Prospecção', key: 'prospeccao' },
                  { label: 'Qualificação', key: 'qualificacao' },
                  { label: 'Apresentação', key: 'apresentacao' },
                  { label: 'Proposta', key: 'proposta' },
                  { label: 'Negociação', key: 'negociacao' },
                  { label: 'Fechamento', key: 'fechamento' },
                  { label: 'Pós-venda', key: 'pos_venda' }
                ].map((stage, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-0">
                    <span className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-xs font-black text-white border border-zinc-800">{i+1}</span>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-bold text-zinc-500">Label de Exibição</Label>
                        <Input defaultValue={stage.label} className="bg-zinc-900 border-zinc-800 text-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase font-bold text-zinc-500">Chave do Sistema (Read-only)</Label>
                        <Input value={stage.key} readOnly className="bg-[#050505] border-zinc-900 text-zinc-600 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 gap-2" disabled={isSaving}>
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
             <Card className="bg-[#0a0a0a] border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-white flex items-center gap-2">
                   <Bell size={20} className="text-orange-500" /> Central de Alertas
                 </CardTitle>
                 <CardDescription>Defina quais eventos disparam e-mails de notificação.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {[
                   { id: 'idle', label: 'Cards sem movimentação (+3 dias)', desc: 'Alerta preventivo para evitar perda de rastro comercial.' },
                   { id: 'goal', label: 'Meta 100% atingida', desc: 'Notificar quando o realizado igualar a meta do período.' },
                   { id: 'whatsapp', label: 'WhatsApp Desconectado', desc: 'Alerta crítico de interrupção na comunicação.' }
                 ].map((item, i) => (
                   <div key={i} className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 space-y-4">
                     <div className="flex items-start justify-between">
                       <div className="space-y-0.5">
                         <h4 className="text-sm font-bold text-white">{item.label}</h4>
                         <p className="text-xs text-zinc-500">{item.desc}</p>
                       </div>
                       <Switch defaultChecked={i > 0} />
                     </div>
                     <div className="flex items-center gap-3 bg-[#0a0a0a] p-2 rounded border border-zinc-800">
                       <Mail size={14} className="text-zinc-600 ml-2" />
                       <Input placeholder="E-mail de destino..." className="border-none bg-transparent h-8 text-xs focus-visible:ring-0" />
                     </div>
                   </div>
                 ))}
                 <div className="flex justify-end pt-4">
                   <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 min-w-[120px]">Salvar Notificações</Button>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="audit">
             <Card className="bg-[#0a0a0a] border-zinc-800">
               <CardHeader className="flex flex-row items-center justify-between">
                 <div className="space-y-1">
                   <CardTitle className="text-white flex items-center gap-2">
                     <Terminal size={20} className="text-orange-500" /> Logs de Auditoria
                   </CardTitle>
                   <CardDescription>Rastro de todas as alterações críticas no sistema.</CardDescription>
                 </div>
                 <div className="flex gap-2">
                   <div className="relative">
                     <Search className="absolute left-3 top-2.5 h-3 w-3 text-zinc-500" />
                     <Input placeholder="Filtrar usuário..." className="pl-8 h-8 w-40 text-xs bg-zinc-900 border-zinc-800" />
                   </div>
                   <Button variant="outline" size="sm" className="h-8 border-zinc-800 text-[10px] uppercase font-bold gap-2">
                     <Filter size={14} /> Período
                   </Button>
                 </div>
               </CardHeader>
               <CardContent>
                  <div className="rounded-md border border-zinc-800 overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead className="bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                          <th className="px-4 py-3 text-left font-black uppercase text-[#888888] tracking-widest">Data/Hora</th>
                          <th className="px-4 py-3 text-left font-black uppercase text-[#888888] tracking-widest">Usuário</th>
                          <th className="px-4 py-3 text-left font-black uppercase text-[#888888] tracking-widest">Ação/Campo</th>
                          <th className="px-4 py-3 text-left font-black uppercase text-[#888888] tracking-widest">Novo Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {[
                          { date: '28/05/2026 14:22', user: 'Admin MEC', field: 'Valor do card #842', value: 'R$ 15.000' },
                          { date: '28/05/2026 13:05', user: 'Gerente Loja', field: 'Status Cliente #12', value: 'Ativo' },
                          { date: '28/05/2026 11:40', user: 'Admin MEC', field: 'Meta Mensal', value: 'R$ 80.000' },
                          { date: '27/05/2026 16:15', user: 'Admin MEC', field: 'Nicho Empresa', value: 'Mecânica' },
                          { date: '27/05/2026 09:30', user: 'Vendedor', field: 'Novo Card #901', value: 'Criado' }
                        ].map((log, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-zinc-500 font-mono">{log.date}</td>
                            <td className="px-4 py-3 font-bold text-white">{log.user}</td>
                            <td className="px-4 py-3 text-zinc-300">{log.field}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/20 text-[10px]">
                                {log.value}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-[10px] text-zinc-500 text-center uppercase font-bold tracking-widest">Mostrando as últimas 100 alterações críticas</p>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="bg-[#0a0a0a] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe size={20} className="text-orange-500" /> Integrações Estratégicas
                </CardTitle>
                <CardDescription>Configure as chaves de API para automação e WhatsApp.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">WhatsApp (Evolution API)</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium">Instância Ativa</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-[#25D366]/30 text-[#25D366] text-[10px] uppercase font-bold">Testar Conexão</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs">URL da API</Label>
                      <Input defaultValue="https://evolution.mecom.com" className="bg-zinc-900 border-zinc-800 h-9 text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs">Global API Key</Label>
                      <Input type="password" value="MEC_SECRET_KEY_123" className="bg-zinc-900 border-zinc-800 h-9 text-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Automação (n8n Webhook)</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium">Motor de Processamento</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-orange-500/30 text-orange-500 text-[10px] uppercase font-bold">Testar Webhook</Button>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label className="text-zinc-500 text-xs">Webhook URL</Label>
                    <Input defaultValue="https://n8n.mecom.com/webhook/c3a2-4b1..." className="bg-zinc-900 border-zinc-800 h-9 text-xs" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 gap-2 min-w-[120px]">
                    <Save size={16} /> Salvar Integrações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
