"use client";

import { useState } from "react";

export default function AudioUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an audio file to upload.");
      return;
    }

    if (!file.name.endsWith(".wav")) {
      setError("Only .wav files are supported.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/match-proxy", {
        // see Step 3 below
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
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 disabled:bg-gray-400 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload & Match"}
      </button>

      {result && <p className="text-green-600">{result}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
