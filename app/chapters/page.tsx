"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Gavel,
  Users,
  Landmark,
  Scale,
  FileText,
  Globe,
  Search,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/language-selector";
import { cn } from "@/lib/utils";

import { chapterIconMap } from "./chapterIconMap";

import { useChapters } from "@/hooks/useChapters";
import { useBookmark } from "@/hooks/chapters/useBookmark";
import { saveBookmark, removeBookmark, getUserReadingProgress } from "@/lib/api";

import { chapterCategoryMap, chapterCategories } from "./chapterCategoryMap";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "./loading";
import { OfflineSaveButton } from "@/components/offline/offline-save-button";
import { OfflineStatusIndicator } from "@/components/offline/offline-status-indicator";
import { BulkOfflineSave } from "@/components/offline/bulk-offline-save";

// Custom hook to manage bookmarks for the chapters page
function useChapterBookmarks(userId: string | undefined) {
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  const [bookmarkIdMap, setBookmarkIdMap] = useState<Record<string, string>>({});
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  
  // Create a global bookmark hook without specific chapter
  const { fetchBookmarks } = useBookmark(
    userId,
    0, // Not tied to a specific chapter
    "", // No specific title
    (bookmarks) => {
      // Process bookmarks when they change
      const chapterBookmarksData = bookmarks
        .filter((bookmark: any) => bookmark.type === "chapter" || bookmark.bookmark_type === "chapter");
      
      // Extract just the references for the bookmarkedChapters state
      const chapterReferences: string[] = [];
      const idMap: Record<string, string> = {};
      
      // Build both the references array and ID map in a single loop
      chapterBookmarksData.forEach((bookmark: any) => {
        if (bookmark.reference && bookmark.bookmark_id) {
          // Add to ID map
          idMap[bookmark.reference] = bookmark.bookmark_id;
          // Add to references array (no duplicates)
          if (!chapterReferences.includes(bookmark.reference)) {
            chapterReferences.push(bookmark.reference);
          }
        }
      });
      
      setBookmarkedChapters(chapterReferences);
      setBookmarkIdMap(idMap);
      setBookmarksLoading(false);
    }
  );
  
  // Fetch bookmarks when userId changes
  useEffect(() => {
    if (userId) {
      setBookmarksLoading(true);
      fetchBookmarks();
    } else {
      setBookmarkedChapters([]);
      setBookmarkIdMap({});
    }
  }, [userId, fetchBookmarks]);
  
  return {
    bookmarkedChapters,
    bookmarkIdMap,
    bookmarksLoading,
    refreshBookmarks: fetchBookmarks
  };
}

