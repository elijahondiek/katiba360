"use client"

import { useState, useEffect } from "react"
import { Star, Trophy, Award, BookOpen, Shield, Gavel, Users, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAchievements, getUserReadingProgress, getUserBookmarks } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { sharingService } from "@/services/sharing.service"

interface RecentAchievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked_at: string
  achievement_type: string
}

export function RecentAchievements({ onViewAll }: { onViewAll: () => void }) {
  const { authState } = useAuth()
  const [achievements, setAchievements] = useState<RecentAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentAchievements() {
      if (!authState?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await getUserAchievements()
        if (response?.body && Array.isArray(response.body)) {
          // If no achievements from backend, create default achievement templates
          let achievementsToProcess = response.body
          if (response.body.length === 0) {
            achievementsToProcess = [
              // Reading Achievements
              {
                id: 'first-chapter',
                achievement_type: 'chapter_completion',
                title: 'First Steps',
                description: 'Read your first chapter',
                progress: 0,
                unlocked: false,
                category: 'reading'
              },
              {
                id: 'chapter-explorer',
                achievement_type: 'chapter_completion',
                title: 'Chapter Explorer',
                description: 'Read 5 chapters',
                progress: 0,
                unlocked: false,
                category: 'reading'
              },
              {
                id: 'constitution-master',
                achievement_type: 'chapter_completion',
                title: 'Constitution Master',
                description: 'Read all 18 chapters',
                progress: 0,
                unlocked: false,
                category: 'reading'
              },
              // Engagement Achievements
              {
                id: 'week-streak',
                achievement_type: 'streak',
                title: 'Week Warrior',
                description: 'Maintain a 7-day reading streak',
                progress: 0,
                unlocked: false,
                category: 'engagement'
              },
              {
                id: 'month-streak',
                achievement_type: 'streak',
                title: 'Dedicated Scholar',
                description: 'Maintain a 30-day reading streak',
                progress: 0,
                unlocked: false,
                category: 'engagement'
              },
              {
                id: 'bookworm',
                achievement_type: 'reading',
                title: 'Bookworm',
                description: 'Read for 10 hours total',
                progress: 0,
                unlocked: false,
                category: 'engagement'
              },
              // Rights Achievements
              {
                id: 'rights-defender',
                achievement_type: 'bill_of_rights',
                title: 'Rights Defender',
                description: 'Complete the Bill of Rights chapter',
                progress: 0,
                unlocked: false,
                category: 'reading'
              },
              {
                id: 'article-scholar',
                achievement_type: 'reading',
                title: 'Article Scholar',
                description: 'Read 50 articles',
                progress: 0,
                unlocked: false,
                category: 'reading'
              },
              // Quiz Achievements
              {
                id: 'quiz-starter',
                achievement_type: 'quiz',
                title: 'Quiz Starter',
                description: 'Complete your first quiz',
                progress: 0,
                unlocked: false,
                category: 'quizzes'
              },
              {
                id: 'quiz-master',
                achievement_type: 'quiz',
                title: 'Quiz Master',
                description: 'Score 100% on 5 quizzes',
                progress: 0,
                unlocked: false,
                category: 'quizzes'
              },
              // Social Achievements
              {
                id: 'bookmark-collector',
                achievement_type: 'social',
                title: 'Bookmark Collector',
                description: 'Save 10 bookmarks',
                progress: 0,
                unlocked: false,
                category: 'social'
              },
              {
                id: 'sharing-citizen',
                achievement_type: 'sharing',
                title: 'Sharing Citizen',
                description: 'Share content 5 times',
                progress: 0,
                unlocked: false,
                category: 'social'
              }
            ]
          }

          // Now let's update progress based on actual user data
          try {
            // Get user's reading progress
            const progressResponse = await getUserReadingProgress(authState.user.id)
            const bookmarksResponse = await getUserBookmarks(authState.user.id)
            
            // Get user's sharing analytics
            const sharingAnalytics = await sharingService.getSharingAnalytics(365) // Get all-time sharing data
            
            // Helper function to calculate achievement earned date
            const calculateAchievementEarnedDate = (achievementId: string, progressData: any) => {
              // For reading-time based achievements, use the reading history to estimate when goal was reached
              if (achievementId === 'bookworm' && progressData.progress?.reading_history) {
                const readingHistory = progressData.progress.reading_history
                let cumulativeMinutes = 0
                const targetMinutes = 10 * 60 // 10 hours
                
                for (const session of readingHistory) {
                  cumulativeMinutes += session.time_spent_minutes || 0
                  if (cumulativeMinutes >= targetMinutes) {
                    return session.session_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Default to 1 week ago
                  }
                }
              }
              
              // For chapter-based achievements, use the chapter completion data
              if (achievementId === 'first-chapter' && progressData.progress?.chapter_progress) {
                const chapterProgress = progressData.progress.chapter_progress
                const firstCompletedChapter = Object.values(chapterProgress).find((chapter: any) => chapter.completed)
                if (firstCompletedChapter) {
                  return (firstCompletedChapter as any).completed_at || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                }
              }
              
              if (achievementId === 'chapter-explorer' && progressData.progress?.chapter_progress) {
                const chapterProgress = progressData.progress.chapter_progress
                const completedChapters = Object.values(chapterProgress).filter((chapter: any) => chapter.completed)
                if (completedChapters.length >= 5) {
                  // Use the 5th completed chapter's date
                  const sortedChapters = completedChapters.sort((a: any, b: any) => 
                    new Date(a.completed_at || 0).getTime() - new Date(b.completed_at || 0).getTime()
                  )
                  return sortedChapters[4]?.completed_at || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
                }
              }
              
              // Default fallback dates based on achievement type
              switch (achievementId) {
                case 'first-chapter':
                  return new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks ago
                case 'chapter-explorer':
                  return new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
                case 'bookworm':
                  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
                case 'constitution-master':
                  return new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
                case 'rights-defender':
                  return new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
                case 'bookmark-collector':
                  return new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
                case 'sharing-citizen':
                  return new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
                default:
                  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
              }
            }
            
            const updatedAchievements = achievementsToProcess.map(achievement => {
              let updated = { ...achievement }
              
              // Update chapter-based achievements
              if (progressResponse?.body?.progress) {
                const completedChapters = progressResponse.body.progress.completed_chapters?.length || 0
                const totalReadingMinutes = progressResponse.body.progress.total_read_time_minutes || 0
                
                if (achievement.id === 'first-chapter' && completedChapters >= 1) {
                  updated.progress = 100
                  updated.unlocked = true
                  updated.unlocked_at = calculateAchievementEarnedDate('first-chapter', progressResponse.body)
                } else if (achievement.id === 'chapter-explorer') {
                  updated.progress = Math.round(Math.min((completedChapters / 5) * 100, 100))
                  if (completedChapters >= 5) {
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('chapter-explorer', progressResponse.body)
                  }
                } else if (achievement.id === 'constitution-master') {
                  updated.progress = Math.round(Math.min((completedChapters / 18) * 100, 100))
                  if (completedChapters >= 18) {
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('constitution-master', progressResponse.body)
                  }
                } else if (achievement.id === 'bookworm') {
                  const totalHours = totalReadingMinutes / 60
                  updated.progress = Math.round(Math.min((totalHours / 10) * 100, 100))
                  if (totalHours >= 10) {
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('bookworm', progressResponse.body)
                  }
                } else if (achievement.id === 'article-scholar') {
                  const completedArticles = progressResponse.body.progress.completed_articles?.length || 0
                  updated.progress = Math.round(Math.min((completedArticles / 50) * 100, 100))
                  if (completedArticles >= 50) {
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('article-scholar', progressResponse.body)
                  }
                } else if (achievement.id === 'rights-defender') {
                  // Check if Chapter 4 (Bill of Rights) is completed
                  const completedChapters = progressResponse.body.progress.completed_chapters || []
                  if (completedChapters.includes('4')) {
                    updated.progress = 100
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('rights-defender', progressResponse.body)
                  }
                }
              }
              
              // Update bookmark achievements
              if (bookmarksResponse?.body?.bookmarks) {
                const bookmarkCount = bookmarksResponse.body.bookmarks.length
                if (achievement.id === 'bookmark-collector') {
                  updated.progress = Math.round(Math.min((bookmarkCount / 10) * 100, 100))
                  if (bookmarkCount >= 10) {
                    updated.unlocked = true
                    updated.unlocked_at = calculateAchievementEarnedDate('bookmark-collector', progressResponse.body)
                  }
                }
              }
              
              // Update sharing achievements
              if (sharingAnalytics && achievement.id === 'sharing-citizen') {
                const totalShares = sharingAnalytics.total_shares || 0
                updated.progress = Math.round(Math.min((totalShares / 5) * 100, 100))
                if (totalShares >= 5) {
                  updated.unlocked = true
                  updated.unlocked_at = calculateAchievementEarnedDate('sharing-citizen', progressResponse.body)
                }
              }
              
              return updated
            })
            
            // Filter unlocked achievements and sort by unlock date
            const unlockedAchievements = updatedAchievements
              .filter((achievement: any) => achievement.unlocked && achievement.unlocked_at)
              .sort((a: any, b: any) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
              .slice(0, 3) // Take top 3 recent achievements
              .map((achievement: any) => ({
                ...achievement,
                icon: getAchievementIcon(achievement.achievement_type)
              }))

            setAchievements(unlockedAchievements)
          } catch (error) {
            console.error('Error calculating achievement progress:', error)
            setAchievements([])
          }
        }
      } catch (err) {
        console.error('Error fetching recent achievements:', err)
        setError('Failed to load recent achievements')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentAchievements()
  }, [authState?.user?.id])

  const getAchievementIcon = (achievementType: string) => {
    switch (achievementType.toLowerCase()) {
      case 'reading':
      case 'chapter_completion':
        return <BookOpen className="h-4 w-4 text-[#1EB53A]" />
      case 'rights':
      case 'bill_of_rights':
        return <Shield className="h-4 w-4 text-[#1EB53A]" />
      case 'scenarios':
      case 'scenario_completion':
        return <Gavel className="h-4 w-4 text-[#1EB53A]" />
      case 'engagement':
      case 'streak':
        return <Clock className="h-4 w-4 text-[#1EB53A]" />
      case 'social':
      case 'sharing':
        return <Users className="h-4 w-4 text-[#1EB53A]" />
      case 'quiz':
      case 'quiz_completion':
        return <Star className="h-4 w-4 text-[#1EB53A]" />
      default:
        return <Award className="h-4 w-4 text-[#1EB53A]" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Recent Achievements
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
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10"
            disabled
          >
            View All Achievements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-[#1EB53A]" />
            Recent Achievements
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
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10"
            onClick={onViewAll}
          >
            View All Achievements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-[#1EB53A]" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-sm text-gray-400 mt-1">Keep reading to unlock achievements</p>
            </div>
          ) : (
            achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="bg-[#1EB53A]/10 p-2 rounded-full">{achievement.icon}</div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">{achievement.title}</p>
                  <p className="text-xs text-[#6B7280]">{achievement.description}</p>
                  <p className="text-xs text-[#1EB53A] mt-1 font-medium">
                    {formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      {achievements.length > 0 && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10"
            onClick={onViewAll}
          >
            View All Achievements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}