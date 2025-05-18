import useSWR from 'swr';
import { getChapterByNumber } from '@/lib/api';

/**
 * Custom hook to fetch Chapter 4 (Bill of Rights) from the backend using SWR.
 * Returns articles array, loading state, and error.
 */
export function useChapter4() {
  const { data, error, isLoading } = useSWR(
    'chapter-4',
    () => getChapterByNumber(4)
  );

  return {
    articles: data?.body?.chapter?.articles ?? [],
    isLoading,
    error,
  };
}
