"use client"

import { BookOpen, Award, TrendingUp, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLearning } from "@/contexts/learning-context"
import { LearningPathCard } from "@/components/learning/learning-path-card"
import { AchievementCard } from "@/components/learning/achievement-card"
import Link from "next/link"

export function LearningDashboard() {
  const { learningPaths, achievements, getOverallProgress, getRecommendedContent } = useLearning()

  const overallProgress = getOverallProgress()
  const recommendedContent = getRecommendedContent()

  // Get earned achievements
  const earnedAchievements = achievements.filter((a) => a.earnedOn)

  // Get in-progress learning paths
  const inProgressPaths = learningPaths
    .filter((path) => path.progress > 0 && !path.completed)
    .sort((a, b) => b.progress - a.progress)

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0A7B24] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#0A7B24]">{overallProgress}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-[#E5E7EB]"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-[#1EB53A]"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${overallProgress * 2.51} 251`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-[#6B7280]">
                {learningPaths.filter((p) => p.completed).length} of {learningPaths.length} learning paths completed
              </p>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0A7B24] flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0A7B24]">{earnedAchievements.length}</p>
                <p className="text-sm text-[#6B7280]">of {achievements.length} earned</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/learn/achievements" className="w-full">
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-[#0A7B24] flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0A7B24]">3.5</p>
                <p className="text-sm text-[#6B7280]">hours spent learning</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="text-sm text-[#6B7280]">Last session: Yesterday, 25 minutes</p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Continue Learning */}
      {inProgressPaths.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0A7B24]">Continue Learning</h2>
            <Link href="/learn/paths">
              <Button variant="ghost" className="text-[#6B7280]">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressPaths.slice(0, 2).map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended For You */}
      {recommendedContent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0A7B24]">Recommended For You</h2>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recommendedContent.map((content) => {
                  // Check if it's a module or scenario
                  if ("level" in content) {
                    // It's a module
                    return (
                      <Link href={`/learn/module/${content.id}`} key={content.id}>
                        <div className="flex items-start justify-between hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">
                              <BookOpen className="h-5 w-5 text-[#1EB53A]" />
                            </div>
                            <div>
                              <h3 className="font-medium text-[#0A7B24]">{content.title}</h3>
                              <p className="text-sm text-[#6B7280]">{content.description}</p>
                              <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {content.duration}
                                </span>
                                <span className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {content.level}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                        </div>
                      </Link>
                    )
                  } else {
                    // It's a scenario
                    return (
                      <Link href={`/learn/scenario/${content.id}`} key={content.id}>
                        <div className="flex items-start justify-between hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">
                              <Award className="h-5 w-5 text-[#1EB53A]" />
                            </div>
                            <div>
                              <h3 className="font-medium text-[#0A7B24]">{content.title}</h3>
                              <p className="text-sm text-[#6B7280]">{content.description}</p>
                              <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1">
                                <span>{content.category}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                        </div>
                      </Link>
                    )
                  }
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Achievements */}
      {earnedAchievements.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0A7B24]">Recent Achievements</h2>
            <Link href="/learn/achievements">
              <Button variant="ghost" className="text-[#6B7280]">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedAchievements.slice(0, 4).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
