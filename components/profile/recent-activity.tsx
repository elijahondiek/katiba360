"use client"

import { useState, useEffect } from "react"
import { Clock, BookOpen, BookMarked, CheckCircle2, Award, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getUserBookmarks, getUserAchievements, getUserReadingProgress } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  title: string
  time: string
  icon: React.ReactNode
  type: 'reading' | 'bookmark' | 'achievement' | 'quiz'
  timestamp: Date
}

export function RecentActivity() {
  const { authState } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentActivity() {
      if (!authState?.user?.id) {
        setLoading(false)
        return
      }

      try {
        // Fetch data from multiple sources
        const [bookmarksResponse, achievementsResponse, progressResponse] = await Promise.all([
          getUserBookmarks(authState.user.id),
          getUserAchievements(),
          getUserReadingProgress(authState.user.id)
        ])

        const activityItems: ActivityItem[] = []

        // Add recent bookmarks
        if (bookmarksResponse?.body?.bookmarks) {
          bookmarksResponse.body.bookmarks.forEach((bookmark: any) => {
            activityItems.push({
              id: `bookmark-${bookmark.bookmark_id}`,
              title: `Bookmarked ${bookmark.type === 'chapter' ? 'Chapter' : 'Article'} ${bookmark.reference}: ${bookmark.title}`,
              time: formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true }),
              icon: <BookMarked className="h-4 w-4 text-[#1EB53A]" />,
              type: 'bookmark',
              timestamp: new Date(bookmark.created_at)
            })
          })
        }

        // Add recent achievements
        if (achievementsResponse?.body) {
          achievementsResponse.body
            .filter((achievement: any) => achievement.unlocked && achievement.unlocked_at)
            .forEach((achievement: any) => {
              activityItems.push({
                id: `achievement-${achievement.id}`,
                title: `Earned "${achievement.title}" achievement`,
                time: formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true }),
                icon: <Award className="h-4 w-4 text-[#1EB53A]" />,
                type: 'achievement',
                timestamp: new Date(achievement.unlocked_at)
              })
            })
        }

        // Add reading progress (simulate recent reading activity)
        if (progressResponse?.body?.progress) {
          const progress = progressResponse.body.progress
          if (progress.completed_chapters && progress.completed_chapters.length > 0) {
            // Add most recent chapter read (simulated)
            const recentChapter = progress.completed_chapters[progress.completed_chapters.length - 1]
            activityItems.push({
              id: `reading-chapter-${recentChapter}`,
              title: `Read Chapter ${recentChapter}`,
              time: formatDistanceToNow(new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), { addSuffix: true }),
              icon: <BookOpen className="h-4 w-4 text-[#1EB53A]" />,
              type: 'reading',
              timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
            })
          }
        }

        // Sort by timestamp (most recent first) and take top 5
        const sortedActivities = activityItems
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5)

        setActivities(sortedActivities)
      } catch (err) {
        console.error('Error fetching recent activity:', err)
        setError('Failed to load recent activity')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [authState?.user?.id])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="bg-gray-200 p-2 rounded-full animate-pulse">
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#1EB53A] hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[#1EB53A]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400 mt-1">Start reading to see your activity here</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="bg-[#1EB53A]/10 p-2 rounded-full">{activity.icon}</div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">{activity.title}</p>
                  <p className="text-xs text-[#6B7280]">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}