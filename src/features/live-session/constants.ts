/**
 * Live Session Constants
 * 
 * Configuration values for the live session system.
 * Modify these to customize behavior in different contexts.
 */

import type { LiveSessionConfig } from './types';

// ============= Default Configuration =============

export const DEFAULT_CONFIG: LiveSessionConfig = {
  joinBaseUrl: 'https://ue1.hkbu.tech/join',
  heartbeatInterval: 5000, // 5 seconds
  participantRefreshInterval: 10000, // 10 seconds
  debug: false,
};

// ============= Storage Keys =============

export const STORAGE_KEYS = {
  sessionState: 'live_session_state',
  studentIdentifier: 'studentIdentifier',
  pendingSessionCode: 'pendingSessionCode',
  pendingDisplayName: 'pendingDisplayName',
} as const;

// ============= Session Limits =============

export const SESSION_LIMITS = {
  maxParticipants: 100,
  sessionCodeLength: 6,
  promptMaxLength: 500,
  displayNameMaxLength: 50,
} as const;

// ============= Anonymous Animals =============
// Used for anonymous participant display

export const ANONYMOUS_ANIMALS = [
  { name: 'Panda', emoji: '🐼' },
  { name: 'Fox', emoji: '🦊' },
  { name: 'Owl', emoji: '🦉' },
  { name: 'Koala', emoji: '🐨' },
  { name: 'Tiger', emoji: '🐯' },
  { name: 'Penguin', emoji: '🐧' },
  { name: 'Dolphin', emoji: '🐬' },
  { name: 'Rabbit', emoji: '🐰' },
  { name: 'Bear', emoji: '🐻' },
  { name: 'Cat', emoji: '🐱' },
  { name: 'Dog', emoji: '🐶' },
  { name: 'Lion', emoji: '🦁' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Unicorn', emoji: '🦄' },
  { name: 'Dragon', emoji: '🐲' },
  { name: 'Butterfly', emoji: '🦋' },
] as const;

// ============= Quick Prompts =============
// Pre-defined prompts for teachers

export const QUICK_PROMPTS = {
  focus: { type: 'focus' as const, content: 'Please pay attention!' },
  timer2min: { type: 'timer' as const, content: '2 minutes remaining' },
  timerUp: { type: 'timer' as const, content: 'Time is up!' },
  moveOn: { type: 'message' as const, content: 'Moving on to the next question' },
  goodJob: { type: 'message' as const, content: 'Great work everyone! 👏' },
} as const;

// ============= Status Labels =============

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  waiting: { label: 'Waiting', color: 'secondary' },
  active: { label: 'Active', color: 'default' },
  paused: { label: 'Paused', color: 'warning' },
  ended: { label: 'Ended', color: 'destructive' },
};
