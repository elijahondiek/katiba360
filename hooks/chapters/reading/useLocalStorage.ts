import { useState, useCallback } from 'react';

// Define constants
export const LOCAL_STORAGE_KEY = 'katiba360_reading_progress';
export const PREVIOUS_CHAPTER_KEY = 'katiba360_previous_chapter';

export interface ReadingProgress {
  itemType: string;
  reference: string;
  readTimeMinutes: number;
  lastUpdated: string;
}

export function useReadingLocalStorage() {
  // Get progress for a specific reference
  const getProgress = useCallback((reference: string): ReadingProgress | null => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedProgress) return null;
      
      const parsedProgress = JSON.parse(storedProgress);
      return parsedProgress[reference] || null;
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
      return null;
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((progress: ReadingProgress) => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      let parsedProgress = storedProgress ? JSON.parse(storedProgress) : {};
      
      // Update for this reference
      parsedProgress[progress.reference] = progress;
      
      // Save back to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedProgress));
      return true;
    } catch (error) {
      console.error('Error saving reading progress to localStorage:', error);
      return false;
    }
  }, []);

  // Get previous chapter reference
  const getPreviousChapter = useCallback((): string | null => {
    try {
      return localStorage.getItem(PREVIOUS_CHAPTER_KEY);
    } catch (error) {
      console.error('Error getting previous chapter:', error);
      return null;
    }
  }, []);

  // Set previous chapter reference
  const setPreviousChapter = useCallback((reference: string) => {
    try {
      localStorage.setItem(PREVIOUS_CHAPTER_KEY, reference);
      return true;
    } catch (error) {
      console.error('Error setting previous chapter:', error);
      return false;
    }
  }, []);

  return {
    getProgress,
    saveProgress,
    getPreviousChapter,
    setPreviousChapter
  };
}
