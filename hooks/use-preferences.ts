"use client"

import { useState, useEffect } from "react"

export interface Preferences {
  bufferTime: {
    enabled: boolean
    before: number
    after: number
  }
  defaultDuration: number
  visualModes: {
    glitchPulse: boolean
    synthwave: boolean
    soundFx: boolean
  }
}

const defaultPreferences: Preferences = {
  bufferTime: {
    enabled: false,
    before: 5,
    after: 5,
  },
  defaultDuration: 30,
  visualModes: {
    glitchPulse: false,
    synthwave: false,
    soundFx: true,
  },
}

const PREFERENCES_KEY = "neurotask-preferences"

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [loaded, setLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (stored) {
        const parsedPrefs = JSON.parse(stored)
        setPreferences({ ...defaultPreferences, ...parsedPrefs })
      }
    } catch (error) {
      console.error("Failed to load preferences:", error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save preferences:", error)
    }
  }, [preferences, loaded])

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }

  return {
    preferences,
    updatePreferences,
  }
}
