import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Bike, Edit2, Trash2,
  CheckCircle, Clock, XCircle, TrendingUp, DollarSign, Package
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { VehicleFormModal } from '@/components/inventory/VehicleFormModal';
import { pageTransition } from '@/lib/animations';

const statusConfig = {
  available: { label: 'Disponível', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
  reserved: { label: 'Reservada', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  sold: { label: 'Vendida', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
};

const Inventory: React.FC = () => {
  const { vehicles, fetchVehicles, deleteVehicle, setVehicleStatus } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchVehicles(); }, []);

  const filtered = vehicles.filter(v => {
    const matchSearch = !search || `${v.brand} ${v.model} ${v.color} ${v.plate || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    reserved: vehicles.filter(v => v.status === 'reserved').length,
    sold: vehicles.filter(v => v.status === 'sold').length,
    totalValue: vehicles.filter(v => v.status === 'available').reduce((s, v) => s + v.price, 0),
    soldRevenue: vehicles.filter(v => v.status === 'sold').reduce((s, v) => s + (v.sold_price || v.price), 0),
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const handleEdit = (v: Vehicle) => { setEditVehicle(v); setFormOpen(true); };
  const handleNew = () => { setEditVehicle(null); setFormOpen(true); };
  const handleDelete = async (id: string) => { await deleteVehicle(id); setDeleteConfirm(null); };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 max-w-7xl mx-auto p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Estoque</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie o inventário de motos</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Moto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Package, color: 'text-blue-400' },
          { label: 'Disponíveis', value: stats.available, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Reservadas', value: stats.reserved, icon: Clock, color: 'text-yellow-400' },
          { label: 'Vendidas', value: stats.sold, icon: XCircle, color: 'text-red-400' },
          { label: 'Valor em Estoque', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'text-cyan-400' },
          { label: 'Receita Vendas', value: formatCurrency(stats.soldRevenue), icon: TrendingUp, color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
            <p className="text-white font-bold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="Buscar por marca, modelo, placa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'reserved', 'sold'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {s === 'all' ? 'Todos' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Bike className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Nenhuma moto encontrada</p>
          <p className="text-slate-500 text-sm mt-1">Cadastre a primeira moto do estoque</p>
          <button onClick={handleNew} className="mt-4 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 text-sm hover:bg-blue-600/30 transition-all">
            Cadastrar agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(vehicle => {
            const sc = statusConfig[vehicle.status || 'available'];
            const StatusIcon = sc.icon;
            const margin = vehicle.purchase_price && vehicle.price
              ? vehicle.price - vehicle.purchase_price : null;

            return (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden group hover:shadow-glow-hover transition-all"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                  {vehicle.imageUrl ? (
                    <img src={vehicle.imageUrl} alt={vehicle.model} className="w-full h-full object-cover" />
                  ) : (
                    <Bike className="w-16 h-16 text-slate-600" />
                  )}
                  {/* Status badge */}
                  <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${sc.bg} ${sc.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {sc.label}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">{vehicle.brand} • {vehicle.year}</p>
                    <h3 className="text-white font-bold text-base leading-tight">{vehicle.model}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{vehicle.color} • {vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : '0 km'}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-bold text-lg">{formatCurrency(vehicle.price)}</p>
                      {margin !== null && (
                        <p className="text-xs text-green-400">Margem: {formatCurrency(margin)}</p>
                      )}
                    </div>
                    {vehicle.plate && (
                      <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-slate-400 font-mono">
                        {vehicle.plate}
                      </span>
                    )}
                  </div>

                  {/* Quick status change */}
                  <div className="flex gap-1">
                    {(['available', 'reserved', 'sold'] as VehicleStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setVehicleStatus(vehicle.id, s)}
                        className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                          vehicle.status === s
                            ? s === 'available' ? 'bg-green-500/20 text-green-400'
                            : s === 'reserved' ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                            : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                        }`}
                      >
                        {s === 'available' ? 'Disp.' : s === 'reserved' ? 'Res.' : 'Vend.'}
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(vehicle.id)}
                      className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative glass-card p-6 rounded-2xl max-w-sm w-full z-10">
            <h3 className="text-white font-bold mb-2">Remover moto?</h3>
            <p className="text-slate-400 text-sm mb-4">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all text-sm font-medium">Remover</button>
            </div>
          </div>
        </div>
      )}

      <VehicleFormModal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditVehicle(null); }} vehicle={editVehicle} />
    </motion.div>
  );
};

export default Inventory;
