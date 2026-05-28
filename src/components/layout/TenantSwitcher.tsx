import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useTenant } from '@/hooks/useTenant';
import { useAuthStore } from '@/store/authStore';
import { Building2 } from 'lucide-react';

export function TenantSwitcher() {
  const { activeTenantId, setActiveTenant } = useTenant();
  const { tenants, setSelectedTenant } = useAuthStore();

  const handleValueChange = (id: string) => {
    setActiveTenant(id);
    setSelectedTenant(id);
  };

  return (
    <div className="flex items-center gap-2 border-l pl-4 ml-2 h-8">
      <span className="text-[10px] font-bold text-muted-foreground uppercase hidden md:inline">Empresa:</span>
      <Select value={activeTenantId || 'all'} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] h-9 border-none bg-transparent hover:bg-muted font-semibold transition-colors">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-muted-foreground" />
              <span>Todas as Empresas</span>
            </div>
          </SelectItem>
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: tenant.color }} 
                />
                <span className="truncate">{tenant.name}</span>
                <span className="text-[10px] text-muted-foreground ml-1">({tenant.niche})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
