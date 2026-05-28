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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from '../types';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, login, tenants, selectedTenantId, setSelectedTenant } = useAuthStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'shop', 'vendor'] },
    { label: 'CRM', icon: Users, path: '/crm', roles: ['admin', 'shop', 'vendor'], labelAlt: { vendor: 'Meus Clientes' } },
    { label: 'WhatsApp', icon: MessageSquare, path: '/whatsapp', roles: ['admin', 'shop', 'vendor'] },
    { label: 'Empresas', icon: Building2, path: '/tenants', roles: ['admin'] },
    { label: 'Vendedores', icon: UserCircle, path: '/vendors', roles: ['admin', 'shop'] },
    { label: 'Lojas', icon: Store, path: '/shops', roles: ['admin'] },
    { label: 'Métricas', icon: BarChart3, path: '/metrics', roles: ['admin', 'shop'], labelAlt: { vendor: 'Minhas Metas' } },
    { label: 'Projeção', icon: TrendingUp, path: '/projection', roles: ['admin'] },
    { label: 'Configurações', icon: Settings, path: '/settings', roles: ['admin', 'shop', 'vendor'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const handleRoleChange = (role: string) => {
    login(role as User['role']);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0a0a0a] text-white transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
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

        {!collapsed && (
          <div className="p-4 border-b border-white/10">
            <label className="text-[10px] font-semibold text-white/40 uppercase mb-2 block">Perfil de Acesso</label>
            <Select value={user?.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                <SelectValue placeholder="Selecionar perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="shop">Loja / Unidade</SelectItem>
                <SelectItem value="vendor">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              const label = (user && item.labelAlt?.[user.role as keyof typeof item.labelAlt]) || item.label;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/60 hover:text-white hover:bg-white/5",
                    isActive && "bg-orange-500/10 text-orange-500 font-medium hover:bg-orange-500/20 hover:text-orange-500",
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

        {collapsed && (
          <div className="p-4 border-t border-white/10 flex justify-center">
             <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60"
              title="Trocar Perfil"
              onClick={() => {
                const roles: User['role'][] = ['admin', 'shop', 'vendor'];
                const currentIndex = roles.indexOf(user?.role as User['role']);
                const nextRole = roles[(currentIndex + 1) % roles.length];
                handleRoleChange(nextRole);
              }}
            >
              <ShieldCheck size={20} />
            </Button>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto bg-[#f8f9fa]">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-[#0a0a0a]">
              {menuItems.find(i => i.path === location.pathname)?.label || 'MEC Hub'}
            </h2>
            
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2 border-l pl-6 h-8">
                <span className="text-xs font-medium text-muted-foreground uppercase">Empresa:</span>
                <Select value={selectedTenantId} onValueChange={setSelectedTenant}>
                  <SelectTrigger className="w-[180px] h-9 border-none bg-transparent hover:bg-muted font-semibold">
                    <SelectValue placeholder="Todas as Empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Empresas</SelectItem>
                    {tenants.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                          {t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-[#0a0a0a]">{user?.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 rounded">
                {user?.role} {user?.tenantId !== 'system' && `• ${tenants.find(t => t.id === user?.tenantId)?.name}`}
              </span>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
