/**
 * CORS Configuration Utility
 * Controls cross-origin access to API endpoints
 */

// Allowed origins for CORS
export const ALLOWED_ORIGINS = [
    // Production
    'https://notespy.vercel.app',
    'https://www.notespy.vercel.app',

    // Development
    'http://localhost:3000',
    'http://127.0.0.1:3000',

    // Uptime monitoring services (to prevent cold starts)
    'https://uptimerobot.com',
    'https://api.uptimerobot.com',
    'https://cronitor.io',
    'https://betteruptime.com',
    'https://uptime.com',
] as const;

// Allowed HTTP methods
export const ALLOWED_METHODS = ['GET', 'POST', 'OPTIONS'] as const;

// Allowed request headers
export const ALLOWED_HEADERS = [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
] as const;

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;

    // Check exact match
    if (ALLOWED_ORIGINS.includes(origin as typeof ALLOWED_ORIGINS[number])) {
        return true;
    }

    // Check for Vercel preview deployments
    if (origin.endsWith('.vercel.app') && origin.includes('notespy')) {
        return true;
    }

    return false;
}

/**
 * Get CORS headers for a request
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
        'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    };

    // Only set Access-Control-Allow-Origin if origin is allowed
    if (origin && isOriginAllowed(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return headers;
}

/**
 * Handle CORS preflight request
 */
export function handleCorsPreflightResponse(origin: string | null): Response {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin),
    });
}
