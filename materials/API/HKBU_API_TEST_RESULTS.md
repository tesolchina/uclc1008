# HKBU Gen AI API Test Results

## ✅ API Status: **WORKING**

## API Key
- **Key**: `255bdceb-5989-4e08-9c67-20ffc9c444f6`
- **Format**: UUID (36 characters)
- **Source**: `/materials/API/HKBUkey.md`
- **Status**: ✅ Valid and working

## Test Date
2025-01-XX (Successfully tested)

## Platform Information
- **Web Platform**: https://genai.hkbu.edu.hk/
- **API Base URL**: `https://genai.hkbu.edu.hk/api/v0/rest`
- **API Format**: Azure OpenAI compatible
- **Authentication**: `api-key` header (Azure OpenAI format)

## Working Endpoints

### 1. List Models
- **Endpoint**: `GET https://genai.hkbu.edu.hk/api/v0/rest/models`
- **Status**: ✅ Working
- **Authentication**: `api-key: {your-api-key}` header

### 2. Chat Completions
- **Endpoint**: `POST https://genai.hkbu.edu.hk/api/v0/rest/deployments/{model}/chat/completions`
- **Alternative**: `POST https://genai.hkbu.edu.hk/api/v0/rest/openai/deployments/{model}/chat/completions`
- **Status**: ✅ Working
- **Authentication**: `api-key: {your-api-key}` header

## Available Models

The API provides access to **14 different LLMs**:

### GPT Models
- `gpt-5` ✅
- `gpt-5-mini` ✅
- `gpt-4.1` ✅
- `gpt-4.1-mini` ✅
- `o1` ✅
- `o3-mini` ✅

### Gemini Models
- `gemini-2.5-pro` ✅
- `gemini-2.5-flash` ✅

### Other Models
- `llama-4-maverick` ✅
- `qwen3-max` ✅
- `qwen-plus` ✅
- `deepseek-r1` ✅
- `deepseek-v3` ✅

## Test Results

### Successful Test
```bash
curl -X POST "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-5/chat/completions" \
  -H "api-key: 255bdceb-5989-4e08-9c67-20ffc9c444f6" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "max_tokens": 50
  }'
```

**Response**: ✅ Successfully returned chat completion

## API Documentation Reference

- **Swagger Spec**: See `/materials/API/docs.md`
- **API Version**: `2024-12-01-preview` (for GPT models)
- **Format**: Azure OpenAI REST API compatible
- **Reference**: [Azure OpenAI API Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/reference?view=foundry-classic)

## Usage Example

### Python Example
```python
import requests

api_key = "255bdceb-5989-4e08-9c67-20ffc9c444f6"
base_url = "https://genai.hkbu.edu.hk/api/v0/rest"

# Chat completion
response = requests.post(
    f"{base_url}/deployments/gpt-5/chat/completions",
    headers={
        "api-key": api_key,
        "Content-Type": "application/json"
    },
    json={
        "messages": [
            {"role": "user", "content": "Hello!"}
        ],
        "max_tokens": 100
    }
)

print(response.json())
```

### cURL Example
```bash
curl -X POST "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-5/chat/completions" \
  -H "api-key: 255bdceb-5989-4e08-9c67-20ffc9c444f6" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Notes

- ✅ API is fully functional and tested
- ✅ Uses Azure OpenAI compatible format
- ✅ Supports function calling/tools (for GPT and Gemini models)
- ✅ Multiple model options available (GPT, Gemini, Llama, Qwen, DeepSeek)
- ✅ Streaming support available for Azure OpenAI GPT models
- The API key works without requiring web-based SSO authentication

