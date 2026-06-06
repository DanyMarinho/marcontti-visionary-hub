import { Tenant } from "../types";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_STAGES: { stage_key: string; label: string; position: number }[] = [
  { stage_key: 'prospeccao', label: 'Prospecção', position: 1 },
  { stage_key: 'qualificacao', label: 'Qualificação', position: 2 },
  { stage_key: 'apresentacao', label: 'Apresentação', position: 3 },
  { stage_key: 'proposta', label: 'Proposta', position: 4 },
  { stage_key: 'negociacao', label: 'Negociação', position: 5 },
  { stage_key: 'fechamento', label: 'Fechamento', position: 6 },
];

export const tenantService = {
  async getAll(): Promise<Tenant[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Tenant[];
  },

  async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as unknown as Tenant) ?? null;
  },

  async create(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .insert({
        ...tenant,
        is_active: true,
        status: (tenant as any).status ?? 'ativo',
        timezone: (tenant as any).timezone ?? 'America/Sao_Paulo',
      } as any)
      .select()
      .single();
    if (error) throw error;

    const newTenant = data as unknown as Tenant;

    // Create default pipeline stages
    const stages = DEFAULT_STAGES.map((s) => ({ ...s, tenant_id: newTenant.id }));
    const { error: stagesErr } = await supabase.from('pipeline_stages').insert(stages);
    if (stagesErr) console.error('Failed to seed pipeline_stages:', stagesErr);

    return newTenant;
  },

  async update(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as Tenant;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tenants')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};
