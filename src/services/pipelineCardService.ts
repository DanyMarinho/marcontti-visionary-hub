import { supabase } from "@/integrations/supabase/client";
import { PipelineCard } from "../types";

export const pipelineService = {
  async getCards(tenantId: string, filters: any = {}) {
    let query = supabase
      .from('pipeline_cards')
      .select('*, client:clients(*), seller:users(*)')
      .eq('tenant_id', tenantId)
      .eq('is_archived', false);

    if (filters.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as any[];
  },

  async createCard(card: any) {
    const { data, error } = await supabase
      .from('pipeline_cards')
      .insert([card])
      .select()
      .single();
    
    if (error) throw error;

    // Log creation
    await this.logHistory({
      card_id: data.id,
      tenant_id: card.tenant_id,
      user_id: card.seller_id,
      event_type: 'created',
      to_stage: card.stage_key,
      description: 'Card criado'
    });

    return data;
  },

  async moveCard(cardId: string, tenantId: string, userId: string, fromStage: string, toStage: string) {
    const { data, error } = await supabase
      .from('pipeline_cards')
      .update({ 
        stage_key: toStage,
        closed_at: toStage === 'fechamento' || toStage === 'pos_venda' ? new Date().toISOString() : null
      })
      .eq('id', cardId)
      .select()
      .single();
    
    if (error) throw error;

    await this.logHistory({
      card_id: cardId,
      tenant_id: tenantId,
      user_id: userId,
      event_type: 'stage_change',
      from_stage: fromStage,
      to_stage: toStage,
      description: `Movido de ${fromStage} para ${toStage}`
    });

    return data;
  },

  async archiveCard(cardId: string, tenantId: string, userId: string, reason: string) {
    const { data, error } = await supabase
      .from('pipeline_cards')
      .update({ 
        is_archived: true,
        lost_reason: reason
      })
      .eq('id', cardId)
      .select()
      .single();
    
    if (error) throw error;

    await this.logHistory({
      card_id: cardId,
      tenant_id: tenantId,
      user_id: userId,
      event_type: 'archived',
      description: `Arquivado: ${reason}`
    });

    return data;
  },

  async logHistory(history: any) {
    const { error } = await supabase
      .from('card_history')
      .insert([history]);
    if (error) console.error('Error logging history:', error);
  },

  async getCardHistory(cardId: string) {
    const { data, error } = await supabase
      .from('card_history')
      .select('*, user:users(full_name)')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
