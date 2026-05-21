import { StateCreator } from 'zustand';
import { Vehicle, VehicleStatus } from '@/types/vehicle';
import { mockVehicles } from '@/data/mockVehicles';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AppStore } from './index';

export interface VehicleSlice {
  vehicles: Vehicle[];
  vehiclesLoading: boolean;
  vehiclesError: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setVehicleStatus: (id: string, status: VehicleStatus, extra?: { sold_price?: number; sold_to?: string }) => Promise<void>;
}

export const createVehicleSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  VehicleSlice
> = (set, get) => ({
  vehicles: mockVehicles,
  vehiclesLoading: false,
  vehiclesError: null,

  fetchVehicles: async () => {
    if (!isSupabaseConfigured()) return; // use mock data

    set((state) => { state.vehiclesLoading = true; state.vehiclesError = null; });

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      set((state) => { state.vehiclesError = error.message; state.vehiclesLoading = false; });
      return;
    }

    set((state) => {
      state.vehicles = (data || []).map(dbToVehicle);
      state.vehiclesLoading = false;
    });
  },

  addVehicle: async (vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: crypto.randomUUID(),
      status: vehicle.status || 'available',
    };

    // Optimistic update
    set((state) => { state.vehicles.unshift(newVehicle); });

    if (!isSupabaseConfigured()) return;

    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleToDb(newVehicle))
      .select()
      .single();

    if (error) {
      // Rollback
      set((state) => { state.vehicles = state.vehicles.filter(v => v.id !== newVehicle.id); });
      set((state) => { state.vehiclesError = error.message; });
      return;
    }

    // Replace with server version
    set((state) => {
      const idx = state.vehicles.findIndex(v => v.id === newVehicle.id);
      if (idx !== -1) state.vehicles[idx] = dbToVehicle(data);
    });
  },

  updateVehicle: async (id, updates) => {
    set((state) => {
      const idx = state.vehicles.findIndex(v => v.id === id);
      if (idx !== -1) state.vehicles[idx] = { ...state.vehicles[idx], ...updates };
    });

    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('vehicles')
      .update(vehicleToDb(updates as Vehicle))
      .eq('id', id);

    if (error) set((state) => { state.vehiclesError = error.message; });
  },

  deleteVehicle: async (id) => {
    const prev = get().vehicles;
    set((state) => { state.vehicles = state.vehicles.filter(v => v.id !== id); });

    if (!isSupabaseConfigured()) return;

    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) {
      set((state) => { state.vehicles = prev; state.vehiclesError = error.message; });
    }
  },

  setVehicleStatus: async (id, status, extra) => {
    const updates: Partial<Vehicle> = {
      status,
      ...(status === 'sold' ? {
        sold_at: new Date().toISOString(),
        sold_price: extra?.sold_price,
        sold_to: extra?.sold_to,
      } : {}),
    };

    set((state) => {
      const idx = state.vehicles.findIndex(v => v.id === id);
      if (idx !== -1) state.vehicles[idx] = { ...state.vehicles[idx], ...updates };
    });

    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from('vehicles')
      .update(vehicleToDb(updates as Vehicle))
      .eq('id', id);

    if (error) set((state) => { state.vehiclesError = error.message; });
  },
});

// DB <-> App mappers
function dbToVehicle(row: any): Vehicle {
  return {
    id: row.id,
    model: row.model,
    brand: row.brand,
    year: row.year,
    price: row.price,
    purchase_price: row.purchase_price,
    category: row.category,
    color: row.color,
    mileage: row.mileage,
    imageUrl: row.image_url || '',
    images: row.images || [],
    status: row.status || 'available',
    available: row.status === 'available',
    highlights: row.highlights || [],
    description: row.description,
    plate: row.plate,
    chassis: row.chassis,
    engine_cc: row.engine_cc,
    fuel_type: row.fuel_type,
    created_at: row.created_at,
    updated_at: row.updated_at,
    sold_at: row.sold_at,
    sold_price: row.sold_price,
    sold_to: row.sold_to,
  };
}

function vehicleToDb(v: Partial<Vehicle>): any {
  const obj: any = {};
  if (v.model !== undefined) obj.model = v.model;
  if (v.brand !== undefined) obj.brand = v.brand;
  if (v.year !== undefined) obj.year = v.year;
  if (v.price !== undefined) obj.price = v.price;
  if (v.purchase_price !== undefined) obj.purchase_price = v.purchase_price;
  if (v.category !== undefined) obj.category = v.category;
  if (v.color !== undefined) obj.color = v.color;
  if (v.mileage !== undefined) obj.mileage = v.mileage;
  if (v.imageUrl !== undefined) obj.image_url = v.imageUrl;
  if (v.images !== undefined) obj.images = v.images;
  if (v.status !== undefined) obj.status = v.status;
  if (v.highlights !== undefined) obj.highlights = v.highlights;
  if (v.description !== undefined) obj.description = v.description;
  if (v.plate !== undefined) obj.plate = v.plate;
  if (v.chassis !== undefined) obj.chassis = v.chassis;
  if (v.engine_cc !== undefined) obj.engine_cc = v.engine_cc;
  if (v.fuel_type !== undefined) obj.fuel_type = v.fuel_type;
  if (v.sold_at !== undefined) obj.sold_at = v.sold_at;
  if (v.sold_price !== undefined) obj.sold_price = v.sold_price;
  if (v.sold_to !== undefined) obj.sold_to = v.sold_to;
  return obj;
}
