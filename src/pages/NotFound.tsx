import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientButton } from '@/components/shared/GradientButton';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <GlassCard className="p-10 text-center border-white/10" hover={false}>
          <h1 className="text-8xl font-black mb-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Página não encontrada</h2>
          <p className="text-secondary mb-8">
            Ops! A página que você está procurando não existe ou foi movida para outro endereço.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/">
              <GradientButton className="w-full">
                <Home className="w-4 h-4 mr-2" /> Voltar para o Início
              </GradientButton>
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full py-2.5 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar Anterior
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NotFound;
