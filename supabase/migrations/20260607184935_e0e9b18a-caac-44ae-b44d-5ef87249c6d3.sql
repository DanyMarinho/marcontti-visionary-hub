DROP POLICY IF EXISTS "wa_conversations_select" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "wa_conversations_select_scoped" ON public.whatsapp_conversations;

CREATE POLICY "wa_conversations_select_scoped"
ON public.whatsapp_conversations FOR SELECT
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_role() IN ('admin', 'loja')
    OR assigned_to = auth.uid()
  )
);