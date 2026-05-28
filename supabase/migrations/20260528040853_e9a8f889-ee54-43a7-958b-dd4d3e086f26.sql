-- TABELA: tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  niche TEXT NOT NULL CHECK (niche IN ('comercio_local','mecanica','clinica','imobiliaria','restaurante','educacao','servicos','outro')),
  cnpj TEXT UNIQUE,
  contact_email TEXT NOT NULL,
  logo_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABELA: stores
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, 
  address TEXT, 
  phone TEXT, 
  manager TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_stores_tenant ON public.stores(tenant_id);

-- TABELA: users (profiles)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL, 
  email TEXT NOT NULL, 
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin','loja','vendedor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_tenant ON public.users(tenant_id);
CREATE INDEX idx_users_store ON public.users(store_id);

-- TABELA: clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL, 
  phone TEXT NOT NULL, 
  email TEXT,
  address TEXT, 
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','lead_unidentified','deleted')),
  last_interaction TIMESTAMPTZ, 
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, phone)
);
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_phone ON public.clients(tenant_id, phone);

-- TABELAS: tags e client_tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, 
  UNIQUE (tenant_id, name)
);

CREATE TABLE public.client_tags (
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, tag_id)
);

-- TABELA: pipeline_stages
CREATE TABLE public.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL CHECK (stage_key IN ('prospeccao','qualificacao','apresentacao','proposta','negociacao','fechamento','pos_venda')),
  label TEXT NOT NULL, 
  position INT NOT NULL,
  UNIQUE (tenant_id, stage_key)
);

-- TABELA: pipeline_cards
CREATE TABLE public.pipeline_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  title TEXT NOT NULL,
  stage_key TEXT NOT NULL CHECK (stage_key IN ('prospeccao','qualificacao','apresentacao','proposta','negociacao','fechamento','pos_venda')),
  estimated_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_value NUMERIC(12,2), 
  expected_close_date DATE,
  closed_at TIMESTAMPTZ, 
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false, 
  lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cards_tenant ON public.pipeline_cards(tenant_id);
CREATE INDEX idx_cards_seller ON public.pipeline_cards(seller_id);
CREATE INDEX idx_cards_stage ON public.pipeline_cards(tenant_id, stage_key);
CREATE INDEX idx_cards_client ON public.pipeline_cards(client_id);

-- TABELA: card_history
CREATE TABLE public.card_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.pipeline_cards(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('stage_change','field_update','note_added','archived','created')),
  from_stage TEXT, 
  to_stage TEXT, 
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_card_history_card ON public.card_history(card_id);
CREATE INDEX idx_card_history_tenant ON public.card_history(tenant_id);

-- TABELA: whatsapp_instances
CREATE TABLE public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL, 
  evolution_url TEXT NOT NULL,
  api_key TEXT NOT NULL, 
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('disconnected','connecting','connected','error')),
  webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABELA: whatsapp_messages
CREATE TABLE public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('sent','received')),
  content TEXT NOT NULL, 
  processed_by_ai BOOLEAN NOT NULL DEFAULT false,
  external_id TEXT, 
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wa_messages_tenant ON public.whatsapp_messages(tenant_id);
CREATE INDEX idx_wa_messages_client ON public.whatsapp_messages(client_id);

-- TABELA: agent_ia_configs
CREATE TABLE public.agent_ia_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT false, 
  webhook_url TEXT,
  schedule JSONB NOT NULL DEFAULT '{"monday":{"enabled":true,"start":"08:00","end":"18:00"},"tuesday":{"enabled":true,"start":"08:00","end":"18:00"},"wednesday":{"enabled":true,"start":"08:00","end":"18:00"},"thursday":{"enabled":true,"start":"08:00","end":"18:00"},"friday":{"enabled":true,"start":"08:00","end":"18:00"},"saturday":{"enabled":false},"sunday":{"enabled":false}}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABELA: agent_ia_logs
CREATE TABLE public.agent_ia_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  received_message TEXT NOT NULL, 
  action_taken TEXT,
  status TEXT NOT NULL CHECK (status IN ('success','failure')),
  error_message TEXT, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_logs_tenant ON public.agent_ia_logs(tenant_id);
CREATE INDEX idx_ai_logs_status ON public.agent_ia_logs(tenant_id, status);

-- TABELA: goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_value NUMERIC(12,2) NOT NULL,
  period_start DATE NOT NULL, 
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT goal_scope CHECK (
    (store_id IS NOT NULL AND seller_id IS NULL) OR
    (store_id IS NULL AND seller_id IS NOT NULL)
  )
);
CREATE INDEX idx_goals_tenant ON public.goals(tenant_id);

-- TABELA: audit_logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  table_name TEXT NOT NULL, 
  field_name TEXT,
  old_value TEXT, 
  new_value TEXT,
  action TEXT NOT NULL CHECK (action IN ('insert','update','delete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_tenant ON public.audit_logs(tenant_id, created_at DESC);

-- GRANTS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stores TO authenticated;
GRANT ALL ON public.stores TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_tags TO authenticated;
GRANT ALL ON public.client_tags TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_stages TO authenticated;
GRANT ALL ON public.pipeline_stages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_cards TO authenticated;
GRANT ALL ON public.pipeline_cards TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.card_history TO authenticated;
GRANT ALL ON public.card_history TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_instances TO authenticated;
GRANT ALL ON public.whatsapp_instances TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_ia_configs TO authenticated;
GRANT ALL ON public.agent_ia_configs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_ia_logs TO authenticated;
GRANT ALL ON public.agent_ia_logs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

-- RLS: habilitar em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_ia_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_ia_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Funções auxiliares RLS
CREATE OR REPLACE FUNCTION public.user_tenant_id() RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT tenant_id FROM public.users WHERE id = auth.uid()
$$;
CREATE OR REPLACE FUNCTION public.user_role() RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

-- Políticas RLS
CREATE POLICY tenants_select ON public.tenants FOR SELECT USING (public.user_role() = 'admin' OR id = public.user_tenant_id());
CREATE POLICY tenants_insert ON public.tenants FOR INSERT WITH CHECK (public.user_role() = 'admin');
CREATE POLICY tenants_update ON public.tenants FOR UPDATE USING (public.user_role() = 'admin' OR id = public.user_tenant_id());

CREATE POLICY stores_all ON public.stores FOR ALL USING (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY users_all ON public.users FOR ALL USING (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY clients_all ON public.clients FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY tags_all ON public.tags FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY cards_select ON public.pipeline_cards FOR SELECT USING (tenant_id = public.user_tenant_id() AND (public.user_role() IN ('admin','loja') OR seller_id = auth.uid()));
CREATE POLICY cards_insert ON public.pipeline_cards FOR INSERT WITH CHECK (tenant_id = public.user_tenant_id() AND (public.user_role() IN ('admin','loja') OR seller_id = auth.uid()));
CREATE POLICY cards_update ON public.pipeline_cards FOR UPDATE USING (tenant_id = public.user_tenant_id() AND (public.user_role() IN ('admin','loja') OR seller_id = auth.uid()));

CREATE POLICY card_history_all ON public.card_history FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY wa_messages_all ON public.whatsapp_messages FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY ai_logs_all ON public.agent_ia_logs FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY goals_all ON public.goals FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());

CREATE POLICY audit_all ON public.audit_logs FOR ALL USING (tenant_id = public.user_tenant_id()) WITH CHECK (tenant_id = public.user_tenant_id());
