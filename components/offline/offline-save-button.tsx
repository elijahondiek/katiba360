"use client"

import { useState, useEffect } from "react"
import { Download, Check, Loader2, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToastService } from "@/services/toast.service"
import { useAuth } from "@/contexts/AuthContext"
import { offlineContentService } from "@/services/offline-content.service"
import { cn } from "@/lib/utils"

interface OfflineSaveButtonProps {
  contentId: string
  contentType: 'chapter' | 'article'
  contentTitle: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  onSaveSuccess?: () => void
  onRemoveSuccess?: () => void
}

export function OfflineSaveButton({
  contentId,
  contentType,
  contentTitle,
  className,
  variant = 'outline',
  size = 'md',
  showText = true,
  onSaveSuccess,
  onRemoveSuccess,
}: OfflineSaveButtonProps) {
  const { authState } = useAuth()
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  // Check if content is available offline
  useEffect(() => {
    checkOfflineStatus()
  }, [contentId, contentType, authState?.user?.id])

  const checkOfflineStatus = async () => {
    if (!authState?.user?.id) {
      setIsCheckingStatus(false)
      return
    }

    try {
      setIsCheckingStatus(true)
      
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
      setIsCheckingStatus(false)
    }
  }

  const handleSaveOffline = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!authState?.user?.id) {
      ToastService.authRequired("Please log in to save content offline")
      return
    }

    setIsLoading(true)
    try {
      if (contentType === 'chapter') {
        const chapterNumber = parseInt(contentId)
        await offlineContentService.downloadChapter(chapterNumber)
        
        ToastService.offlineContentSaved(contentTitle)
      } else {
        // For articles, save the entire chapter
        const chapterNumber = parseInt(contentId.split('.')[0])
        await offlineContentService.downloadChapter(chapterNumber)
        
        ToastService.offlineContentSaved(`Chapter ${chapterNumber} (including this article)`)
      }
      
      setIsOfflineAvailable(true)
      onSaveSuccess?.()
      // Re-check status to ensure UI is in sync
      setTimeout(() => checkOfflineStatus(), 1000)
    } catch (error) {
      console.error('Error saving offline:', error)
      ToastService.offlineContentError("save")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveOffline = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!authState?.user?.id) return

    setIsLoading(true)
    try {
      const chapterNumber = contentType === 'chapter' 
        ? parseInt(contentId)
        : parseInt(contentId.split('.')[0])
      
      await offlineContentService.removeOfflineChapter(chapterNumber)
      
      ToastService.offlineContentRemoved(contentTitle)
      
      setIsOfflineAvailable(false)
      onRemoveSuccess?.()
    } catch (error) {
      console.error('Error removing offline:', error)
      ToastService.offlineContentError("remove")
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-2 text-xs'
      case 'lg':
        return 'h-12 px-6 text-base'
      default:
        return 'h-10 px-4 text-sm'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3'
      case 'lg':
        return 'h-5 w-5'
      default:
        return 'h-4 w-4'
    }
  }

  if (isCheckingStatus) {
    return (
      <Button
        variant={variant}
        disabled
        className={cn(getButtonSize(), className)}
      >
        <Loader2 className={cn(getIconSize(), "animate-spin", showText && "mr-2")} />
        {showText && "Checking..."}
      </Button>
    )
  }

  if (isOfflineAvailable) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10"
          disabled
        >
          <Check className={cn(getIconSize(), showText && "mr-2")} />
          {showText && "Available Offline"}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveOffline}
          disabled={isLoading}
          className="text-[#CE1126] hover:text-[#A10E1F] hover:bg-red-50"
        >
          {isLoading ? (
            <Loader2 className={cn(getIconSize(), "animate-spin")} />
          ) : (
            <Trash2 className={getIconSize()} />
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      onClick={handleSaveOffline}
      disabled={isLoading}
      className={cn(getButtonSize(), className)}
    >
      {isLoading ? (
        <Loader2 className={cn(getIconSize(), "animate-spin", showText && "mr-2")} />
      ) : (
        <Download className={cn(getIconSize(), showText && "mr-2")} />
      )}
      {showText && (isLoading ? "Saving..." : "Save Offline")}
    </Button>
  )
}

export default OfflineSaveButton