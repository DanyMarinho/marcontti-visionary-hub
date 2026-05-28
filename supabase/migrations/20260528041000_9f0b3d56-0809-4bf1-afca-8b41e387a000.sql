ALTER TABLE public.tenants 
ADD COLUMN color TEXT DEFAULT '#f97316',
ADD COLUMN owner_name TEXT,
ADD COLUMN plan TEXT DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium')),
ADD COLUMN status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- Update niche constraint
ALTER TABLE public.tenants DROP CONSTRAINT tenants_niche_check;
ALTER TABLE public.tenants ADD CONSTRAINT tenants_niche_check 
CHECK (niche IN ('comercio_local','mecanica','clinica','imobiliaria','restaurante','educacao','servicos','outro'));
