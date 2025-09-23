"use client";

import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
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
  const [error, setError] = useState<string | null>(null);
  const [openError, setOpenError] = useState(false);

  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please record audio first.");
      setOpenError(true);
      return;
    }

    setLoading(true);
    setResult(null);
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
        setResult(
          `Match found: ${data.title} by ${data.artist} (score: ${data.score})`
        );
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
          className={`px-6 py-3 text-sm !text-white rounded disabled:opacity-100 ${
            loading || !file
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-900"
          }`}
        >
          {loading ? "Uploading..." : "Upload & Match"}
        </Button>
      </div>

      {/* Result as Card */}
      {result && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Song Match Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{result}</p>
          </CardContent>
        </Card>
      )}

      {/* Error as Alert Dialog */}
      <AlertDialog open={openError} onOpenChange={setOpenError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setOpenError(false)}>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
