import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService } from '@/services/whatsappService';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Bot, 
  User, 
  MoreVertical, 
  Phone, 
  Video,
  Loader2,
  Check,
  CheckCheck,
  ChevronLeft,
  Share2,
  CheckCircle2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';


interface ConversationViewProps {
  clientId: string;
  onBack?: () => void;
}

export function ConversationView({ clientId, onBack }: ConversationViewProps) {
  const { activeTenantId } = useTenant();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferUserId, setTransferUserId] = useState('');


  const { data: conversation, isLoading: isLoadingConv } = useQuery({
    queryKey: ['whatsapp-conversation', activeTenantId, clientId],
    queryFn: async () => {
      const conv = await whatsappService.getConversationByClient(activeTenantId!, clientId);
      if (conv && conv.status === 'waiting') {
        // Automatically change status to attending when opening
        await whatsappService.updateConversation(conv.id, { status: 'attending' });
        queryClient.invalidateQueries({ queryKey: ['whatsapp-conversations'] });
      }
      return conv;
    },
    enabled: !!activeTenantId && !!clientId,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['whatsapp-messages', activeTenantId, clientId],
    queryFn: () => whatsappService.getMessages(activeTenantId!, clientId),
    enabled: !!activeTenantId && !!clientId,
  });

  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers', activeTenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('tenant_id', activeTenantId)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!activeTenantId,
  });

  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();
      if (error) return { id: clientId, full_name: 'Lead WhatsApp', phone: '...' };
      return data;
    }
  });

  const updateConvMutation = useMutation({
    mutationFn: (updates: any) => whatsappService.updateConversation(conversation!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-conversation', activeTenantId, clientId] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-conversations'] });
    }
  });


  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // Mock sending message
      await new Promise(resolve => setTimeout(resolve, 500));
      // In production: await supabase.functions.invoke('evolution-proxy/send-message', { body: { clientId, content } })
      return { success: true };
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', activeTenantId, clientId] });
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="p-4 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between min-h-20 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={onBack}>
              <ChevronLeft size={20} />
            </Button>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold border border-orange-500/20">
              {client?.full_name?.substring(0, 2).toUpperCase()}
            </div>
            {conversation?.status && (
              <div className={cn(
                "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0d0d0d]",
                conversation.status === 'waiting' ? "bg-yellow-500" :
                conversation.status === 'attending' ? "bg-blue-500" : "bg-green-500"
              )} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">{client?.full_name}</h3>
              {conversation?.status && (
                <Badge variant="outline" className={cn(
                  "text-[8px] h-4 px-1 uppercase font-black tracking-tighter",
                  conversation.status === 'waiting' ? "border-yellow-500 text-yellow-500" :
                  conversation.status === 'attending' ? "border-blue-500 text-blue-500" :
                  "border-green-500 text-green-500"
                )}>
                  {conversation.status === 'waiting' ? 'Aguardando' : conversation.status === 'attending' ? 'Em atendimento' : 'Resolvido'}
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-[#888888] uppercase font-black tracking-widest">{client?.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* IA Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#1f1f1f] mr-2">
            <Label htmlFor="ia-mode" className="text-[10px] font-black uppercase text-[#888888] cursor-pointer">
              Agente IA
            </Label>
            <Switch 
              id="ia-mode" 
              checked={conversation?.ai_enabled} 
              onCheckedChange={(checked) => {
                updateConvMutation.mutate({ ai_enabled: checked });
                if (!checked) {
                   toast.info(`IA desativada por ${user?.full_name}`);
                }
              }}
            />
          </div>

          {(user?.role === 'admin' || user?.role === 'loja') && (
            <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-[#888888] hover:text-white">
                  <Share2 size={14} /> Transferir
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0d0d0d] border-[#1f1f1f]">
                <DialogHeader>
                  <DialogTitle>Transferir Conversa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Vendedor Destino</Label>
                    <Select value={transferUserId} onValueChange={setTransferUserId}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#1f1f1f]">
                        <SelectValue placeholder="Selecione um vendedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sellers
                          .filter(s => s.id !== user?.id)
                          .map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={!transferUserId}
                    onClick={() => {
                      const seller = sellers.find(s => s.id === transferUserId);
                      updateConvMutation.mutate({ assigned_to: transferUserId });
                      toast.success(`Conversa transferida para ${seller?.full_name}`);
                      setIsTransferModalOpen(false);
                    }}
                  >
                    Confirmar Transferência
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {conversation?.status !== 'resolved' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs gap-1 text-green-500 hover:text-green-400 hover:bg-green-500/10"
              onClick={() => updateConvMutation.mutate({ status: 'resolved' })}
            >
              <CheckCircle2 size={14} /> Resolver
            </Button>
          )}
          
          <div className="h-6 w-[1px] bg-[#1f1f1f] mx-1" />
          
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#888888]"><Phone size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#888888]"><Video size={18} /></Button>
        </div>
      </div>


      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[70%]",
                  msg.direction === 'sent' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm relative group",
                  msg.direction === 'sent' 
                    ? "bg-orange-500 text-white rounded-tr-none shadow-none" 
                    : "bg-[#1a1a1a] text-zinc-100 rounded-tl-none border border-[#1f1f1f] shadow-none"
                )}>
                  {msg.processed_by_ai && (
                    <div className="flex items-center gap-1 mb-1">
                       <Badge variant="secondary" className="h-4 px-1.5 text-[8px] bg-orange-100 text-orange-600 border-none font-black uppercase">
                        <Bot size={8} className="mr-0.5" /> Agente IA
                      </Badge>
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 justify-end",
                    msg.direction === 'sent' ? "text-orange-100" : "text-muted-foreground"
                  )}>
                    <span className="text-[9px] uppercase font-medium">
                      {format(new Date(msg.timestamp), 'HH:mm')}
                    </span>
                    {msg.direction === 'sent' && <CheckCheck size={12} className="opacity-70" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-[#0d0d0d] border-t border-[#1f1f1f]">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <Input 
            placeholder="Digite sua resposta..." 
            className="flex-1 bg-muted/50 border-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-orange-500 hover:bg-orange-600 rounded-full h-10 w-10 shrink-0"
            disabled={!message.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </div>
  );
}
