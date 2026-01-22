/**
 * =============================================================================
 * AI LIVE CLASS - AI CONVERSATION HOOK
 * =============================================================================
 * 
 * This hook manages the AI conversation in a live session. It handles:
 * - Sending messages to the AI
 * - Streaming and displaying AI responses
 * - Managing conversation history
 * - Promoting student messages to the conversation
 * 
 * @module ai-live-class/hooks/useAIConversation
 * @version 1.0.0
 * 
 * USAGE:
 * ```typescript
 * const { messages, sendMessage, isGenerating } = useAIConversation({
 *   sessionId: 'session-uuid',
 *   systemPrompt: 'You are an academic writing tutor...',
 * });
 * ```
 * 
 * =============================================================================
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleStreamingResponse } from '../utils/streamParser';
import { AI_CONFIG, ERROR_MESSAGES } from '../constants';
import type { 
  ConversationMessage, 
  MessageAuthor, 
  QueuedMessage,
  AIConversationState,
} from '../types';

// =============================================================================
// HOOK OPTIONS INTERFACE
// =============================================================================

/**
 * Configuration options for the useAIConversation hook.
 */
export interface UseAIConversationOptions {
  /**
   * The session ID this conversation belongs to.
   * Required for database persistence and real-time sync.
   */
  sessionId: string;

  /**
   * System prompt that defines the AI's behavior.
   * This sets the context and personality for the AI assistant.
   */
  systemPrompt: string;

  /**
   * Optional callback when AI finishes generating a response.
   * Useful for analytics or triggering follow-up actions.
   */
  onResponseComplete?: (response: string) => void;

  /**
   * Optional callback for real-time streaming updates.
   * Called with each chunk as the AI generates its response.
   */
  onStreamingUpdate?: (chunk: string, fullContent: string) => void;

  /**
   * Whether to persist messages to the database.
   * Default: true. Set to false for ephemeral/demo sessions.
   */
  persistMessages?: boolean;

  /**
   * User ID for tracking message authorship.
   * Used when the teacher sends messages.
   */
  userId?: string;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for managing AI conversations in a live session.
 * 
 * This hook provides:
 * - Real-time message display and updates
 * - Streaming AI responses with visual feedback
 * - Message persistence to database
 * - Student message promotion from queue
 * 
 * @param options - Configuration options for the conversation
 * @returns State and methods for managing the conversation
 * 
 * @example
 * ```typescript
 * function TeacherChat({ sessionId }: { sessionId: string }) {
 *   const {
 *     messages,
 *     sendMessage,
 *     promoteMessage,
 *     isGenerating,
 *   } = useAIConversation({
 *     sessionId,
 *     systemPrompt: DEFAULT_PROMPTS.ACADEMIC_WRITING,
 *   });
 * 
 *   const handleSend = async (text: string) => {
 *     await sendMessage(text);
 *   };
 * 
 *   return (
 *     <div>
 *       {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}
 *       {isGenerating && <LoadingIndicator />}
 *       <MessageInput onSend={handleSend} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAIConversation(options: UseAIConversationOptions): AIConversationState {
  const {
    sessionId,
    systemPrompt,
    onResponseComplete,
    onStreamingUpdate,
    persistMessages = true,
    userId,
  } = options;

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * All messages in the conversation, ordered chronologically.
   */
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  /**
   * Whether the AI is currently generating a response.
   * Used to show loading states and disable input.
   */
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Whether initial messages are being loaded.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Ref to track the current streaming content for real-time updates.
   * Using a ref prevents unnecessary re-renders during streaming.
   */
  const streamingContentRef = useRef<string>('');

  // ---------------------------------------------------------------------------
  // MESSAGE LOADING
  // ---------------------------------------------------------------------------

  /**
   * Loads existing messages from the database.
   * Called on mount and when sessionId changes.
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Query messages for this session, ordered by creation time
        const { data, error } = await supabase
          .from('ai_conversation_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('[useAIConversation] Error loading messages:', error);
          // Don't show toast - might just be a new session with no messages
        } else if (data) {
          // Map database rows to our type
          setMessages(data.map(row => ({
            id: row.id,
            session_id: row.session_id,
            author: row.author as MessageAuthor,
            content: row.content,
            created_at: row.created_at,
            queued_message_id: row.queued_message_id,
            student_name: row.student_name,
            metadata: row.metadata,
          })));
        }
      } catch (err) {
        console.error('[useAIConversation] Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [sessionId]);

  // ---------------------------------------------------------------------------
  // REAL-TIME SUBSCRIPTION
  // ---------------------------------------------------------------------------

  /**
   * Subscribes to real-time updates for new messages.
   * This allows multiple clients to see the same conversation.
   */
  useEffect(() => {
    if (!sessionId) return;

    // Create a real-time channel for this session's messages
    const channel = supabase
      .channel(`ai-conversation-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_conversation_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          // Add the new message if it's not already in the list
          // (prevents duplicates from our own inserts)
          const newMessage = payload.new as ConversationMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    // Cleanup: remove the channel when unmounting or sessionId changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // ---------------------------------------------------------------------------
  // SEND MESSAGE TO AI
  // ---------------------------------------------------------------------------

