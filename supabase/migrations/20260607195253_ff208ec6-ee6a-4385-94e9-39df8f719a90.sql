CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE IF NOT EXISTS public.medical_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  crm TEXT,
  specialties TEXT[],
  sub_specialties TEXT[],
  experience_years INT,
  differentiators TEXT,
  location TEXT,
  address TEXT,
  city_state TEXT,
  online_available BOOLEAN,
  schedule TEXT,
  weekly_hours TEXT,
  support_team JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medical_briefings_tenant ON public.medical_briefings(tenant_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_briefings TO authenticated;
GRANT ALL ON public.medical_briefings TO service_role;

ALTER TABLE public.medical_briefings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS medical_briefings_all ON public.medical_briefings;
CREATE POLICY medical_briefings_all ON public.medical_briefings
FOR ALL TO authenticated
USING (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id())
WITH CHECK (public.user_role() = 'admin' OR tenant_id = public.user_tenant_id());

DROP TRIGGER IF EXISTS update_medical_briefings_updated_at ON public.medical_briefings;
CREATE TRIGGER update_medical_briefings_updated_at
  BEFORE UPDATE ON public.medical_briefings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();