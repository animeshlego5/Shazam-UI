import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        console.log('[match-proxy] Receiving form data...')

        // Get the file from the incoming request
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        console.log('[match-proxy] File received:', file.name, 'Size:', file.size)

        // Create a new FormData to send to the backend
        const backendFormData = new FormData()
        backendFormData.append('file', file, file.name || 'upload.wav')

        console.log('[match-proxy] Sending to Shazam backend...')
        const backendRes = await fetch('https://shazam-efve.onrender.com/match', {
            method: 'POST',
            body: backendFormData,
        })

        console.log('[match-proxy] Backend response status:', backendRes.status)

        // Handle non-JSON responses
        const contentType = backendRes.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const text = await backendRes.text()
            console.error('[match-proxy] Non-JSON response:', text)
            return NextResponse.json(
                { error: 'Backend returned non-JSON response', details: text.substring(0, 200) },
                { status: 500 }
            )
        }

        const json = await backendRes.json()
        console.log('[match-proxy] Backend response:', JSON.stringify(json))

        return NextResponse.json(json, { status: backendRes.status })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('[match-proxy] ERROR:', message)
        console.error('[match-proxy] Full error:', error)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
