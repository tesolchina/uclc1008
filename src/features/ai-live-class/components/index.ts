/**
 * =============================================================================
 * AI LIVE CLASS - COMPONENTS INDEX
 * =============================================================================
 * 
 * Central export point for all AI Live Class components.
 * Import from this file for clean, organized imports.
 * 
 * @module ai-live-class/components
 * 
 * USAGE:
 * ```typescript
 * import { AISessionLauncher } from '@/features/ai-live-class/components';
 * ```
 * 
 * =============================================================================
 */

// Session Launcher - Reusable component for starting sessions
export { AISessionLauncher } from './AISessionLauncher';
export type { AISessionLauncherProps } from './AISessionLauncher';

// Teacher View - Main teacher interface with AI conversation and student queue
export { TeacherAIClassView } from './TeacherAIClassView';
export type { TeacherAIClassViewProps } from './TeacherAIClassView';

// Student View - Audience view with question submission
export { StudentAIClassView } from './StudentAIClassView';
export type { StudentAIClassViewProps } from './StudentAIClassView';

// Task Components
export { ChatTaskDisplay } from './ChatTaskDisplay';
export { TaskGenerationPanel } from './TaskGenerationPanel';
export { TaskLibrarySelector } from './TaskLibrarySelector';
