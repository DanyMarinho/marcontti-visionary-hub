create or replace function public.create_full_tenant(
  p_company_name text,
  p_cnpj_cpf text,
  p_address text,
  p_slug text,
  p_admin_name text,
  p_admin_phone text,
  p_store_name text,
  p_store_phone text,
  p_vendor_name text,
  p_vendor_phone text,
  p_whatsapp_number text,
  p_whatsapp_api_key text,
  p_agent_prompt text,
  p_medical_brief text
) returns jsonb language plpgsql security invoker as $$
declare
  v_tenant_id uuid;
  v_temp_password text;
  v_store_id uuid;
  v_user_id uuid;
  v_whatsapp_id uuid;
begin
  -- generate temporary password
  v_temp_password := substr(md5(random()::text), 0, 12);

  -- insert tenant
  insert into tenants (name, cnpj_cpf, address, slug, created_at, updated_at)
  values (p_company_name, p_cnpj_cpf, p_address, p_slug, now(), now())
  returning id into v_tenant_id;

  -- insert store
  insert into stores (tenant_id, name, phone, created_at, updated_at)
  values (v_tenant_id, p_store_name, p_store_phone, now(), now())
  returning id into v_store_id;

  -- insert admin user (role admin)
  insert into users (tenant_id, name, phone, role, password_hash, created_at, updated_at)
  values (v_tenant_id, p_admin_name, p_admin_phone, 'admin', crypt(v_temp_password, gen_salt('bf')), now(), now())
  returning id into v_user_id;

  -- insert vendor user (role vendor)
  insert into users (tenant_id, name, phone, role, created_at, updated_at)
  values (v_tenant_id, p_vendor_name, p_vendor_phone, 'vendor', now(), now());

  -- insert whatsapp number
  insert into whatsapp_numbers (tenant_id, store_id, number, api_key, created_at, updated_at)
  values (v_tenant_id, v_store_id, p_whatsapp_number, p_whatsapp_api_key, now(), now())
  returning id into v_whatsapp_id;

  -- insert medical briefing
  insert into medical_briefings (tenant_id, briefing, created_at, updated_at)
  values (v_tenant_id, p_medical_brief, now(), now());

  -- return result
  return jsonb_build_object('tenant_id', v_tenant_id, 'store_id', v_store_id, 'admin_user_id', v_user_id, 'whatsapp_id', v_whatsapp_id, 'temp_password', v_temp_password);
end;
$$;
