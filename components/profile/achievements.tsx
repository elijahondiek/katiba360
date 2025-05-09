"use client"

import { Award, BookOpen, Shield, Gavel, Users, Star, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Achievements() {
  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: "Constitution Explorer",
      description: "Read all chapters of the Constitution",
      icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
      progress: 60,
      unlocked: false,
      category: "reading",
    },
    {
      id: 2,
      title: "Rights Advocate",
      description: "Complete the Bill of Rights section",
      icon: <Shield className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
      unlocked: true,
      category: "reading",
      date: "May 3, 2023",
    },
    {
      id: 3,
      title: "Scenario Master",
      description: "Complete all constitutional scenarios",
      icon: <Gavel className="h-5 w-5 text-[#1EB53A]" />,
      progress: 40,
      unlocked: false,
      category: "scenarios",
    },
    {
      id: 4,
      title: "Dedicated Learner",
      description: "Maintain a 7-day reading streak",
      icon: <Clock className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
      unlocked: true,
      category: "engagement",
      date: "May 5, 2023",
    },
    {
      id: 5,
      title: "Knowledge Sharer",
      description: "Share content with 5 people",
      icon: <Users className="h-5 w-5 text-[#1EB53A]" />,
      progress: 60,
      unlocked: false,
      category: "social",
    },
    {
      id: 6,
      title: "Quiz Champion",
      description: "Score 100% on 3 constitutional quizzes",
      icon: <Star className="h-5 w-5 text-[#1EB53A]" />,
      progress: 67,
      unlocked: false,
      category: "quizzes",
    },
    {
      id: 7,
      title: "Devolution Expert",
      description: "Complete the chapter on devolution",
      icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
      unlocked: true,
      category: "reading",
      date: "Apr 28, 2023",
    },
    {
      id: 8,
      title: "Offline Reader",
      description: "Download and read content offline",
      icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
      unlocked: true,
      category: "engagement",
      date: "Apr 25, 2023",
    },
  ]

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
  const overallProgress = Math.round((unlockedCount / totalCount) * 100)

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
                    {achievement.icon}
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
                      <p className="text-xs text-[#1EB53A] mt-2 font-medium">Unlocked on {achievement.date}</p>
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
