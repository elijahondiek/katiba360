"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Download, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { offlineContentService } from "@/services/offline-content.service"
import { cn } from "@/lib/utils"

interface OfflineStatusIndicatorProps {
  contentId: string
  contentType: 'chapter' | 'article'
  className?: string
  showText?: boolean
}

export function OfflineStatusIndicator({
  contentId,
  contentType,
  className,
  showText = true,
}: OfflineStatusIndicatorProps) {
  const { authState } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Check offline availability
  useEffect(() => {
    checkOfflineStatus()
  }, [contentId, contentType, authState?.user?.id])

  const checkOfflineStatus = async () => {
    if (!authState?.user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      if (contentType === 'chapter') {
        const chapterNumber = parseInt(contentId)
        const available = await offlineContentService.isChapterAvailableOffline(chapterNumber)
        setIsOfflineAvailable(available)
      } else {
        // For articles, check if parent chapter is available
        const chapterNumber = parseInt(contentId.split('.')[0])
        const available = await offlineContentService.isChapterAvailableOffline(chapterNumber)
        setIsOfflineAvailable(available)
      }
    } catch (error) {
      console.error('Error checking offline status:', error)
      setIsOfflineAvailable(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: Download,
        text: "Checking...",
        variant: "secondary" as const,
        className: "text-gray-500"
      }
    }

    if (!isOnline && isOfflineAvailable) {
      return {
        icon: CheckCircle2,
        text: "Available Offline",
        variant: "default" as const,
        className: "bg-[#1EB53A] text-white hover:bg-[#0A7B24]"
      }
    }

    if (!isOnline && !isOfflineAvailable) {
      return {
        icon: WifiOff,
        text: "Offline - Not Available",
        variant: "destructive" as const,
        className: "bg-[#CE1126] text-white"
      }
    }

    if (isOnline && isOfflineAvailable) {
      return {
        icon: CheckCircle2,
        text: "Online + Offline",
        variant: "default" as const,
        className: "bg-[#1EB53A] text-white hover:bg-[#0A7B24]"
      }
    }

    return {
      icon: Wifi,
      text: "Online Only",
      variant: "secondary" as const,
      className: "text-blue-600"
    }
  }

  const statusInfo = getStatusInfo()
  const Icon = statusInfo.icon

  return (
    <Badge
      variant={statusInfo.variant}
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        statusInfo.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showText && statusInfo.text}
    </Badge>
  )
}

export default OfflineStatusIndicator