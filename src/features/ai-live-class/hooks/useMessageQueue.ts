/**
 * =============================================================================
 * AI LIVE CLASS - MESSAGE QUEUE HOOK
 * =============================================================================
 * 
 * This hook manages the moderation queue for student messages.
 * Teachers use this to review, promote, or dismiss student submissions.
 * 
 * @module ai-live-class/hooks/useMessageQueue
 * @version 1.0.0
 * 
 * USAGE:
 * ```typescript
 * const { queue, pendingCount, promote, dismiss } = useMessageQueue({
 *   sessionId: 'session-uuid',
 * });
 * ```
 * 
 * =============================================================================
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QUEUE_CONFIG } from '../constants';
import type { QueuedMessage, QueueStatus, MessageQueueState } from '../types';

// =============================================================================
// HOOK OPTIONS INTERFACE
// =============================================================================

/**
 * Configuration options for the useMessageQueue hook.
 */
export interface UseMessageQueueOptions {
  /**
   * The session ID to manage the queue for.
   */
  sessionId: string;

  /**
   * Optional callback when a new message is received.
   * Useful for notifications or sound effects.
   */
  onNewMessage?: (message: QueuedMessage) => void;

  /**
   * Optional callback when a message is promoted.
   */
  onMessagePromoted?: (message: QueuedMessage) => void;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for managing the student message moderation queue.
 * 
 * Features:
 * - Real-time queue updates via Supabase subscription
 * - Promote/dismiss actions with database persistence
 * - Pending count for badge displays
 * - Highlight toggling for prioritization
 * 
 * @param options - Configuration options
 * @returns State and methods for queue management
 * 
 * @example
 * ```typescript
 * function MessageModerationPanel({ sessionId }: { sessionId: string }) {
 *   const {
 *     queue,
 *     pendingCount,
 *     promote,
 *     dismiss,
 *     toggleHighlight,
 *   } = useMessageQueue({ sessionId });
 * 
 *   return (
 *     <div>
 *       <Badge>{pendingCount} pending</Badge>
 *       {queue.map(msg => (
 *         <QueueItem
 *           key={msg.id}
 *           message={msg}
 *           onPromote={() => promote(msg.id)}
 *           onDismiss={() => dismiss(msg.id)}
 *           onHighlight={() => toggleHighlight(msg.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMessageQueue(options: UseMessageQueueOptions): MessageQueueState {
  const { sessionId, onNewMessage, onMessagePromoted } = options;

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * All messages in the queue for this session.
   * Includes pending, promoted, and dismissed messages.
   */
  const [queue, setQueue] = useState<QueuedMessage[]>([]);

  /**
   * Whether the queue is currently loading.
   */
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  /**
   * Count of messages with 'pending' status.
   * Used for badge displays and notifications.
   */
  const pendingCount = queue.filter(m => m.status === 'pending').length;

  // ---------------------------------------------------------------------------
  // INITIAL DATA LOADING
  // ---------------------------------------------------------------------------

  /**
   * Loads existing queue messages from the database.
   */
  useEffect(() => {
    const loadQueue = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch queue messages, prioritizing pending and recent
        const { data, error } = await supabase
          .from('ai_message_queue')
          .select('*')
          .eq('session_id', sessionId)
          .order('submitted_at', { ascending: false })
          .limit(QUEUE_CONFIG.VISIBLE_QUEUE_SIZE);

        if (error) {
          console.error('[useMessageQueue] Error loading queue:', error);
        } else if (data) {
          setQueue(data.map(row => ({
            id: row.id,
            session_id: row.session_id,
            student_id: row.student_id,
            student_name: row.student_name,
            content: row.content,
            status: row.status as QueueStatus,
            submitted_at: row.submitted_at,
            reviewed_at: row.reviewed_at,
            promoted_message_id: row.promoted_message_id,
            is_highlighted: row.is_highlighted,
          })));
        }
      } catch (err) {
        console.error('[useMessageQueue] Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQueue();
  }, [sessionId]);

  // ---------------------------------------------------------------------------
  // REAL-TIME SUBSCRIPTION
  // ---------------------------------------------------------------------------

  /**
   * Subscribes to real-time updates for queue changes.
   * Handles inserts (new messages) and updates (status changes).
   */
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`ai-message-queue-${sessionId}`)
      // Handle new messages being added to the queue
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_message_queue',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as QueuedMessage;
          
          // Add to queue if not already present
          setQueue(prev => {
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            // Add at the beginning (most recent first)
            return [newMessage, ...prev];
          });

          // Trigger callback for new message notification
          if (onNewMessage) {
            onNewMessage(newMessage);
          }
        }
      )
      // Handle status updates (promote/dismiss)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_message_queue',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as QueuedMessage;
          
          // Update the message in the queue
          setQueue(prev => prev.map(m => 
            m.id === updatedMessage.id ? updatedMessage : m
          ));

          // Trigger callback if message was promoted
          if (updatedMessage.status === 'promoted' && onMessagePromoted) {
            onMessagePromoted(updatedMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, onNewMessage, onMessagePromoted]);

  // ---------------------------------------------------------------------------
  // PROMOTE MESSAGE
  // ---------------------------------------------------------------------------

  /**
   * Promotes a message to the main conversation.
   * Updates the status to 'promoted' and records the review time.
   * 
   * @param messageId - ID of the message to promote
   */
  const promote = useCallback(async (messageId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ai_message_queue')
        .update({
          status: 'promoted',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) {
        console.error('[useMessageQueue] Error promoting message:', error);
        toast.error('Failed to promote message');
        return;
      }

      // Update local state optimistically
      // (Real-time subscription will also update, but this is faster)
      setQueue(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, status: 'promoted' as QueueStatus, reviewed_at: new Date().toISOString() }
          : m
      ));

      toast.success('Message promoted to conversation');
    } catch (err) {
      console.error('[useMessageQueue] Unexpected error:', err);
      toast.error('Failed to promote message');
    }
  }, []);

  // ---------------------------------------------------------------------------
  // DISMISS MESSAGE
  // ---------------------------------------------------------------------------

  /**
   * Dismisses a message without promoting it.
   * The message remains in the queue for record-keeping.
   * 
   * @param messageId - ID of the message to dismiss
   */
  const dismiss = useCallback(async (messageId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ai_message_queue')
        .update({
          status: 'dismissed',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) {
        console.error('[useMessageQueue] Error dismissing message:', error);
        toast.error('Failed to dismiss message');
        return;
      }

      // Update local state
      setQueue(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, status: 'dismissed' as QueueStatus, reviewed_at: new Date().toISOString() }
          : m
      ));
    } catch (err) {
      console.error('[useMessageQueue] Unexpected error:', err);
      toast.error('Failed to dismiss message');
    }
  }, []);

  // ---------------------------------------------------------------------------
  // DISMISS ALL PENDING
  // ---------------------------------------------------------------------------

  /**
   * Dismisses all pending messages at once.
   * Useful for clearing the queue at the end of a session.
   */
  const dismissAll = useCallback(async (): Promise<void> => {
    const pendingIds = queue
      .filter(m => m.status === 'pending')
      .map(m => m.id);

    if (pendingIds.length === 0) {
      toast.info('No pending messages to dismiss');
      return;
    }

    try {
      const { error } = await supabase
        .from('ai_message_queue')
        .update({
          status: 'dismissed',
          reviewed_at: new Date().toISOString(),
        })
        .in('id', pendingIds);

      if (error) {
        console.error('[useMessageQueue] Error dismissing all:', error);
        toast.error('Failed to dismiss messages');
        return;
      }

      // Update local state
      setQueue(prev => prev.map(m => 
        pendingIds.includes(m.id)
          ? { ...m, status: 'dismissed' as QueueStatus, reviewed_at: new Date().toISOString() }
          : m
      ));

      toast.success(`Dismissed ${pendingIds.length} messages`);
    } catch (err) {
      console.error('[useMessageQueue] Unexpected error:', err);
      toast.error('Failed to dismiss messages');
    }
  }, [queue]);

  // ---------------------------------------------------------------------------
  // TOGGLE HIGHLIGHT
  // ---------------------------------------------------------------------------

  /**
   * Toggles the highlight status of a message.
   * Highlighted messages appear prominently for teacher attention.
   * 
   * @param messageId - ID of the message to toggle
   */
  const toggleHighlight = useCallback(async (messageId: string): Promise<void> => {
    // Find current highlight status
    const message = queue.find(m => m.id === messageId);
    if (!message) return;

    const newHighlightStatus = !message.is_highlighted;

    try {
      const { error } = await supabase
        .from('ai_message_queue')
        .update({ is_highlighted: newHighlightStatus })
        .eq('id', messageId);

      if (error) {
        console.error('[useMessageQueue] Error toggling highlight:', error);
        return;
      }

      // Update local state
      setQueue(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, is_highlighted: newHighlightStatus }
          : m
      ));
    } catch (err) {
      console.error('[useMessageQueue] Unexpected error:', err);
    }
  }, [queue]);

  // ---------------------------------------------------------------------------
  // RETURN STATE AND METHODS
  // ---------------------------------------------------------------------------

  return {
    queue,
    pendingCount,
    isLoading,
    promote,
    dismiss,
    dismissAll,
    toggleHighlight,
  };
}
