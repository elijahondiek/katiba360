// useReadingProgress.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useReadingSession } from './useReadingSession';
import { useReadingSync } from './useReadingSync';
import { useReadingLocalStorage } from './useLocalStorage';

const DEBUG_MODE = process.env.NODE_ENV === 'development';

export function useReadingProgress(
  userId: string | undefined,
  itemType: 'chapter' | 'article',
  reference: string
) {
  const [progressData, setProgressData] = useState<{
    readTimeMinutes: number;
    lastUpdated: string;
  } | null>(null);

  const { saveProgress, getProgress } = useReadingLocalStorage();
  const sessionTracker = useReadingSession();
  const lastSaveTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Handle progress updates from sync - stabilized with useCallback
  const handleProgressUpdate = useCallback((progress: any) => {
    if (!isMountedRef.current) return;
    
    const readTime = progress?.readTimeMinutes || 0;
    DEBUG_MODE && console.log(`[READ TIME DEBUG] Progress updated: ${readTime} minutes`);
    
    setProgressData(prev => {
      // Prevent unnecessary updates if the value hasn't changed
      if (prev?.readTimeMinutes === readTime) {
        return prev;
      }
      
      return {
        readTimeMinutes: readTime,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const { syncProgressWithAPI } = useReadingSync(userId, itemType, reference, handleProgressUpdate);

  // Load progress on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Load from localStorage
    const storedProgress = getProgress(reference);
    if (storedProgress) {
      DEBUG_MODE && console.log(`[READ TIME DEBUG] Loaded progress from localStorage: ${storedProgress.readTimeMinutes} minutes`);
      handleProgressUpdate(storedProgress);
    }
    
    // Set up activity tracking
    const handleUserActivity = () => {
      sessionTracker.updateActivity();
    };
    
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    
    // Start the reading session
    sessionTracker.startReading();
    
    return () => {
      isMountedRef.current = false;
      
      // Clean up event listeners
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      
      // Pause the session when unmounting
      sessionTracker.pauseReading();
    };
  }, [reference, getProgress, sessionTracker.updateActivity, sessionTracker.startReading, sessionTracker.pauseReading, handleProgressUpdate]);

  // Auto-save progress
  useEffect(() => {
    if (!sessionTracker.isReading) return;
    
    const interval = setInterval(() => {
      const readTime = sessionTracker.readTimeMinutes;
      DEBUG_MODE && console.log(`[READ TIME DEBUG] Auto-saving read time: ${readTime} minutes`);
      
      // Save to localStorage
      const now = Date.now();
      const progress = {
        itemType,
        reference,
        readTimeMinutes: readTime,
        lastUpdated: new Date().toISOString()
      };
      
      saveProgress(progress);
      lastSaveTimeRef.current = now;
      
      // Sync with API if user is logged in
      if (userId) {
        syncProgressWithAPI(readTime, false);
      }
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(interval);
  }, [sessionTracker.isReading, itemType, reference, saveProgress, userId, syncProgressWithAPI]);

  // Save progress when it changes
  const saveProgressToStorage = useCallback((readTimeMinutes: number) => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    const progress = {
      itemType,
      reference,
      readTimeMinutes,
      lastUpdated: new Date().toISOString()
    };
    
    DEBUG_MODE && console.log(`[READ TIME DEBUG] Saving progress to storage: ${readTimeMinutes} minutes`);
    
    // Save to localStorage
    saveProgress(progress);
    
    // Sync with API if user is logged in
    if (userId) {
      syncProgressWithAPI(readTimeMinutes, false);
    }
  }, [itemType, reference, saveProgress, userId, syncProgressWithAPI]);

  return {
    progress: progressData,
    readTimeMinutes: sessionTracker.readTimeMinutes,
    isReading: sessionTracker.isReading,
    startReading: sessionTracker.startReading,
    pauseReading: sessionTracker.pauseReading,
    updateActivity: sessionTracker.updateActivity,
    saveProgress: saveProgressToStorage,
    syncProgress: syncProgressWithAPI
  };
}