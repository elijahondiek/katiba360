/**
 * Offline Reading Service
 * Handles content access for both online and offline scenarios
 */

import { 
  getChapterByNumber, 
  getArticleByChapterAndArticle, 
  searchConstitution,
  getChapters 
} from '@/lib/api'
import { offlineContentService, OfflineChapter, OfflineArticle } from './offline-content.service'
import { offlineAuthService } from './offline-auth.service'

export interface ReadingContent {
  source: 'online' | 'offline'
  chapter?: any
  article?: any
  searchResults?: any[]
  timestamp: number
}

export interface ReadingOptions {
  forceOffline?: boolean
  fallbackToOffline?: boolean
  cacheOnline?: boolean
}

class OfflineReadingService {
  private static instance: OfflineReadingService
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private memoryCache = new Map<string, ReadingContent>()
  
  private constructor() {}
  
  static getInstance(): OfflineReadingService {
    if (!OfflineReadingService.instance) {
      OfflineReadingService.instance = new OfflineReadingService()
    }
    return OfflineReadingService.instance
  }
  
  /**
   * Get chapter content (online or offline)
   */
  async getChapter(
    chapterNumber: number, 
    options: ReadingOptions = {}
  ): Promise<ReadingContent | null> {
    const cacheKey = `chapter_${chapterNumber}`
    
    // Check memory cache first
    if (!options.forceOffline && this.isValidCache(cacheKey)) {
      return this.memoryCache.get(cacheKey)!
    }
    
    // Try offline first if forced or no internet
    if (options.forceOffline || !navigator.onLine) {
      const offlineChapter = await this.getOfflineChapter(chapterNumber)
      if (offlineChapter) {
        return offlineChapter
      }
    }
    
    // Try online if available
    if (navigator.onLine && offlineAuthService.isAuthenticated()) {
      try {
        const response = await getChapterByNumber(chapterNumber)
        if (response?.body?.chapter) {
          const content: ReadingContent = {
            source: 'online',
            chapter: response.body.chapter,
            timestamp: Date.now()
          }
          
          // Cache the result
          this.memoryCache.set(cacheKey, content)
          
          // Optionally cache offline
          if (options.cacheOnline) {
            this.cacheChapterOffline(chapterNumber)
          }
          
          return content
        }
      } catch (error) {
        console.error('Error fetching online chapter:', error)
      }
    }
    
    // Fallback to offline if enabled
    if (options.fallbackToOffline) {
      return await this.getOfflineChapter(chapterNumber)
    }
    
    return null
  }
  
  /**
   * Get article content (online or offline)
   */
  async getArticle(
    chapterNumber: number,
    articleNumber: number,
    options: ReadingOptions = {}
  ): Promise<ReadingContent | null> {
    const cacheKey = `article_${chapterNumber}_${articleNumber}`
    
    // Check memory cache first
    if (!options.forceOffline && this.isValidCache(cacheKey)) {
      return this.memoryCache.get(cacheKey)!
    }
    
    // Try offline first if forced or no internet
    if (options.forceOffline || !navigator.onLine) {
      const offlineArticle = await this.getOfflineArticle(chapterNumber, articleNumber)
      if (offlineArticle) {
        return offlineArticle
      }
    }
    
    // Try online if available
    if (navigator.onLine && offlineAuthService.isAuthenticated()) {
      try {
        const response = await getArticleByChapterAndArticle(chapterNumber, articleNumber)
        if (response?.body?.article) {
          const content: ReadingContent = {
            source: 'online',
            article: response.body.article,
            timestamp: Date.now()
          }
          
          // Cache the result
          this.memoryCache.set(cacheKey, content)
          
          return content
        }
      } catch (error) {
        console.error('Error fetching online article:', error)
      }
    }
    
    // Fallback to offline if enabled
    if (options.fallbackToOffline) {
      return await this.getOfflineArticle(chapterNumber, articleNumber)
    }
    
    return null
  }
  
  /**
   * Search content (online or offline)
   */
  async searchContent(
    query: string,
    options: ReadingOptions = {}
  ): Promise<ReadingContent | null> {
    const cacheKey = `search_${query.toLowerCase().replace(/\s+/g, '_')}`
    
    // Check memory cache first
    if (!options.forceOffline && this.isValidCache(cacheKey)) {
      return this.memoryCache.get(cacheKey)!
    }
    
    const results: any[] = []
    
    // Try offline first if forced or no internet
    if (options.forceOffline || !navigator.onLine) {
      const offlineResults = await offlineContentService.searchOfflineContent(query)
      results.push(...offlineResults)
    }
    
    // Try online if available
    if (navigator.onLine && offlineAuthService.isAuthenticated()) {
      try {
        const response = await searchConstitution({ query, limit: 20 })
        if (response?.body?.results) {
          const onlineResults = response.body.results.map((result: any) => ({
            ...result,
            match_type: 'online'
          }))
          results.push(...onlineResults)
        }
      } catch (error) {
        console.error('Error searching online content:', error)
      }
    }
    
    const content: ReadingContent = {
      source: results.some(r => r.match_type === 'online') ? 'online' : 'offline',
      searchResults: results,
      timestamp: Date.now()
    }
    
    // Cache the result
    this.memoryCache.set(cacheKey, content)
    
    return content
  }
  
