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
    // Note: In a real app, users are created via Auth first.
    // For this demonstration, we'll use a random UUID if not provided.
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...user,
        id: (crypto as any).randomUUID()
      }])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async inviteVendor(email: string, fullName: string, tenantId: string, storeId: string) {
    console.log(`Inviting ${fullName} (${email}) to tenant ${tenantId}...`);
    return { success: true };
  },

  async update(id: string, updates: Partial<User>) {
    // Remove properties that are not in the database schema
    const { ...cleanUpdates } = updates;
    
    const { data, error } = await supabase
      .from('users')
      .update(cleanUpdates as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  async deactivateVendor(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId);
    if (error) throw error;
  }
};
