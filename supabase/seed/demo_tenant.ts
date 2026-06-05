// demo_tenant.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const medicalBrief = {
    doctor_name: 'Dr. João Silva',
    crm: '12345-SP',
    specialties: ['Cardiology', 'Internal Medicine'],
    sub_specialties: ['Preventive Cardiology'],
    experience_years: 15,
    differentiators: 'Atende emergências 24h',
    location: 'São Paulo',
    address: 'Rua das Flores, 123',
    city_state: 'São Paulo, SP',
    online_available: true,
    schedule: 'Seg‑Sex 8h‑18h',
    weekly_hours: '40h',
    support_team: { email: 'suporte@exemplo.com', phone: '+55 11 9999-8888' }
  };

  const { data, error } = await supabase.rpc('create_full_tenant', {
    p_company_name: 'Empresa Demo',
    p_cnpj_cpf: '12.345.678/0001-90',
    p_address: 'Avenida Demo, 1000',
    p_slug: 'empresa-demo',
    p_admin_name: 'Ana Maria',
    p_admin_phone: '+55 11 9888-7777',
    p_store_name: 'Loja Demo',
    p_store_phone: '+55 11 9777-6666',
    p_vendor_name: 'Vendedor Demo',
    p_vendor_phone: '+55 11 9666-5555',
    p_whatsapp_number: '+55 11 9555-4444',
    p_whatsapp_api_key: 'demo-api-key',
    p_agent_prompt: 'You are a helpful assistant.',
    p_medical_brief: medicalBrief
  });

  if (error) {
    console.error('Error creating demo tenant:', error);
    process.exit(1);
  }

  console.log('Demo tenant created with ID:', data?.tenant_id);
  console.log('Temporary admin password:', data?.temp_password);
}

main();
