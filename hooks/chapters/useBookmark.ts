import { useState, useEffect, useCallback } from "react";
import { saveBookmark, getUserBookmarks, removeBookmark } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
}

interface Bookmark {
  bookmark_id: string;
  reference: string;
  type: string;
  bookmark_type: string;
  title: string;
}

type BookmarksChangeCallback = (bookmarks: Bookmark[]) => void;

export function useBookmark(
  userId: string | undefined, 
  chapterNumber: number, 
  chapterTitle: string,
  onBookmarksChange?: BookmarksChangeCallback
) {
  // Ensure chapterNumber is always handled as a string for consistency
  const chapterNumberStr = String(chapterNumber);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch bookmarks function that can be called multiple times
  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await getUserBookmarks(userId);
      if (response?.body?.bookmarks) {
        console.log('All bookmarks:', response.body.bookmarks);
        
        // Call the callback with all bookmarks if provided
        if (onBookmarksChange) {
          onBookmarksChange(response.body.bookmarks);
        }
        
        // If we have a chapter number, find this chapter's bookmark
        if (chapterNumberStr) {
          // Find this chapter's bookmark if it exists
          const chapterBookmark = response.body.bookmarks.find(
            (bookmark: any) => 
              (bookmark.type === 'chapter' || bookmark.bookmark_type === 'chapter') && 
              bookmark.reference === chapterNumberStr
          );
          
          console.log(`Bookmark for chapter ${chapterNumberStr}:`, chapterBookmark);
          
          // Update bookmark state
          const isChapterBookmarked = !!chapterBookmark;
          setIsBookmarked(isChapterBookmarked);
          
          // Store the bookmark ID if found
          if (chapterBookmark) {
            console.log('Setting bookmark ID:', chapterBookmark.bookmark_id);
            setBookmarkId(chapterBookmark.bookmark_id);
          } else {
            setBookmarkId(null);
          }
        }
      }
    } catch (error) {
      console.error('Error checking bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, chapterNumberStr]);
  
  // Check if chapter is bookmarked on mount and when dependencies change
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Toggle bookmark function
  const toggleBookmark = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save bookmarks.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Optimistically update the UI state immediately
    setIsBookmarked(prevState => !prevState);
    
    try {
      if (!isBookmarked) {
        // Add bookmark
        await saveBookmark({
          userId,
          bookmark_type: 'chapter',
          reference: chapterNumberStr,
          title: chapterTitle,
        });
        
        toast({
          title: "Success",
          description: "Bookmark saved successfully!",
          variant: "success",
        });
      } else {
        // Remove bookmark using the bookmark ID
        if (typeof removeBookmark === 'function' && bookmarkId) {
          console.log(`Removing bookmark with ID: ${bookmarkId} for chapter ${chapterNumber}`);
          try {
            await removeBookmark(userId, bookmarkId);
            
            // Use info variant for bookmark removal
            toast({
              title: "Bookmark Removed",
              description: `${chapterTitle} removed from bookmarks`,
              variant: "info",
            });
          } catch (error) {
            console.error('Error removing bookmark:', error);
            toast({
              title: "Error",
              description: "Could not remove bookmark",
              variant: "destructive",
            });
          }
        } else {
          console.error(`Cannot remove bookmark: missing bookmark ID (${bookmarkId}) or removeBookmark function`);
          toast({
            title: "Error",
            description: "Could not remove bookmark",
            variant: "destructive",
          });
        }
      }
      
      // Refetch bookmarks to update UI
      await fetchBookmarks();
      
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update bookmark.",
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
    fetchBookmarks,
  };
}
