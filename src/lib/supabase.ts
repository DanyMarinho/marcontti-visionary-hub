import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: check if Supabase is configured
export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          model: string;
          brand: string;
          year: number;
          price: number;
          purchase_price: number | null;
          category: string;
          color: string;
          mileage: number | null;
          image_url: string;
          images: string[] | null;
          status: 'available' | 'reserved' | 'sold';
          highlights: string[] | null;
          description: string | null;
          plate: string | null;
          chassis: string | null;
          engine_cc: number | null;
          fuel_type: string | null;
          created_at: string;
          updated_at: string;
          sold_at: string | null;
          sold_price: number | null;
          sold_to: string | null;
        };
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          vehicle_interest: string;
          service_interest: string | null;
          origin: string;
          stage: string;
          priority: string;
          score: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          lead_id: string;
          description: string;
          type: string;
          due_date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
    };
  };
};
