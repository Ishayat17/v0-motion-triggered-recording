"use client"

import { useRef, useState, type RefObject } from "react"
import { useMotionSettings } from "./use-motion-settings"

interface UseMotionDetectionProps {
  stream: MediaStream | null
  videoRef: RefObject<HTMLVideoElement>
}

export function useMotionDetection({ stream, videoRef }: UseMotionDetectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMotionDetected, setIsMotionDetected] = useState(false)
  const [motionScore, setMotionScore] = useState(0)
  const previousFrameRef = useRef<ImageData | null>(null)
  const motionFrameCountRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const { settings } = useMotionSettings()

  const detectMotion = () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detectMotion)
      return
    }

    // Use smaller resolution for performance
    const width = 320
    const height = 180
    canvas.width = width
    canvas.height = height

    // Draw current frame
    ctx.drawImage(video, 0, 0, width, height)
    const currentFrame = ctx.getImageData(0, 0, width, height)

    if (previousFrameRef.current) {
      // Calculate motion score
      let diffPixels = 0
      const threshold = 30 // Pixel difference threshold

      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const diff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i])
        if (diff > threshold) {
          diffPixels++
        }
      }

      const score = diffPixels / (width * height)
      setMotionScore(score)

      // Check if motion exceeds sensitivity
      if (score > settings.sensitivity) {
        motionFrameCountRef.current++
        if (motionFrameCountRef.current >= settings.minDuration) {
          setIsMotionDetected(true)
        }
      } else {
        motionFrameCountRef.current = 0
        setIsMotionDetected(false)
      }
    }

    previousFrameRef.current = currentFrame
    animationFrameRef.current = requestAnimationFrame(detectMotion)
  }

  const startDetection = () => {
    console.log("[v0] Starting motion detection")
    detectMotion()
  }

  const stopDetection = () => {
    console.log("[v0] Stopping motion detection")
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setIsMotionDetected(false)
    setMotionScore(0)
    motionFrameCountRef.current = 0
    previousFrameRef.current = null
  }

  return {
    isMotionDetected,
    motionScore,
    canvasRef,
    startDetection,
    stopDetection,
  }
}
