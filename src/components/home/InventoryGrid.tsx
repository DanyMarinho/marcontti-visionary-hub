import React from 'react';
import { Bike } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { CardTilt } from '@/components/shared/CardTilt';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { mockVehicles } from '@/data/mockVehicles';

import { DataPlaceholder } from '@/components/shared/DataPlaceholder';

export const InventoryGrid = () => {
  const hasVehicles = mockVehicles.length > 0;
  return (
    <section className="px-6 py-12">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Estoque Premium</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
          </div>
          <p className="text-slate-400 max-w-md">
            Motos rigorosamente selecionadas, com procedência garantida e estado de conservação impecável.
          </p>
        </div>
      </ScrollReveal>

      {hasVehicles ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockVehicles.map((vehicle, index) => (
            <ScrollReveal key={vehicle.id} delay={(index % 4) * 100}>
              <CardTilt>
                <GlassCard className="group overflow-hidden flex flex-col h-full" hover glow="blue">
                  {/* Image Placeholder */}
                  <div className="relative aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    <Bike size={64} className="text-slate-700 group-hover:scale-110 group-hover:text-blue-500/20 transition-all duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-blue-400">
                        {vehicle.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors">
                        {vehicle.model}
                      </h3>
                      <span className="text-slate-400 text-sm">{vehicle.year}</span>
                    </div>
                    
                    <div className="text-slate-400 text-sm mb-4">
                      {vehicle.brand} • {vehicle.color}
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-bold text-white">
                        R$ {vehicle.price.toLocaleString('pt-BR')}
                      </span>
                      <button className="text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-white transition-colors">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </CardTilt>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <DataPlaceholder 
          type="empty"
          title="Nenhum veículo encontrado"
          description="O estoque está vazio no momento. Volte em breve para novidades!"
        />
      )}
    </section>
  );
};
