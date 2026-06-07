import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token)
    if (claimsErr || !claims?.claims?.sub) return json({ error: 'Unauthorized' }, 401)
    const callerId = claims.claims.sub as string

    const admin = createClient(SUPABASE_URL, SERVICE_KEY)
    const { data: callerRoles } = await admin.from('user_roles').select('role').eq('user_id', callerId)
    const roles = (callerRoles ?? []).map((r: any) => r.role)
    if (!roles.includes('admin') && !roles.includes('loja')) {
      return json({ error: 'Forbidden' }, 403)
    }

    const { user_id, hard } = await req.json().catch(() => ({}))
    if (!user_id) return json({ error: 'Missing user_id' }, 400)

    // Loja can only act on sellers within their tenant
    if (!roles.includes('admin')) {
      const { data: caller } = await admin.from('users').select('tenant_id').eq('id', callerId).single()
      const { data: target } = await admin.from('users').select('tenant_id, role').eq('id', user_id).single()
      if (!caller || !target || caller.tenant_id !== target.tenant_id || target.role !== 'vendedor') {
        return json({ error: 'Forbidden' }, 403)
      }
    }

    // Revoke all sessions in auth.users
    try { await admin.auth.admin.signOut(user_id, 'global' as any) } catch (_) {}

    if (hard === true) {
      const { error: delErr } = await admin.auth.admin.deleteUser(user_id)
      if (delErr) return json({ error: delErr.message }, 400)
      // public.users row is removed via cascade or trigger if configured; otherwise:
      await admin.from('users').delete().eq('id', user_id)
      return json({ ok: true, hard: true }, 200)
    }

    // Soft delete
    const { error: updErr } = await admin
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', user_id)
    if (updErr) return json({ error: updErr.message }, 400)

    return json({ ok: true, hard: false }, 200)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}