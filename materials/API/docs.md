HKBU GenAI Platform API Service – GPT Models Swagger Specification
OAS 3.0
The HKBU GenAI Platform API Service provides access to various GPT models through Azure OpenAI integration.

Available Models and API Versions:

Model Name	API Version
gpt-5	2024-12-01-preview
gpt-5-mini	2024-12-01-preview
gpt-4.1	2024-12-01-preview
gpt-4.1-mini	2024-12-01-preview
o1	2024-12-01-preview
o3-mini	2024-12-01-preview
You can refer to GPT API documentation for further information.

To test the REST API, you can use:

Postman for Windows
Command line – Curl
Python Example
Function Calling (Tools) Support

Tools are OpenAI-compatible function definitions passed via tools and tool_choice in the request body.
Supported for: Azure OpenAI GPT (streaming + non‑streaming), Gemini (non‑streaming). Other providers are currently gated.
When a tool is invoked, the assistant message may return tool_calls and content: null.
Example tool definition:

{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the weather for a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": { "type": "string" },
            "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
Servers

{protocol}://{endpoint}/api/v0/rest - HKBU GenAI Platform API
Computed URL:https://genai.hkbu.edu.hk/api/v0/rest
Server variables
protocol
https
endpoint
genai.hkbu.edu.hk

Authorize
Chat Completions


POST
/deployments/{modelDeploymentName}/chat/completions
Creates a completion for the chat message



POST
/openai/deployments/{modelDeploymentName}/chat/completions
Creates a completion for the chat message



Schemas
ToolFunctionDto
ToolDto
ToolChoiceFunctionDto
ToolCall
CreateChatCompletionDto
CreateEmbeddingsDto