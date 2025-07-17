/**
 * API Interceptor Service
 * Handles automatic token refresh and 401 error recovery
 */

import { fetchAPI } from '@/lib/api'

interface RefreshResponse {
  body: {
    access_token: string
    refresh_token: string
  }
}

class ApiInterceptorService {
  private static instance: ApiInterceptorService
  private isRefreshing = false
  private refreshPromise: Promise<void> | null = null
  private failedQueue: Array<{
    resolve: (value: any) => void
    reject: (reason: any) => void
    originalRequest: () => Promise<any>
  }> = []

  private constructor() {}

  static getInstance(): ApiInterceptorService {
    if (!ApiInterceptorService.instance) {
      ApiInterceptorService.instance = new ApiInterceptorService()
    }
    return ApiInterceptorService.instance
  }

  /**
   * Enhanced fetchAPI with automatic token refresh
   */
  async fetchWithRefresh(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    try {
      // First attempt
      return await fetchAPI(endpoint, options)
    } catch (error: any) {
      // Check if it's a 401 error
      if (error.message?.includes('401') || error.status === 401) {
        return this.handleTokenRefresh(endpoint, options)
      }
      throw error
    }
  }

  /**
   * Handle token refresh and retry logic
   */
  private async handleTokenRefresh(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    // SSR safety check
    if (typeof window === 'undefined') {
      throw new Error('Token refresh not available during SSR')
    }
    
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      // No refresh token, redirect to login
      this.redirectToLogin()
      throw new Error('No refresh token available')
    }

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve,
          reject,
          originalRequest: () => fetchAPI(endpoint, options)
        })
      })
    }

    // Start refresh process
    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      await this.refreshPromise
      
      // Process queued requests
      this.processQueue()
      
      // Retry original request with new token
      return await fetchAPI(endpoint, options)
    } catch (refreshError) {
      // Refresh failed, clear auth and redirect
      this.clearAuthAndRedirect()
      throw refreshError
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Perform token refresh
   */
  private async performTokenRefresh(): Promise<void> {
    // SSR safety check
    if (typeof window === 'undefined') {
      throw new Error('Token refresh not available during SSR')
    }
    
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response: RefreshResponse = await fetchAPI('/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Don't include Authorization header for refresh
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      })

      if (response.body) {
        const { access_token, refresh_token: new_refresh_token } = response.body

        // Update tokens
        localStorage.setItem('accessToken', access_token)
        if (new_refresh_token) {
          localStorage.setItem('refreshToken', new_refresh_token)
        }

        // Update auth context if available
        this.updateAuthContext(access_token, new_refresh_token)

        console.log('Token refreshed successfully')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }

  /**
   * Process queued requests after successful refresh
   */
  private processQueue(): void {
    this.failedQueue.forEach(({ resolve, reject, originalRequest }) => {
      originalRequest()
        .then(resolve)
        .catch(reject)
    })
    
    this.failedQueue = []
  }

  /**
   * Update auth context with new tokens
   */
  private updateAuthContext(accessToken: string, refreshToken?: string): void {
    // Dispatch custom event to update auth context
    window.dispatchEvent(new CustomEvent('tokenRefreshed', {
      detail: { accessToken, refreshToken }
    }))
  }

  /**
   * Clear auth and redirect to login
   */
  private clearAuthAndRedirect(): void {
    // SSR safety check
    if (typeof window === 'undefined') {
      return
    }
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // Clear cookies
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('authExpired'))
    
    // Redirect to login
    window.location.href = '/login?error=session_expired'
  }

  /**
   * Redirect to login
   */
  private redirectToLogin(): void {
    // SSR safety check
    if (typeof window === 'undefined') {
      return
    }
    
    window.location.href = '/login?error=session_expired'
  }

  /**
   * Check if token is about to expire (within 2 minutes)
   */
  isTokenExpiring(): boolean {
    // SSR safety check
    if (typeof window === 'undefined') {
      return false
    }
    
    const token = localStorage.getItem('accessToken')
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp
      
      // Check if token expires within 2 minutes (120 seconds)
      return (expirationTime - currentTime) < 120
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  /**
   * Get time until token expires (in seconds)
   */
  getTimeUntilExpiration(): number {
    // SSR safety check
    if (typeof window === 'undefined') {
      return 0
    }
    
    const token = localStorage.getItem('accessToken')
    if (!token) return 0

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = payload.exp
      
      return Math.max(0, expirationTime - currentTime)
    } catch (error) {
      console.error('Error getting token expiration time:', error)
      return 0
    }
  }

  /**
   * Proactively refresh token if it's about to expire
   */
  async proactiveRefresh(): Promise<void> {
    if (this.isTokenExpiring() && !this.isRefreshing) {
      try {
        await this.performTokenRefresh()
      } catch (error) {
        console.error('Proactive refresh failed:', error)
      }
    }
  }
}

export const apiInterceptorService = ApiInterceptorService.getInstance()
export default apiInterceptorService