import React from 'react';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, MessageSquare, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { format } from 'date-fns';

export const ConversationSidebar: React.FC = () => {
  const { conversations, activeConversation, setActiveConversation } = useAppStore();
  const [search, setSearch] = React.useState('');

  const filteredConversations = conversations.filter(c => 
    c.leadName.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicleInterest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]/50 border-r border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Conversas
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Buscar contato ou veículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredConversations.map((conv) => {
              const lastMessage = conv.messages[conv.messages.length - 1];
              const isActive = activeConversation?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={cn(
                    "w-full p-4 flex gap-3 transition-colors text-left group",
                    isActive ? "bg-blue-600/10 border-l-2 border-blue-500" : "hover:bg-white/5"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                      isActive ? "bg-blue-600 shadow-lg shadow-blue-500/20" : "bg-white/10"
                    )}>
                      {conv.leadName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn(
                        "font-bold text-sm truncate transition-colors",
                        isActive ? "text-white" : "text-white/80 group-hover:text-white"
                      )}>
                        {conv.leadName}
                      </h4>
                      {lastMessage && (
                        <span className="text-[10px] text-secondary shrink-0">
                          {format(new Date(lastMessage.timestamp), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-secondary uppercase font-bold tracking-tighter">
                        {conv.vehicleInterest}
                      </span>
                    </div>
                    {lastMessage && (
                      <p className="text-xs text-secondary truncate">
                        {lastMessage.sender === 'ia' ? 'IA: ' : ''}{lastMessage.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-white/10 mx-auto" />
            <p className="text-sm text-secondary">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};