/**
 * Offline Content Service
 * Handles per-chapter content storage and retrieval for offline access
 */

import { getChapterByNumber, getArticleByChapterAndArticle } from '@/lib/api'
import { offlineAuthService } from './offline-auth.service'

export interface OfflineChapter {
  chapter_number: number
  chapter_title: string
  articles: OfflineArticle[]
  downloaded_at: number
  expires_at: number
  size_bytes: number
  user_id: string
}

export interface OfflineArticle {
  article_number: number
  article_title: string
  clauses: OfflineClause[]
  content?: string
}

export interface OfflineClause {
  clause_number: string
  content: string
  sub_clauses: OfflineSubClause[]
}

export interface OfflineSubClause {
  sub_clause_number: string
  content: string
}

export interface OfflineContentMetadata {
  total_chapters: number
  total_size_bytes: number
  last_updated: number
  user_id: string
}

class OfflineContentService {
  private static instance: OfflineContentService
  private readonly DB_NAME = 'katiba360_offline'
  private readonly DB_VERSION = 1
  private readonly CHAPTER_STORE = 'chapters'
  private readonly METADATA_STORE = 'metadata'
  private readonly EXPIRY_DAYS = 30 // Chapters expire after 30 days
  private db: IDBDatabase | null = null
  
  private constructor() {}
  
  static getInstance(): OfflineContentService {
    if (!OfflineContentService.instance) {
      OfflineContentService.instance = new OfflineContentService()
    }
    return OfflineContentService.instance
  }
  
  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(request.result)
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create chapters store
        if (!db.objectStoreNames.contains(this.CHAPTER_STORE)) {
          const chapterStore = db.createObjectStore(this.CHAPTER_STORE, {
            keyPath: 'chapter_number'
          })
          chapterStore.createIndex('user_id', 'user_id', { unique: false })
          chapterStore.createIndex('downloaded_at', 'downloaded_at', { unique: false })
        }
        
