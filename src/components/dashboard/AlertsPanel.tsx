import React from 'react';
import { useAppStore } from '@/store';
import { GlassCard } from '@/components/shared/GlassCard';
import { AlertTriangle, Bell, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const AlertsPanel: React.FC = () => {
  const { vehicles } = useAppStore();
  
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const lowStock = availableVehicles.length <= 3;
  
  // Categorize by brand to find "low stock" per brand
  const brandStock: Record<string, number> = {};
  availableVehicles.forEach(v => {
    brandStock[v.brand] = (brandStock[v.brand] || 0) + 1;
  });
  
  const alerts = [];
  
  if (lowStock) {
    alerts.push({
      id: 'low-total',
      type: 'warning',
      message: `Estoque total baixo: apenas ${availableVehicles.length} veículos disponíveis.`,
      icon: AlertTriangle
    });
  }
  
  Object.entries(brandStock).forEach(([brand, count]) => {
    if (count === 1) {
      alerts.push({
        id: `low-${brand}`,
        type: 'info',
        message: `Última unidade disponível da marca ${brand}.`,
        icon: Info
      });
    }
  });

  if (alerts.length === 0) return null;

  return (
    <GlassCard className="p-4 border-yellow-500/20 bg-yellow-500/5">
      <div className="flex items-center gap-2 mb-4 text-yellow-400">
        <Bell className="w-5 h-5" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Alertas de Estoque</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <alert.icon className="w-4 h-4 mt-0.5 text-yellow-500" />
            <p className="text-sm text-slate-300">{alert.message}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};
