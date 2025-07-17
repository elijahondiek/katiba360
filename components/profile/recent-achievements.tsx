"use client"

import { useState, useEffect } from "react"
import { Star, Award, BookOpen, Shield, Gavel, Users, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { getUserAchievements } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

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
          // Filter unlocked achievements and sort by unlock date
          const unlockedAchievements = response.body
            .filter((achievement: any) => achievement.unlocked && achievement.unlocked_at)
            .sort((a: any, b: any) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
            .slice(0, 3) // Take top 3 recent achievements
            .map((achievement: any) => ({
              ...achievement,
              icon: getAchievementIcon(achievement.achievement_type)
            }))

          setAchievements(unlockedAchievements)
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
            <Star className="h-5 w-5 mr-2 text-[#1EB53A]" />
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
            <Star className="h-5 w-5 mr-2 text-[#1EB53A]" />
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
          <Star className="h-5 w-5 mr-2 text-[#1EB53A]" />
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