import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Store, 
  UserCircle, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  GitMerge,
  Bot,
  PieChart,
  Users2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Role } from '@/types';

interface MenuItem {
  label: string;
  icon: any;
  path: string;
  roles: Role[];
  labelAlt?: Partial<Record<Role, string>>;
}

interface SidebarProps {
  collapsed?: boolean;
  open?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed, open, onToggle, isMobile, onClose }: SidebarProps) {
  const { user, setRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: 'Dashboard Geral', icon: LayoutDashboard, path: '/', roles: ['admin'], labelAlt: { loja: 'Dashboard', vendedor: 'Meu Dashboard' } },
    { label: 'Empresas', icon: Building2, path: '/tenants', roles: ['admin'] },
    { label: 'Lojas', icon: Store, path: '/shops', roles: ['admin'] },
    { label: 'Vendedores', icon: UserCircle, path: '/vendors', roles: ['admin'] },
    { label: 'Minha Equipe', icon: Users2, path: '/team', roles: ['loja'] },
    { label: 'CRM', icon: Users, path: '/crm', roles: ['admin', 'loja'], labelAlt: { vendedor: 'Meus Clientes' } },
    { label: 'Pipeline', icon: GitMerge, path: '/pipeline', roles: ['admin', 'loja', 'vendedor'], labelAlt: { vendedor: 'Meu Pipeline' } },
    { label: 'WhatsApp', icon: MessageSquare, path: '/whatsapp', roles: ['admin', 'loja', 'vendedor'] },
    { label: 'Agente IA', icon: Bot, path: '/ai-agent', roles: ['admin', 'loja'] },
    { label: 'Métricas', icon: PieChart, path: '/metrics', roles: ['admin', 'loja'], labelAlt: { vendedor: 'Minhas Metas' } },
    { label: 'Projeção Financeira', icon: TrendingUp, path: '/projection', roles: ['admin'] },
    { label: 'Configurações', icon: Settings, path: '/settings', roles: ['admin', 'loja', 'vendedor'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || 'vendedor'));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) onClose?.();
  };

  const sidebarClasses = cn(
    "bg-[#0a0a0a] text-white transition-all duration-300 flex flex-col z-50 h-screen fixed lg:sticky top-0 shadow-2xl lg:shadow-none",
    collapsed ? "w-20" : "w-64",
    isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
  );

  return (
    <aside className={sidebarClasses}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
        {(!collapsed || isMobile) && (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-orange-500 text-white w-8 h-8 rounded flex items-center justify-center font-bold">M</span>
              <span className="text-white">MEC <span className="text-orange-500">Hub</span></span>
            </h1>
          </div>
        )}
        
        {isMobile ? (
          <Button variant="ghost" size="icon" className="text-white lg:hidden" onClick={onClose}>
            <X size={20} />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 hidden lg:flex"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const label = (user && item.labelAlt?.[user.role]) || item.label;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white/60 hover:text-white hover:bg-white/5 px-3 h-11 transition-all",
                  isActive && "bg-orange-500 text-white font-medium hover:bg-orange-600 hover:text-white",
                  collapsed && !isMobile && "justify-center px-0"
                )}
                onClick={() => handleNavigate(item.path)}
                aria-label={label}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", (!collapsed || isMobile) && "mr-3")} />
                {(!collapsed || isMobile) && <span className="truncate">{label}</span>}
                {(!collapsed || isMobile) && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className={cn("flex flex-col gap-2", collapsed && !isMobile ? "items-center" : "")}>
          {(!collapsed || isMobile) && (
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Troca Rápida de Perfil</span>
          )}
          <div className="flex flex-wrap gap-1">
            {(['admin', 'loja', 'vendedor'] as Role[]).map((r) => (
              <Button
                key={r}
                variant="ghost"
                size={(collapsed && !isMobile) ? "icon" : "sm"}
                className={cn(
                  "h-8 text-[10px] uppercase font-bold",
                  user?.role === r ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10",
                  (!collapsed || isMobile) && "px-2"
                )}
                onClick={() => setRole(r)}
                title={r.toUpperCase()}
                aria-label={`Trocar para perfil ${r}`}
              >
                {(collapsed && !isMobile) ? r.substring(0, 1).toUpperCase() : r}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
