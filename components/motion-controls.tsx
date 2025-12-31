"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings } from "lucide-react"
import { useMotionSettings } from "@/hooks/use-motion-settings"

export function MotionControls() {
  const { settings, updateSettings } = useMotionSettings()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Motion Detection Settings</CardTitle>
        </div>
        <CardDescription>Adjust sensitivity and timing parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sensitivity</Label>
            <span className="text-sm text-muted-foreground">{(settings.sensitivity * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[settings.sensitivity]}
            onValueChange={([value]) => updateSettings({ sensitivity: value })}
            min={0.01}
            max={0.2}
            step={0.01}
          />
          <p className="text-xs text-muted-foreground">Lower values = more sensitive to motion</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Minimum Duration</Label>
            <span className="text-sm text-muted-foreground">{settings.minDuration} frames</span>
          </div>
          <Slider
            value={[settings.minDuration]}
            onValueChange={([value]) => updateSettings({ minDuration: value })}
            min={1}
            max={30}
            step={1}
          />
          <p className="text-xs text-muted-foreground">Motion must last this many frames to trigger</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Cooldown Period</Label>
            <span className="text-sm text-muted-foreground">{settings.cooldownSeconds}s</span>
          </div>
          <Slider
            value={[settings.cooldownSeconds]}
            onValueChange={([value]) => updateSettings({ cooldownSeconds: value })}
            min={5}
            max={120}
            step={5}
          />
          <p className="text-xs text-muted-foreground">Time to wait before detecting next event</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Pre-roll Buffer</Label>
            <span className="text-sm text-muted-foreground">{settings.preRollSeconds}s</span>
          </div>
          <Slider
            value={[settings.preRollSeconds]}
            onValueChange={([value]) => updateSettings({ preRollSeconds: value })}
            min={10}
            max={60}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Post-roll Buffer</Label>
            <span className="text-sm text-muted-foreground">{settings.postRollSeconds}s</span>
          </div>
          <Slider
            value={[settings.postRollSeconds]}
            onValueChange={([value]) => updateSettings({ postRollSeconds: value })}
            min={10}
            max={60}
            step={5}
          />
        </div>
      </CardContent>
    </Card>
  )
}
