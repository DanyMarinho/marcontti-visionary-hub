export interface Vehicle {
  id: string;
  model: string;
  brand: 'Honda' | 'Yamaha';
  year: number;
  price: number;
  category: VehicleCategory;
  color: string;
  mileage?: number;
  imageUrl: string;
  available: boolean;
  highlights?: string[];
}

export type VehicleCategory = 
  | 'Scooter Premium' 
  | 'Scooter Urbana' 
  | 'Naked/Street' 
  | 'Street Sport' 
  | 'Naked Sport' 
  | 'Naked Premium' 
  | 'Adventure';