  /**
   * Get all chapters (online or offline)
   */
  async getAllChapters(options: ReadingOptions = {}): Promise<ReadingContent | null> {
    const cacheKey = 'all_chapters'
    
    // Check memory cache first
    if (!options.forceOffline && this.isValidCache(cacheKey)) {
      return this.memoryCache.get(cacheKey)!
    }
    
    // Try offline first if forced or no internet
    if (options.forceOffline || !navigator.onLine) {
      const offlineChapters = await offlineContentService.getAllOfflineChapters()
      if (offlineChapters.length > 0) {
        const content: ReadingContent = {
          source: 'offline',
          chapter: { chapters: offlineChapters },
          timestamp: Date.now()
        }
        
        this.memoryCache.set(cacheKey, content)
        return content
      }
    }
    
    // Try online if available
    if (navigator.onLine && offlineAuthService.isAuthenticated()) {
      try {
        const response = await getChapters(18, 0) // Get all 18 chapters
        if (response?.body?.chapters) {
          const content: ReadingContent = {
            source: 'online',
            chapter: response.body,
            timestamp: Date.now()
          }
          
          // Cache the result
          this.memoryCache.set(cacheKey, content)
          
          return content
        }
      } catch (error) {
        console.error('Error fetching online chapters:', error)
      }
    }
    
    return null
  }
  
  /**
   * Get offline chapter content
   */
  private async getOfflineChapter(chapterNumber: number): Promise<ReadingContent | null> {
    const offlineChapter = await offlineContentService.getOfflineChapter(chapterNumber)
    
    if (offlineChapter) {
      return {
        source: 'offline',
        chapter: this.transformOfflineChapterToApiFormat(offlineChapter),
        timestamp: Date.now()
      }
    }
    
    return null
  }
  
  /**
   * Get offline article content
   */
  private async getOfflineArticle(
    chapterNumber: number, 
    articleNumber: number
  ): Promise<ReadingContent | null> {
    const offlineChapter = await offlineContentService.getOfflineChapter(chapterNumber)
    
    if (offlineChapter) {
      const article = offlineChapter.articles.find(a => a.article_number === articleNumber)
      if (article) {
        return {
          source: 'offline',
          article: this.transformOfflineArticleToApiFormat(article, offlineChapter),
          timestamp: Date.now()
        }
      }
    }
    
    return null
  }
  
  /**
   * Transform offline chapter to API format
   */
  private transformOfflineChapterToApiFormat(offlineChapter: OfflineChapter): any {
    return {
      chapter_number: offlineChapter.chapter_number,
      chapter_title: offlineChapter.chapter_title,
      articles: offlineChapter.articles.map(article => ({
        article_number: article.article_number,
        article_title: article.article_title,
        clauses: article.clauses.map(clause => ({
          clause_number: clause.clause_number,
          content: clause.content,
          sub_clauses: clause.sub_clauses.map(subClause => ({
            sub_clause_number: subClause.sub_clause_number,
            content: subClause.content
          }))
        }))
      }))
    }
  }
  
  /**
   * Transform offline article to API format
   */
  private transformOfflineArticleToApiFormat(
    offlineArticle: OfflineArticle, 
    offlineChapter: OfflineChapter
  ): any {
    return {
      chapter_number: offlineChapter.chapter_number,
      chapter_title: offlineChapter.chapter_title,
      article_number: offlineArticle.article_number,
      article_title: offlineArticle.article_title,
      clauses: offlineArticle.clauses.map(clause => ({
        clause_number: clause.clause_number,
        content: clause.content,
        sub_clauses: clause.sub_clauses.map(subClause => ({
          sub_clause_number: subClause.sub_clause_number,
          content: subClause.content
        }))
      }))
    }
  }
  
  /**
   * Cache chapter offline for future use
   */
  private async cacheChapterOffline(chapterNumber: number): Promise<void> {
    try {
      await offlineContentService.downloadChapter(chapterNumber)
    } catch (error) {
      console.error('Error caching chapter offline:', error)
    }
  }
  
  /**
   * Check if cache is valid
   */
  private isValidCache(key: string): boolean {
    const cached = this.memoryCache.get(key)
    if (!cached) return false
    
    return (Date.now() - cached.timestamp) < this.CACHE_DURATION
  }
  
  /**
   * Clear memory cache
   */
  clearCache(): void {
    this.memoryCache.clear()
  }
  
  /**
   * Get content availability status
   */
  async getContentAvailability(chapterNumber: number): Promise<{
    online: boolean
    offline: boolean
    preferred: 'online' | 'offline'
  }> {
    const isOnline = navigator.onLine && offlineAuthService.isAuthenticated()
    const isOffline = await offlineContentService.isChapterAvailableOffline(chapterNumber)
    
    return {
      online: isOnline,
      offline: isOffline,
      preferred: isOnline ? 'online' : 'offline'
    }
  }
  
  /**
   * Sync offline content with online updates
   */
  async syncOfflineContent(): Promise<void> {
    if (!navigator.onLine || !offlineAuthService.isAuthenticated()) {
      return
    }
    
    try {
      const offlineChapters = await offlineContentService.getAllOfflineChapters()
      
      for (const offlineChapter of offlineChapters) {
        // Re-download chapter to get latest content
        await offlineContentService.downloadChapter(offlineChapter.chapter_number)
      }
      
      // Update auth sync timestamp
      offlineAuthService.updateLastSync()
    } catch (error) {
      console.error('Error syncing offline content:', error)
    }
  }
  
  /**
   * Preload chapters for offline access
   */
  async preloadChapters(chapterNumbers: number[]): Promise<void> {
    if (!navigator.onLine || !offlineAuthService.isAuthenticated()) {
      return
    }
    
    for (const chapterNumber of chapterNumbers) {
      try {
        await offlineContentService.downloadChapter(chapterNumber)
      } catch (error) {
        console.error(`Error preloading chapter ${chapterNumber}:`, error)
      }
    }
  }
}

export const offlineReadingService = OfflineReadingService.getInstance()
export default offlineReadingService