import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/hooks/useTenant';
import { TenantSwitcher } from './TenantSwitcher';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useWhatsAppInstance } from '@/modules/whatsapp/hooks/useWhatsAppInstance';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogOut, 
  Sun, 
  Moon, 
  User as UserIcon,
  Menu,
  Bell,
  MessageSquare,
  AlertCircle,
  Share2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ShiftingDropDown } from '@/components/ui/ShiftingDropDown';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, setRole } = useAuthStore();
  const { activeTenant, isGlobal } = useTenant();
  const { theme, setTheme } = useTheme();
  const { instance } = useWhatsAppInstance();
  const navigate = useNavigate();

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications', activeTenant?.id, user?.id],
    queryFn: async () => {
      if (!activeTenant?.id || !user?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('tenant_id', activeTenant.id)
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!activeTenant?.id
  });

  const markAllAsRead = async () => {
    if (!activeTenant?.id || !user?.id) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('tenant_id', activeTenant.id)
      .eq('user_id', user.id)
      .eq('is_read', false);
    refetch();
  };

  const getStatusColor = () => {
    if (!instance) return 'bg-zinc-800';
    if (instance.status === 'connected') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    if (instance.status === 'connecting') return 'bg-yellow-500 animate-pulse';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

  const NotificationsContent = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-sm text-white">Notificações</h3>
        <Button variant="ghost" className="text-[10px] h-6 px-2 text-orange-500 hover:bg-orange-500/10" onClick={markAllAsRead}>
          Limpar tudo
        </Button>
      </div>
      <div className="max-h-80 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-xs">Sem novas notificações</div>
        ) : (
          notifications.map((n: any) => (
            <div 
              key={n.id} 
              className="p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-zinc-700"
              onClick={() => {
                if (n.type === 'no_response' || n.type === 'transfer') navigate('/whatsapp');
                else if (n.type === 'idle_card') navigate('/reactivation');
              }}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  n.type === 'no_response' ? "bg-red-500/10 text-red-500" : 
                  n.type === 'transfer' ? "bg-blue-500/10 text-blue-500" :
                  "bg-orange-500/10 text-orange-500"
                )}>
                  {n.type === 'no_response' ? <MessageSquare size={14} /> : 
                   n.type === 'transfer' ? <Share2 size={14} /> :
                   <AlertCircle size={14} />}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{n.title}</p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{n.message}</p>
                  <p className="text-[9px] text-zinc-500">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const ProfileContent = () => (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          {user?.full_name?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">{user?.full_name}</p>
          <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-wider">{user?.role}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-1">
        <Button variant="ghost" className="w-full justify-start text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 h-9">
          <UserIcon size={14} className="mr-2" />
          Meu Perfil
        </Button>
        <Button variant="ghost" className="w-full justify-start text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 h-9">
          <Moon size={14} className="mr-2" />
          Configurações
        </Button>
        <div className="h-px bg-zinc-800 my-1" />
        <Button 
          variant="ghost" 
          className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 h-9"
          onClick={() => {/* handle logout */}}
        >
          <LogOut size={14} className="mr-2" />
          Sair do Sistema
        </Button>
      </div>

      <div className="border-t border-zinc-800 pt-3">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Simular Perfil</p>
        <div className="flex gap-1">
          {['admin', 'loja', 'vendedor'].map((r: any) => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 text-[9px] uppercase font-bold px-2",
                user?.role === r ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-white"
              )}
              onClick={() => setRole(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const menuTabs = [
    {
      id: 1,
      title: `Notificações${notifications.length > 0 ? ` (${notifications.length})` : ''}`,
      Component: NotificationsContent
    },
    {
      id: 2,
      title: "Minha Conta",
      Component: ProfileContent
    }
  ];

  return (
    <header className="h-20 bg-[#0d0d0d] border-b border-[#1f1f1f] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick} 
          className="lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col lg:hidden">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none font-sans">
              MEC <span className="text-orange-500">Hub</span>
            </h1>
            <span className="text-[9px] text-[#888888] font-medium uppercase tracking-[0.1em]">by Infinda</span>
          </div>
          <h2 className="text-sm font-semibold text-foreground hidden sm:block">
            {isGlobal ? 'Plataforma MEC Hub' : activeTenant?.name}
          </h2>
        </div>
        
        {user?.role === 'admin' && (
          <div className="hidden sm:block">
            <TenantSwitcher />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        {instance && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-[#1f1f1f] hidden sm:flex mr-2">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
            <span className="text-[9px] font-black uppercase text-[#888888] tracking-widest">
              WhatsApp {instance.status === 'connected' ? 'OK' : instance.status === 'connecting' ? 'SYNC' : 'OFF'}
            </span>
          </div>
        )}
        
        <div className="hidden md:block">
          <ShiftingDropDown tabs={menuTabs} />
        </div>

        <div className="md:hidden flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-zinc-500 h-9 w-9">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-500 h-9 w-9">
            <UserIcon size={18} />
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-[#888888] hover:text-white h-9 w-9 ml-2"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
}

