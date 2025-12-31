"use client"

import { useRef, useState } from "react"
import { useMotionSettings } from "./use-motion-settings"

interface UseVideoRecorderProps {
  stream: MediaStream | null
  onEventCreated: (event: any) => void
  onRecordingChange: (isRecording: boolean) => void
}

export function useVideoRecorder({ stream, onEventCreated, onRecordingChange }: UseVideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const ringBufferRef = useRef<Blob[]>([])
  const { settings } = useMotionSettings()

  const startRecording = () => {
    if (!stream) return

    try {
      const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") ? "video/webm; codecs=vp9" : "video/webm"

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
      })

      mediaRecorderRef.current = mediaRecorder

      // Use 1 second chunks for ring buffer
      const chunkInterval = 1000

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          // Add to ring buffer (keep last N seconds)
          ringBufferRef.current.push(event.data)

          const maxChunks = settings.preRollSeconds
          if (ringBufferRef.current.length > maxChunks) {
            ringBufferRef.current.shift()
          }
        }
      }

      mediaRecorder.start(chunkInterval)
      setIsRecording(true)
      onRecordingChange(true)
      console.log("[v0] Started continuous recording with ring buffer")
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      onRecordingChange(false)
      console.log("[v0] Stopped recording")
    }
  }

  const captureEvent = (motionScore: number) => {
    if (!mediaRecorderRef.current) return

    console.log("[v0] Capturing motion event")

    // Copy ring buffer as pre-roll
    const eventChunks = [...ringBufferRef.current]

    // Record post-roll
    const postRollDuration = settings.postRollSeconds * 1000
    const startTime = Date.now()

    const postRollRecorder = new MediaRecorder(stream!, {
      mimeType: mediaRecorderRef.current.mimeType,
      videoBitsPerSecond: 2500000,
    })

    postRollRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        eventChunks.push(event.data)
      }
    }

    postRollRecorder.onstop = () => {
      // Create final blob
      const blob = new Blob(eventChunks, { type: mediaRecorderRef.current!.mimeType })
      const timestamp = new Date()
      const filename = `motion-${timestamp.toISOString().replace(/[:.]/g, "-")}.webm`

      const event = {
        id: crypto.randomUUID(),
        timestamp,
        filename,
        blob,
        duration: settings.preRollSeconds + settings.postRollSeconds,
        motionScore,
        cameraName: "GoPro",
      }

      onEventCreated(event)
      console.log("[v0] Event captured:", filename)
    }

    postRollRecorder.start(1000)

    // Stop after post-roll duration
    setTimeout(() => {
      postRollRecorder.stop()
    }, postRollDuration)
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    captureEvent,
  }
}
