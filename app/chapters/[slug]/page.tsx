"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from "next/navigation"
import Link from "next/link"

// Import custom components
import { ChapterHeader } from "@/components/chapters/ChapterHeader"
import { ChapterSidebar } from "@/components/chapters/ChapterSidebar"
import { ArticleContent } from "@/components/chapters/ArticleContent"
import { AudioPlayer } from "@/components/chapters/AudioPlayer"
import { RelatedArticles } from "@/components/chapters/RelatedArticles"
import { ScrollToTopButton } from "@/components/chapters/ScrollToTopButton"

// Import custom hooks
import { useChapter } from "@/hooks/chapters/useChapter"
import { useBookmark } from "@/hooks/chapters/useBookmark"
import { useAudioSynthesis } from "@/hooks/chapters/useAudioSynthesis"
import { useScrollHandling } from "@/hooks/chapters/useScrollHandling"

// Import utilities
import { processContent } from "@/lib/processContent"
import ChapterDetailLoading from "./loading"

export default function ChapterDetailPage() {
  // Get auth state for user ID
  const { authState } = useAuth()
  const params = useParams()
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
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  
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
  
  // Handle audio synthesis
  // Navigation for chapters
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const router = require('next/navigation').useRouter();

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
    formatTime,
    toggleAudio,
    handleProgressChange,
    handleSpeedChange,
    handleVolumeChange
  } = useAudioSynthesis(contentRef, { onEnd: handleAudioEnd })
  
  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to article handler
  const scrollToArticle = (articleNumber: number) => {
    const articleElement = document.getElementById(`article-${articleNumber}`)
    if (articleElement) {
      // Calculate position with offset for header
      const headerOffset = 120
      const elementPosition = articleElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      // Scroll to the element with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update active section
      setActiveSection(articleNumber.toString())
    }
  }

  // Handle URL hash fragment for automatic scrolling to article sections
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Get the hash fragment from the URL
      const hash = window.location.hash;
      
      if (hash && hash.startsWith('#article-')) {
        // Extract article number from hash (e.g., #article-42 -> 42)
        const articleId = hash.replace('#article-', '');
        const articleNumber = parseInt(articleId, 10);
        
        if (!isNaN(articleNumber)) {
          // Add a small delay to ensure the DOM is fully rendered
          // This is especially important for client-side navigation
          setTimeout(() => {
            scrollToArticle(articleNumber);
          }, 300);
        }
      }
    }
  }, [slug]); // Re-run when slug changes for client-side navigation

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button after scrolling 200px
      setShowScrollTop(window.scrollY > 200)

      // Update active section based on scroll position
      const articleElements = document.querySelectorAll('[id^="article-"]')
      let currentSection = null

      articleElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        // Check if the element is in the viewport (with some buffer)
        if (rect.top <= 150 && rect.bottom >= 150) {
          const articleId = element.id.replace('article-', '')
          currentSection = articleId
        }
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    // Add scroll listener to window since we need to track global scroll
    window.addEventListener('scroll', handleScroll)
    
    // Initial check for active section
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Section Navigator */}
          <div className="order-2 md:order-1">
            <ChapterSidebar 
              articles={articles}
              activeSection={activeSection}
              isBookmarked={isBookmarked}
              isSimplified={isSimplified}
              onArticleClick={scrollToArticle}
              onBookmarkToggle={toggleBookmark}
              onSimplifiedChange={setIsSimplified}
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
              onTogglePlay={toggleAudio}
              onProgressChange={handleProgressChange}
              onSpeedChange={handleSpeedChange}
              onVolumeChange={handleVolumeChange}
              formatTime={formatTime}
            />

            {/* Article Content (visible) */}
            <div className="space-y-8">
              {articles.map((article) => (
                <div key={article.article_number} id={`article-${article.article_number}`} className="article-section">
                  <ArticleContent 
                    articles={[article]}
                    processContent={processContent}
                  />
                </div>
              ))}
            </div>
            {/* Hidden container for audio synthesis (whole chapter) */}
            <div ref={contentRef} style={{ display: 'none' }}>
              {articles.map((article) => (
                <div key={article.article_number} className="article-section">
                  <ArticleContent 
                    articles={[article]}
                    processContent={processContent}
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
          </div>
        </div>
      </main>

      {/* Scroll to top button */}
      <ScrollToTopButton 
        showScrollTop={showScrollTop}
        onClick={scrollToTop}
      />
    </div>
  )
}
