"use client"

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from './SearchResults';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder }: SearchBarProps) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    totalResults,
    currentPage,
    totalPages,
    changePage,
    resetSearch
  } = useSearch({
    debounceMs: 2000,
    resultsPerPage: 10,
    highlight: true,
  });

  // Close modal and reset search when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Only open modal when query is being processed (after debounce)
  // or when there are results
  useEffect(() => {
    if (isLoading) {
      setIsModalOpen(true);
    } else if (results && results.length > 0) {
      setIsModalOpen(true);
    }
  }, [results, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Don't open modal immediately on typing
    // Let the debounce and loading state handle it
    if (!value.trim()) {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`relative ${className || ''}`}>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder || t('search.placeholder')}
          className="pl-12 py-6 rounded-full border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
          aria-label={t('search.ariaLabel')}
        />
        <SearchIcon 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" 
          aria-hidden="true"
        />
      </div>

      <SearchResults
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        results={results || []}
        isLoading={isLoading || false}
        error={error || null}
        query={query || ''}
        totalResults={totalResults || 0}
        currentPage={currentPage || 1}
        totalPages={totalPages || 0}
        onPageChange={changePage}
      />
    </>
  );
}
