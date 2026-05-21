import React from 'react';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';

const metrics = [
  { label: 'Leads/mês', value: 127, icon: Users, suffix: '', animatedBorder: true },
  { label: 'Vendas/mês', value: 18, icon: ShoppingCart, suffix: '', animatedBorder: true },
  { label: 'k Faturamento', value: 510, icon: DollarSign, prefix: 'R$', suffix: '' },
  { label: 'ROI', value: 280, icon: TrendingUp, suffix: '%' },
];

export const MetricsSection = () => {
  return (
    <section className="px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <div className="relative h-full">
              {metric.animatedBorder && <AnimatedBorder />}
              <GlassCard className="h-full flex flex-col items-center justify-center p-8 text-center" glow={index < 2 ? 'blue' : undefined}>
                <div className="p-3 rounded-2xl bg-white/5 mb-4 text-blue-400">
                  <metric.icon size={24} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {metric.prefix && <span className="text-lg md:text-xl mr-1 text-slate-400">{metric.prefix}</span>}
                  <AnimatedCounter value={metric.value} duration={2} />
                  {metric.suffix && <span className="text-lg md:text-xl ml-1 text-slate-400">{metric.suffix}</span>}
                </div>
                <p className="text-slate-400 text-sm md:text-base font-medium">
                  {metric.label}
                </p>
              </GlassCard>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
