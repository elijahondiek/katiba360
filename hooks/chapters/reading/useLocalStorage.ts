import { useState, useCallback } from 'react';

// Define constants
const LOCAL_STORAGE_KEY = 'katiba360_reading_progress';
const PREVIOUS_CHAPTER_KEY = 'katiba360_previous_chapter';

// Debug mode for logging
const DEBUG_MODE = true;

export interface ReadingProgress {
  itemType: 'chapter' | 'article';
  reference: string;
  readTimeMinutes: number;
  lastUpdated: string;
}

export function useReadingLocalStorage() {
  // Get progress for a specific reference
  const getProgress = useCallback((reference: string): ReadingProgress | null => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedProgress) {
        DEBUG_MODE && console.log(`[STORAGE DEBUG] No progress found in localStorage for key ${LOCAL_STORAGE_KEY}`);
        return null;
      }
      
      const parsedProgress = JSON.parse(storedProgress);
      const progress = parsedProgress[reference] || null;
      DEBUG_MODE && console.log(`[STORAGE DEBUG] Retrieved progress for ${reference}: ${progress ? progress.readTimeMinutes + ' minutes' : 'null'}`);
      return progress;
    } catch (error) {
      console.error('[STORAGE DEBUG] Error reading progress from localStorage:', error);
      return null;
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((progress: ReadingProgress) => {
    try {
      if (!progress || !progress.reference) {
        DEBUG_MODE && console.log(`[STORAGE DEBUG] Invalid progress object provided to saveProgress:`, progress);
        return false;
      }
      
      // Ensure readTimeMinutes is a valid number
      const safeReadTimeMinutes = typeof progress.readTimeMinutes === 'number' && !isNaN(progress.readTimeMinutes) ? 
        Math.max(0, progress.readTimeMinutes) : 0;
      
      // Create a safe progress object
      const safeProgress = {
        ...progress,
        readTimeMinutes: safeReadTimeMinutes
      };
      
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      let parsedProgress = storedProgress ? JSON.parse(storedProgress) : {};
      
      // Log previous value if in debug mode
      if (DEBUG_MODE && parsedProgress[progress.reference]) {
        console.log(`[STORAGE DEBUG] Previous value for ${progress.reference}: ${parsedProgress[progress.reference].readTimeMinutes} minutes`);
      }
      
      // Update for this reference
      parsedProgress[progress.reference] = safeProgress;
      
      // Save back to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedProgress));
      
      DEBUG_MODE && console.log(`[STORAGE DEBUG] Saved progress for ${progress.reference}: ${safeReadTimeMinutes} minutes`);
      return true;
    } catch (error) {
      console.error('[STORAGE DEBUG] Error saving reading progress to localStorage:', error);
      return false;
    }
  }, []);

  // Get previous chapter reference
  const getPreviousChapter = useCallback((): string | null => {
    try {
      const previousChapter = localStorage.getItem(PREVIOUS_CHAPTER_KEY);
      DEBUG_MODE && console.log(`[STORAGE DEBUG] Retrieved previous chapter: ${previousChapter || 'null'}`);
      return previousChapter;
    } catch (error) {
      console.error('[STORAGE DEBUG] Error getting previous chapter:', error);
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
