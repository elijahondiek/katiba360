"use client"

import { useState, useEffect } from "react"
import { Download, Check, X, ChevronUp, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { offlineContentService } from "@/services/offline-content.service"
import { cn } from "@/lib/utils"

interface FloatingOfflineMenuProps {
  chapterNumber: number
  chapterTitle: string
  className?: string
}

export function FloatingOfflineMenu({ chapterNumber, chapterTitle, className }: FloatingOfflineMenuProps) {
  const { authState } = useAuth()
  const { toast } = useToast()
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

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

  // Check offline status
  useEffect(() => {
    if (authState?.user?.id) {
      checkOfflineStatus()
    }
  }, [chapterNumber, authState?.user?.id])

  const checkOfflineStatus = async () => {
    try {
      const available = await offlineContentService.isChapterAvailableOffline(chapterNumber)
      setIsOfflineAvailable(available)
    } catch (error) {
      console.error('Error checking offline status:', error)
    }
  }

  const handleOfflineToggle = async () => {
    if (!authState?.user?.id) return

    setIsLoading(true)
    try {
      if (isOfflineAvailable) {
        await offlineContentService.removeOfflineChapter(chapterNumber)
        toast({
          title: "Content Removed",
          description: "Chapter removed from offline storage",
          variant: "default"
        })
        setIsOfflineAvailable(false)
      } else {
        await offlineContentService.downloadChapter(chapterNumber)
        toast({
          title: "Content Saved",
          description: "Chapter is now available offline",
          variant: "default"
        })
        setIsOfflineAvailable(true)
      }
    } catch (error) {
      console.error('Error toggling offline:', error)
      toast({
        title: "Error",
        description: "Failed to update offline content",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsExpanded(false)
    }
  }

  // Don't show if user is not logged in
  if (!authState?.user?.id) {
    return null
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Expanded menu */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-[#374151]">Offline Content</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-blue-500" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-[#CE1126]" />
                  Offline
                </>
              )}
            </div>
            
            <div className="text-xs text-[#9CA3AF] mb-3 truncate">
              {chapterTitle}
            </div>
            
            <Button
              onClick={handleOfflineToggle}
              disabled={isLoading}
              className={cn(
                "w-full text-sm",
                isOfflineAvailable 
                  ? "bg-[#CE1126] hover:bg-[#A10E1F] text-white"
                  : "bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
              )}
            >
              {isLoading ? (
                "Processing..."
              ) : isOfflineAvailable ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Remove from Offline
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Save for Offline
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Floating action button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-10 w-10 rounded-full shadow-md transition-all duration-200 flex items-center justify-center opacity-60 hover:opacity-100",
          isOfflineAvailable 
            ? "bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
            : "bg-[#1EB53A] hover:bg-[#0A7B24] text-white",
          isExpanded && "rotate-180"
        )}
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : isOfflineAvailable ? (
          <Check className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export default FloatingOfflineMenu