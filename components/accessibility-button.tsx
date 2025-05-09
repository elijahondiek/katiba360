"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AccessibilityButton() {
  return (
    <Link href="/accessibility">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 bg-[#1EB53A] text-white border-none shadow-lg hover:bg-[#0A7B24]"
        aria-label="Accessibility Settings"
      >
        <Settings className="h-6 w-6" />
      </Button>
    </Link>
  )
}
