import { supabase } from '@/integrations/supabase/client';

/**
 * Envia uma mensagem de texto usando a Evolution API armazenada para o tenant.
 *
 * @param tenantId  ID do tenant (empresa) que possui a conta Evolution.
 * @param phone     Número de telefone destino no formato internacional sem '+' (ex.: '5511999999999').
 * @param text      Texto da mensagem a ser enviada.
 * @returns Promise que resolve com a resposta da API ou lança erro.
 */
export async function sendWhatsAppMessage(
  tenantId: string,
  phone: string,
  text: string
): Promise<any> {
  // Busca a configuração da conta Evolution associada ao tenant.
  const { data: instance, error: fetchError } = await supabase
    .from('whatsapp_instances')
    .select('phone_number, api_url, api_key')
    .eq('tenant_id', tenantId)
    .single();

  if (fetchError) {
    console.error('[Evolution] Instância não encontrada', fetchError);
    throw fetchError;
  }

  // Monta o payload esperado pela Evolution API.
  const payload = {
    to: phone,
    body: text,
  };

  const resp = await fetch(`${instance.api_url}/message`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${instance.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error('[Evolution] Erro ao enviar mensagem', resp.status, errText);
    throw new Error(`Evolution error ${resp.status}: ${errText}`);
  }

  return resp.json();
}
