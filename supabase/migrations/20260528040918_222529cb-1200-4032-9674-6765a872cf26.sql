-- Add missing RLS policies
CREATE POLICY client_tags_all ON public.client_tags 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE public.clients.id = public.client_tags.client_id 
    AND public.clients.tenant_id = public.user_tenant_id()
  )
);

CREATE POLICY pipeline_stages_all ON public.pipeline_stages 
FOR ALL USING (tenant_id = public.user_tenant_id() OR public.user_role() = 'admin');

CREATE POLICY whatsapp_instances_all ON public.whatsapp_instances 
FOR ALL USING (tenant_id = public.user_tenant_id() OR public.user_role() = 'admin');

CREATE POLICY agent_ia_configs_all ON public.agent_ia_configs 
FOR ALL USING (tenant_id = public.user_tenant_id() OR public.user_role() = 'admin');

-- Set search_path for functions
ALTER FUNCTION public.user_tenant_id() SET search_path = public;
ALTER FUNCTION public.user_role() SET search_path = public;
