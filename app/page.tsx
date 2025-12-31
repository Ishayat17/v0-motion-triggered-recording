"use client"

import { useState, useEffect } from "react"
import { CameraSelector } from "@/components/camera-selector"
import { VideoPreview } from "@/components/video-preview"
import { MotionControls } from "@/components/motion-controls"
import { RecordingStatus } from "@/components/recording-status"
import { EventList } from "@/components/event-list"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function MotionRecorderPage() {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [motionDetected, setMotionDetected] = useState(false)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (selectedDevice) {
      startStream(selectedDevice)
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [selectedDevice])

  const startStream = async (device: MediaDeviceInfo) => {
    try {
      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: device.deviceId } },
        audio: false,
      })
      setStream(newStream)
      setPermissionError(null)
    } catch (error) {
      console.error("[v0] Error starting stream:", error)
      setPermissionError("Failed to access camera. Please check permissions.")
      setStream(null)
    }
  }

  const handleAddEvent = (event: any) => {
    setEvents((prev) => [event, ...prev])
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Motion Recorder</h1>
          <p className="text-sm text-muted-foreground mt-1">GoPro motion-triggered recording with pre/post buffer</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Camera & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <CameraSelector selectedDevice={selectedDevice} onDeviceSelect={setSelectedDevice} />

            {permissionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{permissionError}</AlertDescription>
              </Alert>
            )}

            <VideoPreview
              stream={stream}
              onRecordingChange={setIsRecording}
              onMotionDetected={setMotionDetected}
              onEventCreated={handleAddEvent}
            />

            <MotionControls />
          </div>

          {/* Right Column - Status & Events */}
          <div className="space-y-6">
            <RecordingStatus isRecording={isRecording} motionDetected={motionDetected} />

            <EventList events={events} onDeleteEvent={handleDeleteEvent} />
          </div>
        </div>
      </main>
    </div>
  )
}
