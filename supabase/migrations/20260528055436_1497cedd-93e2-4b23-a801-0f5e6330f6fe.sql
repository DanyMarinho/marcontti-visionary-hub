-- Advanced WhatsApp Conversations
CREATE TABLE public.whatsapp_conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'attending', 'resolved')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ai_enabled BOOLEAN NOT NULL DEFAULT true,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_message_direction TEXT CHECK (last_message_direction IN ('sent', 'received')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tenant_id, client_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_conversations TO authenticated;
GRANT ALL ON public.whatsapp_conversations TO service_role;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own tenant's conversations" ON public.whatsapp_conversations FOR SELECT USING (true);
CREATE POLICY "Users can update their own tenant's conversations" ON public.whatsapp_conversations FOR UPDATE USING (true);

-- Notifications
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info', -- 'idle_card', 'no_response', 'transfer'
    related_id UUID, -- client_id or card_id
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (true);

-- Reactivation Logs
CREATE TABLE public.reactivation_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'whatsapp', 'follow_up', 'transfer', 'auto'
    stage_at_time TEXT,
    result TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reactivation_logs TO authenticated;
GRANT ALL ON public.reactivation_logs TO service_role;
ALTER TABLE public.reactivation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view reactivation logs" ON public.reactivation_logs FOR SELECT USING (true);

-- Update Tenants with more settings
ALTER TABLE public.tenants 
ADD COLUMN no_response_threshold_minutes INTEGER DEFAULT 30,
ADD COLUMN reactivation_auto_enabled BOOLEAN DEFAULT false,
ADD COLUMN reactivation_idle_days INTEGER DEFAULT 7,
ADD COLUMN reactivation_max_attempts INTEGER DEFAULT 3,
ADD COLUMN reactivation_interval_days INTEGER DEFAULT 3,
ADD COLUMN reactivation_messages JSONB DEFAULT '{
    "prospeccao": "Olá {nome}! Vi que você demonstrou interesse. Posso te ajudar?",
    "qualificacao": "Olá {nome}! Gostaria de entender melhor suas necessidades.",
    "apresentacao": "Olá {nome}! Que tal agendarmos uma apresentação rápida?",
    "proposta": "Olá {nome}! Teve chance de analisar nossa proposta?",
    "negociacao": "Olá {nome}! Estou disponível para ajustar os detalhes.",
    "fechamento": "Olá {nome}! Podemos finalizar hoje? Tenho condição especial."
}'::jsonb;

-- Trigger to update whatsapp_conversations on new messages
CREATE OR REPLACE FUNCTION public.handle_new_whatsapp_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.whatsapp_conversations (tenant_id, client_id, last_activity_at, last_message_direction, status)
    VALUES (NEW.tenant_id, NEW.client_id, NEW.timestamp, NEW.direction, 'waiting')
    ON CONFLICT (tenant_id, client_id) 
    DO UPDATE SET 
        last_activity_at = EXCLUDED.last_activity_at,
        last_message_direction = EXCLUDED.last_message_direction,
        status = CASE 
            WHEN EXCLUDED.last_message_direction = 'received' THEN 'waiting' 
            ELSE whatsapp_conversations.status 
        END,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_whatsapp_message_inserted
AFTER INSERT ON public.whatsapp_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_whatsapp_message();
