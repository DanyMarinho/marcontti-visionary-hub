import React from 'react';
import { Droplets, Sparkles, Shield, Star, Palette, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

const services = [
  { title: 'Lavagem Premium', icon: Droplets, price: 150, description: 'Limpeza detalhada com produtos de alta performance e proteção básica.' },
  { title: 'Polimento Técnico', icon: Sparkles, price: 800, description: 'Correção de pintura para remoção de riscos superficiais e devolução do brilho.' },
  { title: 'Vitrificação Cerâmica', icon: Shield, price: 2500, description: 'Proteção de longo prazo com dureza 9H e repelência extrema.' },
  { title: 'Detailing Completo', icon: Star, price: 1800, description: 'Limpeza profunda de todos os componentes, motor, chassi e plásticos.' },
  { title: 'Personalização Visual', icon: Palette, price: 3000, description: 'Pintura de rodas, pinças, detalhes em black piano e customizações exclusivas.' },
  { title: 'Proteção PPF', icon: ShieldCheck, price: 4000, description: 'Película auto-regenerativa contra impactos de pedras e riscos.' },
];

export const ServicesGrid = () => {
  return (
    <section className="px-6 py-12">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Estética & Personalização</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Tratamentos de elite para manter sua máquina sempre com aspecto de nova e protegida contra as ações do tempo.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ScrollReveal key={index} delay={index * 100} variantsName="fadeInScale">
            <div className="relative group h-full">
              <AnimatedBorder />
              <GlassCard className="p-8 flex flex-col h-full" hover glow="purple">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
                  <service.icon size={28} className="text-purple-400 relative z-10" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 mb-6 flex-1 text-sm leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">A partir de</span>
                  <span className="text-xl font-bold text-white">R$ {service.price.toLocaleString('pt-BR')}</span>
                </div>
              </GlassCard>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
