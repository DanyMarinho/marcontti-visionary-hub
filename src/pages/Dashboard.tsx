import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { Upload } from 'lucide-react';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { LeadsLineChart } from '@/components/dashboard/LeadsLineChart';
import { SalesBarChart } from '@/components/dashboard/SalesBarChart';
import { RevenueDonutChart } from '@/components/dashboard/RevenueDonutChart';
import { OriginBarChart } from '@/components/dashboard/OriginBarChart';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { AdImportModal } from '@/components/shared/AdImportModal';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { pageTransition } from '@/lib/animations';

const Dashboard: React.FC = () => {
  const [importOpen, setImportOpen] = useState(false);
  const { leads, vehicles, recalculateFromLeads, recalculateFromVehicles } = useAppStore();

  useEffect(() => {
    recalculateFromLeads(leads);
    recalculateFromVehicles(vehicles);
  }, [leads, vehicles]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Empresarial</h1>
          <p className="text-secondary text-sm">Visão geral de performance e métricas de negócio</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
          >
            <Upload className="w-4 h-4" />
            Importar Anúncios
          </button>
          <PeriodSelector />
        </div>
      </div>

      <AdImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <MetricCards />
        </div>
        <div className="xl:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsLineChart />
        <SalesBarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueDonutChart />
        <OriginBarChart />
      </div>

      <div className="w-full">
        <FinancialSummary />
      </div>
    </motion.div>
  );
};

export default Dashboard;
