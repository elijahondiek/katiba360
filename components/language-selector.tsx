"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
// Make sure the import is correct
import { useLanguage, type Language, languages } from "@/contexts/language-context"
import { useOnClickOutside } from "@/hooks/use-click-outside"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useOnClickOutside(ref, () => setIsOpen(false))

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, lang: Language) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleLanguageChange(lang)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#D1D5DB] transition-colors hover:bg-[#F3F4F6]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <Image
            src={`/flags/${languages[language].flag}`}
            alt={`${languages[language].name} Flag`}
            width={24}
            height={24}
          />
        </div>
        <span className="font-medium">{languages[language].nativeName}</span>
        <ChevronDown className={`h-4 w-4 text-[#6B7280] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 rounded-md bg-white shadow-lg border border-[#E5E7EB]">
          <ul className="py-1 max-h-60 overflow-auto" role="listbox" aria-labelledby="language-selector" tabIndex={-1}>
            {Object.entries(languages).map(([code, { name, flag, nativeName }]) => (
              <li
                key={code}
                role="option"
                aria-selected={language === code}
                tabIndex={0}
                onClick={() => handleLanguageChange(code as Language)}
                onKeyDown={(e) => handleKeyDown(e, code as Language)}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#F3F4F6] ${
                  language === code ? "bg-[#F3F4F6]" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={`/flags/${flag}`} alt={`${name} Flag`} width={24} height={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{nativeName}</span>
                  <span className="text-xs text-[#6B7280]">{name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
