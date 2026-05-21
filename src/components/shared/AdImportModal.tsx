import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, CheckCircle, AlertTriangle, FileText,
  TrendingUp, Users, MousePointer, DollarSign, Eye, Zap
} from 'lucide-react';
import { importFromFile, ImportResult, AdPlatform } from '@/lib/adImporter';
import { useAppStore } from '@/store';

interface AdImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const platformLabels: Record<AdPlatform, string> = {
  meta: 'Meta Ads (Facebook/Instagram)',
  google: 'Google Ads',
  auto: 'Detectado automaticamente',
};

const platformColors: Record<AdPlatform, string> = {
  meta: 'from-blue-600 to-indigo-600',
  google: 'from-red-500 to-yellow-500',
  auto: 'from-purple-600 to-blue-600',
};

export const AdImportModal: React.FC<AdImportModalProps> = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [platformHint, setPlatformHint] = useState<AdPlatform>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addLead, incrementMetric } = useAppStore();

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setResult({
        leads: [], metrics: { totalLeads: 0, totalClicks: 0, totalImpressions: 0, totalSpend: 0, totalConversions: 0, ctr: 0, cpc: 0, cpl: 0 },
        errors: ['Formato não suportado. Use arquivos CSV exportados do Meta Ads ou Google Ads.'],
        platform: 'auto', totalRows: 0, importedRows: 0,
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    const importResult = await importFromFile(file, platformHint);
    setResult(importResult);
    setIsProcessing(false);
  }, [platformHint]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (!result || result.leads.length === 0) return;

    result.leads.forEach(lead => addLead(lead));
    incrementMetric('m1', result.leads.length);

    onClose();
    setResult(null);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('pt-BR').format(value);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl glass-card p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Importar Dados de Anúncios
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Importe CSV do Meta Ads ou Google Ads para atualizar o CRM e Dashboard
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector */}
            <div className="mb-4">
              <label className="text-sm text-slate-400 mb-2 block">Plataforma (opcional)</label>
              <div className="flex gap-2">
                {(['auto', 'meta', 'google'] as AdPlatform[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatformHint(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      platformHint === p
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p === 'auto' ? 'Auto-detectar' : p === 'meta' ? 'Meta Ads' : 'Google Ads'}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Zone */}
            {!result && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                />
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400">Processando arquivo...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Arraste o arquivo CSV aqui</p>
                      <p className="text-slate-400 text-sm mt-1">ou clique para selecionar</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      Suporta exportações do Meta Ads e Google Ads (.csv)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                {/* Platform Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${platformColors[result.platform]} text-white text-sm font-medium`}>
                  <Zap className="w-3.5 h-3.5" />
                  {platformLabels[result.platform]}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Users, label: 'Leads', value: formatNumber(result.metrics.totalLeads), color: 'text-blue-400' },
                    { icon: MousePointer, label: 'Cliques', value: formatNumber(result.metrics.totalClicks), color: 'text-cyan-400' },
                    { icon: Eye, label: 'Impressões', value: formatNumber(result.metrics.totalImpressions), color: 'text-purple-400' },
                    { icon: DollarSign, label: 'Investido', value: formatCurrency(result.metrics.totalSpend), color: 'text-green-400' },
                    { icon: TrendingUp, label: 'CTR', value: `${result.metrics.ctr.toFixed(2)}%`, color: 'text-yellow-400' },
                    { icon: DollarSign, label: 'CPC', value: formatCurrency(result.metrics.cpc), color: 'text-orange-400' },
                    { icon: DollarSign, label: 'CPL', value: formatCurrency(result.metrics.cpl), color: 'text-red-400' },
                    { icon: CheckCircle, label: 'Conversões', value: formatNumber(result.metrics.totalConversions), color: 'text-emerald-400' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="glass-card p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                        <span className="text-xs text-slate-400">{label}</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Import Summary */}
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    {result.importedRows > 0
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    }
                    <span className="text-white font-medium text-sm">
                      {result.importedRows} de {result.totalRows} linhas importadas como leads
                    </span>
                  </div>
                  {result.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {result.errors.slice(0, 3).map((err, i) => (
                        <p key={i} className="text-xs text-yellow-400/80">{err}</p>
                      ))}
                      {result.errors.length > 3 && (
                        <p className="text-xs text-slate-500">+{result.errors.length - 3} outros avisos</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    Trocar arquivo
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={result.importedRows === 0}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Importar {result.importedRows} leads para o CRM
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!result && !isProcessing && (
              <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/5">
                <p className="text-xs text-slate-400 font-medium mb-2">Como exportar:</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <p><span className="text-blue-400">Meta Ads:</span> Gerenciador de Anúncios → Exportar → CSV</p>
                  <p><span className="text-red-400">Google Ads:</span> Relatórios → Baixar → CSV</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdImportModal;
