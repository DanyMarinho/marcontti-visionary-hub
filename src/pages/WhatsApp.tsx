import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  MessageSquare, 
  Settings2, 
  Play, 
  Square,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../store/authStore';

const mockMessages = [
  { id: '1', role: 'user', content: 'Olá, gostaria de saber mais sobre os serviços.', time: '10:30' },
  { id: '2', role: 'agent', content: 'Olá! Como posso ajudar hoje?', time: '10:31' },
];

export default function WhatsApp() {
  const { selectedTenantId, tenants } = useAuthStore();
  const [connected, setConnected] = useState(false);
  const [iaActive, setIaActive] = useState(true);
  
  const isGlobal = selectedTenantId === 'all';
  const currentTenant = tenants.find(t => t.id === selectedTenantId);

  if (isGlobal) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <MessageSquare className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-center">Selecione uma empresa para gerenciar o WhatsApp</h2>
        <p className="text-muted-foreground text-center max-w-md">Cada empresa possui sua própria instância da Evolution API e seu próprio agente de IA.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-180px)]">
      {/* Sidebar - Connection Status & Config */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Status {currentTenant?.name}
              <Badge variant={connected ? "default" : "destructive"} className={connected ? "bg-green-500" : ""}>
                {connected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            {!connected ? (
              <>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-orange-500/20">
                  <QrCode size={180} className="text-[#0a0a0a]" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Escaneie o QR Code da empresa <strong>{currentTenant?.name}</strong>.
                </p>
                <Button className="w-full bg-[#0a0a0a] hover:bg-[#0a0a0a]/90" onClick={() => setConnected(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Gerar Novo QR Code
                </Button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={18} />
                    <span className="font-medium text-xs">Instância: {currentTenant?.name.toLowerCase()}_01</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setConnected(false)} className="text-red-500 hover:text-red-700 h-7 w-7 p-0">
                    <XCircle size={18} />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agente de IA</label>
                  <Button 
                    variant={iaActive ? "default" : "outline"} 
                    className={cn("w-full justify-between", iaActive && "bg-[#f97316] hover:bg-[#f97316]/90")}
                    onClick={() => setIaActive(!iaActive)}
                  >
                    {iaActive ? 'Agente Ativado' : 'Agente Pausado'}
                    {iaActive ? <Square size={16} /> : <Play size={16} />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 size={18} /> Prompt ({currentTenant?.niche})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm rounded-md border bg-background"
              placeholder={`Você é o assistente virtual da ${currentTenant?.name}...`}
              defaultValue={`Você é o assistente comercial da ${currentTenant?.name}. Seja educado e focado no nicho de ${currentTenant?.niche}.`}
            />
            <Button className="w-full" variant="outline" size="sm">Salvar Prompt</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b py-3 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-xs">
                  JS
                </div>
                <div>
                  <CardTitle className="text-sm">Cliente Simulado</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Empresa: {currentTenant?.name}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[#f97316] border-[#f97316] text-[10px]">Agente Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 relative">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {mockMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm shadow-sm",
                      msg.role === 'user' 
                        ? "bg-muted ml-auto" 
                        : "bg-[#0a0a0a] text-white"
                    )}
                  >
                    <p>{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1 text-right",
                      msg.role === 'user' ? "text-muted-foreground" : "text-white/70"
                    )}>{msg.time}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Input placeholder="Digite uma mensagem..." className="flex-1" />
            <Button size="icon" className="bg-[#f97316] hover:bg-[#f97316]/90">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
