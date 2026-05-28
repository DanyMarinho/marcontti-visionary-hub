import React from 'react';
import { useStore } from '@/hooks/useStore';
import { Store as StoreIcon, Check } from 'lucide-react';
import { ShiftingDropDown } from '@/components/ui/ShiftingDropDown';
import { cn } from '@/lib/utils';

export function StoreSwitcher() {
  const { activeStoreId, setActiveStore, activeStore, stores } = useStore();

  const StoreListContent = () => (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider">Selecionar Unidade</h3>
      </div>
      <button
        onClick={() => setActiveStore('all')}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
          activeStoreId === 'all' ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
        )}
      >
        <div className="flex items-center gap-2">
          <StoreIcon size={16} className={activeStoreId === 'all' ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"} />
          <span className="text-sm font-medium">Todas as Unidades</span>
        </div>
        {activeStoreId === 'all' && <Check size={14} />}
      </button>

      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => setActiveStore(store.id)}
          className={cn(
            "w-full flex items-center justify-between p-2 rounded-lg transition-colors group",
            activeStoreId === store.id ? "bg-orange-500/10 text-orange-500" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          <div className="flex items-center gap-2">
            <StoreIcon size={16} className={activeStoreId === store.id ? "text-orange-500" : "text-zinc-500 group-hover:text-zinc-300"} />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium truncate max-w-[150px]">{store.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase">{store.manager}</span>
            </div>
          </div>
          {activeStoreId === store.id && <Check size={14} />}
        </button>
      ))}
    </div>
  );

  const tabs = [
    {
      id: 'store-switcher',
      title: activeStore?.name || 'Todas as Unidades',
      Component: StoreListContent
    }
  ];

  return (
    <div className="flex items-center gap-2 border-l border-zinc-800 pl-4 ml-2 h-8">
      <span className="text-[10px] font-bold text-zinc-500 uppercase hidden md:inline">Unidade:</span>
      <ShiftingDropDown tabs={tabs} />
    </div>
  );
}
