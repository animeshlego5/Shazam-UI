import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";
import { validateSearchParam, sanitizeText } from "@/lib/validation";
import { createRequestLogger, getSafeErrorMessage } from "@/lib/logger";

interface iTunesTrack {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string;
    trackViewUrl: string;
}

interface iTunesResponse {
    resultCount: number;
    results: iTunesTrack[];
}

export interface SongMetadata {
    trackId: number;
    title: string;
    artist: string;
    album: string;
    artworkUrl: string;
    previewUrl: string;
    trackViewUrl: string;
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const logger = createRequestLogger();

    // Only allow GET requests
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    try {
        // Rate limiting
        const clientIP = getClientIP(req as unknown as Request);
        const rateLimit = checkRateLimit(`itunes:${clientIP}`, RATE_LIMITS.itunesSearch);

        // Set rate limit headers
        Object.entries(rateLimit.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        if (rateLimit.limited) {
            logger.warn("Rate limit exceeded", { clientIP });
            res.status(429).json({ error: RATE_LIMITS.itunesSearch.message });
            return;
        }

        const { title, artist } = req.query;

        // Validate title parameter
        const titleValidation = validateSearchParam(title, "title");
        if (!titleValidation.valid) {
            res.status(400).json({ error: titleValidation.error });
            return;
        }

        // Sanitize optional artist parameter
        const sanitizedArtist = artist && typeof artist === "string"
            ? sanitizeText(artist, 200)
            : "";

        logger.info("iTunes search request", {
            title: titleValidation.value,
            artist: sanitizedArtist
        });

        // Build search query
        const searchTerm = sanitizedArtist
            ? `${titleValidation.value} ${sanitizedArtist}`
            : titleValidation.value;

        const encodedQuery = encodeURIComponent(searchTerm);
        const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=1`;

        // Add timeout to the request
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`iTunes API error: ${response.statusText}`);
            }

            const data: iTunesResponse = await response.json();

            if (data.resultCount === 0) {
                logger.info("No results found");
                res.status(404).json({ error: "No results found", found: false });
                return;
            }

            const track = data.results[0];

            // Transform to higher resolution artwork (600x600 instead of 100x100)
            const artworkUrl = track.artworkUrl100.replace("100x100", "600x600");

            const metadata: SongMetadata = {
                trackId: track.trackId,
                title: track.trackName,
                artist: track.artistName,
                album: track.collectionName,
                artworkUrl: artworkUrl,
                previewUrl: track.previewUrl,
                trackViewUrl: track.trackViewUrl,
            };

            logger.info("Search successful", { trackId: track.trackId });
            res.status(200).json({ found: true, ...metadata });
        } catch (fetchError) {
            clearTimeout(timeout);

            if (fetchError instanceof Error && fetchError.name === "AbortError") {
                logger.error("iTunes API request timed out");
                res.status(504).json({ error: "Request timed out. Please try again." });
                return;
            }
            throw fetchError;
        }
    } catch (error: unknown) {
        const safeMessage = getSafeErrorMessage(error);
        logger.error("iTunes search error", {
            error: error instanceof Error ? error.message : "Unknown error"
        });
        res.status(500).json({ error: safeMessage });
    }
}
