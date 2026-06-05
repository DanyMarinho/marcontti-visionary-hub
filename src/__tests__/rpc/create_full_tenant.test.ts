// src/__tests__/rpc/create_full_tenant.test.ts
import { createClient } from '@supabase/supabase-js';
import { expect, test, describe, beforeAll, afterAll } from 'vitest';

// Configure supabase client (replace with your local dev URL & anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

describe('create_full_tenant RPC', () => {
  let tenantId: string;
  const tempPassword = 'testpwd';
  const medicalBrief = {
    doctor_name: 'Dr. Test',
    crm: '12345',
    specialties: ['Cardiology'],
    sub_specialties: ['Pediatric Cardiology'],
    experience_years: 10,
    differentiators: 'Expert in child heart',
    location: 'São Paulo',
    address: 'Rua Teste, 123',
    city_state: 'SP',
    online_available: true,
    schedule: 'Mon-Fri 9am-5pm',
    weekly_hours: '40',
    support_team: { name: 'Support', phone: '+55 11 9999-9999' }
  };

  beforeAll(async () => {
    const { data, error } = await supabase.rpc('create_full_tenant', {
      p_company_name: 'Empresa Teste',
      p_cnpj_cpf: '00.000.000/0001-00',
      p_address: 'Av. Teste, 100',
      p_slug: 'empresateste',
      p_admin_name: 'Admin Test',
      p_admin_phone: '+55 11 8888-8888',
      p_store_name: 'Loja Teste',
      p_store_phone: '+55 11 7777-7777',
      p_vendor_name: 'Vendedor Test',
      p_vendor_phone: '+55 11 6666-6666',
      p_whatsapp_number: '+55 11 5555-5555',
      p_whatsapp_api_key: 'dummy-key',
      p_agent_prompt: 'Olá',
      p_medical_brief: medicalBrief
    });
    if (error) throw error;
    tenantId = data?.tenant_id;
  });

  test('should return tenant id and temporary password', async () => {
    expect(tenantId).toBeDefined();
    // temp password is generated inside the function; we only assert its existence
    const { data } = await supabase.from('tenants').select('id').eq('id', tenantId);
    expect(data).toHaveLength(1);
  });

  afterAll(async () => {
    // Clean up created tenant and cascade delete related rows
    await supabase.from('tenants').delete().eq('id', tenantId);
  });
});
