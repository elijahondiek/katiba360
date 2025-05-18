"use client";

import { useState, useEffect } from "react";
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

import { chapterCategoryMap, chapterCategories } from "./chapterCategoryMap";
import { saveBookmark, getUserBookmarks, removeBookmark } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "./loading";

export default function ChaptersPage() {
  const { chapters, isLoading, error } = useChapters();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  // State for bookmarks
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>([]);
  // Store bookmark IDs mapped to chapter numbers for removal
  const [bookmarkIdMap, setBookmarkIdMap] = useState<Record<string, string>>({});
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  // Get auth state for user ID
  const { authState } = useAuth();
  // Get toast functionality
  const { toast } = useToast();

  // Fetch user's bookmarks when component mounts or user changes
  useEffect(() => {
    // Call the fetchUserBookmarks function when the component mounts or user changes
    fetchUserBookmarks();
  }, [authState.user?.id]);

  // Debug current bookmark state
  useEffect(() => {
    console.log("Current bookmarkedChapters state:", bookmarkedChapters);
  }, [bookmarkedChapters]);

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


  
  // Fetch user bookmarks function that can be reused
  async function fetchUserBookmarks() {
    if (authState.user?.id) {
      try {
        setBookmarksLoading(true);
        const response = await getUserBookmarks(authState.user.id);
        console.log("Bookmarks API response:", response);

        if (response?.body?.bookmarks) {
          // Get only chapter bookmarks
          const chapterBookmarksData = response.body.bookmarks
            .filter((bookmark: any) => bookmark.type === "chapter");
          
          console.log("Chapter bookmarks data:", chapterBookmarksData);
          
          // Log the first bookmark to inspect its structure
          if (chapterBookmarksData.length > 0) {
            console.log("First bookmark structure:", JSON.stringify(chapterBookmarksData[0], null, 2));
          }
          
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
            } else {
              console.error(`No bookmark_id found for bookmark:`, bookmark);
            }
          });

          console.log('Chapter references:', chapterReferences);
          console.log('Bookmark ID Map:', idMap);
          
          setBookmarkedChapters(chapterReferences);
          setBookmarkIdMap(idMap);
        } else {
          // Reset states if no bookmarks found
          setBookmarkedChapters([]);
          setBookmarkIdMap({});
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setBookmarksLoading(false);
      }
    }
  }

  // Toggle bookmark state and call API
  async function toggleBookmark(chapterNumber: string, chapterTitle: string) {
    const userId = authState.user?.id;
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save bookmarks.",
        variant: "destructive",
      });
      return;
    }

    // Check if this chapter is already bookmarked
    // Ensure we're comparing strings with strings
    const chapterNumberStr = String(chapterNumber);
    const isBookmarked = bookmarkedChapters.includes(chapterNumberStr);
    console.log(`Chapter ${chapterNumberStr} isBookmarked:`, isBookmarked);
    console.log('Current bookmarkedChapters:', bookmarkedChapters);
    
    try {
      // Optimistically update UI
      setBookmarkedChapters((prev) =>
        isBookmarked
          ? prev.filter((id) => id !== chapterNumberStr)
          : [...prev, chapterNumberStr]
      );

      console.log(`Toggle bookmark for chapter ${chapterNumberStr}, currently bookmarked: ${isBookmarked}`);
      
      if (!isBookmarked) {
        // NOT already bookmarked, so add a new bookmark
        console.log(`Adding bookmark for chapter ${chapterNumberStr}`);
        await saveBookmark({
          userId,
          bookmark_type: "chapter",
          reference: chapterNumberStr,
          title: chapterTitle,
        });
        
        toast({
          title: "Success",
          description: "Bookmark saved successfully!",
          variant: "success",
        });
      } else {
        // Already bookmarked, so remove it
        console.log(`Removing bookmark for chapter ${chapterNumberStr}`);
        
        // Get the bookmark ID for this chapter
        const bookmarkId = bookmarkIdMap[chapterNumberStr];
        console.log(`Bookmark ID for chapter ${chapterNumberStr}:`, bookmarkId);
        
        if (!bookmarkId) {
          console.error(`No bookmark ID found for chapter ${chapterNumberStr}`);
          toast({
            title: "Error",
            description: "Could not find bookmark to remove",
            variant: "destructive",
          });
          return;
        }
        
        // Remove bookmark using the correct ID
        console.log(`Calling removeBookmark with userId=${userId}, bookmarkId=${bookmarkId}`);
        try {
          const response = await removeBookmark(userId, bookmarkId);
          console.log('Remove bookmark response:', response);
        } catch (error) {
          console.error('Error removing bookmark:', error);
        }
        
        toast({
          title: "Bookmark Removed",
          description: `${chapterTitle} removed from bookmarks`,
        });
      }
      
      // Refetch bookmarks to ensure UI is in sync with backend
      await fetchUserBookmarks();
      
    } catch (e) {
      // Revert optimistic update on error
      await fetchUserBookmarks();
      
      toast({
        title: "Error",
        description: "Failed to update bookmark.",
        variant: "destructive",
      });
      console.error(e);
    }
  }

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
          </div>

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
                    toggleBookmark(
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
                        {Array.isArray(chapter.articles)
                          ? `${chapter.articles.length} Articles`
                          : "Articles"}
                      </span>
                      <span>
                        {chapter.progress > 0
                          ? `${chapter.progress}% Complete`
                          : "Not started"}
                      </span>
                    </div>

                    <Progress
                      value={chapter.progress}
                      className="h-2 bg-[#E5E7EB]"
                      indicatorClassName={cn(
                        chapter.progress > 0 ? "bg-[#1EB53A]" : "bg-[#D1D5DB]"
                      )}
                    />
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
