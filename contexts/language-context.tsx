"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"

// Import translation files
import enTranslations from "@/translations/en.json"
import swTranslations from "@/translations/sw.json"
import kikTranslations from "@/translations/kik.json"
import luoTranslations from "@/translations/luo.json"
import kalTranslations from "@/translations/kal.json"
import kamTranslations from "@/translations/kam.json"

// Define available languages
export type Language = "en" | "sw" | "kik" | "luo" | "kal" | "kam"

// Define translations interface
interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

// Load translations from imported JSON files
const translations: Translations = {
  en: enTranslations,
  sw: swTranslations,
  kik: kikTranslations,
  luo: luoTranslations,
  kal: kalTranslations,
  kam: kamTranslations
}

// Define the context interface
interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  availableLanguages: { code: Language; name: string }[]
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Define props for the provider
interface LanguageProviderProps {
  readonly children: ReactNode
  readonly initialLanguage?: Language
}

// Create the provider component
export function LanguageProvider({ children, initialLanguage = "en" }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  // Load saved language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (translations[language]?.[key]) {
      return translations[language][key]
    }
    // Fallback to English if translation not found
    if (translations.en?.[key]) {
      return translations.en[key]
    }
    // Return the key if no translation found
    return key
  }

  // Available languages for the language selector
  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "sw", name: "Kiswahili" },
    { code: "kik", name: "Kikuyu" },
    { code: "luo", name: "Luo" },
    { code: "kal", name: "Kalenjin" },
    { code: "kam", name: "Kamba" },
  ]

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, availableLanguages }),
    [language, setLanguage, t, availableLanguages]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
