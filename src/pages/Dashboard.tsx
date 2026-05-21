import React from 'react';
import { motion } from 'framer-motion';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { LeadsLineChart } from '@/components/dashboard/LeadsLineChart';
import { SalesBarChart } from '@/components/dashboard/SalesBarChart';
import { RevenueDonutChart } from '@/components/dashboard/RevenueDonutChart';
import { OriginBarChart } from '@/components/dashboard/OriginBarChart';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { pageTransition } from '@/lib/animations';

const Dashboard: React.FC = () => {
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
        <PeriodSelector />
      </div>

      <MetricCards />

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
