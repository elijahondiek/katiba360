"use client"

import { Clock, BookOpen, CheckCircle, Lock, AlertTriangle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { LearningModule, LearningPath } from "@/contexts/learning-context"
import Link from "next/link"

interface ModuleCardProps {
  module: LearningModule
  path: LearningPath
  isActive?: boolean
}

export function ModuleCard({ module, path, isActive = false }: ModuleCardProps) {
  // Check if prerequisites are met
  const prerequisitesMet = module.prerequisites.every((prereqId) => {
    return path.modules.some((m) => m.id === prereqId && m.completed)
  })

  // Get prerequisite modules that are not completed
  const missingPrerequisites = module.prerequisites
    .filter((prereqId) => !path.modules.some((m) => m.id === prereqId && m.completed))
    .map((prereqId) => path.modules.find((m) => m.id === prereqId))
    .filter(Boolean) as LearningModule[]

  const isLocked = !prerequisitesMet && module.prerequisites.length > 0

  return (
    <Card
      className={`
        transition-all
        ${isActive ? "border-[#1EB53A] shadow-sm" : "hover:border-[#1EB53A]/50 hover:shadow-sm"}
        ${isLocked ? "opacity-75" : ""}
      `}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-[#0A7B24] flex items-center gap-2">
            {module.title}
            {isLocked && <Lock className="h-4 w-4 text-[#6B7280]" />}
          </CardTitle>
          <Badge
            variant="outline"
            className={`
              ${
                module.completed
                  ? "bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20"
                  : module.progress > 0
                    ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                    : "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
              }
            `}
          >
            {module.completed ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </>
            ) : module.progress > 0 ? (
              "In Progress"
            ) : (
              "Not Started"
            )}
          </Badge>
        </div>
        <p className="text-sm text-[#4B5563]">{module.description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center text-[#6B7280]">
                <Clock className="h-4 w-4 mr-1" />
                {module.duration}
              </span>
              <span className="flex items-center text-[#6B7280]">
                <BookOpen className="h-4 w-4 mr-1" />
                {module.level}
              </span>
            </div>
          </div>

          {module.progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Progress</span>
                <span>{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="h-2" />
            </div>
          )}

          {isLocked && missingPrerequisites.length > 0 && (
            <div className="bg-[#F3F4F6] p-2 rounded text-xs text-[#6B7280]">
              <div className="flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-[#F59E0B] mt-0.5" />
                <div>
                  <p className="font-medium">Prerequisites needed:</p>
                  <ul className="list-disc list-inside mt-1">
                    {missingPrerequisites.map((prereq) => (
                      <li key={prereq.id}>{prereq.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          {module.completed ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1EB53A] font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Module Completed
              </span>
              <Link href={`/learn/module/${module.id}`}>
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </Link>
            </div>
          ) : (
            <Link href={`/learn/module/${module.id}`} className="w-full">
              <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white" disabled={isLocked}>
                {module.progress > 0 ? "Continue" : "Start"} Module
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
