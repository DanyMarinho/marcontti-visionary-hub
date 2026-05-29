import React from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { Building2, Check } from 'lucide-react';
import { ShiftingDropDown } from '@/components/ui/ShiftingDropDown';
import { cn } from '@/lib/utils';

export function TenantSwitcher() {
  const { activeTenantId, setActiveTenant, activeTenant } = useTenant();
  const { tenants } = useAuthStore();

  const handleValueChange = (id: string) => {
    setActiveTenant(id);
    if (window.location.pathname !== '/') {
      // If we're not on the root dashboard, don't force navigation
      // but ensure if there's any logic redirecting to /admin, it's suppressed
      console.log('Tenant switched to:', id);
    }
  };

  const TenantListContent = () => (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider">Selecionar Empresa</h3>
      </div>
      <button
        onClick={() => handleValueChange('all')}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
          activeTenantId === 'all' ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
        )}
      >
        <div className="flex items-center gap-2">
          <Building2 size={16} className={activeTenantId === 'all' ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"} />
          <span className="text-sm font-medium">Todas as Empresas</span>
        </div>
        {activeTenantId === 'all' && <Check size={14} />}
      </button>

      {tenants.map((tenant) => (
        <button
          key={tenant.id}
          onClick={() => handleValueChange(tenant.id)}
          className={cn(
            "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
            activeTenantId === tenant.id ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: tenant.color }} 
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium truncate max-w-[150px]">{tenant.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase">{tenant.niche}</span>
            </div>
          </div>
          {activeTenantId === tenant.id && <Check size={14} />}
        </button>
      ))}
    </div>
  );

  const tabs = [
    {
      id: 'tenant-switcher',
      title: activeTenant?.name || 'Todas as Empresas',
      Component: TenantListContent
    }
  ];

  return (
    <div className="flex items-center gap-2 border-l border-zinc-800 pl-4 ml-2 h-8">
      <span className="text-[10px] font-bold text-zinc-500 uppercase hidden md:inline">Empresa:</span>
      <ShiftingDropDown tabs={tabs} />
    </div>
  );
}
