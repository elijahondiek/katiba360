"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex justify-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 h-10 px-4 rounded-full border-[#1EB53A] text-[#0A7B24] hover:bg-[#1EB53A]/10 hover:text-[#0A7B24]"
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">
              {availableLanguages.find(lang => lang.code === language)?.name || "English"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48 border-[#E5E7EB] shadow-md">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`text-sm py-2 ${language === lang.code ? "font-medium text-[#0A7B24] bg-[#1EB53A]/10" : "text-[#374151] hover:text-[#0A7B24] hover:bg-[#F3F4F6]"}`}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
