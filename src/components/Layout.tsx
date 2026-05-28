import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
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
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'shop', 'vendor'] },
    { label: 'CRM', icon: Users, path: '/crm', roles: ['admin', 'shop', 'vendor'], labelAlt: { vendor: 'Meus Clientes' } },
    { label: 'WhatsApp', icon: MessageSquare, path: '/whatsapp', roles: ['admin', 'shop', 'vendor'] },
    { label: 'Vendedores', icon: UserCircle, path: '/vendors', roles: ['admin', 'shop'] },
    { label: 'Lojas', icon: Store, path: '/shops', roles: ['admin'] },
    { label: 'Métricas', icon: BarChart3, path: '/metrics', roles: ['admin', 'shop'], labelAlt: { vendor: 'Minhas Metas' } },
    { label: 'Projeção', icon: TrendingUp, path: '/projection', roles: ['admin'] },
    { label: 'Configurações', icon: Settings, path: '/settings', roles: ['admin', 'shop', 'vendor'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#1e3a5f] text-white transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && <h1 className="text-xl font-bold truncate">Marcontti Hub</h1>}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              const label = (user && item.labelAlt?.[user.role as keyof typeof item.labelAlt]) || item.label;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/80 hover:text-white hover:bg-white/10",
                    isActive && "bg-white/20 text-white font-medium",
                    collapsed && "justify-center px-0"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{label}</span>}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-white/80 hover:text-white hover:bg-white/10",
              collapsed && "justify-center px-0"
            )}
            onClick={logout}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/30">
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Marcontti Hub'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name} ({user?.role})</span>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