        // Create metadata store
        if (!db.objectStoreNames.contains(this.METADATA_STORE)) {
          db.createObjectStore(this.METADATA_STORE, { keyPath: 'user_id' })
        }
      }
    })
  }
  
  /**
   * Download and store chapter for offline access
   */
  async downloadChapter(chapterNumber: number): Promise<OfflineChapter> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }
    
    try {
      // Fetch chapter data from API
      const response = await getChapterByNumber(chapterNumber)
      if (!response?.body?.chapter) {
        throw new Error('Chapter not found')
      }
      
      const chapterData = response.body.chapter
      
      // Transform API response to offline format
      const offlineChapter: OfflineChapter = {
        chapter_number: chapterData.chapter_number,
        chapter_title: chapterData.chapter_title,
        articles: this.transformArticles(chapterData.articles || []),
        downloaded_at: Date.now(),
        expires_at: Date.now() + (this.EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        size_bytes: this.calculateChapterSize(chapterData),
        user_id: user.id
      }
      
      // Store in IndexedDB
      await this.storeChapter(offlineChapter)
      
      // Update metadata
      await this.updateMetadata(user.id)
      
      return offlineChapter
    } catch (error) {
      console.error('Error downloading chapter:', error)
      throw error
    }
  }
  
  /**
   * Transform API articles to offline format
   */
  private transformArticles(articles: any[]): OfflineArticle[] {
    return articles.map(article => ({
      article_number: article.article_number,
      article_title: article.article_title,
      clauses: this.transformClauses(article.clauses || []),
      content: article.content || ''
    }))
  }
  
  /**
   * Transform API clauses to offline format
   */
  private transformClauses(clauses: any[]): OfflineClause[] {
    return clauses.map(clause => ({
      clause_number: clause.clause_number,
      content: clause.content,
      sub_clauses: this.transformSubClauses(clause.sub_clauses || [])
    }))
  }
  
  /**
   * Transform API sub-clauses to offline format
   */
  private transformSubClauses(subClauses: any[]): OfflineSubClause[] {
    return subClauses.map(subClause => ({
      sub_clause_number: subClause.sub_clause_number,
      content: subClause.content
    }))
  }
  
  /**
   * Calculate approximate chapter size in bytes
   */
  private calculateChapterSize(chapterData: any): number {
    const jsonString = JSON.stringify(chapterData)
    return new Blob([jsonString]).size
  }
  
  /**
   * Store chapter in IndexedDB
   */
  private async storeChapter(chapter: OfflineChapter): Promise<void> {
    const db = await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.CHAPTER_STORE], 'readwrite')
      const store = transaction.objectStore(this.CHAPTER_STORE)
      
      const request = store.put(chapter)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  /**
   * Get chapter from offline storage
   */
  async getOfflineChapter(chapterNumber: number): Promise<OfflineChapter | null> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return null
    
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.CHAPTER_STORE], 'readonly')
        const store = transaction.objectStore(this.CHAPTER_STORE)
        
        const request = store.get(chapterNumber)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const chapter = request.result as OfflineChapter
          
          // Check if chapter belongs to current user and is not expired
          if (chapter && chapter.user_id === user.id && chapter.expires_at > Date.now()) {
            resolve(chapter)
          } else {
            resolve(null)
          }
        }
      })
    } catch (error) {
      console.error('Error getting offline chapter:', error)
      return null
    }
  }
  
  /**
   * Get all offline chapters for current user
   */
  async getAllOfflineChapters(): Promise<OfflineChapter[]> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return []
    
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.CHAPTER_STORE], 'readonly')
        const store = transaction.objectStore(this.CHAPTER_STORE)
        const index = store.index('user_id')
        
        const request = index.getAll(user.id)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const chapters = request.result as OfflineChapter[]
          
          // Filter out expired chapters
          const validChapters = chapters.filter(chapter => chapter.expires_at > Date.now())
          
          resolve(validChapters)
        }
      })
    } catch (error) {
      console.error('Error getting offline chapters:', error)
      return []
    }
  }
  
  /**
   * Remove chapter from offline storage
   */
  async removeOfflineChapter(chapterNumber: number): Promise<void> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return
    
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.CHAPTER_STORE], 'readwrite')
        const store = transaction.objectStore(this.CHAPTER_STORE)
        
        const request = store.delete(chapterNumber)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          this.updateMetadata(user.id)
          resolve()
        }
      })
    } catch (error) {
      console.error('Error removing offline chapter:', error)
      throw error
    }
  }
  
  /**
   * Update metadata for offline content
   */
  private async updateMetadata(userId: string): Promise<void> {
    const chapters = await this.getAllOfflineChapters()
    
    const metadata: OfflineContentMetadata = {
      total_chapters: chapters.length,
      total_size_bytes: chapters.reduce((total, chapter) => total + chapter.size_bytes, 0),
      last_updated: Date.now(),
      user_id: userId
    }
    
    const db = await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.METADATA_STORE], 'readwrite')
      const store = transaction.objectStore(this.METADATA_STORE)
      
      const request = store.put(metadata)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  /**
   * Get offline content metadata
   */
  async getMetadata(): Promise<OfflineContentMetadata | null> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return null
    
    try {
      const db = await this.initDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.METADATA_STORE], 'readonly')
        const store = transaction.objectStore(this.METADATA_STORE)
        
        const request = store.get(user.id)
        
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result || null)
      })
    } catch (error) {
      console.error('Error getting metadata:', error)
      return null
    }
  }
  
  /**
   * Check if chapter is available offline
   */
  async isChapterAvailableOffline(chapterNumber: number): Promise<boolean> {
    const chapter = await this.getOfflineChapter(chapterNumber)
    return chapter !== null
  }
  
  /**
   * Clean up expired chapters
   */
  async cleanupExpiredChapters(): Promise<void> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return
    
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.CHAPTER_STORE], 'readwrite')
      const store = transaction.objectStore(this.CHAPTER_STORE)
      const index = store.index('user_id')
      
      const request = index.getAll(user.id)
      
      request.onsuccess = () => {
        const chapters = request.result as OfflineChapter[]
        const now = Date.now()
        
        chapters.forEach(chapter => {
          if (chapter.expires_at < now) {
            store.delete(chapter.chapter_number)
          }
        })
        
        this.updateMetadata(user.id)
      }
    } catch (error) {
      console.error('Error cleaning up expired chapters:', error)
    }
  }
  
  /**
   * Search within offline chapters
   */
  async searchOfflineContent(query: string): Promise<any[]> {
    const chapters = await this.getAllOfflineChapters()
    const results: any[] = []
    
    chapters.forEach(chapter => {
      chapter.articles.forEach(article => {
        article.clauses.forEach(clause => {
          if (clause.content.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              chapter_number: chapter.chapter_number,
              chapter_title: chapter.chapter_title,
              article_number: article.article_number,
              article_title: article.article_title,
              clause_number: clause.clause_number,
              content: clause.content,
              match_type: 'offline'
            })
          }
        })
      })
    })
    
    return results
  }
  
  /**
   * Clear all offline content for current user
   */
  async clearAllOfflineContent(): Promise<void> {
    const user = offlineAuthService.getCurrentUser()
    if (!user) return
    
    try {
      const db = await this.initDB()
      const transaction = db.transaction([this.CHAPTER_STORE, this.METADATA_STORE], 'readwrite')
      
      const chapterStore = transaction.objectStore(this.CHAPTER_STORE)
      const metadataStore = transaction.objectStore(this.METADATA_STORE)
      
      const chapterIndex = chapterStore.index('user_id')
      const chapterRequest = chapterIndex.getAll(user.id)
      
      chapterRequest.onsuccess = () => {
        const chapters = chapterRequest.result as OfflineChapter[]
        chapters.forEach(chapter => {
          chapterStore.delete(chapter.chapter_number)
        })
      }
      
      metadataStore.delete(user.id)
    } catch (error) {
      console.error('Error clearing offline content:', error)
      throw error
    }
  }
}

export const offlineContentService = OfflineContentService.getInstance()
export default offlineContentService