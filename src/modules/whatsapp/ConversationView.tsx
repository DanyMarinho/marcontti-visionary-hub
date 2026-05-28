import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService } from '@/services/whatsappService';
import { useTenant } from '@/hooks/useTenant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ConversationViewProps {
  clientId: string;
  onBack?: () => void;
}

export function ConversationView({ clientId, onBack }: ConversationViewProps) {
  const { activeTenantId } = useTenant();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['whatsapp-messages', activeTenantId, clientId],
    queryFn: () => whatsappService.getMessages(activeTenantId!, clientId),
    enabled: !!activeTenantId && !!clientId,
  });

  const { data: client } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      // Try to find the client name from the messages or database
      // For now, using a fallback but prioritizing actual data if available
      return { id: clientId, full_name: 'Lead WhatsApp', phone: 'Sincronizando...' };
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#1f1f1f] bg-[#0d0d0d] flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
              <ChevronLeft size={20} />
            </Button>
          )}
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            {client?.full_name?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm">{client?.full_name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase">{client?.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><Phone size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><Video size={18} /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><MoreVertical size={18} /></Button>
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
