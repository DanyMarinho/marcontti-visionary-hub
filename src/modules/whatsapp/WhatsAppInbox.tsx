import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { whatsappService } from '@/services/whatsappService';
import { useTenant } from '@/hooks/useTenant';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationView } from './ConversationView';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function WhatsAppInbox() {
  const { activeTenantId } = useTenant();
  const [search, setSearch] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Realtime updates
  useRealtime(activeTenantId);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['whatsapp-conversations', activeTenantId],
    queryFn: () => whatsappService.getConversations(activeTenantId!),
    enabled: !!activeTenantId && activeTenantId !== 'all',
  });

  const filteredConversations = conversations.filter(conv => 
    conv.client?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    conv.client?.phone?.includes(search)
  );

  return (
    <div className="flex h-[calc(100vh-140px)] border border-[#1f1f1f] rounded-lg overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar - Conversations List */}
      <div className="w-full md:w-80 flex flex-col border-r border-[#1f1f1f]">
        <div className="p-4 border-b border-[#1f1f1f] space-y-4">
          <h2 className="text-xl font-bold text-white">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar contato..." 
              className="pl-9 bg-muted/50 border-none h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-24 bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 opacity-20" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Nenhuma conversa ativa</h3>
                  <p className="text-xs">Conecte o WhatsApp para começar a receber mensagens.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {filteredConversations.map((msg) => (
                <button
                  key={msg.client_id}
                  onClick={() => setActiveChat(msg.client_id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left",
                    activeChat === msg.client_id && "bg-orange-50 dark:bg-orange-500/10 border-r-2 border-orange-500"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm">
                      {msg.client?.full_name?.substring(0, 2).toUpperCase()}
                    </div>
                    {msg.direction === 'received' && !msg.processed_by_ai && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-zinc-950" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm truncate">{msg.client?.full_name}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: false, locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {msg.processed_by_ai && <Bot size={12} className="text-orange-500 flex-shrink-0" />}
                      <p className="text-xs text-muted-foreground truncate italic">
                        {msg.direction === 'sent' ? 'Você: ' : ''}{msg.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 hidden md:flex flex-col bg-[#0a0a0a]">
        {activeChat ? (
          <ConversationView clientId={activeChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center">
              <MessageSquare size={40} className="opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">MEC Hub WhatsApp</h3>
              <p className="text-xs">Selecione uma conversa para visualizar o histórico e responder.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
