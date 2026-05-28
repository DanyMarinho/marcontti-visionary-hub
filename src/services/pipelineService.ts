import { supabase } from "@/integrations/supabase/client";
import { PipelineStage } from "../types";

export const pipelineService = {
  async getStages(tenantId: string) {
    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('position');
    
    if (error) throw error;
    return data as PipelineStage[];
  },

  async createDefaultStages(tenantId: string) {
    const defaultStages = [
      { tenant_id: tenantId, stage_key: 'prospeccao', label: '1-Prospecção', position: 1 },
      { tenant_id: tenantId, stage_key: 'qualificacao', label: '2-Qualificação', position: 2 },
      { tenant_id: tenantId, stage_key: 'apresentacao', label: '3-Apresentação', position: 3 },
      { tenant_id: tenantId, stage_key: 'proposta', label: '4-Proposta', position: 4 },
      { tenant_id: tenantId, stage_key: 'negociacao', label: '5-Negociação', position: 5 },
      { tenant_id: tenantId, stage_key: 'fechamento', label: '6-Fechamento', position: 6 },
      { tenant_id: tenantId, stage_key: 'pos_venda', label: '7-Pós-venda', position: 7 },
    ];

    const { error } = await supabase
      .from('pipeline_stages')
      .insert(defaultStages);
    
    if (error) throw error;
  }
};
