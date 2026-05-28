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

const mockMessages = [
  { id: '1', role: 'user', content: 'Olá, gostaria de ver os SUVs disponíveis.', time: '10:30' },
  { id: '2', role: 'agent', content: 'Olá! Temos excelentes opções. No momento temos um Compass 2023 e um Corolla Cross 2022. Qual deles te interessa mais?', time: '10:31' },
  { id: '3', role: 'user', content: 'O Compass me interessa. Qual o valor?', time: '10:35' },
];

export default function WhatsApp() {
  const [connected, setConnected] = useState(false);
  const [iaActive, setIaActive] = useState(true);

  return (
    <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-180px)]">
      {/* Sidebar - Connection Status & Config */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Status da Conexão
              <Badge variant={connected ? "default" : "destructive"} className={connected ? "bg-green-500" : ""}>
                {connected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            {!connected ? (
              <>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-[#f97316]/20">
                  <QrCode size={180} className="text-[#0a0a0a]" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Escaneie o QR Code para conectar sua instância da Evolution API.
                </p>
                <Button className="w-full bg-[#0a0a0a] hover:bg-[#0a0a0a]/90" onClick={() => setConnected(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Gerar Novo QR Code
                </Button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg dark:bg-green-900/10 border border-green-200 dark:border-green-900/20">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 size={18} />
                    <span className="font-medium">Instância: infinda_01</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setConnected(false)} className="text-red-500 hover:text-red-700">
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
              <Settings2 size={18} /> Configurar Prompt
            </CardTitle>
            <CardDescription>Defina como a IA deve se comportar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea 
              className="w-full min-h-[150px] p-3 text-sm rounded-md border bg-background"
              placeholder="Você é o assistente virtual da MEC Hub..."
              defaultValue="Você é o assistente comercial da MEC Hub. Seja educado, focado em vendas e agendamento de reuniões. Use os dados de estoque/serviços para responder."
            />
            <Button className="w-full" variant="outline">Salvar Prompt</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white">
                  JS
                </div>
                <div>
                  <CardTitle className="text-base">João Silva</CardTitle>
                  <p className="text-xs text-muted-foreground">Lead • Última mensagem há 5 min</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[#f97316] border-[#f97316]">Agente Ativo</Badge>
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
