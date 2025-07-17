"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid3X3, List, BookOpen, Shield, Gavel, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getUserBookmarks, removeBookmark } from "@/lib/api"

interface SavedContentItem {
  bookmark_id: string
  title: string
  type: string
  reference: string
  created_at: string
  progress?: number
}

export function SavedContentLibrary() {
  const { authState } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [savedContent, setSavedContent] = useState<SavedContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSavedContent() {
      if (!authState?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await getUserBookmarks(authState.user.id)
        console.log('BookmarksAPI response:', response)
        if (response?.body?.bookmarks && Array.isArray(response.body.bookmarks)) {
          console.log('Setting saved content:', response.body.bookmarks)
          setSavedContent(response.body.bookmarks)
        } else {
          console.log('No bookmarks found or invalid response structure')
        }
      } catch (err) {
        console.error('Error fetching saved content:', err)
        setError('Failed to load saved content')
      } finally {
        setLoading(false)
      }
    }

    fetchSavedContent()
  }, [authState?.user?.id])

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'chapter':
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
      case 'article':
      case 'right':
        return <Shield className="h-5 w-5 text-[#1EB53A]" />
      case 'scenario':
        return <Gavel className="h-5 w-5 text-[#1EB53A]" />
      default:
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleRemoveContent = async (bookmarkId: string) => {
    if (!authState?.user?.id) return
    
    try {
      await removeBookmark(authState.user.id, bookmarkId)
      setSavedContent(prev => prev.filter(item => item.bookmark_id !== bookmarkId))
    } catch (err) {
      console.error('Error removing bookmark:', err)
      // You could show a toast notification here
    }
  }

  const handleNavigateToContent = (item: SavedContentItem) => {
    if (item.type === 'chapter') {
      router.push(`/chapters/${item.reference}`)
    } else if (item.type === 'article') {
      // Parse reference like "1.2" to chapter 1, article 2
      const [chapter, article] = item.reference.split('.')
      router.push(`/chapters/${chapter}#article-${article}`)
    }
  }

  // Filter content based on search query and active tab
  const filteredContent = savedContent.filter(
    (item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.reference.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === "all" || item.type === activeTab;
      
      return matchesSearch && matchesTab;
    }
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Saved Content Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-3"></div>
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Saved Content Library</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Saved Content Library</h2>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search saved content..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>

          <div className="border border-gray-200 rounded-md flex">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-md rounded-r-none px-3 ${viewMode === "grid" ? "bg-[#F3F4F6]" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-r-md rounded-l-none px-3 ${viewMode === "list" ? "bg-[#F3F4F6]" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chapter">Chapters</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <Card key={item.bookmark_id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#1EB53A]/10 p-2 rounded-full">{getIcon(item.type)}</div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {item.type} {item.reference} • Saved {formatDate(item.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveContent(item.bookmark_id)
                    }}
                  >
                    <Bookmark className="h-4 w-4 fill-[#1EB53A] text-[#1EB53A]" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                <p className="text-sm text-[#4B5563] line-clamp-2">
                  {item.type === 'chapter' ? 'Chapter' : 'Article'} {item.reference}
                </p>
                {item.progress && item.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="text-[#1EB53A] font-medium">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1EB53A] rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button 
                  variant="ghost" 
                  className="w-full text-[#1EB53A] hover:bg-[#1EB53A]/10"
                  onClick={() => handleNavigateToContent(item)}
                >
                  Continue Reading
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item) => (
            <div
              key={item.bookmark_id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => handleNavigateToContent(item)}
            >
              <div className="bg-[#1EB53A]/10 p-2 rounded-full">{getIcon(item.type)}</div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[#0A7B24]">{item.title}</h3>
                    <p className="text-xs text-[#6B7280]">
                      {item.type} {item.reference} • Saved {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveContent(item.bookmark_id)
                    }}
                  >
                    <Bookmark className="h-4 w-4 fill-[#1EB53A] text-[#1EB53A]" />
                  </Button>
                </div>
                <p className="text-sm text-[#4B5563] mt-1">
                  {item.type === 'chapter' ? 'Chapter' : 'Article'} {item.reference}
                </p>
                {item.progress && item.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="text-[#1EB53A] font-medium">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1EB53A] rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-[#F3F4F6] rounded-full p-4 inline-flex mb-4">
            <Bookmark className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">No saved content found</h3>
          <p className="text-[#6B7280] mb-6">Try adjusting your search or save some content to see it here.</p>
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">Explore Content</Button>
        </div>
      )}
    </div>
  )
}
