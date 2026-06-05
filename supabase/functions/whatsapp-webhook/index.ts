import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()

    // Validação básica do Evolution API (verifica se é mensagem recebida)
    if (!payload.data || !payload.data.message || payload.data.key.fromMe) {
      return new Response(JSON.stringify({ status: 'ignored' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // A instância Evolution API vem na payload, vamos associar ao tenant
    const instanceName = payload.instance
    const { data: waInstance } = await supabase
      .from('whatsapp_instances')
      .select('tenant_id, evolution_url, api_key')
      .eq('instance_name', instanceName)
      .single()

    if (!waInstance) {
      throw new Error(`Instance ${instanceName} not found in database`)
    }

    const tenantId = waInstance.tenant_id
    const phoneNum = payload.data.key.remoteJid.replace('@s.whatsapp.net', '')
    const messageContent = payload.data.message?.conversation || payload.data.message?.extendedTextMessage?.text || ''
    const senderName = payload.data.pushName || 'Lead'

    if (!messageContent) {
      return new Response(JSON.stringify({ status: 'no_text_content' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 1. Buscar ou criar Cliente
    let { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('phone', phoneNum)
      .single()

    if (!client) {
      const { data: newClient } = await supabase
        .from('clients')
        .insert({
          tenant_id: tenantId,
          full_name: senderName,
          phone: phoneNum,
          status: 'lead_unidentified'
        })
        .select()
        .single()
      client = newClient
    }

    // Atualiza a última interação do cliente
    await supabase.from('clients').update({ last_interaction: new Date().toISOString() }).eq('id', client.id)

    // 2. Salva a mensagem recebida
    await supabase.from('whatsapp_messages').insert({
      tenant_id: tenantId,
      client_id: client.id,
      direction: 'received',
      content: messageContent,
      external_id: payload.data.key.id
    })

    // 3. Verifica configuração de IA e Horário
    const { data: aiConfig } = await supabase
      .from('agent_ia_configs')
      .select('*')
      .eq('tenant_id', tenantId)
      .single()

    // Checar "modo IA" específico da conversa (caso vendedor tenha pausado)
    // Se client.status == 'active' significa que está no funil de atendimento humano
    if (client.status === 'active' || !aiConfig?.is_active) {
      return new Response(JSON.stringify({ status: 'ai_disabled_or_human_mode' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Verifica Horário (simplificado, mas que obedece schedule do aiConfig)
    const now = new Date()
    const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()]
    const scheduleToday = aiConfig.schedule[currentDay]

    let isOutsideHours = false
    if (!scheduleToday || !scheduleToday.enabled) {
      isOutsideHours = true
    } else {
      const currentHour = now.getHours()
      const startHour = parseInt(scheduleToday.start.split(':')[0])
      const endHour = parseInt(scheduleToday.end.split(':')[0])
      if (currentHour < startHour || currentHour >= endHour) {
        isOutsideHours = true
      }
    }

    if (isOutsideHours) {
      // Enviar mensagem de ausência
      const absenceMsg = "Olá! 👋 No momento estou fora do horário de atendimento. Deixe sua mensagem que retorno assim que possível! 😊"
      await sendEvolutionMessage(waInstance.evolution_url, waInstance.api_key, instanceName, payload.data.key.remoteJid, absenceMsg)
      
      await supabase.from('whatsapp_messages').insert({
        tenant_id: tenantId, client_id: client.id, direction: 'sent', content: absenceMsg, processed_by_ai: true
      })
      
      return new Response(JSON.stringify({ status: 'outside_business_hours' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Processamento via Groq LLM
    const { data: history } = await supabase
      .from('whatsapp_messages')
      .select('content, direction')
      .eq('client_id', client.id)
      .order('timestamp', { ascending: false })
      .limit(10)

    const chatMessages = history.reverse().map(msg => ({
      role: msg.direction === 'received' ? 'user' : 'assistant',
      content: msg.content
    }))

    const { data: tenant } = await supabase.from('tenants').select('*').eq('id', tenantId).single()

    const systemPrompt = `Você é um assistente comercial inteligente da empresa ${tenant.name} (Nicho: ${tenant.niche}).
Seu objetivo: qualificar leads, responder dúvidas e encaminhar para um vendedor quando estiver quente.
NUNCA prometa preços sem confirmar com vendedor.
Seja direto, máximo de 3 frases. Use emojis com moderação.
Se o cliente pedir para falar com humano, ou estiver qualificado para comprar, inclua a palavra "[HANDOFF_VENDEDOR]" na sua resposta secreta para acionar nosso sistema, e avise o cliente que um vendedor vai assumir.
`

    const groqApiKey = Deno.env.get('GROQ_API_KEY')!
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const groqData = await groqResponse.json()
    let aiReplyText = groqData.choices[0].message.content

    let triggerHandoff = false
    if (aiReplyText.includes('[HANDOFF_VENDEDOR]')) {
      triggerHandoff = true
      aiReplyText = aiReplyText.replace('[HANDOFF_VENDEDOR]', '').trim()
    }

    // 5. Enviar resposta para o cliente via Evolution API
    await sendEvolutionMessage(waInstance.evolution_url, waInstance.api_key, instanceName, payload.data.key.remoteJid, aiReplyText)

    // 6. Salvar resposta e logs
    await supabase.from('whatsapp_messages').insert({
      tenant_id: tenantId, client_id: client.id, direction: 'sent', content: aiReplyText, processed_by_ai: true
    })

    await supabase.from('agent_ia_logs').insert({
      tenant_id: tenantId, client_id: client.id, received_message: messageContent, action_taken: 'replied', status: 'success'
    })

    // 7. Passagem de Bastão Aleatória
    if (triggerHandoff) {
      // Pega um vendedor ativo aleatoriamente deste tenant
      const { data: sellers } = await supabase.from('users').select('id, store_id').eq('tenant_id', tenantId).eq('role', 'vendedor').eq('is_active', true)
      
      if (sellers && sellers.length > 0) {
        const randomSeller = sellers[Math.floor(Math.random() * sellers.length)]
        
        // Altera status do cliente
        await supabase.from('clients').update({ status: 'active' }).eq('id', client.id)

        // Cria card no pipeline na etapa qualificacao/apresentacao
        const { data: card } = await supabase.from('pipeline_cards').insert({
          tenant_id: tenantId,
          store_id: randomSeller.store_id,
          seller_id: randomSeller.id,
          client_id: client.id,
          title: \`Lead via IA: \${client.full_name}\`,
          stage_key: 'qualificacao',
          notes: 'Lead qualificado e repassado pela IA.'
        }).select().single()

        await supabase.from('card_history').insert({
          card_id: card.id, tenant_id: tenantId, user_id: randomSeller.id, event_type: 'created', description: 'Lead repassado automaticamente pela IA'
        })
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

// Função utilitária para chamar Evolution API
async function sendEvolutionMessage(url: string, apikey: string, instance: string, number: string, text: string) {
  const endpoint = \`\${url}/message/sendText/\${instance}\`
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number, options: { delay: 1200 }, textMessage: { text } })
  })
}
