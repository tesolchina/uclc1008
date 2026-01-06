# API Key Management - Process Log

This document describes the behind-the-scenes flow for API key operations in the UE1 platform.

---

## Architecture Overview

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Frontend          │────▶│   Edge Functions     │────▶│   HKBU Platform     │
│   (ApiConfigPage)   │     │   (Supabase)         │     │   (auth.hkbu.tech)  │
└─────────────────────┘     └──────────────────────┘     └─────────────────────┘
         │                           │                            │
         │                           ▼                            │
         │                  ┌──────────────────┐                  │
         │                  │  Local Database  │                  │
         │                  │  (api_keys table)│                  │
         │                  └──────────────────┘                  │
         │                                                        │
         └────────────────── accessToken ─────────────────────────┘
```

---

## 1. Sign-In Flow (OAuth)

### Step 1: User clicks "Sign in with HKBU"
```
Frontend: AuthContext.login()
  └── Redirect to: /functions/v1/oauth-init
```

### Step 2: OAuth Init Edge Function
```
Edge Function: oauth-init
  ├── Read HKBU_CLIENT_ID from env
  ├── Generate state with returnUrl + nonce
  ├── Build auth URL: https://auth.hkbu.tech/auth-provider/login
  └── Redirect user to HKBU login page
```

### Step 3: User authenticates at HKBU
```
HKBU Platform: User enters credentials
  └── On success: Redirect to /functions/v1/oauth-callback?code=XXX&state=XXX
```

### Step 4: OAuth Callback Edge Function
```
Edge Function: oauth-callback
  ├── Extract code and state from URL
  ├── POST to https://auth.hkbu.tech/api/oauth/token
  │     └── Body: { code, client_id, client_secret }
  │     └── Response: { access_token, expires_in }
  ├── Parse JWT from access_token to get userId, email, role
  ├── Upsert profile in database
  ├── Delete old sessions for this profile
  ├── Insert new session with access_token
  ├── Create sessionToken with: { sessionId, profileId, accessToken, expiresAt }
  └── Redirect to /auth/callback?token=<base64(sessionToken)>
```

### Step 5: Frontend receives session
```
Frontend: AuthCallback.tsx
  ├── Extract token from URL
  ├── localStorage.setItem('hkbu_session', token)
  └── Call refreshProfile() → navigate('/')

AuthContext.refreshProfile()
  ├── Read hkbu_session from localStorage
  ├── Decode base64 → JSON.parse
  ├── Extract { profileId, accessToken, expiresAt }
  ├── Check if expired
  ├── setAccessToken(accessToken)  ← CRITICAL for API key sync
  └── Fetch profile from database
```

---

## 2. Check API Status Flow

### Triggered when:
- Component mounts
- User signs in/out
- After saving/revoking API key
- User clicks "Refresh Status"

### Process Log:

```
Frontend: ApiConfigPage.tsx
  └── checkApiStatus(accessToken)
        ├── POST /functions/v1/check-api-status
        │     └── Body: { accessToken: "<HKBU_ACCESS_TOKEN>" or null }
        └── Receive: { statuses: [...], authenticated: true/false }

Edge Function: check-api-status
  │
  ├── IF accessToken is null/undefined:
  │     ├── LOG: "No access token provided - showing limited status"
  │     ├── Check LOVABLE_API_KEY env var only
  │     └── Return all user providers as unavailable, authenticated: false
  │
  └── IF accessToken is provided:
        ├── LOG: "Fetching API keys from HKBU platform..."
        ├── GET https://auth.hkbu.tech/api/user/api-keys
        │     └── Headers: { Authorization: Bearer <accessToken> }
        │     └── Response: { api_keys: { hkbu: "...", openrouter: "...", ... } }
        ├── LOG: "HKBU platform keys found: [hkbu, openrouter, ...]"
        │
        ├── Also check local database as fallback:
        │     └── SELECT provider, api_key FROM api_keys
        │
        ├── For each provider, check:
        │     └── hkbuPlatformKeys[provider] || localKeyMap.get(provider)
        │
        └── Return { statuses: [...], authenticated: true }
              │
              └── Each status: {
                    provider: "hkbu",
                    available: true/false,
                    name: "HKBU GenAI",
                    source: "hkbu_platform" | "local" | null
                  }
```

---

## 3. Save API Key Flow

### Process Log:

```
Frontend: ApiConfigPage.tsx
  └── handleSaveApiKey()
        ├── Validate: apiKey is not empty
        ├── POST /functions/v1/save-api-key
        │     └── Body: { provider: "hkbu", apiKey: "xxx", accessToken: "<token>" }
        └── On success:
              ├── Show toast with savedToHkbu indicator
              └── Call checkApiStatus(accessToken)

