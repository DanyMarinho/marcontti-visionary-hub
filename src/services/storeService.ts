import { Store } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const storeService = {
  async getAll(tenantId?: string): Promise<Store[]> {
    let q = supabase
      .from('stores')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });
    if (tenantId && tenantId !== 'all') q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as unknown as Store[];
  },

  async create(store: Omit<Store, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .insert({ ...store, is_active: true } as any)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Store;
  },

  async update(id: string, updates: Partial<Store>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Store;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('stores')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
