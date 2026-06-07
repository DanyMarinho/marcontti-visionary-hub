import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tenant_id, phone, content } = await req.json()

    if (!tenant_id || !phone || !content) {
      return new Response(
        JSON.stringify({ error: 'tenant_id, phone e content são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar instância WhatsApp do tenant
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('evolution_url, api_key, instance_name, status')
      .eq('tenant_id', tenant_id)
      .single()

    if (instanceError || !instance) {
      return new Response(
        JSON.stringify({ error: 'Instância WhatsApp não encontrada para este tenant' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (instance.status !== 'connected') {
      return new Response(
        JSON.stringify({ error: `WhatsApp não está conectado (status: ${instance.status})` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enviar mensagem via Evolution API
    const phoneClean = phone.replace(/\D/g, '')
    const evolutionResponse = await fetch(
      `${instance.evolution_url}/message/sendText/${instance.instance_name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': instance.api_key,
        },
        body: JSON.stringify({
          number: phoneClean,
          textMessage: { text: content },
        }),
      }
    )

    if (!evolutionResponse.ok) {
      const errText = await evolutionResponse.text()
      return new Response(
        JSON.stringify({ error: `Erro na Evolution API: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await evolutionResponse.json()
    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})