import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { title, artist } = req.query;

    if (!title || typeof title !== "string") {
        res.status(400).json({ error: "Missing title parameter" });
        return;
    }

    try {
        // Build search query
        const searchTerm = artist
            ? `${title} ${artist}`
            : title;

        const encodedQuery = encodeURIComponent(searchTerm);
        const url = `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`iTunes API error: ${response.statusText}`);
        }

        const data: iTunesResponse = await response.json();

        if (data.resultCount === 0) {
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

        res.status(200).json({ found: true, ...metadata });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: message });
    }
}
