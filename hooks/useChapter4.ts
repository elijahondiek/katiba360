import useSWR from 'swr';
import { getChapterByNumber, reloadConstitutionData } from '@/lib/api';
import { useEffect, useState, useMemo } from 'react';

/**
 * Custom hook to fetch Chapter 4 (Bill of Rights) from the backend using SWR.
 * Returns articles array, loading state, and error.
 * Handles both direct articles and articles within parts structure.
 */
export function useChapter4() {
  const [cacheCleared, setCacheCleared] = useState(false);

  // Clear cache on first load
  useEffect(() => {
    const clearCacheOnce = async () => {
      if (!cacheCleared) {
        try {
          console.log('Clearing constitution cache...');
          await reloadConstitutionData();
          setCacheCleared(true);
          console.log('Cache cleared successfully');
        } catch (error) {
          console.error('Failed to clear cache:', error);
          setCacheCleared(true); // Continue anyway
        }
      }
    };
    clearCacheOnce();
  }, [cacheCleared]);

  const { data, error, isLoading } = useSWR(
    cacheCleared ? 'chapter-4-fresh' : null, // Don't fetch until cache is cleared
    async () => {
      const response = await getChapterByNumber(4, { force_reload: true });
      console.log('Full API response for Chapter 4:', response);
      return response;
    }
  );

  // Extract articles from parts structure with proper error handling
  const articles = useMemo(() => {
    const chapter = data?.body?.chapter;
    if (!chapter) return [];

    // Chapter 4 now uses parts structure - process all parts
    if (chapter.parts && Array.isArray(chapter.parts) && chapter.parts.length > 0) {
      const allArticles: any[] = [];
      
      chapter.parts.forEach((part: any) => {
        if (part.articles && Array.isArray(part.articles)) {
          // Add part information to each article for context
          const articlesWithPartInfo = part.articles.map((article: any) => ({
            ...article,
            part_number: part.part_number,
            part_title: part.part_title,
          }));
          allArticles.push(...articlesWithPartInfo);
        }
      });
      
      // Sort articles by article number to ensure proper order
      allArticles.sort((a, b) => a.article_number - b.article_number);
      return allArticles;
    }

    // Fallback to direct articles if no parts structure (legacy support)
    if (chapter.articles && Array.isArray(chapter.articles) && chapter.articles.length > 0) {
      return chapter.articles.map((article: any) => {
        // Manual mapping based on standard Bill of Rights structure
        let part_number, part_title;
        
        if (article.article_number >= 19 && article.article_number <= 25) {
          part_number = 1;
          part_title = "General Provisions to the Bill of Rights";
        } else if (article.article_number >= 26 && article.article_number <= 49) {
          part_number = 2;
          part_title = "Rights and fundamental freedoms";
        } else if (article.article_number >= 50 && article.article_number <= 57) {
          part_number = 3;
          part_title = "Specific application of rights";
        } else if (article.article_number === 58) {
          part_number = 4;
          part_title = "State of emergency";
        } else if (article.article_number === 59) {
          part_number = 5;
          part_title = "Kenya National Human Rights and Equality Commission";
        } else {
          part_number = 1;
          part_title = "General Provisions to the Bill of Rights";
        }
        
        return {
          ...article,
          part_number,
          part_title,
        };
      });
    }

    return [];
  }, [data]);

  return {
    articles,
    chapter: data?.body?.chapter,
    isLoading,
    error,
  };
}
