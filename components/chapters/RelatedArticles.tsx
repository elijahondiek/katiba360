"use client";

import Link from "next/link";

interface RelatedArticle {
  chapter_number: number;
  chapter_title?: string;
  article_number: number;
  article_title?: string;
  relevance: string;
}

interface RelatedArticlesProps {
  relatedArticles: RelatedArticle[];
  relatedArticlesLoading: boolean;
  formatRelevance: (relevance: string) => string;
}

export function RelatedArticles({ 
  relatedArticles, 
  relatedArticlesLoading, 
  formatRelevance 
}: RelatedArticlesProps) {
  return (
    <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
      <h3 className="text-xl font-bold mb-4">Related Articles</h3>
      
      {relatedArticlesLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : relatedArticles.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {relatedArticles.map((article, index) => (
            <Link 
              href={`/chapters/${article.chapter_number}#article-${article.article_number}`} 
              key={`${article.chapter_number}-${article.article_number}-${index}`}
              className="group"
            >
              <div className="border border-[#E5E7EB] group-hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 group-hover:shadow-md">
                <h4 className="font-bold text-[#0A7B24] capitalize">
                  Chapter {article.chapter_number}: {article.chapter_title ?? ""}
                </h4>
                <p className="font-medium text-[#374151] mt-1 capitalize">
                  Article {article.article_number}: {article.article_title ?? ""}
                </p>
                <div className="mt-2 inline-block px-2 py-1 bg-[#E5F7E8] text-[#0A7B24] text-xs rounded-full">
                  {formatRelevance(article.relevance)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No related articles found</p>
        </div>
      )}
    </div>
  );
}
