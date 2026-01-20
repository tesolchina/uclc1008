/**
 * @fileoverview Inline hint component for AI feedback areas.
 * Shows API key status and markdown formatting tips.
 */

import { useApiKeyStatus } from '@/contexts/ApiKeyContext';
import { Key, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AiFeedbackHintProps {
  /** Whether to show the markdown tip (default: true) */
  showMarkdownTip?: boolean;
  /** Additional className for styling */
  className?: string;
}

/**
 * Displays an inline hint about API key status and markdown formatting.
 * Use this near AI feedback buttons/textareas to inform students about:
 * 1. Whether their HKBU API key is configured
 * 2. How to use markdown for italics
 */
export function AiFeedbackHint({ showMarkdownTip = true, className = '' }: AiFeedbackHintProps) {
  const { hasPersonalKey, isLoading, studentId, sharedUsage } = useApiKeyStatus();

  // Don't show if loading
  if (isLoading) return null;

  const remaining = sharedUsage ? Math.max(0, sharedUsage.limit - sharedUsage.used) : null;
  const isEmpty = remaining === 0;

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${className}`}>
      {/* API Key Status */}
      {studentId && (
        hasPersonalKey ? (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <Key className="h-3 w-3" />
            HKBU API active
          </span>
        ) : isEmpty ? (
          <span className="inline-flex items-center gap-1 text-destructive">
            <AlertCircle className="h-3 w-3" />
            Daily limit reached.{' '}
            <Link to="/settings" className="underline font-medium hover:text-destructive/80">
              Set up API key
            </Link>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-3 w-3" />
            Using shared API ({remaining}/{sharedUsage?.limit}).{' '}
            <Link to="/settings" className="underline font-medium hover:text-amber-700">
              Get unlimited access
            </Link>
          </span>
        )
      )}

      {!studentId && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <Link to="/settings" className="underline hover:text-foreground">
            Set up API key for AI feedback
          </Link>
        </span>
      )}

      {/* Markdown Tip */}
      {showMarkdownTip && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Info className="h-3 w-3" />
          Use *asterisks* for <em>italics</em>
        </span>
      )}
    </div>
  );
}
