/**
 * Hook for automatic token refresh and expiration handling
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiInterceptorService } from '@/services/api-interceptor.service'

interface UseTokenRefreshOptions {
  /** Enable proactive refresh (default: true) */
  proactiveRefresh?: boolean
  /** Refresh when token has this many seconds left (default: 120) */
  refreshThreshold?: number
  /** Check interval in milliseconds (default: 60000) */
  checkInterval?: number
}

export function useTokenRefresh(options: UseTokenRefreshOptions = {}) {
  const {
    proactiveRefresh = true,
    refreshThreshold = 120, // 2 minutes
    checkInterval = 60000, // 1 minute
  } = options

  const { authState, refreshAccessToken } = useAuth()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastRefreshRef = useRef<number>(0)

  const checkAndRefreshToken = useCallback(async () => {
    if (!authState.isAuthenticated || authState.isOfflineMode) {
      return
    }

    const timeUntilExpiration = apiInterceptorService.getTimeUntilExpiration()
    const now = Date.now()

    // Avoid refreshing too frequently (minimum 30 seconds between refreshes)
    if (now - lastRefreshRef.current < 30000) {
      return
    }

    if (timeUntilExpiration > 0 && timeUntilExpiration < refreshThreshold) {
      try {
        console.log(`Token expires in ${timeUntilExpiration} seconds, refreshing...`)
        await apiInterceptorService.proactiveRefresh()
        lastRefreshRef.current = now
      } catch (error) {
        console.error('Proactive token refresh failed:', error)
      }
    }
  }, [authState.isAuthenticated, authState.isOfflineMode, refreshThreshold])

  // Set up proactive refresh interval
  useEffect(() => {
    if (proactiveRefresh && authState.isAuthenticated && !authState.isOfflineMode) {
      intervalRef.current = setInterval(checkAndRefreshToken, checkInterval)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [proactiveRefresh, authState.isAuthenticated, authState.isOfflineMode, checkInterval, checkAndRefreshToken])

  // Listen for token refresh events
  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent) => {
      console.log('Token refreshed via interceptor')
      lastRefreshRef.current = Date.now()
    }

    const handleAuthExpired = () => {
      console.log('Auth expired, clearing interval')
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    window.addEventListener('tokenRefreshed', handleTokenRefreshed as EventListener)
    window.addEventListener('authExpired', handleAuthExpired)

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed as EventListener)
      window.removeEventListener('authExpired', handleAuthExpired)
    }
  }, [])

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    try {
      await refreshAccessToken()
      lastRefreshRef.current = Date.now()
    } catch (error) {
      console.error('Manual token refresh failed:', error)
      throw error
    }
  }, [refreshAccessToken])

  return {
    /** Current time until token expiration (in seconds) */
    timeUntilExpiration: apiInterceptorService.getTimeUntilExpiration(),
    /** Whether token is about to expire */
    isTokenExpiring: apiInterceptorService.isTokenExpiring(),
    /** Manually trigger token refresh */
    refreshToken: manualRefresh,
    /** Check and refresh token if needed */
    checkAndRefresh: checkAndRefreshToken,
  }
}

export default useTokenRefresh