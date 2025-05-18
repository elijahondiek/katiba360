import { useState, useEffect, useCallback } from 'react';
import { searchConstitution } from '@/lib/api';

interface SearchResult {
  id: string;
  chapter: {
    number: number;
    title: string;
  };
  article: {
    number: number;
    title: string;
  };
  clause?: {
    number: string;
    content: string;
  };
  match_context?: string;
  highlight?: string;
}

interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

interface UseSearchOptions {
  debounceMs?: number;
  resultsPerPage?: number;
  highlight?: boolean;
}

const DEFAULT_OPTIONS: UseSearchOptions = {
  debounceMs: 1200, // Increased from 800ms to 1200ms to give users more time to type
  resultsPerPage: 10,
  highlight: true,
};

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs, resultsPerPage, highlight } = { ...DEFAULT_OPTIONS, ...options };
  
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
  });

  // Handle debouncing of search query
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trim the query to remove leading and trailing spaces
      const trimmedQuery = query.trim();
      
      if (trimmedQuery) {
        // Set the trimmed query as the debounced query
        setDebouncedQuery(trimmedQuery);
      } else {
        // Clear results if query is empty
        setSearchState(prev => ({
          ...prev,
          results: [],
          totalResults: 0,
          totalPages: 0,
        }));
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch search results when debouncedQuery changes
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        // Reset search state when query is empty
        setSearchState(prev => ({
          ...prev,
          results: [],
          isLoading: false,
          error: null,
          totalResults: 0,
          totalPages: 0
        }));
        return;
      }

      setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const offset = (searchState.currentPage - 1) * (resultsPerPage || 10);
        
        // Ensure the query is trimmed before sending to API
        const trimmedQuery = debouncedQuery.trim();
        
        const response = await searchConstitution({
          query: trimmedQuery,
          limit: resultsPerPage,
          offset,
          highlight: highlight,
        });

        // Handle the nested response structure
        const results = response.body?.results || [];
        const pagination = response.body?.pagination || {};
        const total = pagination.total || 0;
        
        setSearchState(prev => ({
          ...prev,
          results: results,
          isLoading: false,
          totalResults: total,
          totalPages: Math.ceil(total / (resultsPerPage || 10)),
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred while searching',
          totalResults: 0,
          totalPages: 0
        }));
      }
    }

    fetchResults();
  }, [debouncedQuery, searchState.currentPage, resultsPerPage, highlight]);

  // Change page
  const changePage = useCallback((page: number) => {
    setSearchState(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSearchState({
      results: [],
      isLoading: false,
      error: null,
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
    });
  }, []);

  return {
    query,
    setQuery,
    ...searchState,
    changePage,
    resetSearch,
  };
}
