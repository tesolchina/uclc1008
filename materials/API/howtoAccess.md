# How to Access HKBU Gen AI API

This guide provides all the information needed to access Large Language Models (LLMs) via the HKBU Gen AI Platform API.

## Quick Start

- **API Base URL**: `https://genai.hkbu.edu.hk/api/v0/rest`
- **API Key**: See `/materials/API/HKBUkey.md`
- **Authentication**: Use `api-key` header (Azure OpenAI format)
- **API Format**: Azure OpenAI REST API compatible

## API Key

Your API key is stored in `/materials/API/HKBUkey.md`. The key is a UUID format and should be kept secure.

**Authentication Header Format:**

```
api-key: YOUR_API_KEY_HERE
```

## Available Models

The HKBU Gen AI Platform provides access to **14 different LLMs**:

### GPT Models (API Version: `2024-12-01-preview`)

- `gpt-5` - Latest GPT model
- `gpt-5-mini` - Smaller, faster GPT-5 variant
- `gpt-4.1` - Enhanced GPT-4
- `gpt-4.1-mini` - Smaller GPT-4.1 variant
- `o1` - Reasoning model
- `o3-mini` - Smaller reasoning model

### Gemini Models

- `gemini-2.5-pro` - Google's advanced Gemini model
- `gemini-2.5-flash` - Faster Gemini variant

### Other Models

- `llama-4-maverick` - Meta's Llama model
- `qwen3-max` - Alibaba's Qwen model
- `qwen-plus` - Qwen variant
- `deepseek-r1` - DeepSeek reasoning model
- `deepseek-v3` - DeepSeek latest model

## API Endpoints

### 1. List Available Models

**Endpoint:** `GET /models`

**Full URL:** `https://genai.hkbu.edu.hk/api/v0/rest/models`

**Example Request:**

```bash
curl -X GET "https://genai.hkbu.edu.hk/api/v0/rest/models" \
  -H "api-key: YOUR_API_KEY"
```

**Response:**

```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-5",
      "object": "model",
      "owned_by": "hkbu-genai-platform"
    },
    ...
  ]
}
```

### 2. Chat Completions

**Endpoint:** `POST /deployments/{model}/chat/completions`

**Alternative Endpoint:** `POST /openai/deployments/{model}/chat/completions`

**Full URL:**

- `https://genai.hkbu.edu.hk/api/v0/rest/deployments/{model}/chat/completions`
- `https://genai.hkbu.edu.hk/api/v0/rest/openai/deployments/{model}/chat/completions`

**Required Headers:**

- `api-key`: Your API key
- `Content-Type`: `application/json`

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ],
  "max_tokens": 100
}
```

## Usage Examples

### cURL Example

```bash
curl -X POST "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-5/chat/completions" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello! Explain quantum computing in simple terms."}
    ],
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

### Python Example

```python
import requests
import json

# Configuration
API_KEY = "YOUR_API_KEY_HERE"  # Get from /materials/API/HKBUkey.md
BASE_URL = "https://genai.hkbu.edu.hk/api/v0/rest"
MODEL = "gpt-5"  # or any other available model

# Chat completion request
def chat_completion(messages, model=MODEL, max_tokens=200, temperature=0.7):
    url = f"{BASE_URL}/deployments/{model}/chat/completions"
  
    headers = {
        "api-key": API_KEY,
        "Content-Type": "application/json"
    }
  
    payload = {
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature
    }
  
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

# Example usage
messages = [
    {"role": "user", "content": "What is machine learning?"}
]

result = chat_completion(messages)
print(json.dumps(result, indent=2))
```

### JavaScript/Node.js Example

```javascript
const fetch = require('node-fetch'); // or use native fetch in Node 18+

const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://genai.hkbu.edu.hk/api/v0/rest";
const MODEL = "gpt-5";

async function chatCompletion(messages, model = MODEL, maxTokens = 200) {
  const url = `${BASE_URL}/deployments/${model}/chat/completions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return await response.json();
}

// Example usage
const messages = [
  { role: "user", content: "Explain AI in simple terms" }
];

chatCompletion(messages)
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(error => console.error("Error:", error));
```

## Advanced Features

### Function Calling (Tools)

The API supports OpenAI-compatible function calling for GPT and Gemini models.

**Supported Models:**

- Azure OpenAI GPT models (streaming + non-streaming)
- Gemini models (non-streaming only)

**Example with Tools:**

```json
{
  "messages": [
    {"role": "user", "content": "What's the weather in Hong Kong?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the weather for a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

### Streaming Responses

Streaming is supported for Azure OpenAI GPT models. To enable streaming, add `"stream": true` to your request:

```python
payload = {
    "messages": messages,
    "stream": True,
    "max_tokens": 200
}

response = requests.post(url, headers=headers, json=payload, stream=True)

for line in response.iter_lines():
    if line:
        # Process streaming response
        print(line.decode('utf-8'))
```

## Request Parameters

Common parameters for chat completions:

| Parameter       | Type    | Description                                        | Default       |
| --------------- | ------- | -------------------------------------------------- | ------------- |
| `messages`    | array   | Array of message objects                           | Required      |
| `max_tokens`  | integer | Maximum tokens to generate                         | Model default |
| `temperature` | number  | Sampling temperature (0-2)                         | 1.0           |
| `top_p`       | number  | Nucleus sampling parameter                         | 1.0           |
| `stream`      | boolean | Enable streaming responses                         | false         |
| `tools`       | array   | Function definitions for tool calling              | null          |
| `tool_choice` | string  | Tool choice strategy ("auto", "none", or function) | "auto"        |

## Response Format

**Successful Response:**

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response text here",
        "annotations": [],
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

## Error Handling

**Common Error Responses:**

- **401 Unauthorized**: Invalid or missing API key
- **404 Not Found**: Invalid model name or endpoint
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

**Example Error Response:**

```json
{
  "error": {
    "message": "Error description",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

## Best Practices

1. **Keep your API key secure**: Never commit API keys to version control
2. **Use appropriate models**: Choose models based on your needs (speed vs. quality)
3. **Set reasonable limits**: Use `max_tokens` to control response length and costs
4. **Handle errors gracefully**: Implement proper error handling in your code
5. **Respect rate limits**: Implement retry logic with exponential backoff
6. **Monitor usage**: Track token usage to manage costs

## Additional Resources

- **API Documentation**: See `/materials/API/docs.md` for Swagger specification
- **Test Results**: See `/materials/API/HKBU_API_TEST_RESULTS.md` for test results
- **Azure OpenAI Reference**: [Microsoft Azure OpenAI API Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/reference?view=foundry-classic)
- **Web Platform**: https://genai.hkbu.edu.hk/

## Support

For issues or questions:

- **HKBU IT Support**: hotline@hkbu.edu.hk
- **Platform**: Access the web interface at https://genai.hkbu.edu.hk/ (requires HKBU SSO login)

---

**Last Updated**: Based on successful API tests conducted in January 2025
**API Status**: ✅ Fully functional and tested

