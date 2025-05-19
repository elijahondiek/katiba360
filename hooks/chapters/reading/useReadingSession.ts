import { useState, useRef, useCallback, useEffect } from 'react';

// Define constants
const INACTIVITY_THRESHOLD_MS = 60000; // 1 minute
const DEBUG_MODE = false; // Set to false to disable console logs

export interface ReadingSession {
  startTime: number;
  totalTimeMs: number;
  isActive: boolean;
  lastActiveTime: number;
}

export function useReadingSession() {
  // State for tracking reading session
  const [session, setSession] = useState<ReadingSession>({
    startTime: Date.now(),
    totalTimeMs: 0,
    isActive: false,
    lastActiveTime: Date.now(),
  });
  
  // Refs declared at the top level to avoid closure issues
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const readTimeRef = useRef<number>(0);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const isMountedRef = useRef<boolean>(true); // Track component mount state
  
  // Calculate total read time in minutes
  const calculateReadTimeMinutes = useCallback((): number => {
    const currentSessionMs = session.isActive 
      ? Date.now() - session.startTime 
      : 0;
    
    const totalMs = session.totalTimeMs + currentSessionMs;
    const minutes = Math.round(totalMs / 60000 * 100) / 100; // Convert to minutes with 2 decimal precision
    readTimeRef.current = minutes;
    return minutes;
  }, [session]);
  
  // Start tracking reading time
  const startReading = useCallback(() => {
    if (!isMountedRef.current) return; // Safety check
    
    // Set active state
    setSession(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now(),
      lastActiveTime: Date.now(),
    }));
    
    // Set up activity check interval
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
    }
    
    activityCheckIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        // Component unmounted, clean up
        if (activityCheckIntervalRef.current) {
          clearInterval(activityCheckIntervalRef.current);
        }
        return;
      }
      
      // Check for inactivity using the ref value
      const now = Date.now();
      const lastActive = lastActiveTimeRef.current;
      const isSessionActive = session.isActive;
      
      if (now - lastActive > INACTIVITY_THRESHOLD_MS && isSessionActive) {
        // User has been inactive, pause the reading timer but use a local variable
        // to avoid the dependency on session state
        const currentSessionTime = now - session.startTime;
        
        // Use functional update to avoid stale state
        if (isMountedRef.current) {
          setSession(prev => ({
            ...prev,
            isActive: false,
            totalTimeMs: prev.totalTimeMs + currentSessionTime,
          }));
          
          DEBUG_MODE && console.log('Auto-paused reading due to inactivity');
        }
      }
    }, 10000); // Check every 10 seconds
  }, []);  // No dependencies to avoid cascading updates
  
  // Flag to prevent concurrent calls to pauseReading
  const isPausingRef = useRef(false);
  
  // Pause tracking reading time
  const pauseReading = useCallback(() => {
    console.log('[ReadingSession] pauseReading called. isMounted:', isMountedRef.current, 'isPausing:', isPausingRef.current);
    // Skip if component is unmounted or already pausing
    if (!isMountedRef.current) {
      console.warn('[ReadingSession] pauseReading called but not mounted.');
      return;
    }
    if (isPausingRef.current) {
      console.warn('[ReadingSession] pauseReading reentrancy guard hit.');
      return;
    }
    
    // Set flag to prevent concurrent calls
    isPausingRef.current = true;
    
    // Use a timeout to ensure we're outside any existing React render cycle
    setTimeout(() => {
      if (isMountedRef.current) {
        // Calculate time spent in current session using functional state update
        setSession(prev => {
          console.log('[ReadingSession] setSession in pauseReading. prev:', prev);
          if (!prev.isActive) {
            isPausingRef.current = false;
            console.log('[ReadingSession] Already paused, skipping.');
            return prev; // No changes if already paused
          }
          const now = Date.now();
          const sessionTime = now - prev.startTime;
          const updated = {
            ...prev,
            isActive: false,
            totalTimeMs: prev.totalTimeMs + sessionTime,
          };
          // Deep equality check to prevent redundant updates
          const isSame = prev.isActive === updated.isActive &&
                        prev.totalTimeMs === updated.totalTimeMs &&
                        prev.startTime === updated.startTime &&
                        prev.lastActiveTime === updated.lastActiveTime;
          if (isSame) {
            isPausingRef.current = false;
            console.log('[ReadingSession] No session change in pauseReading, skipping update.');
            return prev;
          }
          setTimeout(() => {
            isPausingRef.current = false;
            console.log('[ReadingSession] pauseReading finished and flag reset.');
          }, 0);
          console.log('[ReadingSession] Updated session in pauseReading:', updated);
          return updated;
        });
        
        // Clear interval
        if (activityCheckIntervalRef.current) {
          clearInterval(activityCheckIntervalRef.current);
          activityCheckIntervalRef.current = null;
          console.log('[ReadingSession] Cleared activity interval in pauseReading.');
        }
      } else {
        // Reset flag if unmounted
        isPausingRef.current = false;
        console.warn('[ReadingSession] pauseReading finished but not mounted.');
      }
    }, 0);
  }, []);  // No dependencies to avoid cascading updates
  
  // lastActiveTimeRef is now declared at the top
  
  // Update activity timestamp (call this on user interactions)
  const updateActivity = useCallback(() => {
    if (session.isActive) {
      // Update ref directly to avoid re-renders
      lastActiveTimeRef.current = Date.now();
      
      // Only update state occasionally to avoid excessive re-renders
      const timeSinceLastUpdate = Date.now() - session.lastActiveTime;
      if (timeSinceLastUpdate > 5000) { // Only update state every 5 seconds
        setSession(prev => ({
          ...prev,
          lastActiveTime: lastActiveTimeRef.current,
        }));
      }
    }
  }, [session.isActive, session.lastActiveTime]);
  
  // Reset session timer
  const resetSession = useCallback(() => {
    setSession({
      startTime: Date.now(),
      totalTimeMs: 0,
      isActive: false,
      lastActiveTime: Date.now(),
    });
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;
    
    return () => {
      // Mark as unmounted first to prevent state updates during cleanup
      isMountedRef.current = false;
      
      // Save current reading time without triggering state updates
      if (session.isActive) {
        // Just record the final time in readTimeRef without state updates
        const now = Date.now();
        const sessionTime = now - session.startTime;
        readTimeRef.current = Math.round((session.totalTimeMs + sessionTime) / 60000 * 100) / 100;
      }
      
      // Clean up interval
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
        activityCheckIntervalRef.current = null;
      }
    };
  }, [session.isActive, session.totalTimeMs, session.startTime]);
  
  // Calculate read time on each render but avoid re-renders from it
  // by using the memoized function
  calculateReadTimeMinutes();
  
  return {
    session,
    isReading: session.isActive,
    readTimeMinutes: readTimeRef.current,
    startReading,
    pauseReading,
    updateActivity,
    resetSession
  };
}
