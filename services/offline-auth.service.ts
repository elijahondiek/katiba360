/**
 * Offline Authentication Service
 * Handles user authentication state for offline scenarios
 */

export interface OfflineAuthState {
  user_id: string
  email: string
  display_name?: string
  bio?: string
  avatar_url?: string
  offline_session_token: string
  expires_at: number
  last_sync: number
  is_offline_mode: boolean
}

export interface OnlineAuthState {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    display_name?: string
    bio?: string
    avatar_url?: string
  }
}

class OfflineAuthService {
  private static instance: OfflineAuthService
  private readonly STORAGE_KEY = 'offline_auth_state'
  private readonly MAX_OFFLINE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  
  private constructor() {}
  
  static getInstance(): OfflineAuthService {
    if (!OfflineAuthService.instance) {
      OfflineAuthService.instance = new OfflineAuthService()
    }
    return OfflineAuthService.instance
  }
  
  /**
   * Store authentication state for offline use
   */
  storeOfflineAuth(onlineAuthState: OnlineAuthState): void {
    const offlineAuthState: OfflineAuthState = {
      user_id: onlineAuthState.user.id,
      email: onlineAuthState.user.email,
      display_name: onlineAuthState.user.display_name,
      bio: onlineAuthState.user.bio,
      avatar_url: onlineAuthState.user.avatar_url,
      offline_session_token: this.generateOfflineToken(onlineAuthState.user.id),
      expires_at: Date.now() + this.MAX_OFFLINE_DURATION,
      last_sync: Date.now(),
      is_offline_mode: false
    }
    
    this.setStoredAuthState(offlineAuthState)
  }
  
  /**
   * Generate secure offline session token
   */
  private generateOfflineToken(userId: string): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2)
    const payload = `${userId}:${timestamp}:${random}`
    
    // Simple hash for offline token (not cryptographically secure, but sufficient for non-sensitive app)
    return btoa(payload).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
  }
  
  /**
   * Get current offline authentication state
   */
  getOfflineAuthState(): OfflineAuthState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const authState = JSON.parse(stored) as OfflineAuthState
      
      // Check if expired
      if (Date.now() > authState.expires_at) {
        this.clearOfflineAuth()
        return null
      }
      
      return authState
    } catch (error) {
      console.error('Error reading offline auth state:', error)
      this.clearOfflineAuth()
      return null
    }
  }
  
  /**
   * Check if user is authenticated (online or offline)
   */
  isAuthenticated(): boolean {
    // Check online authentication first
    if (this.hasValidOnlineAuth()) {
      return true
    }
    
    // Check offline authentication
    const offlineAuth = this.getOfflineAuthState()
    return offlineAuth !== null
  }
  
  /**
   * Check if user has valid online authentication
   */
  private hasValidOnlineAuth(): boolean {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    return !!(accessToken && refreshToken)
  }
  
  /**
   * Update offline auth state to offline mode
   */
  setOfflineMode(isOffline: boolean): void {
    const authState = this.getOfflineAuthState()
    if (authState) {
      authState.is_offline_mode = isOffline
      this.setStoredAuthState(authState)
    }
  }
  
  /**
   * Update last sync timestamp
   */
  updateLastSync(): void {
    const authState = this.getOfflineAuthState()
    if (authState) {
      authState.last_sync = Date.now()
      this.setStoredAuthState(authState)
    }
  }
  
  /**
   * Get current user (online or offline)
   */
  getCurrentUser(): OnlineAuthState['user'] | null {
    // Try online first
    const onlineUser = this.getOnlineUser()
    if (onlineUser) return onlineUser
    
    // Fall back to offline
    const offlineAuth = this.getOfflineAuthState()
    if (offlineAuth) {
      return {
        id: offlineAuth.user_id,
        email: offlineAuth.email,
        display_name: offlineAuth.display_name,
        bio: offlineAuth.bio,
        avatar_url: offlineAuth.avatar_url
      }
    }
    
    return null
  }
  
  /**
   * Get online user from stored auth state
   */
  private getOnlineUser(): OnlineAuthState['user'] | null {
    try {
      const authState = localStorage.getItem('authState')
      if (!authState) return null
      
      const parsed = JSON.parse(authState)
      return parsed.user || null
    } catch (error) {
      return null
    }
  }
  
  /**
   * Check if offline session is about to expire
   */
  isOfflineSessionExpiring(): boolean {
    const authState = this.getOfflineAuthState()
    if (!authState) return false
    
    const timeUntilExpiry = authState.expires_at - Date.now()
    const oneDayInMs = 24 * 60 * 60 * 1000
    
    return timeUntilExpiry < oneDayInMs
  }
  
  /**
   * Get time until offline session expires
   */
  getTimeUntilExpiry(): number {
    const authState = this.getOfflineAuthState()
    if (!authState) return 0
    
    return Math.max(0, authState.expires_at - Date.now())
  }
  
  /**
   * Clear offline authentication
   */
  clearOfflineAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }
  
  /**
   * Clear all authentication (online and offline)
   */
  clearAllAuth(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authState')
    this.clearOfflineAuth()
  }
  
  /**
   * Store offline auth state in localStorage
   */
  private setStoredAuthState(authState: OfflineAuthState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState))
    } catch (error) {
      console.error('Error storing offline auth state:', error)
    }
  }
  
  /**
   * Sync offline auth with online state if available
   */
  async syncWithOnlineAuth(): Promise<boolean> {
    if (!navigator.onLine) return false
    
    const onlineAuth = this.getOnlineUser()
    if (!onlineAuth) return false
    
    try {
      // Update offline auth with latest online data
      const offlineAuth = this.getOfflineAuthState()
      if (offlineAuth) {
        offlineAuth.display_name = onlineAuth.display_name
        offlineAuth.bio = onlineAuth.bio
        offlineAuth.avatar_url = onlineAuth.avatar_url
        offlineAuth.last_sync = Date.now()
        offlineAuth.is_offline_mode = false
        
        this.setStoredAuthState(offlineAuth)
      }
      
      return true
    } catch (error) {
      console.error('Error syncing offline auth:', error)
      return false
    }
  }
  
  /**
   * Get authentication header for API calls
   */
  getAuthHeader(): { Authorization: string } | {} {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` }
    }
    
    // For offline mode, we don't send auth headers
    return {}
  }
}

export const offlineAuthService = OfflineAuthService.getInstance()
export default offlineAuthService