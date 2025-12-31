"use client"

import { create } from "zustand"

interface MotionSettings {
  sensitivity: number
  minDuration: number
  cooldownSeconds: number
  preRollSeconds: number
  postRollSeconds: number
}

interface MotionSettingsStore {
  settings: MotionSettings
  updateSettings: (updates: Partial<MotionSettings>) => void
}

export const useMotionSettings = create<MotionSettingsStore>((set) => ({
  settings: {
    sensitivity: 0.05,
    minDuration: 3,
    cooldownSeconds: 30,
    preRollSeconds: 30,
    postRollSeconds: 30,
  },
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),
}))
