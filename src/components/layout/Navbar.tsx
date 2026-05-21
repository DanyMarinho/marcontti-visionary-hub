import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0a0a0f]/40 backdrop-blur-md z-20">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar leads, veículos..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>
      </div>
      
      {/* Mobile search icon only */}
      <div className="sm:hidden">
        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0f]" />
        </motion.button>
        
        <div className="h-8 w-[1px] bg-white/5 mx-2" />
        
        <button className="flex items-center gap-3 p-1.5 md:pr-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-white text-xs font-bold leading-none">Admin Marcontti</p>
            <p className="text-white/20 text-[10px] font-medium mt-1">Gerente de Vendas</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;