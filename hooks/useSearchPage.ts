import { useState, useEffect, useCallback } from 'react';
import { searchConstitution, getChapters } from '@/lib/api';

// Define result types based on the API response
export interface SearchResult {
  id: string;
  type: 'chapter' | 'article' | 'clause' | 'right' | 'scenario' | 'sub_clause';
  title: string;
  chapter?: {
    number: string;
    title: string;
  };
  article?: {
    number: string;
    title: string;
  };
  content: string;
  highlight?: string;
  url: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterCategory {
  name: string;
  options: FilterOption[];
}

interface SearchPageState {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  chaptersData: any[];
  chaptersLoading: boolean;
}

interface UseSearchPageOptions {
  debounceMs?: number;
  resultsPerPage?: number;
  highlight?: boolean;
  noCache?: boolean;
}

const DEFAULT_OPTIONS: UseSearchPageOptions = {
  debounceMs: 1200,
  resultsPerPage: 10,
  highlight: true,
  noCache: false,
};

export function useSearchPage(options: UseSearchPageOptions = {}) {
  const { debounceMs, resultsPerPage, highlight, noCache } = { ...DEFAULT_OPTIONS, ...options };
  
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchState, setSearchState] = useState<SearchPageState>({
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    chaptersData: [],
    chaptersLoading: true,
  });

