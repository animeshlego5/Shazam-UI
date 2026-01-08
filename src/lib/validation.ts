/**
 * Input Validation Utilities
 * Sanitize and validate user inputs to prevent injection attacks
 */

// Maximum lengths for various inputs
export const INPUT_LIMITS = {
    title: 200,
    artist: 200,
    fileName: 255,
    maxFileSize: 10 * 1024 * 1024, // 10MB
} as const;

// Allowed audio MIME types
export const ALLOWED_AUDIO_TYPES = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/webm',
    'audio/mp4',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/flac',
    'audio/x-m4a',
    'audio/aac',
] as const;

// Allowed file extensions
export const ALLOWED_EXTENSIONS = [
    '.wav',
    '.webm',
    '.mp4',
    '.mp3',
    '.m4a',
    '.ogg',
    '.flac',
    '.aac',
] as const;

/**
 * Sanitize a text string for safe use
 * Removes potentially dangerous characters while preserving music-related chars
 */
export function sanitizeText(input: string, maxLength: number = 200): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Trim and limit length
    let sanitized = input.trim().slice(0, maxLength);

    // Remove null bytes and control characters (except newlines/tabs)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Remove HTML/script tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    return sanitized;
}

/**
 * Validate a search query parameter
 */
export function validateSearchParam(
    value: unknown,
    fieldName: string
): { valid: boolean; value: string; error?: string } {
    if (value === undefined || value === null) {
        return { valid: false, value: '', error: `${fieldName} is required` };
    }

    if (typeof value !== 'string') {
        return { valid: false, value: '', error: `${fieldName} must be a string` };
    }

    const sanitized = sanitizeText(value, INPUT_LIMITS.title);

    if (sanitized.length === 0) {
        return { valid: false, value: '', error: `${fieldName} cannot be empty` };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /on\w+\s*=/i,  // Event handlers like onclick=
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(sanitized)) {
            return { valid: false, value: '', error: `Invalid characters in ${fieldName}` };
        }
    }

    return { valid: true, value: sanitized };
}

/**
 * Validate an uploaded file
 */
export function validateAudioFile(file: File): {
    valid: boolean;
    error?: string;
} {
    // Check if file exists
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    // Check file size
    if (file.size > INPUT_LIMITS.maxFileSize) {
        const maxMB = INPUT_LIMITS.maxFileSize / (1024 * 1024);
        return { valid: false, error: `File too large. Maximum size is ${maxMB}MB` };
    }

    // Check file size minimum (empty or too small files)
    if (file.size < 1000) { // Less than 1KB is suspicious
        return { valid: false, error: 'File is too small to be valid audio' };
    }

    // Check MIME type
    const mimeType = file.type.toLowerCase();
    if (mimeType && !ALLOWED_AUDIO_TYPES.includes(mimeType as typeof ALLOWED_AUDIO_TYPES[number])) {
        // Allow empty MIME type as some browsers don't set it
        if (mimeType !== '') {
            return { valid: false, error: `Invalid file type: ${mimeType}. Please upload an audio file.` };
        }
    }

    // Check file extension if name is available
    if (file.name) {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (extension && extension !== '.' && !ALLOWED_EXTENSIONS.includes(extension as typeof ALLOWED_EXTENSIONS[number])) {
            return { valid: false, error: `Invalid file extension: ${extension}` };
        }

        // Validate filename length
        if (file.name.length > INPUT_LIMITS.fileName) {
            return { valid: false, error: 'Filename is too long' };
        }
    }

    return { valid: true };
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
    if (!filename) return 'upload.wav';

    // Remove path components
    let sanitized = filename.split(/[/\\]/).pop() || 'upload.wav';

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*\x00-\x1F]/g, '');

    // Limit length
    if (sanitized.length > INPUT_LIMITS.fileName) {
        const ext = sanitized.split('.').pop() || 'wav';
        const base = sanitized.slice(0, INPUT_LIMITS.fileName - ext.length - 1);
        sanitized = `${base}.${ext}`;
    }

    return sanitized || 'upload.wav';
}
