"use client"

import { BarChart, BookOpen, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReadingStats() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 text-[#1EB53A] mr-2" />
            <CardTitle>Reading Statistics</CardTitle>
          </div>
          <Tabs defaultValue="week" className="w-[240px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>Track your reading progress and engagement with the constitution.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-[#1EB53A]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Chapters Read</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-[#0A7B24]">12</p>
                  <p className="text-xs text-[#1EB53A]">+3 this week</p>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1EB53A] rounded-full" style={{ width: "60%" }}></div>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">12 of 20 chapters</p>
          </div>

          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-[#1EB53A]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Reading Time</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-[#0A7B24]">5.2</p>
                  <p className="text-xs text-[#1EB53A]">hours</p>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {[30, 45, 20, 60, 75, 40, 50].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-full bg-[#1EB53A] rounded-sm"
                    style={{ height: `${value}%`, maxHeight: "60px", minHeight: "4px" }}
                  ></div>
                  <span className="text-xs text-[#6B7280] mt-1">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-[#1EB53A]" />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Current Streak</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-[#0A7B24]">7</p>
                  <p className="text-xs text-[#1EB53A]">days</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-8 bg-[#1EB53A] rounded-sm flex items-center justify-center text-white text-xs font-medium"
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6B7280] mt-2 text-center">Keep it up! You're building a great habit.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
