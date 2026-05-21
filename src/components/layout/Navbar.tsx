import React from 'react';
export const Navbar: React.FC = () => (
  <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0f]/50">
    <div className="text-white text-sm font-medium uppercase tracking-wider">Marcontti Garage</div>
    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
  </header>
);
export default Navbar;