import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Bot, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'CRM', path: '/crm', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
    { name: 'Automações', path: '/automacoes', icon: Bot },
  ];

  return (
    <nav className={cn("w-64 border-r border-white/10 bg-[#0a0a0f]/50 p-4", className)}>
      <div className="text-white font-bold mb-8 p-4">Marcontti Garage</div>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-sm transition-all",
              location.pathname === link.path ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
            )}
          >
            <link.icon className="w-4 h-4" />
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};
export default Sidebar;