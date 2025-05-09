"use client"

import { Play, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Scenario } from "@/contexts/learning-context"
import Link from "next/link"
import Image from "next/image"

interface ScenarioCardProps {
  scenario: Scenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <Card className="overflow-hidden hover:border-[#1EB53A] hover:shadow-sm transition-all h-full">
      <div className="relative h-40">
        <Image src={scenario.coverImage || "/placeholder.svg"} alt={scenario.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-2 right-2 bg-white text-[#0A7B24]">{scenario.category}</Badge>
        {scenario.completed && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-[#1EB53A] text-white">
              <CheckCircle className="h-3 w-3 mr-1" /> Completed
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-[#0A7B24]">{scenario.title}</CardTitle>
        <p className="text-sm text-[#4B5563]">{scenario.description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-[#6B7280]">
          <Clock className="h-4 w-4 mr-1" />
          <span>15-20 minutes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/learn/scenario/${scenario.id}`} className="w-full">
          <Button
            className={`w-full ${
              scenario.completed
                ? "bg-white text-[#1EB53A] border border-[#1EB53A]"
                : "bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
            }`}
          >
            {scenario.completed ? (
              "Play Again"
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" /> Start Scenario
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
