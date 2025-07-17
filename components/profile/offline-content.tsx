"use client"

import { useState, useEffect } from "react"
import { Download, Trash2, Plus, HardDrive, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { getUserOfflineContent, addOfflineContent, removeOfflineContent, getChapters } from "@/lib/api"
import { offlineContentService } from "@/services/offline-content.service"
import { formatDistanceToNow } from "date-fns"

interface OfflineContentItem {
  id: string
  content_id: string
  content_type: string
  download_status: string
  file_size_bytes?: number
  downloaded_at?: string
  expires_at?: string
  priority: number
  created_at: string
  title?: string
  chapter_number?: number
}

interface Chapter {
  chapter_number: number
  chapter_title: string
  articles_count: number
}

export function OfflineContent() {
  const { authState } = useAuth()
  const { toast } = useToast()
  const [offlineContent, setOfflineContent] = useState<OfflineContentItem[]>([])
  const [availableChapters, setAvailableChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingContent, setAddingContent] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)

  // User preferences (in real app, these would come from user settings)
  const maxStorageLimit = 100 * 1024 * 1024 // 100 MB in bytes
  const currentStorageUsed = offlineContent.reduce((total, item) => total + (item.file_size_bytes || 0), 0)

  useEffect(() => {
    fetchOfflineContent()
    fetchAvailableChapters()
  }, [authState?.user?.id])

  const fetchOfflineContent = async () => {
    if (!authState?.user?.id) {
      setLoading(false)
      return
    }

    try {
      // Get content from offline service (IndexedDB)
      const offlineChapters = await offlineContentService.getAllOfflineChapters()
      
      // Transform to match the expected interface
      const enhancedContent = offlineChapters.map((chapter) => ({
        id: `offline_${chapter.chapter_number}`,
        content_id: chapter.chapter_number.toString(),
        content_type: 'chapter',
        download_status: 'downloaded',
        file_size_bytes: chapter.size_bytes,
        downloaded_at: new Date(chapter.downloaded_at).toISOString(),
        expires_at: new Date(chapter.expires_at).toISOString(),
        priority: 1,
        created_at: new Date(chapter.downloaded_at).toISOString(),
        title: chapter.chapter_title,
        chapter_number: chapter.chapter_number
      }))
      
      setOfflineContent(enhancedContent)
    } catch (err) {
      console.error('Error fetching offline content:', err)
      setError('Failed to load offline content')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableChapters = async () => {
    try {
      const response = await getChapters(18, 0) // Get all 18 chapters
      if (response?.body && Array.isArray(response.body.chapters)) {
        setAvailableChapters(response.body.chapters)
        
        // Update offline content with chapter titles
        setOfflineContent(prev => prev.map(item => {
          if (item.content_type === 'chapter' && item.chapter_number) {
            const chapter = response.body.chapters.find((c: any) => c.chapter_number === item.chapter_number)
            if (chapter) {
              return {
                ...item,
                title: `Chapter ${chapter.chapter_number}: ${chapter.chapter_title}`
              }
            }
          }
          return item
        }))
      }
    } catch (err) {
      console.error('Error fetching chapters:', err)
    }
  }

  const handleAddContent = async (contentId: string, contentType: string) => {
    if (!authState?.user?.id) return

    setAddingContent(true)
    try {
      // Use offline content service for better integration
      await offlineContentService.downloadChapter(parseInt(contentId))
      
      toast({
        title: "Content Downloaded",
        description: "Content is now available offline",
        variant: "default"
      })
      
      await fetchOfflineContent()
      setShowAddContent(false)
    } catch (err) {
      console.error('Error adding offline content:', err)
      toast({
        title: "Error",
        description: "Failed to download content for offline access",
        variant: "destructive"
      })
    } finally {
      setAddingContent(false)
    }
  }

  const handleRemoveContent = async (contentId: string) => {
    if (!authState?.user?.id) return

    try {
      // Find the content to get chapter number
      const content = offlineContent.find(item => item.id === contentId)
      if (content && content.chapter_number) {
        await offlineContentService.removeOfflineChapter(content.chapter_number)
      }
      
      toast({
        title: "Content Removed",
        description: "Content has been removed from offline storage",
        variant: "default"
      })
      
      await fetchOfflineContent()
    } catch (err) {
      console.error('Error removing offline content:', err)
      toast({
        title: "Error",
        description: "Failed to remove offline content",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'downloaded':
        return <CheckCircle2 className="h-4 w-4 text-[#1EB53A]" />
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Download className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'downloaded':
        return 'text-[#1EB53A]'
      case 'downloading':
        return 'text-blue-500'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const storagePercentage = (currentStorageUsed / maxStorageLimit) * 100

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Offline Content</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Offline Content</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOfflineContent} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0A7B24]">Offline Content</h2>
          <p className="text-[#4B5563] mt-1">Manage your downloaded content for offline access.</p>
        </div>
        <Button
          onClick={() => setShowAddContent(!showAddContent)}
          className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Storage Usage */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6B7280]">
              {formatFileSize(currentStorageUsed)} of {formatFileSize(maxStorageLimit)} used
            </span>
            <span className="text-sm font-medium text-[#1EB53A]">
              {Math.round(storagePercentage)}%
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Add Content Section */}
      {showAddContent && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Add New Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableChapters
                .filter(chapter => !offlineContent.some(item => 
                  item.content_type === 'chapter' && item.chapter_number === chapter.chapter_number
                ))
                .map((chapter) => (
                  <div
                    key={chapter.chapter_number}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#1EB53A] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <h4 className="font-medium text-[#374151]">
                          Chapter {chapter.chapter_number}
                        </h4>
                        <p className="text-sm text-[#6B7280] mt-1">
                          {chapter.chapter_title}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {chapter.articles_count} articles
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddContent(chapter.chapter_number.toString(), 'chapter')}
                        disabled={addingContent}
                        className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downloaded Content */}
      <div className="space-y-4">
        <h3 className="font-medium text-[#374151]">Downloaded Content</h3>
        
        {offlineContent.length === 0 ? (
          <div className="text-center py-8">
            <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No offline content yet</p>
            <p className="text-sm text-gray-400 mt-1">Add content to access it offline</p>
          </div>
        ) : (
          offlineContent.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#1EB53A] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                  {getStatusIcon(item.download_status)}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-[#374151]">{item.title}</p>
                  <div className="flex items-center text-xs text-[#6B7280] mt-1 gap-4">
                    <span className={`flex items-center gap-1 ${getStatusColor(item.download_status)}`}>
                      {item.download_status.charAt(0).toUpperCase() + item.download_status.slice(1)}
                    </span>
                    {item.file_size_bytes && (
                      <span>{formatFileSize(item.file_size_bytes)}</span>
                    )}
                    {item.downloaded_at && (
                      <span>
                        Downloaded {formatDistanceToNow(new Date(item.downloaded_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {item.expires_at && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Expires {formatDistanceToNow(new Date(item.expires_at), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveContent(item.id)}
                className="text-[#CE1126] hover:bg-red-50 hover:text-[#CE1126]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}