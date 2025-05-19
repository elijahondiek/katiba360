import { useState, useRef, useCallback, useEffect } from 'react';
import { updateReadingProgress, getUserReadingProgress } from '@/lib/api';
import { ReadingProgress } from './useLocalStorage';

// Define constants
const API_DEBOUNCE_MS = 60000; // 60 seconds - increased to avoid rate limiting
const SYNC_INTERVAL_MS = 600000; // 10 minutes - increased to avoid rate limiting
const MAX_RETRY_COUNT = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 5000; // 5 seconds between retries
const DEBUG_MODE = false; // Set to false to disable console logs

export function useReadingSync(
  userId: string | undefined,
  itemType: 'chapter' | 'article',
  reference: string,
  onProgressUpdate: (progress: ReadingProgress) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastApiCallTimeRef = useRef<number>(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track retry attempts
  const retryCountRef = useRef<number>(0);
  const lastFetchTimeRef = useRef<number>(0);
  
  // Fetch progress from API with retry logic
  const fetchProgressFromAPI = useCallback(async () => {
    if (!userId) return;
    
    // Check if we've fetched recently to avoid rate limiting
    const now = Date.now();
    if (now - lastFetchTimeRef.current < API_DEBOUNCE_MS) {
      DEBUG_MODE && console.log('Skipping API fetch - too soon since last fetch');
      return;
    }
    
    // Update last fetch time
    lastFetchTimeRef.current = now;
    
    // Only set loading if not already loading
    if (!isLoading) {
      setIsLoading(true);
    }
    
    try {
      const response = await getUserReadingProgress(userId);
      // Reset retry counter on success
      retryCountRef.current = 0;
      
      if (response?.body?.progress) {
        const apiProgress = response.body.progress;
        
        // Find the progress for this specific reference
        const matchingProgress = Array.isArray(apiProgress) 
          ? apiProgress.find(p => p.reference === reference)
          : null;
        
        if (matchingProgress) {
          const updatedProgress: ReadingProgress = {
            itemType,
            reference,
            readTimeMinutes: matchingProgress.total_read_time_minutes || 0,
            lastUpdated: matchingProgress.last_read.timestamp,
          };
          
          onProgressUpdate(updatedProgress);
        }
      }
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      
      // Implement retry logic for network errors
      if (retryCountRef.current < MAX_RETRY_COUNT) {
        retryCountRef.current++;
        DEBUG_MODE && console.log(`Retry attempt ${retryCountRef.current} in ${RETRY_DELAY_MS}ms`);
        
        // Wait and retry
        setTimeout(() => {
          fetchProgressFromAPI();
        }, RETRY_DELAY_MS * retryCountRef.current); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, itemType, reference, onProgressUpdate, isLoading]);

  // Sync progress with API
  const syncProgressWithAPI = useCallback(async (readTimeMinutes: number, force: boolean = false) => {
    if (!userId || !reference) {
      DEBUG_MODE && console.log('No user ID or reference, skipping API call');
      return false;
    }
    
    // Only sync if there's actual reading time
    if (readTimeMinutes <= 0) {
      DEBUG_MODE && console.log('No reading time, skipping API call');
      return false;
    }
    
    // Check if we've made an API call recently (unless forced)
    const now = Date.now();
    const timeSinceLastApiCall = now - lastApiCallTimeRef.current;
    
    if (timeSinceLastApiCall < API_DEBOUNCE_MS && !force) {
      DEBUG_MODE && console.log(`API call debounced. Last call was ${Math.round(timeSinceLastApiCall / 1000)}s ago`);
      return false;
    }
    
    // Update the last API call time
    lastApiCallTimeRef.current = now;
    DEBUG_MODE && console.log(`Making API call to update reading progress: ${readTimeMinutes} minutes`);
    
    // Avoid setting state if we're already syncing
    if (!isSyncing) {
      setIsSyncing(true);
    }
    
    try {
      const response = await updateReadingProgress({
        userId,
        itemType,
        reference,
        readTimeMinutes,
      });
      
      if (response?.body?.progress) {
        // Update our local state with the response
        const apiProgress = response.body.progress;
        
        // Update our local state
        const updatedProgress: ReadingProgress = {
          itemType,
          reference,
          readTimeMinutes: apiProgress.total_read_time_minutes || 0,
          lastUpdated: apiProgress.last_read.timestamp,
        };
        
        onProgressUpdate(updatedProgress);
        return true;
      }
    } catch (error) {
      console.error('Error syncing reading progress:', error);
    } finally {
      setIsSyncing(false);
    }
    
    return false;
  }, [userId, itemType, reference, onProgressUpdate, isSyncing]);

  // Track if we've already synced to avoid duplicate calls
  const hasSyncedRef = useRef(false);
  
  // Set up page unload handler to sync progress
  useEffect(() => {
    
    const handleBeforeUnload = () => {
      // Skip if we've already synced or if there are too many API calls
      if (hasSyncedRef.current) {
        return;
      }
      
      // Mark as synced to prevent duplicate calls
      hasSyncedRef.current = true;
      
      // This is a synchronous event handler, so we need to use sendBeacon
      // or a similar approach for the API call to work during page unload
      try {
        // Check for accessToken which is how the app stores authentication
        const authToken = localStorage.getItem('accessToken') || '';
        const userData = localStorage.getItem('user');
        const isLoggedIn = !!authToken && !!userData;
        
        if (!isLoggedIn || !userId || !reference) {
          DEBUG_MODE && console.log('Not logged in or missing data, skipping API call on unload');
          return;
        }
        
        // Get the current progress from localStorage to send
        try {
          const storedProgress = localStorage.getItem('katiba360_reading_progress');
          if (!storedProgress) return;
          
          const parsedProgress = JSON.parse(storedProgress);
          if (!parsedProgress[reference]) return;
          
          const readTimeMinutes = parsedProgress[reference].readTimeMinutes;
          if (readTimeMinutes <= 0) return;
          
          // Check if we've made an API call recently
          const now = Date.now();
          const timeSinceLastApiCall = now - lastApiCallTimeRef.current;
          if (timeSinceLastApiCall < API_DEBOUNCE_MS) {
            DEBUG_MODE && console.log('Skipping unload sync - too soon since last API call');
            return;
          }
          
          // Update last API call time
          lastApiCallTimeRef.current = now;
          
          // Prepare data for API call
          const data = JSON.stringify({
            item_type: itemType,
            reference,
            read_time_minutes: readTimeMinutes,
          });
          
          // Create the request object with headers
          const blob = new Blob([data], { type: 'application/json' });
          
          // Use the correct API endpoint format with API_PREFIX
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/constitution/user/${userId}/progress`;
          
          // Try to use sendBeacon for async request that works during page unload
          if (navigator.sendBeacon) {
            DEBUG_MODE && console.log('Using sendBeacon for unload sync');
            navigator.sendBeacon(apiUrl, blob);
          } else {
            // Fallback to fetch with keepalive option
            DEBUG_MODE && console.log('Using fetch fallback for unload sync');
            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
              },
              body: data,
              keepalive: true,
              mode: 'cors', // Explicitly set CORS mode
              credentials: 'include', // Include credentials for CORS
            }).catch(e => console.error('Fetch fallback failed:', e));
          }
        } catch (error) {
          console.error('Error getting progress data for unload sync:', error);
        }
      } catch (error) {
        console.error('Error during page unload sync:', error);
      }
    };
    
    // Add the event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also add pagehide event which is more reliable on mobile
    window.addEventListener('pagehide', handleBeforeUnload);
    
    return () => {
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      
      // Only call the handler when component unmounts if we haven't already synced
      if (!hasSyncedRef.current) {
        handleBeforeUnload();
      }
    };
  }, [userId, itemType, reference]);

  // Set up periodic sync as a backup
  useEffect(() => {
    // Clear any existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    
    // Set up a new interval with a long duration
    syncIntervalRef.current = setInterval(() => {
      // Get the current progress from localStorage
      try {
        const storedProgress = localStorage.getItem('katiba360_reading_progress');
        if (!storedProgress) return;
        
        const parsedProgress = JSON.parse(storedProgress);
        if (!parsedProgress[reference]) return;
        
        const readTimeMinutes = parsedProgress[reference].readTimeMinutes;
        syncProgressWithAPI(readTimeMinutes, false);
      } catch (error) {
        console.error('Error in periodic sync:', error);
      }
    }, SYNC_INTERVAL_MS);
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [reference, syncProgressWithAPI]);

  return {
    isLoading,
    isSyncing,
    fetchProgressFromAPI,
    syncProgressWithAPI
  };
}
