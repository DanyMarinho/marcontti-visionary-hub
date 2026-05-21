import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Bike } from 'lucide-react';
import { Vehicle, VehicleCategory, VehicleStatus } from '@/types/vehicle';
import { useAppStore } from '@/store';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null; // null = new
}

const CATEGORIES: VehicleCategory[] = [
  'Scooter Premium', 'Scooter Urbana', 'Naked/Street', 'Street Sport',
  'Naked Sport', 'Naked Premium', 'Adventure', 'Custom', 'Trail', 'Touring', 'Outro',
];

const FUEL_TYPES = ['Gasolina', 'Flex', 'Elétrica'];

const empty: Omit<Vehicle, 'id'> = {
  model: '', brand: '', year: new Date().getFullYear(), price: 0,
  purchase_price: 0, category: 'Naked/Street', color: '', mileage: 0,
  imageUrl: '', images: [], status: 'available', highlights: [],
  description: '', plate: '', chassis: '', engine_cc: 0, fuel_type: 'Gasolina',
};

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { addVehicle, updateVehicle } = useAppStore();
  const [form, setForm] = useState<Omit<Vehicle, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(vehicle);

  useEffect(() => {
    if (vehicle) setForm({ ...empty, ...vehicle });
    else setForm(empty);
  }, [vehicle, isOpen]);

  const set = (key: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (isEdit && vehicle) {
      await updateVehicle(vehicle.id, form);
    } else {
      await addVehicle(form);
    }
    setSaving(false);
    onClose();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all";
  const labelClass = "block text-xs text-slate-400 mb-1.5 font-medium";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-card p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-blue-400" />
                {isEdit ? 'Editar Moto' : 'Cadastrar Moto'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identificação */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Marca *</label>
                  <input required className={inputClass} placeholder="Honda, Yamaha..." value={form.brand} onChange={e => set('brand', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Modelo *</label>
                  <input required className={inputClass} placeholder="CB 300F, PCX 160..." value={form.model} onChange={e => set('model', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Ano *</label>
                  <input required type="number" min="1990" max="2030" className={inputClass} value={form.year} onChange={e => set('year', Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>Cor *</label>
                  <input required className={inputClass} placeholder="Preto Fosco..." value={form.color} onChange={e => set('color', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Km rodados</label>
                  <input type="number" min="0" className={inputClass} placeholder="0" value={form.mileage || ''} onChange={e => set('mileage', Number(e.target.value))} />
                </div>
              </div>

              {/* Categoria e Motor */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Categoria *</label>
                  <select required className={inputClass} value={form.category} onChange={e => set('category', e.target.value as VehicleCategory)}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Motor (cc)</label>
                  <input type="number" min="0" className={inputClass} placeholder="300" value={form.engine_cc || ''} onChange={e => set('engine_cc', Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>Combustível</label>
                  <select className={inputClass} value={form.fuel_type || 'Gasolina'} onChange={e => set('fuel_type', e.target.value)}>
                    {FUEL_TYPES.map(f => <option key={f} value={f} className="bg-[#0a0a0f]">{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Documentação */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Placa</label>
                  <input className={inputClass} placeholder="ABC-1234" value={form.plate || ''} onChange={e => set('plate', e.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className={labelClass}>Chassi</label>
                  <input className={inputClass} placeholder="9C2..." value={form.chassis || ''} onChange={e => set('chassis', e.target.value.toUpperCase())} />
                </div>
              </div>

              {/* Preços */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preço de Venda (R$) *</label>
                  <input required type="number" min="0" step="100" className={inputClass} placeholder="0" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>Preço de Compra (R$)</label>
                  <input type="number" min="0" step="100" className={inputClass} placeholder="0" value={form.purchase_price || ''} onChange={e => set('purchase_price', Number(e.target.value))} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {(['available', 'reserved', 'sold'] as VehicleStatus[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('status', s)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        form.status === s
                          ? s === 'available' ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                          : s === 'reserved' ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                          : 'bg-red-500/20 border border-red-500/50 text-red-400'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {s === 'available' ? 'Disponível' : s === 'reserved' ? 'Reservada' : 'Vendida'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className={labelClass}>Descrição / Observações</label>
                <textarea
                  rows={3}
                  className={inputClass + ' resize-none'}
                  placeholder="Revisões em dia, único dono, IPVA pago..."
                  value={form.description || ''}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              {/* URL da imagem */}
              <div>
                <label className={labelClass}>URL da Foto Principal</label>
                <input className={inputClass} placeholder="https://..." value={form.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)} />
              </div>

              {/* Destaques */}
              <div>
                <label className={labelClass}>Destaques (separados por vírgula)</label>
                <input
                  className={inputClass}
                  placeholder="ABS, Freio a disco, Painel digital..."
                  value={(form.highlights || []).join(', ')}
                  onChange={e => set('highlights', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Moto'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleFormModal;
