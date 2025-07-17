"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getUserBookmarks, saveBookmark, removeBookmark } from '@/lib/api'

interface Bookmark {
  id: string
  type: 'article' | 'chapter'
  reference: string
  title: string
  created_at: string
}

interface BookmarkContextType {
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  isBookmarked: (type: 'article' | 'chapter', reference: string) => boolean
  addBookmark: (type: 'article' | 'chapter', reference: string, title: string) => Promise<void>
  removeBookmark: (type: 'article' | 'chapter', reference: string) => Promise<void>
  refreshBookmarks: () => Promise<void>
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchBookmarks = async (force = false) => {
    if (!authState?.user?.id) return
    
    // Prevent multiple rapid calls (debounce for 5 seconds)
    const now = Date.now()
    if (!force && now - lastFetch < 5000) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await getUserBookmarks(authState.user.id)
      if (response?.body?.bookmarks) {
        setBookmarks(response.body.bookmarks)
        setLastFetch(now)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks')
      console.error('Error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load bookmarks when user changes
  useEffect(() => {
    if (authState?.user?.id) {
      fetchBookmarks()
    } else {
      setBookmarks([])
    }
  }, [authState?.user?.id])

  const isBookmarked = (type: 'article' | 'chapter', reference: string): boolean => {
    return bookmarks.some(bookmark => 
      bookmark.type === type && bookmark.reference === reference
    )
  }

  const addBookmark = async (type: 'article' | 'chapter', reference: string, title: string) => {
    if (!authState?.user?.id) return

    try {
      const response = await saveBookmark(authState.user.id, {
        type,
        reference,
        title
      })
      
      if (response?.body?.bookmark) {
        setBookmarks(prev => [...prev, response.body.bookmark])
      }
    } catch (err) {
      console.error('Error adding bookmark:', err)
      throw err
    }
  }

  const removeBookmarkById = async (type: 'article' | 'chapter', reference: string) => {
    if (!authState?.user?.id) return

    const bookmark = bookmarks.find(b => b.type === type && b.reference === reference)
    if (!bookmark) return

    try {
      await removeBookmark(authState.user.id, bookmark.id)
      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id))
    } catch (err) {
      console.error('Error removing bookmark:', err)
      throw err
    }
  }

  const refreshBookmarks = async () => {
    await fetchBookmarks(true)
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        error,
        isBookmarked,
        addBookmark,
        removeBookmark: removeBookmarkById,
        refreshBookmarks
      }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}

export const useBookmarks = () => {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}