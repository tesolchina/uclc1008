# API Key Management

Edge functions for managing AI API keys across multiple providers.

---

## check-api-status

**Path:** `supabase/functions/check-api-status/index.ts`  
**JWT Verification:** `false`

Checks availability of various AI API keys for the current user.

### Functionality

1. Fetches API keys from HKBU platform (if authenticated via access token)
2. Checks per-student saved keys in `students` table
3. Falls back to system-level keys in `api_keys` table
4. Returns masked key previews (first 2 + last 4 characters)

### Supported Providers

| Provider | Key Field | Description |
|----------|-----------|-------------|
| `hkbu` | `hkbu_api_key` | HKBU GenAI Platform |
| `openrouter` | - | OpenRouter API |
| `bolatu` | - | Bolatu (BLT) API |
| `kimi` | - | Kimi API |

### Request

```
POST /check-api-status
Content-Type: application/json

{
  "accessToken": "optional-hkbu-access-token",
  "studentId": "optional-student-id"
}
```

### Response

```json
{
  "statuses": [
    {
      "provider": "hkbu",
      "available": true,
      "source": "student",
      "maskedKey": "ab••••1234"
    },
    {
      "provider": "openrouter",
      "available": false,
      "source": null,
      "maskedKey": null
    }
  ],
  "authenticated": true
}
```

### Key Resolution Order

```
1. HKBU Platform (via access token) → highest priority
2. Student's saved key (students.hkbu_api_key)
3. System shared key (api_keys table)
4. Not available
```

---

## save-api-key

**Path:** `supabase/functions/save-api-key/index.ts`  
**JWT Verification:** `false`

Validates and saves API keys for students.

### Functionality

1. Validates HKBU API key by making test request to GenAI endpoint
2. Supports `testOnly` mode for validation without saving
3. Saves validated key to student's record in `students` table
4. Logs operations to `process_logs` table

### HKBU Validation

**Endpoint:** `https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions`

Test request:
```json
{
  "messages": [{"role": "user", "content": "Hi"}],
  "max_tokens": 5
}
```

### Request Body

```json
{
  "provider": "hkbu",
  "apiKey": "your-api-key-here",
  "studentId": "student-identifier",
  "testOnly": false
}
```

### Response

**Success:**
```json
{
  "success": true,
  "message": "API key validated and saved successfully"
}
```

**Test Only:**
```json
{
  "success": true,
  "message": "API key is valid",
  "testOnly": true
}
```

**Validation Failed:**
```json
{
  "success": false,
  "error": "Invalid API key - authentication failed"
}
```

---

## revoke-api-key

**Path:** `supabase/functions/revoke-api-key/index.ts`  
**JWT Verification:** `false`

Revokes API keys from both HKBU platform and local database.

### Functionality

1. Attempts to revoke from HKBU platform via DELETE or POST with empty key
2. Removes from shared `api_keys` table (if no studentId provided)
3. Clears `hkbu_api_key` from student record (if studentId provided)

### Request Body

```json
{
  "provider": "hkbu",
  "studentId": "optional-student-id",
  "accessToken": "optional-for-hkbu-platform-revocation"
}
```

### Response

```json
{
  "success": true,
  "message": "API key revoked successfully"
}
```

### Database Operations

| Scenario | Action |
|----------|--------|
| With studentId | `UPDATE students SET hkbu_api_key = NULL WHERE student_id = ?` |
| Without studentId | `DELETE FROM api_keys WHERE provider = ?` |
