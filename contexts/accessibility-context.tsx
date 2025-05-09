"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define accessibility settings interface
interface AccessibilitySettings {
  textSize: "small" | "medium" | "large" | "x-large"
  highContrast: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
  languageComplexity: "simple" | "standard" | "technical"
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  useSimplifiedNavigation: boolean
}

// Define context interface
interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  resetSettings: () => void
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  textSize: "medium",
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
  languageComplexity: "standard",
  colorBlindMode: "none",
  useSimplifiedNavigation: false,
}

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved accessibility settings", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Apply settings to document
    document.documentElement.setAttribute("data-text-size", settings.textSize)
    document.documentElement.setAttribute("data-high-contrast", settings.highContrast.toString())
    document.documentElement.setAttribute("data-reduced-motion", settings.reducedMotion.toString())
    document.documentElement.setAttribute("data-color-blind-mode", settings.colorBlindMode)

    // Apply prefers-reduced-motion media query override if needed
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty("--reduce-motion", "reduce")
    } else {
      document.documentElement.style.removeProperty("--reduce-motion")
    }

    // Apply text size CSS variables
    const textSizeMap = {
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
      "x-large": "1.25rem",
    }
    document.documentElement.style.setProperty("--base-text-size", textSizeMap[settings.textSize])
  }, [settings])

  // Update settings
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// Custom hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
