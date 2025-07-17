"use client"

import { useState, useEffect } from "react"
import { Award, BookOpen, Shield, Gavel, Users, Star, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAchievements, getUserReadingProgress, getUserBookmarks } from "@/lib/api"
import { ComingSoonChip } from "@/components/ui/coming-soon-chip"
import { sharingService } from "@/services/sharing.service"

interface AchievementItem {
  id: string
  achievement_type: string
  title: string
  description: string
  progress: number
  unlocked: boolean
  unlocked_at?: string
  category: string
}

export function Achievements() {
  const { authState } = useAuth()
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAchievements() {
      if (!authState?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await getUserAchievements()
        if (response?.body && Array.isArray(response.body)) {
          // If no achievements from backend, create default achievement templates
          if (response.body.length === 0) {
            const defaultAchievements: AchievementItem[] = [
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
                      return session.session_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
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
              
              const updatedAchievements = defaultAchievements.map(achievement => {
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
              
              setAchievements(updatedAchievements)
            } catch (error) {
              console.error('Error calculating achievement progress:', error)
              setAchievements(defaultAchievements)
            }
          } else {
            setAchievements(response.body)
          }
        }
      } catch (err) {
        console.error('Error fetching achievements:', err)
        setError('Failed to load achievements')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [authState?.user?.id])

  const getIcon = (achievementType: string) => {
    switch (achievementType.toLowerCase()) {
      case 'reading':
      case 'chapter_completion':
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
      case 'rights':
      case 'bill_of_rights':
        return <Shield className="h-5 w-5 text-[#1EB53A]" />
      case 'scenarios':
      case 'scenario_completion':
        return <Gavel className="h-5 w-5 text-[#1EB53A]" />
      case 'engagement':
      case 'streak':
        return <Clock className="h-5 w-5 text-[#1EB53A]" />
      case 'social':
      case 'sharing':
        return <Users className="h-5 w-5 text-[#1EB53A]" />
      case 'quiz':
      case 'quiz_completion':
        return <Star className="h-5 w-5 text-[#1EB53A]" />
      default:
        return <Award className="h-5 w-5 text-[#1EB53A]" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-[#1EB53A] mr-2" />
              <CardTitle>Your Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="h-16 bg-gray-200 rounded mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-[#1EB53A] mr-2" />
              <CardTitle>Your Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white px-4 py-2 rounded"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Group achievements by category
  const categories = {
    reading: { title: "Reading Achievements", icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" /> },
    scenarios: { title: "Scenario Achievements", icon: <Gavel className="h-5 w-5 text-[#1EB53A]" /> },
    engagement: { title: "Engagement Achievements", icon: <Clock className="h-5 w-5 text-[#1EB53A]" /> },
    social: { title: "Social Achievements", icon: <Users className="h-5 w-5 text-[#1EB53A]" /> },
    quizzes: { title: "Quiz Achievements", icon: <Star className="h-5 w-5 text-[#1EB53A]" /> },
  }

  const groupedAchievements = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = []
      }
      acc[achievement.category].push(achievement)
      return acc
    },
    {} as Record<string, typeof achievements>,
  )

  // Calculate overall progress
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const overallProgress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-[#1EB53A] mr-2" />
            <CardTitle>Your Achievements</CardTitle>
          </div>
          <CardDescription>
            Track your progress and unlock achievements as you explore the constitution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <div className="bg-[#1EB53A]/10 p-4 rounded-full">
              <Award className="h-10 w-10 text-[#1EB53A]" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="font-bold text-lg text-[#0A7B24]">Achievement Progress</h3>
              <p className="text-[#4B5563] mb-3">
                You've unlocked {unlockedCount} of {totalCount} achievements
              </p>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-[#6B7280]">Overall Progress</span>
                <span className="text-[#1EB53A] font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            {categories[category as keyof typeof categories]?.icon}
            <h2 className="text-xl font-bold text-[#0A7B24]">
              {categories[category as keyof typeof categories]?.title}
            </h2>
            {category === 'quizzes' && (
              <ComingSoonChip variant="profile" compact={true} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border ${achievement.unlocked ? "border-[#1EB53A]" : "border-gray-200"} rounded-lg p-4 ${
                  achievement.unlocked ? "bg-[#1EB53A]/5" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${achievement.unlocked ? "bg-[#1EB53A]/20" : "bg-[#F3F4F6]"}`}>
                    {getIcon(achievement.achievement_type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${achievement.unlocked ? "text-[#0A7B24]" : "text-[#374151]"}`}>
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && <CheckCircle2 className="h-5 w-5 text-[#1EB53A]" />}
                    </div>
                    <p className="text-sm text-[#4B5563] mt-1">{achievement.description}</p>

                    {achievement.unlocked ? (
                      <p className="text-xs text-[#1EB53A] mt-2 font-medium">
                        Unlocked on {achievement.unlocked_at ? formatDate(achievement.unlocked_at) : 'N/A'}
                      </p>
                    ) : (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-[#6B7280]">Progress</span>
                          <span className="text-[#6B7280]">{achievement.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1EB53A] rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
