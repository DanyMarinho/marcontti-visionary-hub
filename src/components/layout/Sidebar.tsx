import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bot, 
  Home as HomeIcon,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const links = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'CRM', path: '/crm', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
    { name: 'Automações', path: '/automacoes', icon: Bot },
  ];

  return (
    <nav className={cn(
      "w-72 border-r border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl p-6 flex flex-col h-full z-20", 
      className
    )}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-black text-xl italic">M</span>
        </div>
        <div>
          <h1 className="text-white font-bold tracking-tight text-lg leading-none">Marcontti</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Garage Premium</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <p className="text-white/20 text-[10px] uppercase tracking-widest mb-2 px-2 font-bold">Menu Principal</p>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="group relative"
            >
              <div className={cn(
                "flex items-center justify-between p-3.5 rounded-2xl text-sm transition-all duration-300 relative z-10",
                isActive 
                  ? "bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" 
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-blue-500/10 text-blue-400" : "bg-transparent text-current"
                  )}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium tracking-tight">{link.name}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill">
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </motion.div>
                )}
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-link"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl border-l-2 border-blue-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-4 p-4 w-full text-white/40 hover:text-white transition-colors rounded-2xl hover:bg-white/[0.02]">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair da Conta</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;