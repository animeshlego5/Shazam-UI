'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button";


export default function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (file: File) => void }) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const recordingStartTime = useRef<number>(0)  // Add this ref

  const startRecording = async () => {
    setError(null)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support audio recording.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/wav' })
        const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' })
        onRecordingComplete(file)
      }

      mediaRecorder.current.start()
      recordingStartTime.current = Date.now()  // Capture start time here
      setRecording(true)
    } catch (err) {
      setError('Could not access microphone.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    setRecording(false)

    const minDurationMs = 5000
    const recordingDuration = Date.now() - recordingStartTime.current  // Calculate duration

    if (recordingDuration < minDurationMs) {
      alert('Please record at least 5 seconds of audio for accurate matching.')
    }
  }

  return (
    <div className="flex justify-center items-center">
      {error && <p className="text-red-600">{error}</p>}

      {!recording ? (
        <Button
          onClick={startRecording}
          size="lg"
          className="px-6 py-3 bg-green-800 text-white rounded hover:bg-green-900"
        >
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          size="lg"
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Stop Recording
        </Button>
      )}
    </div>
  )
}
