import { useState, useEffect, useCallback, useRef } from 'react';
import { useReadingLocalStorage, ReadingProgress } from './useLocalStorage';
import { useReadingSession } from './useReadingSession';
import { useReadingSync } from './useReadingSync';
import { useToast } from '@/hooks/use-toast';

// Debug mode for logging
const DEBUG_MODE = false;

/**
 * Main hook for tracking reading progress
 * - Only syncs with API when chapter changes or page unloads
 * - Tracks reading time locally
 * - Handles user activity/inactivity
 */
export function useReadingProgress(
  userId: string | undefined, 
  itemType: 'chapter' | 'article', 
  reference: string
) {
  const [progressData, setProgressData] = useState<ReadingProgress | null>(null);
  const toast = useToast();
  
  // Initialize sub-hooks
  const storage = useReadingLocalStorage();
  const sessionTracker = useReadingSession();
  
  // Use ref to track if we've already processed this progress update
  const lastProgressRef = useRef<string>('');
  
  // Handle progress updates from API or local changes
  const handleProgressUpdate = useCallback((progress: ReadingProgress) => {
    // Create a unique key for this progress update
    const progressKey = `${progress.reference}-${progress.readTimeMinutes}-${progress.lastUpdated}`;
    
    // Only update if this is a new progress update
    if (lastProgressRef.current !== progressKey) {
      lastProgressRef.current = progressKey;
      setProgressData(progress);
      storage.saveProgress(progress);
    }
  }, [storage]);
  
  // Initialize sync hook with memoized callback
  const sync = useReadingSync(userId, itemType, reference, handleProgressUpdate);
  
  // Save current reading progress to localStorage
  const saveProgress = useCallback((readTimeMinutes: number) => {
    const now = new Date().toISOString();
    const progress: ReadingProgress = {
      itemType,
      reference,
      readTimeMinutes,
      lastUpdated: now,
    };
    
    handleProgressUpdate(progress);
    return progress;
  }, [itemType, reference, handleProgressUpdate]);
  
  // Manual sync function for UI buttons
  const manualSync = useCallback(() => {
    const currentReadTime = sessionTracker.readTimeMinutes;
    
    // Save to localStorage first
    const progress = saveProgress(currentReadTime);
    
    // Then sync with API (force = true)
    sync.syncProgressWithAPI(progress.readTimeMinutes, true)
      .then(success => {
        if (success) {
          toast.toast({
            title: "Reading progress synced",
            description: `${Math.round(progress.readTimeMinutes)} minutes saved`,
          });
          sessionTracker.resetSession();
        }
      });
  }, [sessionTracker, saveProgress, sync, toast]);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Track if initial setup is done to prevent double loading
  const initialSetupDoneRef = useRef(false);
  
  // Load initial progress and handle chapter changes
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Prevent running this effect more than once for the same reference
    if (!userId || !reference || initialSetupDoneRef.current) return;
    
    // Mark setup as done
    initialSetupDoneRef.current = true;
    
    const loadInitialProgress = async () => {
      try {
        // Load progress from localStorage
        const localProgress = storage.getProgress(reference);
        if (localProgress && isMountedRef.current) {
          setProgressData(localProgress);
        }
        
        // Handle previous chapter sync
        const previousChapter = storage.getPreviousChapter();
        if (previousChapter && previousChapter !== reference) {
          // Previous chapter exists and is different from current one
          const prevProgress = storage.getProgress(previousChapter);
          
          if (prevProgress && prevProgress.readTimeMinutes > 0) {
            // Sync previous chapter progress to API
            try {
              await sync.syncProgressWithAPI(prevProgress.readTimeMinutes, true);
            } catch (error) {
              console.error('Error syncing previous chapter progress:', error);
            }
          }
          
          // Update stored previous chapter to current one
          storage.setPreviousChapter(reference);
        } else if (!previousChapter) {
          // First time visiting any chapter
          storage.setPreviousChapter(reference);
        }
        
        // Fetch latest progress from API if component still mounted
        if (isMountedRef.current) {
          await sync.fetchProgressFromAPI();
        }
      } catch (error) {
        console.error('Error loading initial progress:', error);
      }
    };
    
    // Execute async function
    loadInitialProgress();
    
    // Clean up
    return () => {
      isMountedRef.current = false;
      initialSetupDoneRef.current = false;
    };
  }, [userId, reference]); // Only depend on userId and reference
  
  // Use ref to track last save time to avoid excessive saves
  const lastSaveTimeRef = useRef<number>(0);
  
  // Auto-save progress to localStorage every minute
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const now = Date.now();
      // Only save if user is reading and there's progress to save
      // and it's been at least 30 seconds since last save
      if (sessionTracker.isReading && 
          sessionTracker.readTimeMinutes > 0 &&
          now - lastSaveTimeRef.current > 30000) {
        
        lastSaveTimeRef.current = now;
        saveProgress(sessionTracker.readTimeMinutes);
        DEBUG_MODE && console.log('Auto-saved reading progress:', sessionTracker.readTimeMinutes);
      }
    }, 60000); // Every minute
    
    return () => clearInterval(autoSaveInterval);
  }, [sessionTracker.isReading, sessionTracker.readTimeMinutes, saveProgress]);
  
  return {
    // Progress data
    progressData,
    isLoading: sync.isLoading,
    isSyncing: sync.isSyncing,
    
    // Session controls
    isReading: sessionTracker.isReading,
    readTimeMinutes: sessionTracker.readTimeMinutes,
    startReading: sessionTracker.startReading,
    pauseReading: sessionTracker.pauseReading,
    updateActivity: sessionTracker.updateActivity,
    
    // Sync controls
    saveProgress,
    syncProgress: sync.syncProgressWithAPI,
    manualSync,
  };
}
