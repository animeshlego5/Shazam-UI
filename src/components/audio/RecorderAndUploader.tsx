"use client";

import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import SongCard, { SongMetadata } from "./SongCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecorderAndUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [songMetadata, setSongMetadata] = useState<SongMetadata | null>(null);
  const [matchScore, setMatchScore] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setResult(null);
    setSongMetadata(null);
    setMatchScore(undefined);
    setError(null);
  };

  const fetchItunesMetadata = async (title: string, artist: string) => {
    try {
      const params = new URLSearchParams({ title, artist });
      const response = await fetch(`/api/itunes-search?${params}`);

      if (!response.ok) {
        console.error("iTunes API error:", response.statusText);
        return null;
      }

      const data = await response.json();

      if (data.found) {
        return data as SongMetadata;
      }
      return null;
    } catch (err) {
      console.error("Error fetching iTunes metadata:", err);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please record audio first.");
      setOpenError(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setSongMetadata(null);
    setMatchScore(undefined);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/match-proxy", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.match) {
        // Store the match score
        setMatchScore(data.score);

        // Fetch iTunes metadata for rich display
        const metadata = await fetchItunesMetadata(data.title, data.artist);

        if (metadata) {
          setSongMetadata(metadata);
        } else {
          // Fallback to simple text result if iTunes fails
          setResult(
            `Match found: ${data.title} by ${data.artist} (score: ${data.score})`
          );
        }
      } else {
        setResult(data.message || "No match found");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        {/* {file && <p className="text-center">{file.name}</p>} */}

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          size="lg"
          className={`px-6 py-3 text-sm !text-white rounded disabled:opacity-100 transition-all duration-300 ${loading || !file
            ? "bg-zinc-800 cursor-not-allowed"
            : "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]"
            }`}
        >
          {loading ? "Matching..." : "Upload & Match"}
        </Button>
      </div>

      {/* Rich Song Card with iTunes metadata */}
      {songMetadata && (
        <SongCard metadata={songMetadata} matchScore={matchScore} />
      )}

      {/* Fallback text result (when iTunes fails or no match) */}
      {result && !songMetadata && (
        <Card className="max-w-lg border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">Song Match Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">{result}</p>
          </CardContent>
        </Card>
      )}

      {/* Error as Alert Dialog */}
      <AlertDialog open={openError} onOpenChange={setOpenError}>
        <AlertDialogContent className="border-destructive/50 bg-destructive/10 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              Error
            </AlertDialogTitle>
            <AlertDialogDescription className="text-destructive-foreground/90 font-medium">
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => setOpenError(false)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
