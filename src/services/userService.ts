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
    // Invite the user via Auth (creates auth.users row + sends email).
    // The handle_new_user trigger inserts into public.users, but we
    // still upsert here to ensure tenant_id/store_id/role are applied.
    const { data: inv, error: invErr } = await supabase.functions.invoke('invite-user', {
      body: {
        email: user.email,
        full_name: user.full_name,
        tenant_id: user.tenant_id,
        store_id: user.store_id,
        role: user.role,
      },
    });
    if (invErr) throw invErr;

    const userId = (inv as any)?.user?.id ?? (inv as any)?.id;
    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          tenant_id: user.tenant_id,
          store_id: user.store_id ?? null,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_active: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data as unknown as User;
    }
    return inv as unknown as User;
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
    const { error } = await supabase
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },
};
