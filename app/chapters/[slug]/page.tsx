"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { getUserBookmarks, saveBookmark, removeBookmark } from "@/lib/api"
import { ToastService } from "@/services/toast.service"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

// Import custom components
import { ChapterHeader } from "@/components/chapters/ChapterHeader"
import { ChapterSidebar } from "@/components/chapters/ChapterSidebar"
import { ArticleContent } from "@/components/chapters/ArticleContent"
import { AudioPlayer } from "@/components/chapters/AudioPlayer"
import { RelatedArticles } from "@/components/chapters/RelatedArticles"
import { ScrollToTopButton } from "@/components/chapters/ScrollToTopButton"
import { FloatingOfflineMenu } from "@/components/chapters/floating-offline-menu"
import { ChapterNavigation } from "@/components/chapters/ChapterNavigation"

// Import custom hooks
import { useChapter, type Chapter, type Part } from "@/hooks/chapters/useChapter"
import { useBookmark } from "@/hooks/chapters/useBookmark"
import { useAudioSynthesis } from "@/hooks/chapters/useAudioSynthesis"
import { useScrollHandling } from "@/hooks/chapters/useScrollHandling"
import { useReadingProgress } from "@/hooks/chapters/useReadingProgress"

// Import utilities
import { processContent } from "@/lib/processContent"
import ChapterDetailLoading from "./loading"

