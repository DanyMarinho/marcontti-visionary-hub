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
    if (error) throw new Error(error.message || 'Erro ao convidar usuário');

    // invite-user retorna { success: true, user_id: "uuid" }
    const userId = (data as any)?.user_id;
    if (!userId) throw new Error('invite-user: resposta inválida — user_id ausente');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Usuário criado mas perfil não encontrado: ' + (profileError?.message || ''));
    }

    return profile as unknown as User;
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
