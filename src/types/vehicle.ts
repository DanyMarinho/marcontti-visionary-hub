export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  purchase_price?: number;
  category: VehicleCategory;
  color: string;
  mileage?: number;
  imageUrl: string;
  images?: string[];
  status: VehicleStatus;
  highlights?: string[];
  description?: string;
  plate?: string;
  chassis?: string;
  engine_cc?: number;
  fuel_type?: string;
  created_at?: string;
  updated_at?: string;
  sold_at?: string;
  sold_price?: number;
  sold_to?: string; // lead id
  // legacy
  available?: boolean;
}

export type VehicleStatus = 'available' | 'reserved' | 'sold';

export type VehicleCategory = 
  | 'Scooter Premium' 
  | 'Scooter Urbana' 
  | 'Naked/Street' 
  | 'Street Sport' 
  | 'Naked Sport' 
  | 'Naked Premium' 
  | 'Adventure'
  | 'Custom'
  | 'Trail'
  | 'Touring'
  | 'Outro';
