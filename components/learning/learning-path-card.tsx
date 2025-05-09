"use client"

import { BookOpen, CheckCircle, Clock, Award, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { LearningPath } from "@/contexts/learning-context"
import Link from "next/link"

interface LearningPathCardProps {
  path: LearningPath
  compact?: boolean
}

export function LearningPathCard({ path, compact = false }: LearningPathCardProps) {
  const totalModules = path.modules.length
  const completedModules = path.modules.filter((module) => module.completed).length
  const inProgressModules = path.modules.filter((module) => !module.completed && module.progress > 0).length

  // Calculate total duration
  const totalDuration = path.modules.reduce((total, module) => {
    const minutes = Number.parseInt(module.duration.split(" ")[0])
    return total + minutes
  }, 0)

  // Find the next module to continue
  const nextModule = path.modules.find((module) => {
    // If module is not completed and has progress, it's in progress
    if (!module.completed && module.progress > 0) return true

    // If module is not completed and has no prerequisites, it's available
    if (!module.completed && module.prerequisites.length === 0) return true

    // If module is not completed and all prerequisites are completed, it's available
    if (!module.completed) {
      return module.prerequisites.every((prereqId) => path.modules.some((m) => m.id === prereqId && m.completed))
    }

    return false
  })

  if (compact) {
    return (
      <Card className="hover:border-[#1EB53A] transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-[#0A7B24]">{path.title}</h3>
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-1">
                <span className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {totalModules} modules
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {totalDuration} min
                </span>
              </div>
            </div>
            {path.completed ? (
              <Badge className="bg-[#1EB53A] text-white">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
                {path.progress}% Complete
              </Badge>
            )}
          </div>

          <Progress value={path.progress} className="h-1.5 mt-3" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:border-[#1EB53A] hover:shadow-sm transition-all h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-[#0A7B24]">{path.title}</CardTitle>
          {path.completed && path.certificate && (
            <Badge className="bg-[#1EB53A] text-white">
              <Award className="h-3 w-3 mr-1" /> Certified
            </Badge>
          )}
        </div>
        <p className="text-sm text-[#4B5563]">{path.description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center text-[#6B7280]">
                <BookOpen className="h-4 w-4 mr-1" />
                {totalModules} modules
              </span>
              <span className="flex items-center text-[#6B7280]">
                <Clock className="h-4 w-4 mr-1" />
                {totalDuration} min
              </span>
            </div>
            <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
              {completedModules} / {totalModules} completed
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#6B7280]">
              <span>Progress</span>
              <span>{path.progress}%</span>
            </div>
            <Progress value={path.progress} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          {path.completed ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1EB53A] font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Path Completed
              </span>
              <Link href={`/learn/certificate/${path.id}`}>
                <Button variant="outline" size="sm" className="text-[#1EB53A] border-[#1EB53A]">
                  <Award className="h-4 w-4 mr-1" />
                  View Certificate
                </Button>
              </Link>
            </div>
          ) : nextModule ? (
            <Link href={`/learn/module/${nextModule.id}`} className="w-full">
              <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                {inProgressModules > 0 ? "Continue Learning" : "Start Learning"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link href={`/learn/path/${path.id}`} className="w-full">
              <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                View Path
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
