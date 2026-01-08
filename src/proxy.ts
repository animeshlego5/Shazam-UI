import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security Headers Middleware
 * Adds security headers to all responses and handles CORS
 */

// Security headers to add to all responses
const securityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy (restrict browser features)
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(), payment=()',

    // DNS prefetch control
    'X-DNS-Prefetch-Control': 'on',
}

// Content Security Policy
const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://itunes.apple.com https://shazam-efve.onrender.com https://*.vercel.app",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
]

export function proxy(request: NextRequest) {
    // Get the response
    const response = NextResponse.next()

    // Add security headers
    for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value)
    }

    // Add CSP header (relaxed for development)
    const isDev = process.env.NODE_ENV === 'development'
    if (!isDev) {
        response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
    }

    // Add request ID for tracing
    const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    response.headers.set('X-Request-Id', requestId)

    return response
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public directory)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
