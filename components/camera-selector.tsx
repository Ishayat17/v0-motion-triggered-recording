"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"

interface CameraSelectorProps {
  selectedDevice: MediaDeviceInfo | null
  onDeviceSelect: (device: MediaDeviceInfo | null) => void
}

export function CameraSelector({ selectedDevice, onDeviceSelect }: CameraSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    setLoading(true)
    try {
      // Request permissions first
      await navigator.mediaDevices.getUserMedia({ video: true })

      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter((device) => device.kind === "videoinput")

      console.log("[v0] Found video devices:", videoDevices.length)
      setDevices(videoDevices)

      // Auto-select first device if none selected
      if (videoDevices.length > 0 && !selectedDevice) {
        onDeviceSelect(videoDevices[0])
      }
    } catch (error) {
      console.error("[v0] Error loading devices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find((d) => d.deviceId === deviceId)
    onDeviceSelect(device || null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <CardTitle>Camera Selection</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={loadDevices} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Select your GoPro or other camera device</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedDevice?.deviceId || ""}
          onValueChange={handleDeviceChange}
          disabled={devices.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={devices.length === 0 ? "No cameras found" : "Select a camera"} />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {devices.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">
            No cameras detected. Please connect your GoPro in webcam mode.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
