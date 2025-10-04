"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function AudioRecorder({
  onRecordingComplete,
}: {
  onRecordingComplete: (file: File) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recordingStartTime = useRef<number>(0); // Add this ref

  const startRecording = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        const file = new File([blob], `recording_${Date.now()}.wav`, {
          type: "audio/wav",
        });
        onRecordingComplete(file);
      };

      mediaRecorder.current.start();
      recordingStartTime.current = Date.now(); // Capture start time here
      setRecording(true);
    } catch (err) {
      setError("Could not access microphone.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    setRecording(false);

    const minDurationMs = 5000;
    const recordingDuration = Date.now() - recordingStartTime.current; // Calculate duration

    if (recordingDuration < minDurationMs) {
      alert("Please record at least 5 seconds of audio for accurate matching.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      {error && <p className="text-red-600">{error}</p>}

      {!recording ? (
        <Button
          onClick={startRecording}
          size="lg"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Initializing...
            </span>
          ) : (
            "Start Recording"
          )}
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          size="lg"
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Stop Recording
        </Button>
      )}
    </div>
  );
}
