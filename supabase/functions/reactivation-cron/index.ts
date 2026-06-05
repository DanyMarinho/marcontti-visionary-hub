import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    const groqApiKey = Deno.env.get('GROQ_API_KEY')!

    // Buscar clientes inativos há mais de 30 dias que não estão no funil "active"
    // E que a empresa tem IA ativa
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: clientsToReactivate } = await supabase
      .from('clients')
      .select('id, full_name, phone, tenant_id, last_interaction')
      .lt('last_interaction', thirtyDaysAgo.toISOString())
      .in('status', ['lead_unidentified', 'deleted'])
      .limit(50) // Limite em batch

    if (!clientsToReactivate || clientsToReactivate.length === 0) {
      return new Response(JSON.stringify({ message: "Nenhum cliente para reativar no momento." }))
    }

    let count = 0;
    for (const client of clientsToReactivate) {
      const { data: aiConfig } = await supabase.from('agent_ia_configs').select('is_active').eq('tenant_id', client.tenant_id).single()
      if (!aiConfig?.is_active) continue;

      const { data: waInstance } = await supabase.from('whatsapp_instances').select('evolution_url, api_key, instance_name').eq('tenant_id', client.tenant_id).single()
      if (!waInstance) continue;

      const { data: tenant } = await supabase.from('tenants').select('name, niche').eq('id', client.tenant_id).single()

      // Gera mensagem com Groq
      const systemPrompt = `Você é um assistente comercial da empresa ${tenant.name} (${tenant.niche}). 
      Gere UMA única mensagem curta, amigável e direta de reativação para um cliente chamado ${client.full_name || 'Amigo'} que não fala conosco há um tempo. Ofereça ajuda ou pergunte se ele ainda precisa dos nossos serviços. 
      Sem emojis excessivos, linguagem profissional mas acolhedora.`

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'system', content: systemPrompt }],
          temperature: 0.8,
          max_tokens: 100
        })
      })

      const groqData = await groqResponse.json()
      const aiReplyText = groqData.choices[0].message.content

      // Disparar
      await sendEvolutionMessage(waInstance.evolution_url, waInstance.api_key, waInstance.instance_name, `${client.phone}@s.whatsapp.net`, aiReplyText)

      // Atualiza last_interaction
      await supabase.from('clients').update({ last_interaction: new Date().toISOString() }).eq('id', client.id)

      // Registra mensagem enviada
      await supabase.from('whatsapp_messages').insert({
        tenant_id: client.tenant_id, client_id: client.id, direction: 'sent', content: aiReplyText, processed_by_ai: true
      })
      count++;
    }

    return new Response(JSON.stringify({ message: \`Foram reativados \${count} clientes.\` }))
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})

async function sendEvolutionMessage(url: string, apikey: string, instance: string, number: string, text: string) {
  const endpoint = \`\${url}/message/sendText/\${instance}\`
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'apikey': apikey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number, options: { delay: 1200 }, textMessage: { text } })
  })
}
