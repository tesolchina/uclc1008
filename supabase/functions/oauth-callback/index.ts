import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenResponse {
  access_token: string
  token_type?: string
  expires_in?: number
}

interface JWTPayload {
  // HKBU token fields (seen in docs and earlier implementations)
  userId?: string
  sub?: string
  user_id?: string

  email?: string
  name?: string
  role?: string

  aud?: string
  iat?: number
  exp?: number
}

function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

function getFrontendOriginFromState(state: string | null): string {
  const fallback = Deno.env.get('FRONTEND_URL') || 'https://ue1.hkbu.tech'
  if (!state) return fallback

  // Some providers may turn '+' into spaces in query params
  const normalized = state.replace(/ /g, '+')

  try {
    const decoded = JSON.parse(atob(normalized))
    const returnUrl = decoded?.returnUrl

    if (typeof returnUrl === 'string') {
      try {
        return new URL(returnUrl).origin
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  return fallback
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    const frontendOrigin = getFrontendOriginFromState(state)

    if (!code) {
      return Response.redirect(`${frontendOrigin}/auth?error=no_code`, 302)
    }

    const clientId = Deno.env.get('HKBU_CLIENT_ID')
    const clientSecret = Deno.env.get('HKBU_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials')
      return Response.redirect(`${frontendOrigin}/auth?error=config_error`, 302)
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://auth.hkbu.tech/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return Response.redirect(`${frontendOrigin}/auth?error=token_exchange_failed`, 302)
    }

    const tokenData: TokenResponse = await tokenResponse.json()
    const jwtPayload = parseJWT(tokenData.access_token)

    if (!jwtPayload) {
      return Response.redirect(`${frontendOrigin}/auth?error=invalid_token`, 302)
    }

    const hkbuUserId = jwtPayload.userId ?? jwtPayload.sub ?? jwtPayload.user_id
    if (!hkbuUserId) {
      return Response.redirect(`${frontendOrigin}/auth?error=invalid_token`, 302)
    }

    // Connect to backend database with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const role = jwtPayload.role === 'teacher' ? 'teacher' : 'student'
    const displayName = jwtPayload.name || jwtPayload.email?.split('@')[0] || null

    // Upsert profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          hkbu_user_id: hkbuUserId,
          email: jwtPayload.email || null,
          display_name: displayName,
          role,
        },
        {
          onConflict: 'hkbu_user_id',
        }
      )
      .select()
      .single()

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      return Response.redirect(`${frontendOrigin}/auth?error=profile_error`, 302)
    }

    // Upsert user role (best-effort)
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert(
        {
          profile_id: profile.id,
          role,
        },
        {
          onConflict: 'profile_id,role',
        }
      )

    if (roleError) {
      console.error('Role upsert error:', roleError)
    }

    // Compute expiry (prefer JWT exp, fall back to expires_in)
    const nowSeconds = Math.floor(Date.now() / 1000)
    const expSeconds =
      (typeof jwtPayload.exp === 'number' ? jwtPayload.exp : undefined) ??
      (typeof tokenData.expires_in === 'number' ? nowSeconds + tokenData.expires_in : nowSeconds + 3600)

    const expiresAt = new Date(expSeconds * 1000)
    if (!Number.isFinite(expiresAt.valueOf())) {
      console.error('Invalid expiresAt computed', { expSeconds, tokenData })
      return Response.redirect(`${frontendOrigin}/auth?error=invalid_token`, 302)
    }

    // Delete old sessions for this profile
    await supabase.from('user_sessions').delete().eq('profile_id', profile.id)

    // Insert new session
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        profile_id: profile.id,
        access_token: tokenData.access_token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Session insert error:', sessionError)
      return Response.redirect(`${frontendOrigin}/auth?error=session_error`, 302)
    }

    // Redirect to frontend with session token
    const sessionData = JSON.stringify({
      sessionId: session.id,
      profileId: profile.id,
      accessToken: tokenData.access_token,
      expiresAt: expiresAt.toISOString(),
    })

    // Base64 can contain +/= which must be URL encoded
    const sessionToken = btoa(sessionData)
    return Response.redirect(
      `${frontendOrigin}/auth/callback?token=${encodeURIComponent(sessionToken)}`,
      302
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    const fallback = Deno.env.get('FRONTEND_URL') || 'https://ue1.hkbu.tech'
    return Response.redirect(`${fallback}/auth?error=server_error`, 302)
  }
})