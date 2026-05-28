import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Store, 
  UserCircle, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  GitMerge,
  Bot,
  PieChart,
  Users2
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

export function Sidebar() {
  const { user, setRole } = useAuthStore();
  const [collapsed, setCollapsed] = React.useState(false);
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

  const handleRoleChange = (role: Role) => {
    setRole(role);
  };

  return (
    <aside 
      className={cn(
        "bg-[#0a0a0a] text-white transition-all duration-300 flex flex-col z-40 h-screen sticky top-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-orange-500">MEC Hub</h1>
            <span className="text-[10px] text-white/50 uppercase tracking-widest">Infinda Digital</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
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
                  "w-full justify-start text-white/60 hover:text-white hover:bg-white/5 px-3 h-11",
                  isActive && "bg-orange-500 text-white font-medium hover:bg-orange-600 hover:text-white",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className={cn("flex flex-col gap-2", collapsed ? "items-center" : "")}>
          {!collapsed && (
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Troca Rápida de Perfil</span>
          )}
          <div className="flex flex-wrap gap-1">
            {(['admin', 'loja', 'vendedor'] as Role[]).map((r) => (
              <Button
                key={r}
                variant="ghost"
                size={collapsed ? "icon" : "sm"}
                className={cn(
                  "h-8 text-[10px] uppercase font-bold",
                  user?.role === r ? "bg-white/20 text-white" : "text-white/40 hover:text-white hover:bg-white/10",
                  !collapsed && "px-2"
                )}
                onClick={() => handleRoleChange(r)}
                title={r.toUpperCase()}
              >
                {collapsed ? r.substring(0, 1).toUpperCase() : r}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
