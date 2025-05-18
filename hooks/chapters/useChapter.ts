import { useState, useEffect } from "react";
import { getChapterByNumber, getRelatedArticles } from "@/lib/api";

interface Chapter {
  chapter_number: number;
  chapter_title: string;
  articles: Article[];
  simplified_content?: string;
}

interface Article {
  article_number: number;
  article_title: string;
  content: string;
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
          setChapter(response.body.chapter);

          // Fetch related articles separately to avoid blocking the main content
          try {
            setRelatedArticlesLoading(true);
            
            // The API expects a reference in the format "chapterNumber.articleNumber" (e.g., "1.2")
            // If we have chapter data with articles, use the first article for the reference
            let reference = `${chapterNumber}`;
            
            // If the chapter has articles, use the first article's number to create a proper reference
            if (response.body.chapter.articles && response.body.chapter.articles.length > 0) {
              const firstArticle = response.body.chapter.articles[0];
              if (firstArticle.article_number) {
                reference = `${chapterNumber}.${firstArticle.article_number}`;
                console.log(`Using reference: ${reference} for related articles`);
              }
            } else {
              // If no articles are available, append .1 as a fallback
              reference = `${chapterNumber}.1`;
              console.log(`No articles found, using fallback reference: ${reference}`);
            }
            
            const relatedResponse = await getRelatedArticles(reference);
            
            if (relatedResponse && relatedResponse.body && relatedResponse.body.related_articles) {
              console.log('Related articles response:', relatedResponse.body.related_articles);
              setRelatedArticles(relatedResponse.body.related_articles);
            } else {
              console.log('No related articles found or invalid response format');
              setRelatedArticles([]);
            }
          } catch (relatedErr) {
            console.error('Error fetching related articles:', relatedErr);
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
