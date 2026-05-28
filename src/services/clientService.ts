import { supabase } from "@/integrations/supabase/client";
import { Client } from "../types";

export const clientService = {
  async getAll(tenantId: string, page = 1, pageSize = 10, search = '', filters: any = {}) {
    let query = supabase
      .from('clients')
      .select('*, tags(*)', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('full_name');

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query.range(from, to);
    
    if (error) throw error;
    return { data: data as (Client & { tags: any[] })[], count };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*, tags(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Client & { tags: any[] };
  },

  async checkDuplicatePhone(tenantId: string, phone: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('phone', phone)
      .is('deleted_at', null)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'last_interaction' | 'deleted_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  },

  async softDelete(id: string) {
    const { error } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Tags
  async listTenantTags(tenantId: string) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('tenant_id', tenantId);
    if (error) throw error;
    return data;
  },

  async addTagToClient(clientId: string, tagId: string) {
    const { error } = await supabase
      .from('client_tags')
      .insert([{ client_id: clientId, tag_id: tagId }]);
    if (error) throw error;
  },

  async removeTagFromClient(clientId: string, tagId: string) {
    const { error } = await supabase
      .from('client_tags')
      .delete()
      .eq('client_id', clientId)
      .eq('tag_id', tagId);
    if (error) throw error;
  },

  async createTag(tenantId: string, name: string) {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ tenant_id: tenantId, name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
