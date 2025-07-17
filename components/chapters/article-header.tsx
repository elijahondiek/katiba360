"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bookmark, BookmarkCheck, Download, MoreHorizontal, Share2, Copy, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { offlineContentService } from "@/services/offline-content.service"
import { sharingService } from "@/services/sharing.service"
import { cn } from "@/lib/utils"

interface ArticleHeaderProps {
  articleNumber: number
  articleTitle: string
  chapterNumber: number
  isBookmarked: boolean
  onBookmarkToggle: () => void
  isBookmarkLoading: boolean
}

export function ArticleHeader({
  articleNumber,
  articleTitle,
  chapterNumber,
  isBookmarked,
  onBookmarkToggle,
  isBookmarkLoading
}: ArticleHeaderProps) {
  const { authState } = useAuth()
  const { toast } = useToast()
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)
  const [isOfflineLoading, setIsOfflineLoading] = useState(false)

  // Check offline status on mount
  React.useEffect(() => {
    checkOfflineStatus()
  }, [chapterNumber])

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

    setIsOfflineLoading(true)
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
      setIsOfflineLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/chapters/${chapterNumber}#article-${articleNumber}`
    
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link Copied",
        description: "Article link copied to clipboard",
        variant: "default"
      })
      
      // Track sharing event
      await sharingService.trackShare('article', `${chapterNumber}.${articleNumber}`, 'copy-link', url)
    } catch (error) {
      console.error('Error copying link:', error)
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/chapters/${chapterNumber}#article-${articleNumber}`
    const text = `Check out Article ${articleNumber}: ${articleTitle} from the Constitution of Kenya`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Article ${articleNumber}: ${articleTitle}`,
          text,
          url
        })
        
        // Track sharing event
        await sharingService.trackShare('article', `${chapterNumber}.${articleNumber}`, 'native', url)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
          handleCopyLink() // Fallback to copy
        }
      }
    } else {
      handleCopyLink() // Fallback to copy
    }
  }

  return (
    <div className="flex items-start justify-between mb-4 gap-4">
      <h2 className="text-2xl font-bold text-[#0A7B24] flex-grow">
        Article {articleNumber}: {articleTitle}
      </h2>
      
      {authState?.user?.id && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Primary bookmark button - most important action */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmarkToggle}
            disabled={isBookmarkLoading}
            className={cn(
              "text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10",
              isBookmarked && "bg-[#1EB53A]/10"
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            <span className="hidden sm:inline ml-1">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </Button>

          {/* More options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6B7280] hover:text-[#374151] hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleOfflineToggle} disabled={isOfflineLoading}>
                {isOfflineAvailable ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-[#1EB53A]" />
                    Remove from Offline
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {isOfflineLoading ? 'Saving...' : 'Save for Offline'}
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default ArticleHeader