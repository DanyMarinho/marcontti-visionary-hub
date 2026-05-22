import React from 'react';
import { useAppStore } from '@/store';
import { 
  Users, 
  UserCheck, 
  Target, 
  ShoppingCart, 
  TrendingUp, 
  Bike, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Users,
  UserCheck,
  Target,
  ShoppingCart,
  TrendingUp,
  Bike,
  Sparkles,
};

export const MetricCards: React.FC = () => {
  const { metrics } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.filter(m => !m.id.startsWith('m_')).slice(0, 4).map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} delay={index * 0.1} />
        ))}
      </div>
      
      {/* Novas métricas de estoque em tempo real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.filter(m => m.id.startsWith('m_')).map((metric, index) => (
          <MetricCard 
            key={metric.id} 
            metric={metric} 
            delay={(index + 4) * 0.1} 
            animatedBorder={metric.id === 'm_availability'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.filter(m => !m.id.startsWith('m_')).slice(4, 7).map((metric, index) => (
          <MetricCard 
            key={metric.id} 
            metric={metric} 
            delay={(index + 7) * 0.1} 
            animatedBorder={metric.id === 'm5'} // ROI card has AnimatedBorder
          />
        ))}
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: any;
  delay: number;
  animatedBorder?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, delay, animatedBorder }) => {
  const Icon = iconMap[metric.icon] || TrendingUp;
  const isPositive = metric.trend === 'up';

  return (
    <GlassCard 
      animatedBorder={animatedBorder}
      className="p-5 flex flex-col justify-between min-h-[140px]"
      hover
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/5 relative group">
          <Icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse -z-10" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.8, duration: 0.5 }}
          className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
          {metric.variation}{metric.variationType === 'pp' ? 'pp' : '%'}
        </motion.div>
      </div>

      <div>
        <p className="text-secondary text-xs font-medium mb-1 uppercase tracking-wider">{metric.label}</p>
        <div className="flex items-baseline gap-1">
          <AnimatedCounter 
            value={metric.value} 
            prefix={metric.format === 'currency' ? 'R$ ' : ''}
            suffix={metric.format === 'percentage' ? '%' : ''}
            decimals={metric.format === 'percentage' ? 1 : 0}
            className="text-2xl font-bold text-white"
          />
        </div>
      </div>
    </GlassCard>
  );
};
