import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface JWTPayload {
  sub: string
  aud: string
  exp: number
  email?: string
  name?: string
  role?: string
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    
    if (!code) {
      // Redirect to frontend with error
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=no_code`, 302)
    }

    const clientId = Deno.env.get('HKBU_CLIENT_ID')
    const clientSecret = Deno.env.get('HKBU_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials')
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=config_error`, 302)
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
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=token_exchange_failed`, 302)
    }

    const tokenData: TokenResponse = await tokenResponse.json()
    const jwtPayload = parseJWT(tokenData.access_token)

    if (!jwtPayload) {
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=invalid_token`, 302)
    }

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Determine role from JWT claims
    const role = jwtPayload.role === 'teacher' ? 'teacher' : 'student'

    // Upsert profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        hkbu_user_id: jwtPayload.sub,
        email: jwtPayload.email || null,
        display_name: jwtPayload.name || null,
        role: role,
      }, {
        onConflict: 'hkbu_user_id',
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile upsert error:', profileError)
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=profile_error`, 302)
    }

    // Upsert user role
    await supabase
      .from('user_roles')
      .upsert({
        profile_id: profile.id,
        role: role,
      }, {
        onConflict: 'profile_id,role',
      })

    // Store session
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
    
    // Delete old sessions for this profile
    await supabase
      .from('user_sessions')
      .delete()
      .eq('profile_id', profile.id)

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
      const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
      return Response.redirect(`${frontendUrl}/auth?error=session_error`, 302)
    }

    // Redirect to frontend with session token
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
    const sessionData = JSON.stringify({
      sessionId: session.id,
      profileId: profile.id,
      expiresAt: expiresAt.toISOString(),
    })
    const sessionToken = btoa(sessionData)

    return Response.redirect(`${frontendUrl}/auth/callback?token=${sessionToken}`, 302)

  } catch (error) {
    console.error('OAuth callback error:', error)
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'https://sjkrxhqkwpmobdkdlefd.lovableproject.com'
    return Response.redirect(`${frontendUrl}/auth?error=server_error`, 302)
  }
})