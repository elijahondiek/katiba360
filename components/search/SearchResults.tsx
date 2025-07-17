"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SearchResult {
  type: string;
  chapter_number: number;
  chapter_title: string;
  article_number: number;
  article_title: string;
  clause_number?: string;
  sub_clause_letter?: string;
  content: string;
  match_context?: string;
}

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  query: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  isOpen,
  onClose,
  results,
  isLoading,
  error,
  query,
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
}: SearchResultsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { navigateToSection } = useScrollToSection();

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the specific section in the constitution
    const url = `/chapters/${result.chapter_number}#article-${result.article_number}`;
    navigateToSection(url);
    onClose();
  };

  // Function to highlight matched terms in text
  const highlightMatch = (text: string): string => {
    if (!text) return '';
    
    // If the text already contains HTML with mark tags, return it as is
    if (text.includes('<mark>')) {
      return text;
    }
    
    // Check if the text contains API-style highlighting with asterisks
    if (text.includes('**')) {
      // Replace API-style highlighting (**word**) with HTML highlighting
      return text.replace(/\*\*(.*?)\*\*/g, '<mark>$1</mark>');
    }
    
    // Otherwise, try to highlight the query terms
    const terms = query.trim().split(/\s+/).filter(term => term.length > 2);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby="search-results-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A7B24]">
            {t('search.results')} {query && `"${query}"`}
          </DialogTitle>
        </DialogHeader>

        <div id="search-results-description" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-[#1EB53A] animate-spin" />
              <span className="ml-2 text-[#4B5563]">{t('search.loading')}</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-[#CE1126]">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-[#CE1126] text-[#CE1126]"
                onClick={onClose}
              >
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : !results || results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#4B5563]">{t('search.noResults')}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-[#1EB53A] text-[#1EB53A]"
                onClick={onClose}
              >
                {t('common.back')}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#6B7280] mb-4">
                {t('search.foundResults').replace('{count}', (totalResults || 0).toString())}
              </p>
              
              <div className="space-y-4">
                {results && results.map((result) => (
                  <div 
                    key={`${result.chapter_number}-${result.article_number}-${result.clause_number || ''}-${result.sub_clause_letter || ''}`}
                    className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1EB53A] cursor-pointer transition-all duration-200"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-1 rounded-full">
                        {t('chapter.label')} {result.chapter_number}
                      </span>
                      <span className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-1 rounded-full">
                        {t('article.label')} {result.article_number}
                      </span>
                      {result.clause_number && (
                        <span className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-1 rounded-full">
                          {t('clause.label')} {result.clause_number}
                        </span>
                      )}
                      {result.sub_clause_letter && (
                        <span className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-1 rounded-full">
                          {t('subclause.label') || 'Sub-clause'} {result.sub_clause_letter}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-[#0A7B24] mb-1">
                      {result.chapter_title} - {result.article_title}
                    </h3>
                    
                    {result.match_context && (
                      <div 
                        className="text-sm text-[#374151] mt-2"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMatch(result.match_context || result.content) 
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                    aria-label={t('pagination.previous')}
                  >
                    &laquo;
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageToShow}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageToShow)}
                        className={`h-8 w-8 p-0 ${currentPage === pageToShow ? 'bg-[#1EB53A] hover:bg-[#0A7B24]' : ''}`}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                    aria-label={t('pagination.next')}
                  >
                    &raquo;
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