export default function ChapterDetailPage() {
  // Get auth state for user ID
  const { authState } = useAuth()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // Get translation function from language context
  const { t } = useLanguage()
  
  // Support both '1' and 'something-1' formats
  let chapterNumber: number
  if (slug.includes("-")) {
    // Take the last segment after the last dash
    const lastSegment = slug.split("-").pop()
    chapterNumber = lastSegment ? parseInt(lastSegment, 10) : NaN
  } else {
    chapterNumber = parseInt(slug, 10)
  }
  
  // Other UI states
  const [isSimplified, setIsSimplified] = useState(false)
  // Using React.RefObject<HTMLDivElement> type to match the useScrollHandling hook's expected type
  const contentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  
  // Handler for simplified text toggle - using a simple function instead of useCallback
  const handleSimplifiedChange = (value: boolean) => {
    setIsSimplified(value)
  }
  
  // Initialize reading progress tracking
  const { 
    startReading, 
    pauseReading, 
    updateActivity,
    readTimeMinutes,
    isReading,
    syncProgress,
    manualSync
  } = useReadingProgress(
    authState.user?.id,
    'chapter',
    String(chapterNumber)
  )
  
  // Fetch chapter data
  const { 
    chapter, 
    relatedArticles, 
    relatedArticlesLoading, 
    loading, 
    error 
  } = useChapter(chapterNumber)
  
  // Handle bookmarking
  const { 
    isBookmarked,
    toggleBookmark,
    isLoading: bookmarkLoading
  } = useBookmark(
    authState.user?.id, 
    chapterNumber, 
    chapter?.chapter_title ?? ''
  )
  
  // State for article bookmarks
  const [articleBookmarks, setArticleBookmarks] = useState<Set<string>>(new Set())
  const [loadingArticleBookmarks, setLoadingArticleBookmarks] = useState<Set<string>>(new Set())
  
  // Load all bookmarks once for the chapter
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!authState.user?.id || !chapterNumber) return
      
      try {
        const response = await getUserBookmarks(authState.user.id)
        if (response?.body?.bookmarks) {
          const articleBookmarkRefs = response.body.bookmarks
            .filter((bookmark: any) => 
              bookmark.type === 'article' && 
              bookmark.reference.startsWith(`${chapterNumber}.`)
            )
            .map((bookmark: any) => bookmark.reference)
          setArticleBookmarks(new Set(articleBookmarkRefs))
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error)
      }
    }
    
    loadBookmarks()
  }, [authState.user?.id, chapterNumber])
  
  
  // Handle article bookmark toggle
  const toggleArticleBookmark = useCallback(async (articleNumber: number, articleTitle: string) => {
    if (!authState.user?.id || !chapterNumber) return
    
    const articleRef = `${chapterNumber}.${articleNumber}`
    const isCurrentlyBookmarked = articleBookmarks.has(articleRef)
    
    setLoadingArticleBookmarks(prev => new Set(prev).add(articleRef))
    
    try {
      if (isCurrentlyBookmarked) {
        // Find and remove bookmark
        const response = await getUserBookmarks(authState.user.id)
        if (response?.body?.bookmarks) {
          const bookmark = response.body.bookmarks.find(
            (b: any) => b.type === 'article' && b.reference === articleRef
          )
          if (bookmark) {
            await removeBookmark(authState.user.id, bookmark.bookmark_id)
            setArticleBookmarks(prev => {
              const newSet = new Set(prev)
              newSet.delete(articleRef)
              return newSet
            })
            ToastService.bookmarkRemoved(`Article ${articleNumber}`)
          }
        }
      } else {
        // Add bookmark
        await saveBookmark(authState.user.id, {
          type: 'article',
          reference: articleRef,
          title: articleTitle,
        })
        setArticleBookmarks(prev => new Set(prev).add(articleRef))
        ToastService.bookmarkSaved(`Article ${articleNumber}`)
      }
    } catch (error) {
      console.error('Error toggling article bookmark:', error)
      ToastService.error("Failed to update bookmark.")
    } finally {
      setLoadingArticleBookmarks(prev => {
        const newSet = new Set(prev)
        newSet.delete(articleRef)
        return newSet
      })
    }
  }, [authState.user?.id, chapterNumber, articleBookmarks])
  
  // Handle audio synthesis
  // Navigation for chapters
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  // Helper: get next chapter slug (assuming numeric order)
  const getNextChapterSlug = () => {
    if (!Number.isFinite(chapterNumber)) return null;
    // You may need to adapt this if your slugs are not just numbers
    const nextChapter = chapterNumber + 1;
    // Preserve prefix if any
    if (slug.includes("-")) {
      const prefix = slug.substring(0, slug.lastIndexOf("-") + 1);
      return `${prefix}${nextChapter}`;
    }
    return `${nextChapter}`;
  };

  // Auto-play audio on navigation
  useEffect(() => {
    if (autoPlayNext) {
      setAutoPlayNext(false);
      setTimeout(() => {
        toggleAudio();
      }, 600); // Wait for DOM to update
    }
  }, [autoPlayNext]);

  // Audio end handler
  const handleAudioEnd = () => {
    const nextSlug = getNextChapterSlug();
    if (nextSlug) {
      setAutoPlayNext(true);
      router.push(`/chapters/${nextSlug}`);
    }
  };

  const {
    isPlaying,
    audioProgress,
    audioSpeed,
    audioDuration,
    currentTime,
    volume,
    availableVoices,
    selectedVoice,
    formatTime,
    toggleAudio,
    handleProgressChange,
    handleSpeedChange,
    handleVolumeChange,
    handleVoiceChange,
    getVoiceLabel,
    getVoiceDetail
  } = useAudioSynthesis(contentRef, { onEnd: handleAudioEnd })
  
  // We'll use scrollToTop and scrollToArticle from the scrollHandling hook
  
  // Get scroll handling functions from custom hook
  const scrollHandling = useScrollHandling(
    contentRef,
    chapter?.articles || []
  )
  

  
  // Set up user activity tracking for reading progress
  useEffect(() => {
    // Create a debounced version of updateActivity to avoid too many updates
    let activityTimeout: NodeJS.Timeout | null = null;
    
    const debouncedUpdateActivity = () => {
      // Clear any existing timeout
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      
      // Set a new timeout
      activityTimeout = setTimeout(() => {
        updateActivity();
      }, 300); // 300ms debounce
    };

    // Keyboard navigation handler
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Handle arrow key navigation
      if (e.key === 'ArrowLeft' && chapterNumber > 1) {
        e.preventDefault();
        router.push(`/chapters/${chapterNumber - 1}`);
      } else if (e.key === 'ArrowRight' && chapterNumber < 18) {
        e.preventDefault();
        router.push(`/chapters/${chapterNumber + 1}`);
      }
      
      // Update activity for any key press
      debouncedUpdateActivity();
    };
    
    // Add user activity listeners
    window.addEventListener('mousemove', debouncedUpdateActivity)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', debouncedUpdateActivity)
    window.addEventListener('touchstart', debouncedUpdateActivity)
    window.addEventListener('scroll', debouncedUpdateActivity)
    
    // Trigger activity update immediately to start the session
    updateActivity();
    
    // Also set up a periodic activity check to ensure the session stays active while reading
    const periodicActivityCheck = setInterval(() => {
      // Check if the document is visible (user hasn't switched tabs)
      if (document.visibilityState === 'visible') {
        updateActivity();
      }
    }, 30000); // Every 30 seconds
    
    return () => {
      // Clean up all event listeners
      window.removeEventListener('mousemove', debouncedUpdateActivity)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', debouncedUpdateActivity)
      window.removeEventListener('touchstart', debouncedUpdateActivity)
      window.removeEventListener('scroll', debouncedUpdateActivity)
      
      // Clear the debounce timeout if it exists
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      
      // Clear the periodic activity check
      clearInterval(periodicActivityCheck);
    }
  }, [updateActivity])
  
  // Start reading progress tracking when component mounts or chapter changes
  useEffect(() => {
    // Start tracking when component mounts and user is logged in
    if (authState.user?.id) {
      // Pause any existing tracking first (in case of chapter change)
      pauseReading()
      
      // Sync any existing progress before starting new tracking
      syncProgress()
      
      // Start tracking for current chapter
      startReading()
    }
    
    // Sync progress and pause tracking when component unmounts
    return () => {
      if (authState.user?.id) {
        pauseReading()
        syncProgress() // Final sync on unmount
      }
    }
  }, [authState.user?.id, chapterNumber])

  // Helper function to format relevance text nicely
  const formatRelevance = (relevance: string): string => {
    if (!relevance) return t("related") ?? "Related"
    
    // Handle special cases
    if (relevance === "same_chapter") {
      return "Same Chapter"
    }
    
    // Convert snake_case to Title Case with spaces
    return relevance
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  
  if (loading) {
    return <ChapterDetailLoading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#CE1126] mb-4">{t("error") ?? "Error"}</h1>
          <p className="text-[#6B7280] mb-6">{error}</p>
          <Link href="/chapters">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">View All Chapters</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return null
  }

  // Define all variables that will be used in the component
  const chapterTitle = chapter.chapter_title ?? ''
  const content = isSimplified && chapter.simplified_content ? chapter.simplified_content : chapter.chapter_title
  const articles = chapter.articles ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ChapterHeader 
        chapterTitle={chapterTitle} 
        chapterNumber={chapterNumber}
        totalChapters={18}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Section Navigator */}
          <div className="order-2 md:order-1">
            <ChapterSidebar 
              articles={articles}
              parts={chapter.parts}
              activeSection={scrollHandling.activeSection}
              isBookmarked={isBookmarked}
              isSimplified={isSimplified}
              onArticleClick={scrollHandling.scrollToArticle}
              onBookmarkToggle={toggleBookmark}
              onSimplifiedChange={handleSimplifiedChange}
              chapterNumber={chapterNumber}
              chapterTitle={chapterTitle}
            />
          </div>

          {/* Main Content */}
          <div className="order-1 md:order-2">
            {/* Audio Player */}
            <AudioPlayer 
              isPlaying={isPlaying}
              audioProgress={audioProgress}
              audioDuration={audioDuration}
              currentTime={currentTime}
              audioSpeed={audioSpeed}
              volume={volume}
              availableVoices={availableVoices}
              selectedVoice={selectedVoice}
              onTogglePlay={toggleAudio}
              onProgressChange={handleProgressChange}
              onSpeedChange={handleSpeedChange}
              onVolumeChange={handleVolumeChange}
              onVoiceChange={handleVoiceChange}
              getVoiceLabel={getVoiceLabel}
              getVoiceDetail={getVoiceDetail}
              formatTime={formatTime}
            />

            {/* Article Content (visible) */}
            <div className="space-y-8">
              {chapter.parts && chapter.parts.length > 0 ? (
                // Render parts structure with part headers
                chapter.parts.map((part) => (
                  <div key={part.part_number} className="space-y-6">
                    {/* Part Header */}
                    <div className="border-l-4 border-[#1EB53A] pl-4 py-2 bg-[#F9FAFB]">
                      <h2 className="text-xl font-bold text-[#0A7B24] mb-1">
                        Part {part.part_number}: {part.part_title}
                      </h2>
                      <div className="text-sm text-[#6B7280]">
                        {part.articles?.length || 0} articles
                      </div>
                    </div>
                    
                    {/* Articles in this part */}
                    <div className="space-y-6 ml-4">
                      {part.articles?.map((article) => (
                        <div key={article.article_number} id={`article-${article.article_number}`} className="article-section">
                          <ArticleContent 
                            articles={[article]}
                            processContent={processContent}
                            chapterNumber={chapterNumber}
                            bookmarkedArticles={articleBookmarks}
                            loadingArticles={loadingArticleBookmarks}
                            onToggleBookmark={toggleArticleBookmark}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Render direct articles structure (existing chapters)
                articles.map((article) => (
                  <div key={article.article_number} id={`article-${article.article_number}`} className="article-section">
                    <ArticleContent 
                      articles={[article]}
                      processContent={processContent}
                      chapterNumber={chapterNumber}
                      bookmarkedArticles={articleBookmarks}
                      loadingArticles={loadingArticleBookmarks}
                      onToggleBookmark={toggleArticleBookmark}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Hidden container for audio synthesis (whole chapter) */}
            <div ref={contentRef} style={{ display: 'none' }}>
              {articles.map((article) => (
                <div key={article.article_number} className="article-section">
                  <ArticleContent 
                    articles={[article]}
                    processContent={processContent}
                    chapterNumber={chapterNumber}
                    bookmarkedArticles={articleBookmarks}
                    loadingArticles={loadingArticleBookmarks}
                    onToggleBookmark={toggleArticleBookmark}
                  />
                </div>
              ))}
            </div>

            {/* Related Articles */}
            <RelatedArticles 
              relatedArticles={relatedArticles}
              relatedArticlesLoading={relatedArticlesLoading}
              formatRelevance={formatRelevance}
            />

            {/* Chapter Navigation */}
            <ChapterNavigation 
              currentChapter={chapterNumber}
              totalChapters={18}
            />
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      <ScrollToTopButton 
        showScrollTop={scrollHandling.showScrollTop}
        onClick={scrollHandling.scrollToTop}
      />

      {/* Floating offline menu for mobile */}
      {chapter && (
        <FloatingOfflineMenu
          chapterNumber={chapterNumber}
          chapterTitle={chapter.chapter_title}
          className="md:hidden"
        />
      )}
    </div>
  )
}
