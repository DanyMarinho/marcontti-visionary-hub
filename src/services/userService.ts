import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  async getAll(tenantId?: string): Promise<User[]> {
    let q = supabase.from('users').select('*').order('created_at', { ascending: false });
    if (tenantId && tenantId !== 'all') q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as unknown as User[];
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<User> {
    // Single server-side call: invites in auth + upserts public.users atomically
    // (the edge function rolls back the auth user if the public row fails).
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: {
        email: user.email,
        full_name: user.full_name,
        tenant_id: user.tenant_id,
        store_id: user.store_id ?? null,
        role: user.role,
      },
    });
    if (error) throw error;
    const row = (data as any)?.user ?? data;
    if (!row?.id) throw new Error('invite-user: invalid response');
    return row as User;
  },

  async inviteVendor(email: string, fullName: string, tenantId: string, storeId: string) {
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: {
        email,
        full_name: fullName,
        tenant_id: tenantId,
        store_id: storeId,
        role: 'vendedor',
      },
    });
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as User;
  },

  async deactivateVendor(userId: string): Promise<void> {
    // Soft delete + global session revocation in auth.users
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { user_id: userId, hard: false },
    });
    if (error) throw error;
  },

  async deleteVendor(userId: string): Promise<void> {
    // Hard delete (auth.users + public.users) with session revocation
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { user_id: userId, hard: true },
    });
    if (error) throw error;
  },
};
