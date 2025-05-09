"use client"

import { Award, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Achievement } from "@/contexts/learning-context"

interface AchievementCardProps {
  achievement: Achievement
  size?: "small" | "medium" | "large"
}

export function AchievementCard({ achievement, size = "medium" }: AchievementCardProps) {
  const isEarned = !!achievement.earnedOn
  const earnedDate = achievement.earnedOn
    ? new Date(achievement.earnedOn).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  if (size === "small") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-lg
            ${isEarned ? "bg-[#1EB53A]/10 text-[#1EB53A]" : "bg-[#F3F4F6] text-[#9CA3AF]"}
          `}
        >
          {achievement.icon}
        </div>
        <div>
          <p className={`font-medium ${isEarned ? "text-[#374151]" : "text-[#6B7280]"}`}>{achievement.title}</p>
          {isEarned ? (
            <p className="text-xs text-[#6B7280]">Earned on {earnedDate}</p>
          ) : (
            <div className="w-24 mt-1">
              <Progress value={achievement.progress || 0} className="h-1" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className={`overflow-hidden ${isEarned ? "" : "opacity-75"}`}>
      <div
        className={`
          h-2 w-full
          ${isEarned ? "bg-[#1EB53A]" : "bg-[#9CA3AF]"}
        `}
      />
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-3">
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center text-3xl
              ${isEarned ? "bg-[#1EB53A]/10 text-[#1EB53A]" : "bg-[#F3F4F6] text-[#9CA3AF]"}
            `}
          >
            {achievement.icon}
          </div>
        </div>

        <h3 className={`font-medium ${isEarned ? "text-[#0A7B24]" : "text-[#6B7280]"}`}>{achievement.title}</h3>
        <p className="text-sm text-[#6B7280] mt-1">{achievement.description}</p>

        {isEarned ? (
          <div className="mt-3 text-xs text-[#6B7280] flex items-center justify-center gap-1">
            <Award className="h-3 w-3" />
            Earned on {earnedDate}
          </div>
        ) : (
          <div className="mt-3">
            {achievement.progress !== undefined ? (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-1.5" />
              </div>
            ) : (
              <div className="text-xs text-[#6B7280] flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Not yet earned
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
