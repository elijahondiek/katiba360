"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export type Language = "en" | "sw" | "kik" | "luo" | "kal" | "kam"

// Define translations interface
interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

// Sample translations (in a real app, these would be more extensive)
const translations: Translations = {
  en: {
    "app.title": "Katiba360",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.community": "Community",
    "footer.copyright": "All rights reserved.",
    "search.placeholder": "Search the constitution...",
    "language.english": "English",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Kikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
  sw: {
    "app.title": "Katiba360",
    "nav.chapters": "Sura",
    "nav.rights": "Haki",
    "nav.learn": "Jifunze",
    "nav.community": "Jamii",
    "footer.copyright": "Haki zote zimehifadhiwa.",
    "search.placeholder": "Tafuta katiba...",
    "language.english": "Kiingereza",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Kikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
  kik: {
    "app.title": "Katiba360",
    "nav.chapters": "Icigo",
    "nav.rights": "Kihooto",
    "nav.learn": "Thoma",
    "nav.community": "Mugwatanio",
    "footer.copyright": "Kihooto ciothe ni cia muene.",
    "search.placeholder": "Caria katiba...",
    "language.english": "Githungu",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Gikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
  // Add other languages as needed
  luo: {
    "app.title": "Katiba360",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.community": "Community",
    "footer.copyright": "All rights reserved.",
    "search.placeholder": "Search the constitution...",
    "language.english": "English",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Kikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
  kal: {
    "app.title": "Katiba360",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.community": "Community",
    "footer.copyright": "All rights reserved.",
    "search.placeholder": "Search the constitution...",
    "language.english": "English",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Kikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
  kam: {
    "app.title": "Katiba360",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.community": "Community",
    "footer.copyright": "All rights reserved.",
    "search.placeholder": "Search the constitution...",
    "language.english": "English",
    "language.kiswahili": "Kiswahili",
    "language.kikuyu": "Kikuyu",
    "language.luo": "Luo",
    "language.kalenjin": "Kalenjin",
    "language.kamba": "Kamba",
  },
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
  children: ReactNode
  initialLanguage?: Language
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
    if (translations[language] && translations[language][key]) {
      return translations[language][key]
    }
    // Fallback to English if translation not found
    if (translations.en && translations.en[key]) {
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
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
