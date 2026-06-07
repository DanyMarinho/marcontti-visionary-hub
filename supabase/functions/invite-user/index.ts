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
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

    // Validate caller identity & role
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token)
    if (claimsErr || !claims?.claims?.sub) return json({ error: 'Unauthorized' }, 401)
    const callerId = claims.claims.sub as string

    const admin = createClient(SUPABASE_URL, SERVICE_KEY)
    const { data: callerRoles } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId)
    const roles = (callerRoles ?? []).map((r: any) => r.role)
    if (!roles.includes('admin') && !roles.includes('loja')) {
      return json({ error: 'Forbidden' }, 403)
    }

    const body = await req.json().catch(() => ({}))
    const { email, full_name, tenant_id, store_id, role } = body ?? {}
    if (!email || !full_name || !tenant_id || !role) {
      return json({ error: 'Missing required fields' }, 400)
    }
    if (!['admin', 'loja', 'vendedor'].includes(role)) {
      return json({ error: 'Invalid role' }, 400)
    }
    if (!roles.includes('admin') && role !== 'vendedor') {
      return json({ error: 'Only admins can create non-seller users' }, 403)
    }

    const redirectTo = `${Deno.env.get('APP_URL') ?? ''}/login`

    // Try invite; if user already exists, fetch existing id
    let userId: string | null = null
    const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name, tenant_id, store_id, role },
      redirectTo,
    })
    if (inviteErr) {
      // already registered → find existing
      const { data: list } = await admin.auth.admin.listUsers()
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === String(email).toLowerCase())
      if (!existing) return json({ error: inviteErr.message }, 400)
      userId = existing.id
    } else {
      userId = invited.user?.id ?? null
    }
    if (!userId) return json({ error: 'Could not resolve user id' }, 500)

    // Atomic-ish upsert into public.users with desired tenant/store/role
    const { data: upserted, error: upsertErr } = await admin
      .from('users')
      .upsert({
        id: userId,
        tenant_id,
        store_id: store_id || null,
        full_name,
        email,
        role,
        is_active: true,
        invited_at: new Date().toISOString(),
        last_invite_sent_at: new Date().toISOString(),
        invite_status: 'pending',
      })
      .select()
      .single()

    if (upsertErr) {
      // rollback: remove the auth user we just created
      try { await admin.auth.admin.deleteUser(userId) } catch (_) {}
      return json({ error: upsertErr.message }, 400)
    }

    return json({ user: upserted, id: userId }, 200)
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