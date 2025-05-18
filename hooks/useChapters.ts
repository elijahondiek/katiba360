import useSWR from 'swr';
import { getChapters } from '@/lib/api';

/**
 * Custom hook to fetch chapters from the backend using SWR.
 * Returns chapters array, pagination, loading, error, and mutate function.
 */
export function useChapters(limit = 18, offset = 0) {
  const { data, error, isLoading, mutate } = useSWR(
    ['chapters', limit, offset],
    () => getChapters(limit, offset)
  );
  return {
    chapters: data?.body?.chapters ?? [],
    pagination: data?.body?.pagination,
    error,
    isLoading,
    mutate,
  };
}
