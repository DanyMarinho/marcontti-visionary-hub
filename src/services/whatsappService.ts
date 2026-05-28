import { supabase } from "@/integrations/supabase/client";
import { WhatsAppInstance, WhatsAppMessage } from "../types";

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

  async getConversations(tenantId: string) {
    // This is a simplified version. In a real app, we might want a 'conversations' view or table.
    // Here we'll get the last message per client for the tenant.
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*, client:clients(*)')
      .eq('tenant_id', tenantId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    // Simple deduplication by client_id to get "conversations"
    const uniqueClients = new Set();
    return (data || []).filter(msg => {
      if (uniqueClients.has(msg.client_id)) return false;
      uniqueClients.add(msg.client_id);
      return true;
    });
  }
};
