"use client";

import { useRef, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { ArticleHeader } from "@/components/chapters/article-header";

interface SubClause {
  sub_clause_id?: string;
  sub_clause_letter?: string;
  sub_clause_number?: string;
  content: string;
}

interface Clause {
  clause_number: string;
  content: string;
  sub_clauses?: SubClause[];
}

interface Article {
  article_number: number;
  article_title: string;
  content: string;
  clauses?: Clause[];
}

interface ArticleContentProps {
  articles: Article[];
  processContent: (content: string) => string;
  chapterNumber?: number;
  bookmarkedArticles?: Set<string>;
  loadingArticles?: Set<string>;
  onToggleBookmark?: (articleNumber: number, articleTitle: string) => void;
}

export function ArticleContent({ 
  articles, 
  processContent, 
  chapterNumber,
  bookmarkedArticles = new Set(),
  loadingArticles = new Set(),
  onToggleBookmark
}: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { authState } = useAuth();

  // Key terms tooltip effect
  useEffect(() => {
    if (!contentRef.current) return;
    
    const setupKeyTermTooltips = () => {
      if (!contentRef.current) return;
      const keyTerms = contentRef.current.querySelectorAll('.key-term');
      
      function handleMouseEnter(e: Event) {
        const target = e.currentTarget as HTMLElement;
        const tooltip = document.createElement('div');
        tooltip.className = 'key-term-tooltip';
        tooltip.textContent = target.dataset.definition ?? '';
        document.body.appendChild(tooltip);
        const rect = target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
      }
      
      function handleMouseLeave() {
        const tooltip = document.querySelector('.key-term-tooltip');
        if (tooltip) tooltip.remove();
      }
      
      keyTerms.forEach(term => {
        term.addEventListener('mouseenter', handleMouseEnter);
        term.addEventListener('mouseleave', handleMouseLeave);
      });
    };
    
    // Initial setup
    setupKeyTermTooltips();
    
    // Cleanup function
    return () => {
      if (!contentRef.current) return;
      const keyTerms = contentRef.current.querySelectorAll('.key-term');
      keyTerms.forEach(term => {
        term.removeEventListener('mouseenter', function() {});
        term.removeEventListener('mouseleave', function() {});
      });
      const tooltip = document.querySelector('.key-term-tooltip');
      if (tooltip) tooltip.remove();
    };
  }, [articles]);

  return (
    <div ref={contentRef}>
      <TooltipProvider>
        <div className="prose prose-green max-w-none">
          {articles.map((article) => {
            return (
              <div key={article.article_number} id={`article-${article.article_number}`} className="mb-12 article-section">
                {/* Article header with improved UX */}
                <ArticleHeader
                  articleNumber={article.article_number}
                  articleTitle={article.article_title}
                  chapterNumber={chapterNumber!}
                  isBookmarked={bookmarkedArticles.has(`${chapterNumber}.${article.article_number}`)}
                  onBookmarkToggle={() => onToggleBookmark?.(article.article_number, article.article_title)}
                  isBookmarkLoading={loadingArticles.has(`${chapterNumber}.${article.article_number}`)}
                />
                
                {/* If there's content directly on the article, display it */}
                {article.content && (
                  <div className="text-[#374151] leading-relaxed mb-4">
                    <div dangerouslySetInnerHTML={{ __html: processContent(article.content) }} />
                  </div>
                )}
                
                {/* If there are clauses, display them */}
                {article.clauses && article.clauses.map((clause) => (
                  <div 
                    key={clause.clause_number} 
                    id={`article-${article.article_number}-clause-${clause.clause_number}`}
                    className="mb-4"
                  >
                    <div className="font-medium mb-2 flex">
                      <span className="mr-2 flex-shrink-0">{clause.clause_number}.</span>
                      <div dangerouslySetInnerHTML={{ __html: processContent(clause.content) }} />
                    </div>
                    
                    {/* If there are sub-clauses, display them */}
                    {clause.sub_clauses && clause.sub_clauses.length > 0 && (
                      <div className="pl-6 space-y-2">
                        {clause.sub_clauses.map((subClause) => {
                          const subClauseId = subClause.sub_clause_id || subClause.sub_clause_letter || subClause.sub_clause_number || '';
                          return (
                            <div 
                              key={subClauseId} 
                              id={`article-${article.article_number}-clause-${clause.clause_number}-${subClauseId}`}
                              className="text-[#4B5563] flex"
                            >
                              <span className="mr-2 flex-shrink-0">({subClauseId})</span>
                              <div dangerouslySetInnerHTML={{ __html: processContent(subClause.content) }} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Add CSS styles for key terms and article formatting */}
      <style dangerouslySetInnerHTML={{ __html: `
        .key-term {
          text-decoration: underline;
          text-decoration-style: dotted;
          text-decoration-color: #1EB53A;
          cursor: help;
          position: relative;
        }
        
        .key-term-tooltip {
          position: fixed;
          background-color: #374151;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          max-width: 300px;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .key-term-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 16px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #374151;
        }
        
        /* Style the first paragraph that contains the article title to be more prominent */
        .article-section p:first-of-type:not(:only-of-type) {
          font-weight: 600;
          color: #0A7B24;
          font-size: 1.1em;
          margin-bottom: 1.5em;
        }
      `}} />
    </div>
  );
}
