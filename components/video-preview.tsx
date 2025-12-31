"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Activity } from "lucide-react"
import { useMotionDetection } from "@/hooks/use-motion-detection"
import { useVideoRecorder } from "@/hooks/use-video-recorder"

interface VideoPreviewProps {
  stream: MediaStream | null
  onRecordingChange: (isRecording: boolean) => void
  onMotionDetected: (detected: boolean) => void
  onEventCreated: (event: any) => void
}

export function VideoPreview({ stream, onRecordingChange, onMotionDetected, onEventCreated }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoInfo, setVideoInfo] = useState({ width: 0, height: 0, fps: 0 })

  const { isMotionDetected, motionScore, canvasRef, startDetection, stopDetection } = useMotionDetection({
    stream,
    videoRef,
  })

  const { isRecording, startRecording, stopRecording } = useVideoRecorder({
    stream,
    onEventCreated,
    onRecordingChange,
  })

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream

      // Get video track settings
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        const settings = videoTrack.getSettings()
        setVideoInfo({
          width: settings.width || 0,
          height: settings.height || 0,
          fps: settings.frameRate || 0,
        })
      }

      // Start motion detection
      startDetection()
      startRecording()
    }

    return () => {
      stopDetection()
      stopRecording()
    }
  }, [stream])

  useEffect(() => {
    onMotionDetected(isMotionDetected)
  }, [isMotionDetected, onMotionDetected])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <CardTitle>Live Preview</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isMotionDetected && (
              <Badge variant="default" className="bg-destructive text-destructive-foreground">
                <Activity className="h-3 w-3 mr-1" />
                Motion Detected
              </Badge>
            )}
            {isRecording && (
              <Badge variant="default">
                <div className="h-2 w-2 bg-destructive rounded-full animate-pulse mr-1.5" />
                Recording
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          {videoInfo.width > 0 && (
            <span>
              {videoInfo.width}×{videoInfo.height} @ {Math.round(videoInfo.fps)} FPS
              {motionScore > 0 && ` • Motion: ${(motionScore * 100).toFixed(1)}%`}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
          <canvas ref={canvasRef} className="hidden" />
          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">No camera selected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
