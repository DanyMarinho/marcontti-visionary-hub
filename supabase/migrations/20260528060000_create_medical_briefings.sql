-- Migration: create medical_briefings table
CREATE TABLE public.medical_briefings (
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
CREATE INDEX idx_medical_briefings_tenant ON public.medical_briefings(tenant_id);
