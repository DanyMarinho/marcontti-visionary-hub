import { supabase } from "@/integrations/supabase/client";
import { Tenant, Niche } from "../types";

export const tenantService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Tenant[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Tenant;
  },

  async create(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenant])
      .select()
      .single();
    
    if (error) throw error;
    return data as Tenant;
  },

  async update(id: string, updates: Partial<Tenant>) {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tenant;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
