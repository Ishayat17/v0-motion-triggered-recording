"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Trash2, Play, FileVideo } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface EventListProps {
  events: any[]
  onDeleteEvent: (eventId: string) => void
}

export function EventList({ events, onDeleteEvent }: EventListProps) {
  const handleDownload = (event: any) => {
    const url = URL.createObjectURL(event.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = event.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePlay = (event: any) => {
    const url = URL.createObjectURL(event.blob)
    window.open(url, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Recorded Events</CardTitle>
        </div>
        <CardDescription>
          {events.length} event{events.length !== 1 ? "s" : ""} captured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileVideo className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No events recorded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Motion events will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{event.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Duration: {event.duration}s • Score: {(event.motionScore * 100).toFixed(0)}%
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handlePlay(event)} className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(event)} className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDeleteEvent(event.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
