import { useState, useEffect } from "react";
import { getChapterByNumber, getRelatedArticles } from "@/lib/api";

export interface Part {
  part_number: number;
  part_title: string;
  articles: Article[];
}

export interface Chapter {
  chapter_number: number;
  chapter_title: string;
  articles?: Article[];
  parts?: Part[];
  simplified_content?: string;
}

export interface Article {
  article_number: number;
  article_title: string;
  content?: string;
  clauses?: any[];
}

interface RelatedArticle {
  chapter_number: number;
  chapter_title?: string;
  article_number: number;
  article_title?: string;
  relevance: string;
}

export function useChapter(chapterNumber: number) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [relatedArticlesLoading, setRelatedArticlesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapter() {
      setLoading(true);
      setError(null);
      try {
        if (isNaN(chapterNumber)) {
          setError("Invalid chapter identifier.");
          setLoading(false);
          return;
        }

        const response = await getChapterByNumber(chapterNumber);
        if (response && response.body && response.body.chapter) {
          const chapterData = response.body.chapter;
          
          // Handle chapters with parts structure (e.g., Chapter 14)
          if (chapterData.parts && chapterData.parts.length > 0) {
            // Flatten articles from all parts into a single array
            const allArticles = chapterData.parts.flatMap(part => part.articles || []);
            
            // Create a normalized chapter structure
            const normalizedChapter = {
              ...chapterData,
              articles: allArticles,
              parts: chapterData.parts // Keep parts for reference if needed
            };
            
            setChapter(normalizedChapter);
          } else {
            // Handle regular chapters with direct articles
            setChapter(chapterData);
          }

          // Fetch related articles separately to avoid blocking the main content
          try {
            setRelatedArticlesLoading(true);
            
            // The API expects a reference in the format "chapterNumber.articleNumber" (e.g., "1.2")
            // Get the first available article from either direct articles or parts
            let reference = `${chapterNumber}`;
            let firstArticle = null;
            
            if (chapterData.articles && chapterData.articles.length > 0) {
              firstArticle = chapterData.articles[0];
            } else if (chapterData.parts && chapterData.parts.length > 0) {
              // Find first article in parts
              for (const part of chapterData.parts) {
                if (part.articles && part.articles.length > 0) {
                  firstArticle = part.articles[0];
                  break;
                }
              }
            }
            
            if (firstArticle && firstArticle.article_number) {
              reference = `${chapterNumber}.${firstArticle.article_number}`;
            } else {
              // If no articles are available, append .1 as a fallback
              reference = `${chapterNumber}.1`;
            }
            
            const relatedResponse = await getRelatedArticles(reference);
            
            if (relatedResponse && relatedResponse.body && relatedResponse.body.related_articles) {
              // console.log('Related articles response:', relatedResponse.body.related_articles);
              setRelatedArticles(relatedResponse.body.related_articles);
            } else {
              // console.log('No related articles found or invalid response format');
              setRelatedArticles([]);
            }
          } catch (relatedErr) {
            // console.error('Error fetching related articles:', relatedErr);
            setRelatedArticles([]);
          } finally {
            setRelatedArticlesLoading(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch chapter.");
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
  }, [chapterNumber]);

  return {
    chapter,
    relatedArticles,
    relatedArticlesLoading,
    loading,
    error
  };
}
