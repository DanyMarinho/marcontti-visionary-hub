import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bot, 
  Home as HomeIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileMenu: React.FC = () => {
  const links = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'CRM', path: '/crm', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
    { name: 'Automações', path: '/automacoes', icon: Bot },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/5 z-40 flex items-center justify-around px-2">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center gap-1 transition-all duration-300",
            isActive ? "text-blue-500" : "text-white/40"
          )}
        >
          <link.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{link.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileMenu;