export default function ChaptersPage() {
  const { chapters, isLoading, error } = useChapters();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const { language } = useLanguage();
  const { authState } = useAuth();
  // Get toast functionality
  const { toast } = useToast();
  
  // Use our custom hook to manage bookmarks
  const { bookmarkedChapters, bookmarkIdMap, bookmarksLoading, refreshBookmarks } = 
    useChapterBookmarks(authState.user?.id);
  
  // Fetch reading progress when user is authenticated
  useEffect(() => {
    const fetchReadingProgress = async () => {
      if (!authState.user?.id) {
        setReadingProgress({});
        return;
      }
      
      try {
        const response = await getUserReadingProgress(authState.user.id);
        if (response?.body?.progress?.completed_chapters) {
          // Convert completed chapters array to a map for easy lookup
          const progressMap: Record<string, number> = {};
          response.body.progress.completed_chapters.forEach((chapterNum: string) => {
            progressMap[chapterNum] = 100; // Completed chapters are 100%
          });
          setReadingProgress(progressMap);
        }
      } catch (error) {
        console.error('Error fetching reading progress:', error);
      }
    };
    
    fetchReadingProgress();
  }, [authState.user?.id]);

  // // Debug current bookmark state
  // useEffect(() => {
  //   console.log("Current bookmarkedChapters state:", bookmarkedChapters);
  // }, [bookmarkedChapters]);

  // Filter and search logic using API data
  const filteredChapters = chapters.filter((chapter: any) => {
    const matchesCategory =
      activeCategory === "All" ||
      chapterCategoryMap[chapter.chapter_number] === activeCategory;
    const matchesSearch =
      !search ||
      chapter.chapter_title?.toLowerCase().includes(search.toLowerCase()) ||
      chapter.chapter_summary?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  
  // Create a function to handle toggling bookmarks for chapters in the list
  const handleToggleBookmark = async (chapterNumber: string, chapterTitle: string) => {
    if (!authState.user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save bookmarks.",
        variant: "destructive",
      });
      return;
    }
    
    const chapterNumberStr = String(chapterNumber);
    const isCurrentlyBookmarked = bookmarkedChapters.includes(chapterNumberStr);
    
    try {
      if (!isCurrentlyBookmarked) {
        // Add bookmark
        await saveBookmark(authState.user.id, {
          type: "chapter",
          reference: chapterNumberStr,
          title: chapterTitle,
        });
        
        toast({
          title: "Success",
          description: "Bookmark saved successfully!",
          variant: "success",
        });
      } else {
        // Remove bookmark
        const bookmarkId = bookmarkIdMap[chapterNumberStr];
        
        if (!bookmarkId) {
          toast({
            title: "Error",
            description: "Could not find bookmark to remove",
            variant: "destructive",
          });
          return;
        }
        
        await removeBookmark(authState.user.id, bookmarkId);
        
        toast({
          title: "Bookmark Removed",
          description: `${chapterTitle} removed from bookmarks`,
          variant: "info",
        });
      }
      
      // Refresh the bookmarks list to update the UI
      refreshBookmarks();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark.",
        variant: "destructive",
      });
    }
  };

  const { t } = useLanguage();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <span className="text-[#CE1126] text-xl font-bold">
            Failed to load chapters. Please try again later.
          </span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-4">
            Explore the Constitution
          </h1>
          <p className="text-[#4B5563] mb-8">
            The Constitution of Kenya is organized into chapters that cover
            different aspects of governance, rights, and responsibilities.
            Explore each chapter to understand the framework that guides our
            nation.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search chapters..."
                className="pl-10 py-2 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            </div>
            
            {/* Bulk Download Toggle */}
            {authState.user && (
              <Button
                onClick={() => setShowBulkDownload(!showBulkDownload)}
                variant="outline"
                className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10"
              >
                {showBulkDownload ? "Hide" : "Bulk Download"}
              </Button>
            )}
          </div>

          {/* Bulk Download Panel */}
          {showBulkDownload && authState.user && (
            <div className="mb-8">
              <BulkOfflineSave
                onSaveComplete={(savedChapters) => {
                  toast({
                    title: "Download Complete",
                    description: `${savedChapters.length} chapters saved for offline reading`,
                    variant: "default"
                  });
                }}
              />
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {chapterCategories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  activeCategory === category
                    ? "bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                    : "border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]",
                  "transition-all duration-200"
                )}
                variant={activeCategory === category ? "default" : "outline"}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter: any) => (
              <div
                key={chapter.chapter_number}
                className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md flex flex-col h-full relative group"
              >
                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleBookmark(
                      chapter.chapter_number,
                      chapter.chapter_title
                    );
                  }}
                  className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1EB53A] transition-all duration-200"
                  aria-label={
                    bookmarkedChapters.includes(String(chapter.chapter_number))
                      ? "Remove bookmark"
                      : "Save for later"
                  }
                >
                  {bookmarkedChapters.includes(
                    String(chapter.chapter_number)
                  ) ? (
                    <BookmarkCheck className="h-5 w-5 transform transition-transform duration-300 scale-110" />
                  ) : (
                    <Bookmark className="h-5 w-5 transform transition-transform duration-300 group-hover:scale-110" />
                  )}
                </button>

                {/* Popular Tag */}
                {chapter.popular && (
                  <div className="absolute top-4 left-4 bg-[#CE1126] text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Popular</span>
                  </div>
                )}

                <Link
                  href={`/chapters/${chapter.chapter_number}`}
                  className="flex flex-col h-full"
                >
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    {chapterIconMap[chapter.chapter_number]}
                  </div>

                  <h2 className="text-xl font-bold mb-2 text-[#0A7B24]">
                    {chapter.chapter_title}
                  </h2>

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                      <span>
                        {(() => {
                          let articleCount = 0;
                          
                          // Count articles from direct articles array
                          if (Array.isArray(chapter.articles)) {
                            articleCount += chapter.articles.length;
                          }
                          
                          // Count articles from parts array (for chapters like Chapter 14)
                          if (Array.isArray(chapter.parts)) {
                            chapter.parts.forEach((part: any) => {
                              if (Array.isArray(part.articles)) {
                                articleCount += part.articles.length;
                              }
                            });
                          }
                          
                          return articleCount > 0 ? `${articleCount} Articles` : "Articles";
                        })()}
                      </span>
                      <span>
                        {readingProgress[chapter.chapter_number.toString()] > 0
                          ? "Complete"
                          : "Not started"}
                      </span>
                    </div>

                    <Progress
                      value={readingProgress[chapter.chapter_number.toString()] || 0}
                      className="h-2 bg-[#E5E7EB] mb-3"
                      indicatorClassName={cn(
                        readingProgress[chapter.chapter_number.toString()] > 0 ? "bg-[#1EB53A]" : "bg-[#D1D5DB]"
                      )}
                    />

                    {/* Offline Status and Save Button */}
                    {authState.user && (
                      <div className="flex items-center justify-end">
                        
                        <OfflineSaveButton
                          contentId={chapter.chapter_number.toString()}
                          contentType="chapter"
                          contentTitle={chapter.chapter_title}
                          variant="ghost"
                          size="sm"
                          showText={false}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
