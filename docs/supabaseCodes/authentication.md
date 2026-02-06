# Authentication & Session Management

Edge functions handling OAuth authentication with HKBU platform and session management.

---

## oauth-init

**Path:** `supabase/functions/oauth-init/index.ts`  
**JWT Verification:** `false`

Initiates OAuth authentication flow with HKBU platform.

### Functionality

- Constructs OAuth authorization URL with client ID and redirect URI
- Generates a state parameter containing return URL and nonce for CSRF protection
- Redirects user to `https://auth.hkbu.tech/auth-provider/login`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `HKBU_CLIENT_ID` | OAuth client ID |
| `SUPABASE_URL` | Used to construct callback URL |

### Request

```
GET /oauth-init?return_url=/dashboard
```

### Response

HTTP 302 redirect to HKBU auth page

---

## oauth-callback

**Path:** `supabase/functions/oauth-callback/index.ts`  
**JWT Verification:** `false`

Handles OAuth callback after HKBU authentication.

### Functionality

1. Exchanges authorization code for access token via HKBU token endpoint
2. Parses JWT to extract user information (userId, email, name, role)
3. Upserts user profile and roles in database
4. Creates user session with access token and expiry
5. Redirects to frontend with session token

### Environment Variables

| Variable | Description |
|----------|-------------|
| `HKBU_CLIENT_ID` | OAuth client ID |
| `HKBU_CLIENT_SECRET` | OAuth client secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for DB operations |
| `FRONTEND_URL` | Fallback redirect URL |

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile storage |
| `user_roles` | Role assignments |
| `user_sessions` | Session management |

### Flow Diagram

```
HKBU Auth → oauth-callback → Exchange Code → Parse JWT → Upsert Profile → Create Session → Redirect
```

---

## get-session-access-token

**Path:** `supabase/functions/get-session-access-token/index.ts`  
**JWT Verification:** `false`

Retrieves access token for an existing session.

### Functionality

- Validates session ID and profile ID
- Checks session expiry
- Returns access token if valid

### Request Body

```json
{
  "sessionId": "uuid",
  "profileId": "uuid"
}
```

### Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2025-01-15T12:00:00Z"
}
```

### Error Responses

| Status | Reason |
|--------|--------|
| 400 | Missing sessionId or profileId |
| 401 | Session expired or invalid |
| 404 | Session not found |
