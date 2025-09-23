"use client";

import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { Button } from "@/components/ui/button";

export default function RecorderAndUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecordingComplete = (recordedFile: File) => {
    setFile(recordedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please record audio first.");
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
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0">
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />

        {/* {file && <p className="text-center">{file.name}</p>} */}

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          size="lg"
          className={`px-6 py-3 text-sm  !text-white rounded disabled:opacity-100
                      ${loading || !file
                          ? "bg-gray-700 cursor-not-allowed hover:text"
                          : "bg-blue-600 hover:bg-blue-900"
                      }
                    `}>
          {loading ? "Uploading..." : "Upload & Match"}
        </Button>

        {result && <p className="text-green-600 text-center">{result}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