  /**
   * Sends a message to the AI and handles the streaming response.
   * 
   * Flow:
   * 1. Add user message to local state and database
   * 2. Send request to AI with conversation history
   * 3. Stream response, updating UI in real-time
   * 4. Save complete AI response to database
   * 
   * @param content - The message content to send
   * @param author - Who is sending the message (default: 'teacher')
   */
  const sendMessage = useCallback(async (
    content: string,
    author: MessageAuthor = 'teacher'
  ): Promise<void> => {
    if (!content.trim() || !sessionId) {
      return;
    }

    // Create message object for the user's message
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      author,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistically add to local state
    setMessages(prev => [...prev, userMessage]);

    // Persist to database if enabled
    if (persistMessages) {
      try {
        await supabase
          .from('ai_conversation_messages')
          .insert({
            id: userMessage.id,
            session_id: sessionId,
            author: userMessage.author,
            content: userMessage.content,
            created_at: userMessage.created_at,
          });
      } catch (err) {
        console.error('[useAIConversation] Error saving user message:', err);
        // Continue anyway - the message is in local state
      }
    }

    // Now get AI response
    setIsGenerating(true);
    streamingContentRef.current = '';

    try {
      // Build the messages array for the AI, including history
      const contextMessages = messages
        .slice(-AI_CONFIG.CONTEXT_MESSAGE_LIMIT) // Limit context size
        .map(m => ({
          role: m.author === 'ai' ? 'assistant' : 'user',
          content: m.content,
        }));

      // Add the new message
      contextMessages.push({
        role: 'user',
        content: content.trim(),
      });

      // Prepare the request
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      // Create a placeholder for the AI response
      const aiMessageId = crypto.randomUUID();
      const aiMessage: ConversationMessage = {
        id: aiMessageId,
        session_id: sessionId,
        author: 'ai',
        content: '', // Will be updated as we stream
        created_at: new Date().toISOString(),
      };

      // Add placeholder to show loading state
      setMessages(prev => [...prev, aiMessage]);

      // Make the streaming request
      const result = await handleStreamingResponse(
        () => fetch(`${supabaseUrl}/functions/v1/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              ...contextMessages,
            ],
            studentId: userId, // For usage tracking
          }),
        }),
        // Streaming callback - update the message content in real-time
        (chunk, fullContent) => {
          streamingContentRef.current = fullContent;
          
          // Update the AI message with new content
          setMessages(prev => prev.map(m => 
            m.id === aiMessageId 
              ? { ...m, content: fullContent }
              : m
          ));

          // Call external callback if provided
          if (onStreamingUpdate) {
            onStreamingUpdate(chunk, fullContent);
          }
        }
      );

      // Handle the result
      if (result.success && result.content) {
        // Update final message content
        setMessages(prev => prev.map(m => 
          m.id === aiMessageId 
            ? { ...m, content: result.content }
            : m
        ));

        // Persist to database
        if (persistMessages) {
          try {
            await supabase
              .from('ai_conversation_messages')
              .insert({
                id: aiMessageId,
                session_id: sessionId,
                author: 'ai',
                content: result.content,
                created_at: aiMessage.created_at,
              });
          } catch (err) {
            console.error('[useAIConversation] Error saving AI message:', err);
          }
        }

        // Call completion callback
        if (onResponseComplete) {
          onResponseComplete(result.content);
        }
      } else {
        // Remove the placeholder message on error
        setMessages(prev => prev.filter(m => m.id !== aiMessageId));
        toast.error(ERROR_MESSAGES.AI_ERROR);
        console.error('[useAIConversation] AI error:', result.error);
      }

    } catch (err) {
      console.error('[useAIConversation] Unexpected error:', err);
      toast.error(ERROR_MESSAGES.AI_ERROR);
    } finally {
      setIsGenerating(false);
      streamingContentRef.current = '';
    }
  }, [sessionId, messages, systemPrompt, persistMessages, userId, onResponseComplete, onStreamingUpdate]);

  // ---------------------------------------------------------------------------
  // PROMOTE STUDENT MESSAGE
  // ---------------------------------------------------------------------------

  /**
   * Promotes a queued student message to the main conversation.
   * 
   * This adds the student's message to the conversation and optionally
   * triggers an AI response to address it.
   * 
   * @param queuedMessage - The queued message to promote
   */
  const promoteMessage = useCallback(async (queuedMessage: QueuedMessage): Promise<void> => {
    if (!sessionId) return;

    // Create the promoted message
    const promotedMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      author: 'student',
      content: queuedMessage.content,
      created_at: new Date().toISOString(),
      queued_message_id: queuedMessage.id,
      student_name: queuedMessage.student_name,
    };

    // Add to local state
    setMessages(prev => [...prev, promotedMessage]);

    // Persist to database
    if (persistMessages) {
      try {
        await supabase
          .from('ai_conversation_messages')
          .insert({
            id: promotedMessage.id,
            session_id: sessionId,
            author: 'student',
            content: promotedMessage.content,
            created_at: promotedMessage.created_at,
            queued_message_id: queuedMessage.id,
            student_name: queuedMessage.student_name,
          });

        // Update the queued message status
        await supabase
          .from('ai_message_queue')
          .update({
            status: 'promoted',
            reviewed_at: new Date().toISOString(),
            promoted_message_id: promotedMessage.id,
          })
          .eq('id', queuedMessage.id);

      } catch (err) {
        console.error('[useAIConversation] Error promoting message:', err);
        toast.error('Failed to promote message');
      }
    }

    // Automatically get AI response to the student's question
    // The AI should address the student directly
    await sendMessage(
      `[Student ${queuedMessage.student_name} asks]: ${queuedMessage.content}`,
      'student'
    );
  }, [sessionId, persistMessages, sendMessage]);

  // ---------------------------------------------------------------------------
  // CLEAR CONVERSATION
  // ---------------------------------------------------------------------------

  /**
   * Clears all messages from the conversation.
   * Teacher-only action for resetting the session.
   */
  const clearConversation = useCallback(async (): Promise<void> => {
    if (!sessionId) return;

    try {
      // Clear from database
      if (persistMessages) {
        await supabase
          .from('ai_conversation_messages')
          .delete()
          .eq('session_id', sessionId);
      }

      // Clear local state
      setMessages([]);
      toast.success('Conversation cleared');
    } catch (err) {
      console.error('[useAIConversation] Error clearing conversation:', err);
      toast.error('Failed to clear conversation');
    }
  }, [sessionId, persistMessages]);

  // ---------------------------------------------------------------------------
  // RETURN STATE AND METHODS
  // ---------------------------------------------------------------------------

  return {
    messages,
    isGenerating,
    isLoading,
    sendMessage,
    promoteMessage,
    clearConversation,
  };
}
