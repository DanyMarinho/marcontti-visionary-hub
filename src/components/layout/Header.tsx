import React from 'react';
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
  ChevronDown,
  Menu,
  Bell,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const { activeTenant, isGlobal } = useTenant();
  const { theme, setTheme } = useTheme();
  const { instance } = useWhatsAppInstance();
  const navigate = useNavigate();

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications', activeTenant?.id, user?.id],
    queryFn: async () => {
      if (!activeTenant?.id) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('tenant_id', activeTenant.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!activeTenant?.id
  });

  const markAllAsRead = async () => {
    if (!activeTenant?.id) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('tenant_id', activeTenant.id)
      .eq('is_read', false);
    refetch();
  };



  const getStatusColor = () => {
    if (!instance) return 'bg-zinc-800';
    if (instance.status === 'connected') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    if (instance.status === 'connecting') return 'bg-yellow-500 animate-pulse';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-[#1f1f1f] hidden sm:flex">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
            <span className="text-[9px] font-black uppercase text-[#888888] tracking-widest">
              WhatsApp {instance.status === 'connected' ? 'OK' : instance.status === 'connecting' ? 'SYNC' : 'OFF'}
            </span>
          </div>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#888888] hover:text-white h-9 w-9 relative">
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0d0d0d]">
                  {notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#0d0d0d] border-[#1f1f1f] p-0 shadow-2xl" align="end">
            <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Notificações</h3>
              <Button variant="ghost" className="text-[10px] h-6 px-2 text-orange-500" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#888888] text-xs">Sem novas notificações</div>
              ) : (
                notifications.map((n: any) => (
                  <div key={n.id} className="p-4 border-b border-[#1f1f1f]/50 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => {
                    if (n.type === 'no_response') navigate('/whatsapp');
                    else if (n.type === 'idle_card') navigate('/reactivation');
                  }}>
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        n.type === 'no_response' ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                      )}>
                        {n.type === 'no_response' ? <MessageSquare size={14} /> : <AlertCircle size={14} />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white leading-tight">{n.title}</p>
                        <p className="text-[11px] text-[#888888] leading-tight">{n.message}</p>
                        <p className="text-[9px] text-[#555555]">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-[#888888] hover:text-white h-9 w-9"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1 md:px-2 hover:bg-muted rounded-full transition-colors h-9">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[10px] md:text-xs">
                {user?.full_name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium leading-none">{user?.full_name}</span>
                <span className="text-[10px] text-muted-foreground uppercase mt-1">
                  {user?.role}
                </span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <div className="sm:hidden p-2">
                <TenantSwitcher />
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
