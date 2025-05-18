"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useOffline } from "@/contexts/offline-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function OfflineIndicator() {
  const { isOffline } = useOffline()
  const [showNotification, setShowNotification] = useState(false)

  // Show notification when offline status changes
  useEffect(() => {
    if (isOffline) {
      setShowNotification(true)
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOffline])

  if (!isOffline && !showNotification) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <Link href="/offline" className="pointer-events-auto">
        <Badge
          variant="outline"
          className={`
            py-2 px-4 
            ${isOffline ? "bg-[#CE1126]/90 text-white border-[#CE1126]" : "bg-[#1EB53A]/90 text-white border-[#1EB53A]"}
            shadow-lg
            flex items-center gap-2
            animate-in slide-in-from-bottom duration-300
          `}
        >
          {isOffline ? (
            <>
              <WifiOff className="h-4 w-4" /> You are offline. Some features may be limited.
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" /> You are back online.
            </>
          )}
        </Badge>
      </Link>
    </div>
  )
}
