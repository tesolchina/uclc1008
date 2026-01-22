/**
 * =============================================================================
 * AI LIVE CLASS - STREAM PARSER UTILITIES
 * =============================================================================
 * 
 * Utilities for parsing Server-Sent Events (SSE) streams from AI APIs.
 * These functions handle the streaming response format used by the chat
 * edge function to provide real-time AI responses.
 * 
 * @module ai-live-class/utils/streamParser
 * @version 1.0.0
 * 
 * =============================================================================
 */

/**
 * Callback function type for receiving streamed content chunks.
 * Called each time a new piece of content is received from the stream.
 * 
 * @param chunk - The new content chunk received
 * @param fullContent - The accumulated content so far
 */
export type StreamChunkCallback = (chunk: string, fullContent: string) => void;

/**
 * Result of parsing a complete stream.
 */
export interface StreamParseResult {
  /** The complete accumulated content */
  content: string;
  
  /** Whether the stream completed successfully */
  success: boolean;
  
  /** Error message if parsing failed */
  error?: string;
  
  /** Token usage statistics if available */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Parses a single SSE data line to extract the content delta.
 * 
 * SSE format: "data: {json_object}\n\n"
 * The JSON object contains OpenAI-style response chunks.
 * 
 * @param line - A single line from the SSE stream
 * @returns The content delta if present, null otherwise
 * 
 * @example
 * ```typescript
 * const content = parseSSELine('data: {"choices":[{"delta":{"content":"Hello"}}]}');
 * console.log(content); // "Hello"
 * 
 * parseSSELine('data: [DONE]'); // null (end signal)
 * parseSSELine('event: heartbeat'); // null (not a data line)
 * ```
 */
export function parseSSELine(line: string): string | null {
  // Only process lines starting with "data: "
  if (!line.startsWith('data: ')) {
    return null;
  }
  
  // Extract the JSON portion
  const jsonStr = line.slice(6).trim();
  
  // Handle the end-of-stream marker
  if (jsonStr === '[DONE]' || jsonStr === '') {
    return null;
  }
  
  try {
    // Parse the JSON payload
    const parsed = JSON.parse(jsonStr);
    
    // Extract content from OpenAI-style response format
    // Structure: { choices: [{ delta: { content: "..." } }] }
    const content = parsed.choices?.[0]?.delta?.content;
    
    // Return the content if it exists and is a string
    return typeof content === 'string' ? content : null;
  } catch {
    // JSON parsing failed - might be partial data or different format
    // This is normal for some SSE implementations, so we silently skip
    return null;
  }
}

/**
 * Parses multiple lines from an SSE chunk.
 * 
 * SSE data often arrives in chunks that may contain multiple events
 * separated by newlines. This function processes all lines in a chunk.
 * 
 * @param chunk - A chunk of SSE data that may contain multiple lines
 * @returns Array of content strings extracted from the chunk
 * 
 * @example
 * ```typescript
 * const chunk = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n' +
 *               'data: {"choices":[{"delta":{"content":" World"}}]}\n\n';
 * const contents = parseSSEChunk(chunk);
 * console.log(contents); // ["Hello", " World"]
 * ```
 */
export function parseSSEChunk(chunk: string): string[] {
  const results: string[] = [];
  
  // Split by newlines and process each line
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    const content = parseSSELine(line);
    if (content !== null) {
      results.push(content);
    }
  }
  
  return results;
}

/**
 * Reads and parses a complete SSE stream from a Response body.
 * 
 * This is the main function for processing streaming AI responses.
 * It reads the stream incrementally, parsing each chunk and calling
 * the optional callback for real-time updates.
 * 
 * @param body - The ReadableStream from a fetch Response
 * @param onChunk - Optional callback for each content chunk received
 * @returns Promise resolving to the complete parsed result
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/chat', { method: 'POST', body: ... });
 * 
 * // With real-time updates
 * const result = await parseSSEStream(response.body, (chunk, full) => {
 *   console.log('New chunk:', chunk);
 *   updateUI(full); // Update UI with accumulated content
 * });
 * 
 * // Without real-time updates (just get final result)
 * const result = await parseSSEStream(response.body);
 * console.log('Complete response:', result.content);
 * ```
 */
export async function parseSSEStream(
  body: ReadableStream<Uint8Array>,
  onChunk?: StreamChunkCallback
): Promise<StreamParseResult> {
  // Create a reader for the stream
  const reader = body.getReader();
  
  // Create a decoder to convert bytes to text
  // Using { stream: true } ensures proper handling of multi-byte characters
  const decoder = new TextDecoder();
  
  // Accumulate the complete content
  let fullContent = '';
  
  try {
    // Read the stream until it's done
    while (true) {
      const { done, value } = await reader.read();
      
      // Stream is complete
      if (done) {
        break;
      }
      
      // Decode the chunk (value is Uint8Array)
      const chunk = decoder.decode(value, { stream: true });
      
      // Parse all content from this chunk
      const contents = parseSSEChunk(chunk);
      
      // Process each piece of content
      for (const content of contents) {
        fullContent += content;
        
        // Call the callback if provided
        if (onChunk) {
          onChunk(content, fullContent);
        }
      }
    }
    
    // Successfully completed
    return {
      content: fullContent,
      success: true,
    };
    
  } catch (error) {
    // Error during stream processing
    const errorMessage = error instanceof Error ? error.message : 'Unknown stream error';
    
    return {
      content: fullContent, // Return what we got before the error
      success: false,
      error: errorMessage,
    };
    
  } finally {
    // Always release the reader lock
    reader.releaseLock();
  }
}

/**
 * Creates a streaming response handler that wraps the parsing logic.
 * 
 * This is a convenience function that combines the common pattern of
 * fetching and parsing an SSE stream with error handling.
 * 
 * @param fetchFn - Async function that performs the fetch and returns the Response
 * @param onChunk - Optional callback for each content chunk
 * @returns Promise resolving to the complete parsed result
 * 
 * @example
 * ```typescript
 * const result = await handleStreamingResponse(
 *   () => fetch('/api/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ messages: [...] }),
 *   }),
 *   (chunk, full) => setContent(full) // React state update
 * );
 * 
 * if (result.success) {
 *   saveToDatabase(result.content);
 * } else {
 *   showError(result.error);
 * }
 * ```
 */
export async function handleStreamingResponse(
  fetchFn: () => Promise<Response>,
  onChunk?: StreamChunkCallback
): Promise<StreamParseResult> {
  try {
    // Perform the fetch
    const response = await fetchFn();
    
    // Check for HTTP errors
    if (!response.ok) {
      return {
        content: '',
        success: false,
        error: `HTTP error: ${response.status} ${response.statusText}`,
      };
    }
    
    // Check that we have a body to read
    if (!response.body) {
      return {
        content: '',
        success: false,
        error: 'Response has no body',
      };
    }
    
    // Parse the stream
    return await parseSSEStream(response.body, onChunk);
    
  } catch (error) {
    // Network error or other fetch failure
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    
    return {
      content: '',
      success: false,
      error: errorMessage,
    };
  }
}
