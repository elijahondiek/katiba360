// useReadingSession.ts
import { useState, useRef, useCallback, useEffect } from 'react';

// Constants
const INACTIVITY_THRESHOLD_MS = 60000; // 1 minute
const DEBUG_MODE = true;

interface ReadingSession {
  startTime: number;
  totalTimeMs: number;
  isActive: boolean;
  lastActiveTime: number;
}

export function useReadingSession() {
  const [session, setSession] = useState<ReadingSession>({
    startTime: Date.now(),
    totalTimeMs: 0,
    isActive: false,
    lastActiveTime: Date.now(),
  });

  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const readTimeRef = useRef<number>(0);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const isMountedRef = useRef<boolean>(true);

  // Calculate total read time in minutes
  const calculateReadTimeMinutes = useCallback((): number => {
    const currentSessionMs = session.isActive 
      ? Date.now() - session.startTime 
      : 0;
    
    const totalMs = session.totalTimeMs + currentSessionMs;
    const minutes = Math.round(totalMs / 60000 * 100) / 100;
    
    DEBUG_MODE && console.log(`[READ TIME DEBUG] Session - Current: ${currentSessionMs}ms, Total: ${totalMs}ms, Minutes: ${minutes}`);
    
    readTimeRef.current = minutes;
    return minutes;
  }, [session]);

  // Handle pausing the reading session
  const pauseReading = useCallback(() => {
    if (!session.isActive) return;
    
    const now = Date.now();
    const sessionTime = now - session.startTime;
    
    setSession(prev => {
      const updatedTotalMs = prev.totalTimeMs + sessionTime;
      DEBUG_MODE && console.log(`[READ TIME DEBUG] Pausing session. Added ${sessionTime}ms, total: ${updatedTotalMs}ms`);
      
      return {
        ...prev,
        isActive: false,
        totalTimeMs: updatedTotalMs,
        lastActiveTime: now
      };
    });
  }, [session.isActive, session.startTime]);

  // Start or resume the reading session
  const startReading = useCallback(() => {
    if (!isMountedRef.current) return;
    
    if (session.isActive) {
      lastActiveTimeRef.current = Date.now();
      return;
    }
    
    DEBUG_MODE && console.log('[READ TIME DEBUG] Starting/resuming reading session');
    
    setSession(prev => {
      const now = Date.now();
      return {
        ...prev,
        isActive: true,
        startTime: now,
        lastActiveTime: now
      };
    });
    
    // Clear any existing interval
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
    }
    
    // Set up activity check
    activityCheckIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (activityCheckIntervalRef.current) {
          clearInterval(activityCheckIntervalRef.current);
        }
        return;
      }
      
      const now = Date.now();
      if (now - lastActiveTimeRef.current > INACTIVITY_THRESHOLD_MS) {
        DEBUG_MODE && console.log('[READ TIME DEBUG] Inactivity detected, pausing session');
        pauseReading();
      }
    }, 10000); // Check every 10 seconds
  }, [session.isActive, pauseReading]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    lastActiveTimeRef.current = now;
    
    // If session is paused, resume it
    if (!session.isActive) {
      DEBUG_MODE && console.log('[READ TIME DEBUG] Resuming session on activity');
      startReading();
      return;
    }
    
    // Update last active time in state occasionally
    if (now - session.lastActiveTime > 5000) {
      setSession(prev => ({
        ...prev,
        lastActiveTime: now
      }));
    }
  }, [session.isActive, session.lastActiveTime, startReading]);

  // Reset the session
  const resetSession = useCallback(() => {
    if (!isMountedRef.current) return;
    
    DEBUG_MODE && console.log('[READ TIME DEBUG] Resetting session');
    
    setSession({
      startTime: Date.now(),
      totalTimeMs: 0,
      isActive: false,
      lastActiveTime: Date.now(),
    });
    
    readTimeRef.current = 0;
  }, []);

  // Set up cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Save final time before unmounting
      if (session.isActive) {
        const now = Date.now();
        const sessionTime = now - session.startTime;
        readTimeRef.current = Math.round((session.totalTimeMs + sessionTime) / 60000 * 100) / 100;
      }
      
      // Clear interval
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [session.isActive, session.startTime, session.totalTimeMs]);

  // Calculate read time on each render
  const currentReadTime = calculateReadTimeMinutes();

  return {
    session,
    isReading: session.isActive,
    readTimeMinutes: currentReadTime,
    startReading,
    pauseReading,
    updateActivity,
    resetSession
  };
}