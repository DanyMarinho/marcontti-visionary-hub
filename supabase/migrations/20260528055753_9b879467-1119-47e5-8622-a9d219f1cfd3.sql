ALTER TABLE public.whatsapp_conversations 
DROP CONSTRAINT IF EXISTS whatsapp_conversations_assigned_to_fkey;

ALTER TABLE public.whatsapp_conversations 
ADD COLUMN IF NOT EXISTS content TEXT,
ALTER COLUMN assigned_to TYPE UUID;

ALTER TABLE public.whatsapp_conversations 
ADD CONSTRAINT whatsapp_conversations_assigned_to_fkey 
FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;

-- Update trigger function to include content
CREATE OR REPLACE FUNCTION public.handle_new_whatsapp_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.whatsapp_conversations (tenant_id, client_id, last_activity_at, last_message_direction, status, content)
    VALUES (NEW.tenant_id, NEW.client_id, NEW.timestamp, NEW.direction, 'waiting', NEW.content)
    ON CONFLICT (tenant_id, client_id) 
    DO UPDATE SET 
        last_activity_at = EXCLUDED.last_activity_at,
        last_message_direction = EXCLUDED.last_message_direction,
        content = EXCLUDED.content,
        status = CASE 
            WHEN EXCLUDED.last_message_direction = 'received' THEN 'waiting' 
            ELSE whatsapp_conversations.status 
        END,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
