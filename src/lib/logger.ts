/**
 * @fileoverview Client-side logging utility for debugging and error tracking.
 * 
 * This module provides a consistent logging interface with:
 * - Log levels (debug, info, warn, error)
 * - Structured log context
 * - Console output with formatting
 * - Optional remote logging integration
 * 
 * @example
 * import { logger } from '@/lib/logger';
 * 
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to load data', { endpoint: '/api/data', status: 500 });
 */

// ============================================================================
// Types
// ============================================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

interface LoggerConfig {
  /** Minimum level to output (default: 'info' in production, 'debug' in development) */
  minLevel: LogLevel;
  /** Whether to include timestamps in console output */
  showTimestamp: boolean;
  /** Whether to output to console */
  enableConsole: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDevelopment = import.meta.env.DEV;

const defaultConfig: LoggerConfig = {
  minLevel: isDevelopment ? 'debug' : 'info',
  showTimestamp: true,
  enableConsole: true,
};

// ============================================================================
// Logger Implementation
// ============================================================================

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Checks if a log level should be output based on configuration
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  /**
   * Formats a log entry for console output
   */
  private formatForConsole(entry: LogEntry): string[] {
    const parts: string[] = [];
    
    if (this.config.showTimestamp) {
      parts.push(`[${entry.timestamp}]`);
    }
    
    parts.push(`[${entry.level.toUpperCase()}]`);
    parts.push(entry.message);
    
    return parts;
  }

  /**
   * Creates a log entry and outputs it
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (this.config.enableConsole) {
      const formattedParts = this.formatForConsole(entry);
      const consoleMethod = level === 'debug' ? 'log' : level;
      
      if (context && Object.keys(context).length > 0) {
        console[consoleMethod](...formattedParts, context);
      } else {
        console[consoleMethod](...formattedParts);
      }
    }
  }

  /**
   * Debug level - detailed information for development
   * @example logger.debug('Component rendered', { props: { id: 1 } });
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  /**
   * Info level - general operational information
   * @example logger.info('User action completed', { action: 'save' });
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Warn level - potentially problematic situations
   * @example logger.warn('API response slow', { duration: 5000 });
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Error level - errors that need attention
   * @example logger.error('Failed to save', { error: err.message });
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  /**
   * Creates a child logger with additional default context
   * @example const userLogger = logger.child({ userId: '123' });
   */
  child(defaultContext: Record<string, unknown>): Logger {
    const childLogger = new Logger(this.config);
    const originalLog = childLogger.log.bind(childLogger);
    
    childLogger.log = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
      originalLog(level, message, { ...defaultContext, ...context });
    };
    
    return childLogger;
  }

  /**
   * Updates logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Default logger instance for application-wide use
 */
export const logger = new Logger();

/**
 * Creates a new logger instance with custom configuration
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}
