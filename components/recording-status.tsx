"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle, Activity, Clock } from "lucide-react"

interface RecordingStatusProps {
  isRecording: boolean
  motionDetected: boolean
}

export function RecordingStatus({ isRecording, motionDetected }: RecordingStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle
              className={`h-4 w-4 ${isRecording ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
            />
            <span className="text-sm">Recording</span>
          </div>
          <span className={`text-sm font-medium ${isRecording ? "text-destructive" : "text-muted-foreground"}`}>
            {isRecording ? "Active" : "Idle"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${motionDetected ? "text-destructive" : "text-muted-foreground"}`} />
            <span className="text-sm">Motion</span>
          </div>
          <span className={`text-sm font-medium ${motionDetected ? "text-destructive" : "text-muted-foreground"}`}>
            {motionDetected ? "Detected" : "None"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Buffer</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">30s pre/post</span>
        </div>
      </CardContent>
    </Card>
  )
}
