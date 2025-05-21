"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for offline content
interface OfflineChapter {
  id: string
  title: string
  size: number // in KB
  lastUpdated: string
  isDownloaded: boolean
  downloadProgress?: number // 0-100
}

interface OfflineStats {
  totalDownloaded: number // in KB
  availableStorage: number // in KB
  lastSynced: string | null
}

// Define context interface
interface OfflineContextType {
  isOffline: boolean
  chapters: OfflineChapter[]
  stats: OfflineStats
  downloadChapter: (chapterId: string) => Promise<void>
  removeChapter: (chapterId: string) => Promise<void>
  syncContent: () => Promise<void>
  isDownloading: boolean
  downloadQueue: string[]
}

// Create context
const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

// Mock chapters data
const mockChapters: OfflineChapter[] = [
  {
    id: "chapter-1",
    title: "Chapter 1: Sovereignty of the People",
    size: 120,
    lastUpdated: "2023-05-15",
    isDownloaded: false,
  },
  { id: "chapter-2", title: "Chapter 2: The Republic", size: 85, lastUpdated: "2023-05-15", isDownloaded: false },
  { id: "chapter-3", title: "Chapter 3: Citizenship", size: 150, lastUpdated: "2023-05-15", isDownloaded: false },
  { id: "chapter-4", title: "Chapter 4: Bill of Rights", size: 320, lastUpdated: "2023-05-15", isDownloaded: false },
  {
    id: "chapter-5",
    title: "Chapter 5: Land and Environment",
    size: 210,
    lastUpdated: "2023-05-15",
    isDownloaded: false,
  },
  {
    id: "chapter-6",
    title: "Chapter 6: Leadership and Integrity",
    size: 180,
    lastUpdated: "2023-05-15",
    isDownloaded: false,
  },
  {
    id: "chapter-7",
    title: "Chapter 7: Representation of the People",
    size: 230,
    lastUpdated: "2023-05-15",
    isDownloaded: false,
  },
  { id: "chapter-8", title: "Chapter 8: The Legislature", size: 290, lastUpdated: "2023-05-15", isDownloaded: false },
  { id: "chapter-9", title: "Chapter 9: The Executive", size: 260, lastUpdated: "2023-05-15", isDownloaded: false },
  { id: "chapter-10", title: "Chapter 10: Judiciary", size: 310, lastUpdated: "2023-05-15", isDownloaded: false },
]

// Provider component
export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false)
  const [chapters, setChapters] = useState<OfflineChapter[]>(mockChapters)
  const [stats, setStats] = useState<OfflineStats>({
    totalDownloaded: 0,
    availableStorage: 1000 * 1000, // 1GB in KB
    lastSynced: null,
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadQueue, setDownloadQueue] = useState<string[]>([])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load offline data from localStorage
  useEffect(() => {
    const savedChapters = localStorage.getItem("offline-chapters")
    const savedStats = localStorage.getItem("offline-stats")

    if (savedChapters) {
      try {
        setChapters(JSON.parse(savedChapters))
      } catch (error) {
        console.error("Failed to parse saved chapters", error)
      }
    }

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats))
      } catch (error) {
        console.error("Failed to parse saved stats", error)
      }
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("offline-chapters", JSON.stringify(chapters))
    localStorage.setItem("offline-stats", JSON.stringify(stats))
  }, [chapters, stats])

  // Process download queue
  useEffect(() => {
    if (downloadQueue.length > 0 && !isDownloading) {
      const processQueue = async () => {
        setIsDownloading(true)
        const chapterId = downloadQueue[0]

        // Find the chapter
        const chapterIndex = chapters.findIndex((c) => c.id === chapterId)
        if (chapterIndex === -1) {
          setDownloadQueue((prev) => prev.slice(1))
          setIsDownloading(false)
          return
        }

        // Simulate download progress
        const chapter = chapters[chapterIndex]
        for (let progress = 0; progress <= 100; progress += 10) {
          setChapters((prev) => {
            const updated = [...prev]
            updated[chapterIndex] = { ...chapter, downloadProgress: progress }
            return updated
          })

          // Wait a bit to simulate download
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        // Mark as downloaded
        setChapters((prev) => {
          const updated = [...prev]
          updated[chapterIndex] = {
            ...chapter,
            isDownloaded: true,
            downloadProgress: undefined,
            lastUpdated: new Date().toISOString().split("T")[0],
          }
          return updated
        })

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalDownloaded: prev.totalDownloaded + chapter.size,
          availableStorage: prev.availableStorage - chapter.size,
        }))

        // Remove from queue
        setDownloadQueue((prev) => prev.slice(1))
        setIsDownloading(false)
      }

      processQueue()
    }
  }, [downloadQueue, isDownloading, chapters])

  // Download a chapter
  const downloadChapter = async (chapterId: string) => {
    // Add to download queue if not already in queue
    if (!downloadQueue.includes(chapterId)) {
      setDownloadQueue((prev) => [...prev, chapterId])
    }
  }

  // Remove a downloaded chapter
  const removeChapter = async (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId)
    if (!chapter?.isDownloaded) return

    setChapters((prev) => prev.map((c) => (c.id === chapterId ? { ...c, isDownloaded: false } : c)))

    setStats((prev) => ({
      ...prev,
      totalDownloaded: prev.totalDownloaded - chapter.size,
      availableStorage: prev.availableStorage + chapter.size,
    }))
  }

  // Sync all content
  const syncContent = async () => {
    // Simulate sync by updating lastSynced
    setStats((prev) => ({
      ...prev,
      lastSynced: new Date().toISOString(),
    }))

    // In a real app, this would check for updates to downloaded content
    return Promise.resolve()
  }

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        chapters,
        stats,
        downloadChapter,
        removeChapter,
        syncContent,
        isDownloading,
        downloadQueue,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}

// Custom hook to use offline context
export function useOffline() {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider")
  }
  return context
}
