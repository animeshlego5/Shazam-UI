/**
 * Structured Logger Utility
 * Provides consistent, secure logging without leaking sensitive data
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, unknown>;
    requestId?: string;
}

// Patterns to redact from logs
const SENSITIVE_PATTERNS = [
    /password/i,
    /secret/i,
    /token/i,
    /api[_-]?key/i,
    /authorization/i,
    /cookie/i,
    /session/i,
];

// Keys to always redact
const SENSITIVE_KEYS = new Set([
    'password',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'authorization',
    'cookie',
    'session',
    'creditCard',
    'ssn',
]);

/**
 * Redact sensitive values from an object
 */
function redactSensitive(obj: unknown, depth = 0): unknown {
    // Prevent infinite recursion
    if (depth > 10) return '[MAX_DEPTH]';

    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        // Check if string looks like a key=value or contains sensitive data
        for (const pattern of SENSITIVE_PATTERNS) {
            if (pattern.test(obj)) {
                return '[REDACTED]';
            }
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => redactSensitive(item, depth + 1));
    }

    if (typeof obj === 'object') {
        const redacted: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (SENSITIVE_KEYS.has(key.toLowerCase())) {
                redacted[key] = '[REDACTED]';
            } else {
                redacted[key] = redactSensitive(value, depth + 1);
            }
        }
        return redacted;
    }

    return obj;
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Format a log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, requestId } = entry;
    const reqIdStr = requestId ? `[${requestId}]` : '';
    const contextStr = context ? ` ${JSON.stringify(redactSensitive(context))}` : '';
    return `${timestamp} ${level.toUpperCase().padEnd(5)} ${reqIdStr} ${message}${contextStr}`;
}

/**
 * Logger class for structured logging
 */
class Logger {
    private requestId?: string;

    constructor(requestId?: string) {
        this.requestId = requestId;
    }

    private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: context ? redactSensitive(context) as Record<string, unknown> : undefined,
            requestId: this.requestId,
        };

        const formatted = formatLogEntry(entry);

        switch (level) {
            case 'debug':
                console.debug(formatted);
                break;
            case 'info':
                console.info(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'error':
                console.error(formatted);
                break;
        }
    }

    debug(message: string, context?: Record<string, unknown>) {
        this.log('debug', message, context);
    }

    info(message: string, context?: Record<string, unknown>) {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, unknown>) {
        this.log('warn', message, context);
    }

    error(message: string, context?: Record<string, unknown>) {
        this.log('error', message, context);
    }

    /**
     * Create a child logger with additional context
     */
    child(requestId: string): Logger {
        return new Logger(requestId);
    }
}

// Default logger instance
export const logger = new Logger();

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(requestId?: string): Logger {
    return new Logger(requestId || generateRequestId());
}

/**
 * Extract safe error information for client response
 */
export function getSafeErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        // Return generic message for sensitive errors
        const message = error.message.toLowerCase();
        if (message.includes('econnrefused') ||
            message.includes('timeout') ||
            message.includes('network')) {
            return 'Service temporarily unavailable. Please try again later.';
        }
        if (message.includes('unauthorized') || message.includes('forbidden')) {
            return 'Access denied.';
        }
        // Return the message if it seems safe
        if (error.message.length < 200 && !SENSITIVE_PATTERNS.some(p => p.test(error.message))) {
            return error.message;
        }
    }
    return 'An unexpected error occurred. Please try again.';
}
