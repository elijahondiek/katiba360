"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Download, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { offlineContentService } from "@/services/offline-content.service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OnlineOfflineStatusProps {
  className?: string
  showInMobile?: boolean
}

export function OnlineOfflineStatus({ className, showInMobile = true }: OnlineOfflineStatusProps) {
  const { authState } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [offlineContentCount, setOfflineContentCount] = useState(0)
  const [offlineContentSize, setOfflineContentSize] = useState(0)

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

  // Check offline content
  useEffect(() => {
    if (authState?.user?.id) {
      checkOfflineContent()
    }
  }, [authState?.user?.id])

  const checkOfflineContent = async () => {
    try {
      const metadata = await offlineContentService.getMetadata()
      if (metadata) {
        setOfflineContentCount(metadata.total_chapters)
        setOfflineContentSize(metadata.total_size_bytes)
      }
    } catch (error) {
      console.error('Error checking offline content:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getStatusInfo = () => {
    if (authState?.isOfflineMode || !isOnline) {
      if (offlineContentCount > 0) {
        return {
          icon: CheckCircle2,
          color: "bg-[#1EB53A]",
          pulse: false,
          tooltip: `Offline Mode - ${offlineContentCount} chapters available (${formatFileSize(offlineContentSize)})`
        }
      } else {
        return {
          icon: WifiOff,
          color: "bg-[#CE1126]",
          pulse: true,
          tooltip: "Offline - No content available. Go online to download content."
        }
      }
    } else {
      if (offlineContentCount > 0) {
        return {
          icon: CheckCircle2,
          color: "bg-[#1EB53A]",
          pulse: false,
          tooltip: `Online + ${offlineContentCount} chapters offline (${formatFileSize(offlineContentSize)})`
        }
      } else {
        return {
          icon: Wifi,
          color: "bg-blue-500",
          pulse: false,
          tooltip: "Online - No offline content saved"
        }
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  if (!authState?.user) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative p-2 h-auto",
              !showInMobile && "hidden sm:flex",
              className
            )}
          >
            {/* Breathing dot */}
            <div className="relative">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  statusInfo.color,
                  statusInfo.pulse && "animate-pulse"
                )}
              />
              
              {/* Ripple effect for offline mode */}
              {statusInfo.pulse && (
                <div className={cn(
                  "absolute inset-0 w-3 h-3 rounded-full animate-ping",
                  statusInfo.color,
                  "opacity-20"
                )} />
              )}
            </div>

            {/* Badge for offline content count (desktop only) */}
            {offlineContentCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs hidden sm:flex"
              >
                {offlineContentCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm">{statusInfo.tooltip}</span>
          </div>
          {authState.user && (
            <div className="text-xs text-gray-500 mt-1">
              Click to manage offline content
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default OnlineOfflineStatus