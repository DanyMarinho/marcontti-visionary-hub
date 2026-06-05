// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppInstance, WhatsAppMessage, WhatsAppConversation } from "../types";

export const whatsappService = {
  async getInstance(tenantId: string) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle();
    
    if (error) throw error;
    return data as WhatsAppInstance | null;
  },

  async upsertInstance(instance: Omit<WhatsAppInstance, 'id' | 'created_at' | 'updated_at' | 'status'>) {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .upsert([instance], { onConflict: 'tenant_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data as WhatsAppInstance;
  },

  async updateStatus(id: string, status: WhatsAppInstance['status'], phoneNumber?: string) {
    const { error } = await supabase
      .from('whatsapp_instances')
      .update({ status, phone_number: phoneNumber, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  },

  async getMessages(tenantId: string, clientId?: string) {
    let query = supabase
      .from('whatsapp_messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('timestamp', { ascending: true });
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WhatsAppMessage[];
  },

  async getConversations(tenantId: string, status?: string): Promise<WhatsAppConversation[]> {
    let query = supabase
      .from('whatsapp_conversations')
      .select('*, client:clients(*), assigned_user:users(*)')
      .eq('tenant_id', tenantId)
      .order('last_activity_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(conv => ({
      ...conv,
      content: conv.content || '' // Handle possible missing content if table is empty or differently structured
    })) as WhatsAppConversation[];
  },

  async updateConversation(id: string, updates: any) {
    const { data, error } = await supabase
      .from('whatsapp_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as WhatsAppConversation;
  },

  async getConversationByClient(tenantId: string, clientId: string) {
    const { data, error } = await supabase
      .from('whatsapp_conversations')
      .select('*, client:clients(*), assigned_user:users(*)')
      .eq('tenant_id', tenantId)
      .eq('client_id', clientId)
      .maybeSingle();
    
    if (error) throw error;
    return data as WhatsAppConversation | null;
  }
};