  // Load chapters data on initial load
  useEffect(() => {
    async function loadChapters() {
      try {
        const response = await getChapters(20, 0);
        if (response?.body?.chapters) {
          setSearchState(prev => ({
            ...prev,
            chaptersData: response.body.chapters,
            chaptersLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error loading chapters:', error);
        setSearchState(prev => ({
          ...prev,
          chaptersLoading: false,
        }));
      }
    }

    loadChapters();
  }, []);

  // Handle debouncing of search query
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();
      
      if (trimmedQuery) {
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

  // Fetch search results when debouncedQuery changes or filters change
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
        const trimmedQuery = debouncedQuery.trim();
        
        // Determine if we need to filter by chapter based on active filters
        const chapterFilters = activeFilters.filter(f => f.startsWith('chapter-'));
        let chapterFilter = undefined;
        
        if (chapterFilters.length > 0) {
          // Extract chapter number from filter ID (e.g., 'chapter-1' -> 1)
          chapterFilter = parseInt(chapterFilters[0].split('-')[1], 10);
        }
        
        // Determine if we need to filter by article based on active filters
        const articleFilters = activeFilters.filter(f => f.startsWith('article-'));
        let articleFilter = undefined;
        
        if (articleFilters.length > 0) {
          // Extract article number from filter ID (e.g., 'article-1' -> 1)
          articleFilter = parseInt(articleFilters[0].split('-')[1], 10);
        }
        
        const response = await searchConstitution({
          query: trimmedQuery,
          chapter: chapterFilter,
          article: articleFilter,
          limit: resultsPerPage,
          offset,
          highlight: highlight,
          no_cache: noCache,
        });

        // Process the results to match our expected format
        const apiResults = response.body?.results || [];
        const pagination = response.body?.pagination || {};
        const total = pagination.total || 0;
        
        // Transform API results to our SearchResult format
        const transformedResults = apiResults.map((item: any): SearchResult => {
          // Get the type directly from the API response
          const type = item.type as 'chapter' | 'article' | 'clause' | 'right' | 'scenario' | 'sub_clause';
          
          // Determine the URL based on the type
          let url = '/';
          if (type === 'chapter') {
            url = `/chapters/${item.chapter_number}`;
          } else if (['article', 'clause', 'sub_clause'].includes(type)) {
            url = `/chapters/${item.chapter_number}#article-${item.article_number}`;
            if (item.clause_number) {
              url += `-clause-${item.clause_number}`;
              if (item.sub_clause_letter) {
                url += `-${item.sub_clause_letter}`;
              }
            }
          }
          
          // Create a unique ID for the result
          const id = `result-${item.chapter_number}-${item.article_number || ''}-${item.clause_number || ''}-${item.sub_clause_letter || ''}`;
          
          // Create the result object
          return {
            id,
            type,
            title: item.article_title || item.chapter_title || '',
            chapter: {
              number: String(item.chapter_number),
              title: item.chapter_title
            },
            article: item.article_number ? {
              number: String(item.article_number),
              title: item.article_title
            } : undefined,
            content: item.content || '',
            highlight: item.match_context || '',
            url
          };
        });
        
        // Filter results based on active filters
        let filteredResults = transformedResults;
        
        if (activeFilters.length > 0) {
          // Filter by content type
          const typeFilters = activeFilters.filter(f => ['chapters', 'rights', 'scenarios'].includes(f));
          if (typeFilters.length > 0) {
            filteredResults = filteredResults.filter((result: SearchResult) => {
              if (typeFilters.includes('chapters') && result.type === 'chapter') return true;
              if (typeFilters.includes('rights') && (result.type === 'article' || result.type === 'clause' || result.type === 'sub_clause')) return true;
              if (typeFilters.includes('scenarios') && result.type === 'scenario') return true;
              return false;
            });
          }
          
          // Filter by category from chapterCategoryMap
          const categoryFilters = activeFilters.filter(f => 
            ['governance', 'rights', 'land', 'justice', 'finance', 'security'].includes(f)
          );
          
          if (categoryFilters.length > 0) {
            filteredResults = filteredResults.filter((result: SearchResult) => {
              // If we have chapter information, use the chapter category map
              if (result.chapter?.number) {
                const chapterNum = parseInt(result.chapter.number, 10);
                // Import chapterCategoryMap dynamically to avoid circular dependencies
                // This is a simplified check - in a real implementation you'd import the map properly
                const chapterCategory = {
                  1: "Governance", 2: "Governance", 3: "Governance",
                  4: "Rights", 5: "Land", 6: "Governance",
                  7: "Governance", 8: "Governance", 9: "Governance",
                  10: "Justice", 11: "Governance", 12: "Finance",
                  13: "Governance", 14: "Security", 15: "Governance",
                  16: "Governance", 17: "Governance", 18: "Governance"
                }[chapterNum];
                
                if (chapterCategory) {
                  return categoryFilters.some(filter => 
                    filter.toLowerCase() === chapterCategory.toLowerCase()
                  );
                }
              }
              
              // Fallback to content-based filtering if no chapter info or chapter not in map
              const content = (result.content || '').toLowerCase();
              const title = (result.title || '').toLowerCase();
              
              return categoryFilters.some(topic => {
                if (topic === 'governance' && (content.includes('govern') || title.includes('govern'))) return true;
                if (topic === 'rights' && (content.includes('right') || title.includes('right'))) return true;
                if (topic === 'land' && (content.includes('land') || title.includes('land'))) return true;
                if (topic === 'justice' && (content.includes('justice') || content.includes('judic') || title.includes('judic'))) return true;
                if (topic === 'finance' && (content.includes('finance') || content.includes('budget') || title.includes('finance'))) return true;
                if (topic === 'security' && (content.includes('security') || content.includes('defence') || title.includes('security'))) return true;
                return false;
              });
            });
          }
        }
        
        setSearchState(prev => ({
          ...prev,
          results: filteredResults,
          isLoading: false,
          totalResults: total, // Use the total from the API response
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

    if (debouncedQuery) {
      fetchResults();
    }
  }, [debouncedQuery, searchState.currentPage, resultsPerPage, highlight, activeFilters]);

  // Toggle filter selection
  const toggleFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId) 
        : [...prev, filterId]
    );
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setSearchState(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  // Reset search and filters
  const resetSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setActiveFilters([]);
    setSearchState(prev => ({
      ...prev,
      results: [],
      isLoading: false,
      error: null,
      totalResults: 0,
      currentPage: 1,
      totalPages: 0,
    }));
  }, []);

  // Search in chapters data (client-side search)
  const searchInChapters = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || searchState.chaptersLoading) {
      return [];
    }
    
    const query = searchQuery.toLowerCase().trim();
    return searchState.chaptersData.filter((chapter: any) => {
      return (
        chapter.chapter_title?.toLowerCase().includes(query) ||
        chapter.chapter_summary?.toLowerCase().includes(query)
      );
    }).map((chapter: any): SearchResult => ({
      id: `chapter-${chapter.chapter_number}`,
      type: 'chapter',
      title: chapter.chapter_title,
      chapter: {
        number: String(chapter.chapter_number),
        title: chapter.chapter_title
      },
      content: chapter.chapter_summary || '',
      url: `/chapters/${chapter.chapter_number}`
    }));
  }, [searchState.chaptersData, searchState.chaptersLoading]);

  return {
    query,
    setQuery,
    activeFilters,
    toggleFilter,
    searchInChapters,
    ...searchState,
    changePage,
    resetSearch,
  };
}
