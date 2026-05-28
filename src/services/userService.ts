import { supabase } from "@/integrations/supabase/client";
import { User, Role } from "../types";

export const userService = {
  async getAll(tenantId?: string) {
    let query = supabase.from('users').select('*').order('full_name');
    if (tenantId && tenantId !== 'all') {
      query = query.eq('tenant_id', tenantId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as User[];
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    // In a real app, this would be an Edge Function call to handle supabase.auth.admin
    // For now, we'll insert into the public.users table (which is our profiles table)
    // Note: In a production app, the user would be created in auth.users first.
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async inviteVendor(email: string, fullName: string, tenantId: string, storeId: string) {
    console.log(`Inviting ${fullName} (${email}) to tenant ${tenantId}...`);
    // Mocking the invite process for demonstration
    // In production, use: await supabase.functions.invoke('admin-invite', { body: { email, fullName, tenantId, storeId } })
    return { success: true };
  },

  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async deactivateVendor(userId: string) {
    // Reassign logic would go here: reassign pipeline cards to shop manager
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);
    if (error) throw error;
  }
};
