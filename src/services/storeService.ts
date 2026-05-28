import { supabase } from "@/integrations/supabase/client";
import { Store } from "../types";

export const storeService = {
  async getAll(tenantId?: string) {
    let query = supabase.from('stores').select('*').order('name');
    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Store[];
  },

  async create(store: Omit<Store, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const { data, error } = await supabase
      .from('stores')
      .insert([store])
      .select()
      .single();
    if (error) throw error;
    return data as Store;
  },

  async update(id: string, updates: Partial<Store>) {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Store;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
