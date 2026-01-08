import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { getCorsHeaders, isOriginAllowed, handleCorsPreflightResponse } from '@/lib/cors'
import { validateAudioFile, sanitizeFilename } from '@/lib/validation'
import { createRequestLogger, getSafeErrorMessage } from '@/lib/logger'

export const runtime = 'nodejs'

// Request timeout in milliseconds (30 seconds)
const REQUEST_TIMEOUT = 30000

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin')
    return handleCorsPreflightResponse(origin)
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin)
    const logger = createRequestLogger()

    try {
        logger.info('Receiving audio match request')

        // Check CORS
        if (origin && !isOriginAllowed(origin)) {
            logger.warn('CORS violation attempt', { origin })
            return NextResponse.json(
                { error: 'Origin not allowed' },
                { status: 403, headers: corsHeaders }
            )
        }

        // Check rate limit
        const clientIP = getClientIP(request)
        const rateLimit = checkRateLimit(`match:${clientIP}`, RATE_LIMITS.matchProxy)

        if (rateLimit.limited) {
            logger.warn('Rate limit exceeded', { clientIP })
            return NextResponse.json(
                { error: RATE_LIMITS.matchProxy.message },
                {
                    status: 429,
                    headers: { ...corsHeaders, ...rateLimit.headers }
                }
            )
        }

        // Get the file from the incoming request
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400, headers: { ...corsHeaders, ...rateLimit.headers } }
            )
        }

        // Validate the file
        const validation = validateAudioFile(file)
        if (!validation.valid) {
            logger.warn('File validation failed', { error: validation.error })
            return NextResponse.json(
                { error: validation.error },
                { status: 400, headers: { ...corsHeaders, ...rateLimit.headers } }
            )
        }

        const sanitizedName = sanitizeFilename(file.name)
        logger.info('File received', { name: sanitizedName, size: file.size })

        // Create a new FormData to send to the backend
        const backendFormData = new FormData()
        backendFormData.append('file', file, sanitizedName)

        // Add timeout to the backend request
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

        logger.info('Sending to Shazam backend')

        try {
            const backendRes = await fetch('https://shazam-efve.onrender.com/match', {
                method: 'POST',
                body: backendFormData,
                signal: controller.signal,
            })

            clearTimeout(timeout)

            logger.info('Backend response received', { status: backendRes.status })

            // Handle non-JSON responses
            const contentType = backendRes.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                const text = await backendRes.text()
                logger.error('Non-JSON response from backend', { response: text.substring(0, 100) })
                return NextResponse.json(
                    { error: 'Backend service error. Please try again later.' },
                    { status: 502, headers: { ...corsHeaders, ...rateLimit.headers } }
                )
            }

            const json = await backendRes.json()
            logger.info('Match result', { found: json.found || false })

            return NextResponse.json(json, {
                status: backendRes.status,
                headers: { ...corsHeaders, ...rateLimit.headers }
            })
        } catch (fetchError) {
            clearTimeout(timeout)

            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                logger.error('Backend request timed out')
                return NextResponse.json(
                    { error: 'Request timed out. The server is taking too long to respond.' },
                    { status: 504, headers: { ...corsHeaders, ...rateLimit.headers } }
                )
            }
            throw fetchError
        }
    } catch (error: unknown) {
        const safeMessage = getSafeErrorMessage(error)
        logger.error('Match proxy error', {
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        return NextResponse.json(
            { error: safeMessage },
            { status: 500, headers: corsHeaders }
        )
    }
}
