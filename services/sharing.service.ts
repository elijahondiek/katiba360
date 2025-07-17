import { fetchAPI } from '@/lib/api'
import apiInterceptorService from './api-interceptor.service'

export interface SharingEvent {
  content_type: string
  content_id: string
  share_method: 'facebook' | 'twitter' | 'whatsapp' | 'native' | 'copy-link'
  content_url: string
}

export interface SharingEventResponse {
  id: string
  user_id: string
  content_type: string
  content_id: string
  share_method: string
  content_url: string
  shared_at: string
}

export interface SharingAnalytics {
  total_shares: number
  shares_by_method: Record<string, number>
  shares_by_content_type: Record<string, number>
  most_recent_share?: string
  period_days: number
}

class SharingService {
  private baseUrl = '/api/v1/sharing'
  
  /**
   * Track a sharing event
   */
  async trackSharingEvent(
    event: SharingEvent
  ): Promise<SharingEventResponse | null> {
    try {
      const response = await apiInterceptorService.fetchWithRefresh(
        `${this.baseUrl}/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      )
      return response?.body || null
    } catch (error) {
      console.error('Error tracking sharing event:', error)
      // Return null or handle error as needed, without re-throwing
      return null
    }
  }

  /**
   * Get user's sharing events
   */
  async getSharingEvents(limit: number = 50, offset: number = 0): Promise<SharingEventResponse[]> {
    try {
      const response = await apiInterceptorService.fetchWithRefresh(
        `${this.baseUrl}/events?limit=${limit}&offset=${offset}`
      )
      if (!response.body) {
        throw new Error(response.header?.customerMessage || 'Failed to get sharing events')
      }
      return response.body
    } catch (error) {
      console.error('Error getting sharing events:', error)
      throw error
    }
  }

  /**
   * Get sharing analytics
   */
  async getSharingAnalytics(days: number = 30): Promise<SharingAnalytics | null> {
    try {
      const response = await apiInterceptorService.fetchWithRefresh(
        `${this.baseUrl}/analytics?days=${days}`
      )
      return response?.body || null
    } catch (error) {
      console.error('Error getting sharing analytics:', error)
      return null
    }
  }

  /**
   * Check if user qualifies for Sharing Citizen achievement
   */
  async checkSharingCitizenAchievement(): Promise<{ qualifies: boolean; achievement_name: string; description: string }> {
    try {
      const response = await fetchAPI(`${this.baseUrl}/achievement/sharing-citizen`)

      if (!response.body) {
        throw new Error(response.header?.customerMessage || 'Failed to check sharing achievement')
      }

      return response.body
    } catch (error) {
      console.error('Error checking sharing achievement:', error)
      throw error
    }
  }

  /**
   * Helper to track sharing with error handling
   */
  async trackShare(
    contentType: string,
    contentId: string,
    shareMethod: SharingEvent['share_method'],
    contentUrl: string
  ): Promise<void> {
    // trackSharingEvent now handles errors gracefully and returns null on failure
    await this.trackSharingEvent({
      content_type: contentType,
      content_id: contentId,
      share_method: shareMethod,
      content_url: contentUrl,
    })
  }
}

export const sharingService = new SharingService()
export default sharingService