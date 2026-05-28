
-- Notifications: scope to user + tenant
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "notifications_select_own"
ON public.notifications FOR SELECT
USING (tenant_id = public.user_tenant_id() AND user_id = auth.uid());

CREATE POLICY "notifications_update_own"
ON public.notifications FOR UPDATE
USING (tenant_id = public.user_tenant_id() AND user_id = auth.uid())
WITH CHECK (tenant_id = public.user_tenant_id() AND user_id = auth.uid());

CREATE POLICY "notifications_insert_own_tenant"
ON public.notifications FOR INSERT
WITH CHECK (tenant_id = public.user_tenant_id());

-- WhatsApp conversations: scope to tenant
DROP POLICY IF EXISTS "Users can view their own tenant's conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Users can update their own tenant's conversations" ON public.whatsapp_conversations;

CREATE POLICY "wa_conversations_select"
ON public.whatsapp_conversations FOR SELECT
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "wa_conversations_update"
ON public.whatsapp_conversations FOR UPDATE
USING (tenant_id = public.user_tenant_id())
WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY "wa_conversations_insert"
ON public.whatsapp_conversations FOR INSERT
WITH CHECK (tenant_id = public.user_tenant_id());

-- Reactivation logs: scope to tenant
DROP POLICY IF EXISTS "Users can view reactivation logs" ON public.reactivation_logs;

CREATE POLICY "reactivation_logs_select"
ON public.reactivation_logs FOR SELECT
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "reactivation_logs_insert"
ON public.reactivation_logs FOR INSERT
WITH CHECK (tenant_id = public.user_tenant_id());

-- WhatsApp instances: restrict SELECT to admins (API keys)
DROP POLICY IF EXISTS "whatsapp_instances_all" ON public.whatsapp_instances;

CREATE POLICY "whatsapp_instances_select_admin"
ON public.whatsapp_instances FOR SELECT
USING (public.user_role() = 'admin' AND (tenant_id = public.user_tenant_id() OR public.user_role() = 'admin'));

CREATE POLICY "whatsapp_instances_modify_admin"
ON public.whatsapp_instances FOR ALL
USING (public.user_role() = 'admin')
WITH CHECK (public.user_role() = 'admin');

-- Users: prevent role self-escalation
DROP POLICY IF EXISTS "users_all" ON public.users;

CREATE POLICY "users_select"
ON public.users FOR SELECT
USING (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id());

CREATE POLICY "users_insert_admin"
ON public.users FOR INSERT
WITH CHECK (public.user_role() = 'admin' AND tenant_id = public.user_tenant_id());

CREATE POLICY "users_delete_admin"
ON public.users FOR DELETE
USING (public.user_role() = 'admin' AND tenant_id = public.user_tenant_id());

-- Admins can update any user in their tenant (including role)
CREATE POLICY "users_update_admin"
ON public.users FOR UPDATE
USING (public.user_role() = 'admin' AND tenant_id = public.user_tenant_id())
WITH CHECK (public.user_role() = 'admin' AND tenant_id = public.user_tenant_id());

-- Non-admin users can only update their own row and CANNOT change their role
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.user_role() <> 'admin' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Only admins can change user role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_self_change_trg ON public.users;
CREATE TRIGGER prevent_role_self_change_trg
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_change();

CREATE POLICY "users_update_self"
ON public.users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND tenant_id = public.user_tenant_id());