Edge Function: save-api-key
  │
  ├── Validate provider is in: ["hkbu", "openrouter", "bolatu", "kimi"]
  │
  ├── IF accessToken is provided:
  │     ├── LOG: "Saving API key for <provider> to HKBU platform..."
  │     ├── POST https://auth.hkbu.tech/api/user/api-keys
  │     │     └── Headers: { Authorization: Bearer <accessToken> }
  │     │     └── Body: { keyType: <provider>, apiKey: <apiKey> }
  │     │
  │     ├── IF response.ok:
  │     │     ├── LOG: "API key saved to HKBU platform for <provider>"
  │     │     └── Return { success: true, savedToHkbu: true }
  │     │
  │     └── IF response NOT ok:
  │           ├── LOG: "HKBU platform error: <status>"
  │           └── Return error response
  │
  └── IF accessToken is NOT provided (fallback):
        ├── LOG: "No access token provided, saving <provider> key to local database..."
        ├── UPSERT into api_keys table
        │     └── { provider, api_key, updated_at }
        │     └── ON CONFLICT (provider) DO UPDATE
        └── Return { success: true, savedToHkbu: false }
```

---

## 4. Revoke API Key Flow

### Process Log:

```
Frontend: ApiConfigPage.tsx
  └── handleRevokeApiKey(provider)
        ├── Show confirmation dialog
        ├── POST /functions/v1/revoke-api-key
        │     └── Body: { provider: "hkbu", accessToken: "<token>" }
        └── On success:
              ├── Show toast with revokedFromHkbu indicator
              └── Call checkApiStatus(accessToken)

Edge Function: revoke-api-key
  │
  ├── Validate provider is in: ["hkbu", "openrouter", "bolatu", "kimi"]
  │
  ├── IF accessToken is provided:
  │     ├── LOG: "Revoking API key for <provider> from HKBU platform..."
  │     ├── DELETE https://auth.hkbu.tech/api/user/api-keys/<provider>
  │     │     └── Headers: { Authorization: Bearer <accessToken> }
  │     │
  │     └── IF response.ok:
  │           └── LOG: "API key revoked from HKBU platform for <provider>"
  │
  ├── Also delete from local database:
  │     └── DELETE FROM api_keys WHERE provider = <provider>
  │
  └── Return { success: true, revokedFromHkbu: <true if accessToken was used> }
```

---

## 5. Common Issues & Debugging

### Issue: "Key stored locally" even when signed in

**Symptom:** Toast shows "Key stored locally. Sign in with HKBU to sync across devices."

**Cause:** The `accessToken` is not in the session token (older sessions before fix).

**Check:**
```javascript
// In browser console:
const session = JSON.parse(atob(localStorage.getItem('hkbu_session')));
console.log('Has accessToken:', !!session.accessToken);
```

**Solution:** Sign out and sign in again to get a new session with `accessToken`.

---

### Issue: API status shows all unavailable

**Symptom:** All providers show red X even after saving keys.

**Possible causes:**
1. `accessToken` not being sent (check network request body)
2. HKBU platform returned error
3. Edge function crashed

**Debug steps:**
1. Check network tab: POST to `check-api-status` - is `accessToken` in body?
2. Check edge function logs in Supabase dashboard
3. Verify HKBU platform is reachable

---

### Issue: HKBU platform returns 401

**Symptom:** Edge function logs show "HKBU platform error: 401"

**Cause:** Access token has expired.

**Solution:** Sign out and sign in again.

---

## 6. Database Schema Reference

### `api_keys` table (local fallback storage)
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL UNIQUE,  -- 'hkbu', 'openrouter', 'bolatu', 'kimi'
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `user_sessions` table (session management)
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  access_token TEXT NOT NULL,  -- HKBU OAuth access token
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Environment Variables Required

| Variable | Used In | Description |
|----------|---------|-------------|
| `HKBU_CLIENT_ID` | oauth-init, oauth-callback | OAuth client ID |
| `HKBU_CLIENT_SECRET` | oauth-callback | OAuth client secret |
| `LOVABLE_API_KEY` | check-api-status | Built-in AI service key |
| `SUPABASE_URL` | All edge functions | Database connection |
| `SUPABASE_SERVICE_ROLE_KEY` | All edge functions | Service role for DB ops |

---

## 8. HKBU Platform API Reference

Base URL: `https://auth.hkbu.tech`

### Endpoints used:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/api-keys` | Fetch user's saved API keys |
| POST | `/api/user/api-keys` | Save an API key |
| DELETE | `/api/user/api-keys/{keyType}` | Revoke an API key |
| POST | `/api/oauth/token` | Exchange code for access token |

---

*Last updated: 2026-01-06*
