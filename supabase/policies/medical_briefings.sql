-- RLS policy for medical_briefings
CREATE POLICY medical_briefings_all ON public.medical_briefings
FOR ALL
USING (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id())
WITH CHECK (tenant_id = public.user_tenant_id());
