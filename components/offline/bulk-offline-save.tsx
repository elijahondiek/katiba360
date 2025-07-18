"use client"

import { useState, useEffect } from "react"
import { Download, Check, Loader2, AlertCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { offlineContentService } from "@/services/offline-content.service"
import { getChapters } from "@/lib/api"

interface Chapter {
  chapter_number: number
  chapter_title: string
  articles_count: number
  estimated_size?: string
}

interface BulkOfflineSaveProps {
  onSaveComplete?: (savedChapters: number[]) => void
  className?: string
}

export function BulkOfflineSave({ onSaveComplete, className }: BulkOfflineSaveProps) {
  const { authState } = useAuth()
  const { toast } = useToast()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapters, setSelectedChapters] = useState<Set<number>>(new Set())
  const [offlineChapters, setOfflineChapters] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentDownloading, setCurrentDownloading] = useState<string | null>(null)
  const [isLoadingChapters, setIsLoadingChapters] = useState(true)

  useEffect(() => {
    fetchChapters()
    checkOfflineStatus()
  }, [authState?.user?.id])

  const fetchChapters = async () => {
    try {
      setIsLoadingChapters(true)
      const response = await getChapters(18, 0)
      if (response?.body?.chapters) {
        const chaptersWithEstimates = response.body.chapters.map((chapter: any) => ({
          ...chapter,
          estimated_size: estimateChapterSize(chapter.articles_count)
        }))
        setChapters(chaptersWithEstimates)
      }
    } catch (error) {
      console.error('Error fetching chapters:', error)
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive"
      })
    } finally {
      setIsLoadingChapters(false)
    }
  }

  const checkOfflineStatus = async () => {
    if (!authState?.user?.id) return

    try {
      const offlineChapters = await offlineContentService.getAllOfflineChapters()
      const offlineChapterNumbers = new Set(offlineChapters.map(c => c.chapter_number))
      setOfflineChapters(offlineChapterNumbers)
    } catch (error) {
      console.error('Error checking offline status:', error)
    }
  }

  const estimateChapterSize = (articleCount: number): string => {
    // Rough estimation: ~3KB per article
    const estimatedKB = articleCount * 3
    if (isNaN(estimatedKB) || !isFinite(estimatedKB) || articleCount === undefined || articleCount === null) {
      return "Size unknown"
    }
    if (estimatedKB < 1024) {
      return `~${estimatedKB}KB`
    }
    return `~${(estimatedKB / 1024).toFixed(1)}MB`
  }

  const handleChapterToggle = (chapterNumber: number) => {
    const newSelected = new Set(selectedChapters)
    if (newSelected.has(chapterNumber)) {
      newSelected.delete(chapterNumber)
    } else {
      newSelected.add(chapterNumber)
    }
    setSelectedChapters(newSelected)
  }

  const handleSelectAll = () => {
    const availableChapters = chapters
      .filter(chapter => !offlineChapters.has(chapter.chapter_number))
      .map(chapter => chapter.chapter_number)
    
    setSelectedChapters(new Set(availableChapters))
  }

  const handleDeselectAll = () => {
    setSelectedChapters(new Set())
  }

  const handleBulkDownload = async () => {
    if (!authState?.user?.id || selectedChapters.size === 0) return

    setIsLoading(true)
    setDownloadProgress(0)
    
    const chaptersToDownload = Array.from(selectedChapters)
    const totalChapters = chaptersToDownload.length
    const savedChapters: number[] = []

    try {
      for (let i = 0; i < chaptersToDownload.length; i++) {
        const chapterNumber = chaptersToDownload[i]
        const chapter = chapters.find(c => c.chapter_number === chapterNumber)
        
        setCurrentDownloading(chapter?.chapter_title || `Chapter ${chapterNumber}`)
        
        try {
          await offlineContentService.downloadChapter(chapterNumber)
          savedChapters.push(chapterNumber)
          
          // Update offline chapters set
          setOfflineChapters(prev => new Set([...prev, chapterNumber]))
          
          // Update progress
          const progress = ((i + 1) / totalChapters) * 100
          setDownloadProgress(progress)
        } catch (error) {
          console.error(`Error downloading chapter ${chapterNumber}:`, error)
          toast({
            title: "Download Failed",
            description: `Failed to download ${chapter?.chapter_title || `Chapter ${chapterNumber}`}`,
            variant: "destructive"
          })
        }
      }

      // Clear selections
      setSelectedChapters(new Set())
      
      toast({
        title: "Download Complete",
        description: `Successfully downloaded ${savedChapters.length} of ${totalChapters} chapters`,
        variant: "default"
      })
      
      onSaveComplete?.(savedChapters)
    } catch (error) {
      console.error('Bulk download error:', error)
      toast({
        title: "Download Error",
        description: "An error occurred during bulk download",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setCurrentDownloading(null)
      setDownloadProgress(0)
    }
  }

  const availableChapters = chapters.filter(chapter => 
    !offlineChapters.has(chapter.chapter_number)
  )

  const totalEstimatedSize = () => {
    const totalKB = Array.from(selectedChapters).reduce((total, chapterNumber) => {
      const chapter = chapters.find(c => c.chapter_number === chapterNumber)
      return total + (chapter?.articles_count || 0) * 3 // 3KB per article estimate
    }, 0)
    
    if (totalKB < 1024) {
      return `${totalKB}KB`
    }
    return `${(totalKB / 1024).toFixed(1)}MB`
  }

  if (isLoadingChapters) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Bulk Offline Download
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#1EB53A]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-[#1EB53A]" />
          Bulk Offline Download
        </CardTitle>
        <p className="text-sm text-[#6B7280]">
          Download multiple chapters for offline reading
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress indicator during download */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Downloading...</span>
              <span className="text-[#1EB53A] font-medium">{Math.round(downloadProgress)}%</span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
            {currentDownloading && (
              <p className="text-xs text-[#6B7280]">
                Current: {currentDownloading}
              </p>
            )}
          </div>
        )}

        {/* Selection controls */}
        {availableChapters.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoading}
              >
                Select All ({availableChapters.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                disabled={isLoading || selectedChapters.size === 0}
              >
                Deselect All
              </Button>
            </div>
            
            {selectedChapters.size > 0 && (
              <div className="text-sm text-[#6B7280]">
                Selected: {selectedChapters.size} chapters (~{totalEstimatedSize()})
              </div>
            )}
          </div>
        )}

        {/* Chapter list */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {availableChapters.length === 0 ? (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-[#1EB53A] mx-auto mb-4" />
              <p className="text-[#6B7280]">All chapters are already available offline</p>
            </div>
          ) : (
            availableChapters.map((chapter) => (
              <div
                key={chapter.chapter_number}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#1EB53A] transition-colors"
              >
                <Checkbox
                  checked={selectedChapters.has(chapter.chapter_number)}
                  onCheckedChange={() => handleChapterToggle(chapter.chapter_number)}
                  disabled={isLoading}
                />
                
                <div className="flex-grow">
                  <p className="font-medium text-[#374151]">
                    Chapter {chapter.chapter_number}
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    {chapter.chapter_title}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {chapter.articles_count} articles • {chapter.estimated_size}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Download button */}
        {availableChapters.length > 0 && (
          <Button
            onClick={handleBulkDownload}
            disabled={isLoading || selectedChapters.size === 0}
            className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Selected ({selectedChapters.size})
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default BulkOfflineSave