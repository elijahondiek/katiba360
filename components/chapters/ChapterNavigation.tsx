"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useChapters } from "@/hooks/useChapters"

interface ChapterNavigationProps {
  currentChapter: number
  totalChapters?: number
}

export function ChapterNavigation({ 
  currentChapter, 
  totalChapters = 18 // Kenya Constitution has 18 chapters
}: ChapterNavigationProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { chapters } = useChapters()

  const hasPrevious = currentChapter > 1
  const hasNext = currentChapter < totalChapters

  // Create a map of chapter numbers to titles for quick lookup
  const chapterTitles = chapters.reduce((acc, chapter) => {
    acc[chapter.chapter_number] = chapter.chapter_title
    return acc
  }, {} as Record<number, string>)

  const previousChapterTitle = chapterTitles[currentChapter - 1]
  const nextChapterTitle = chapterTitles[currentChapter + 1]

  const handlePrevious = () => {
    if (hasPrevious) {
      router.push(`/chapters/${currentChapter - 1}`)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      router.push(`/chapters/${currentChapter + 1}`)
    }
  }

  return (
    <div className="border-t border-gray-200 py-8 mt-12">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Previous Chapter */}
          {hasPrevious ? (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center gap-3 px-6 py-4 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#1EB53A] transition-colors min-w-[200px] h-16"
            >
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="text-sm text-gray-500 mb-1">
                  {t("previous")?.charAt(0).toUpperCase() + t("previous")?.slice(1) ?? "Previous"}
                </div>
                <div className="font-semibold text-sm text-gray-900">
                  {t("chapter.label") ?? "Chapter"} {currentChapter - 1}
                </div>
                {previousChapterTitle && (
                  <div className="text-xs text-gray-600 truncate max-w-[150px]">
                    {previousChapterTitle}
                  </div>
                )}
              </div>
            </Button>
          ) : (
            <div className="min-w-[200px]" />
          )}

          {/* Chapter Progress Indicator */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {t("chapter.label") ?? "Chapter"} {currentChapter} {t("of") ?? "of"} {totalChapters}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalChapters }, (_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i + 1 === currentChapter
                      ? "bg-[#1EB53A]"
                      : i + 1 < currentChapter
                      ? "bg-[#1EB53A] opacity-50"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Chapter */}
          {hasNext ? (
            <Button
              variant="outline"
              onClick={handleNext}
              className="flex items-center gap-3 px-6 py-4 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#1EB53A] transition-colors min-w-[200px] h-16"
            >
              <div className="text-right min-w-0">
                <div className="text-sm text-gray-500 mb-1">
                  {t("next")?.charAt(0).toUpperCase() + t("next")?.slice(1) ?? "Next"}
                </div>
                <div className="font-semibold text-sm text-gray-900">
                  {t("chapter.label") ?? "Chapter"} {currentChapter + 1}
                </div>
                {nextChapterTitle && (
                  <div className="text-xs text-gray-600 truncate max-w-[150px]">
                    {nextChapterTitle}
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 flex-shrink-0" />
            </Button>
          ) : (
            <div className="min-w-[200px]" />
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          {/* Progress Indicator */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {t("chapter.label") ?? "Chapter"} {currentChapter} {t("of") ?? "of"} {totalChapters}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalChapters }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 === currentChapter
                      ? "bg-[#1EB53A]"
                      : i + 1 < currentChapter
                      ? "bg-[#1EB53A] opacity-50"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {/* Previous Chapter */}
            {hasPrevious ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#1EB53A] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <div className="text-center">
                  <div className="text-xs text-gray-500">
                    {t("previous")?.charAt(0).toUpperCase() + t("previous")?.slice(1) ?? "Previous"}
                  </div>
                  <div className="font-medium text-sm">
                    {t("chapter.label") ?? "Chapter"} {currentChapter - 1}
                  </div>
                </div>
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {/* Next Chapter */}
            {hasNext ? (
              <Button
                variant="outline"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#1EB53A] transition-colors"
              >
                <div className="text-center">
                  <div className="text-xs text-gray-500">
                    {t("next")?.charAt(0).toUpperCase() + t("next")?.slice(1) ?? "Next"}
                  </div>
                  <div className="font-medium text-sm">
                    {t("chapter.label") ?? "Chapter"} {currentChapter + 1}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>

      {/* Additional Navigation Options */}
      <div className="flex flex-col items-center gap-3 mt-8 pt-6 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={() => router.push('/chapters')}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          {t("home.viewAllChapters") ?? "View All Chapters"}
        </Button>
        
        {/* Keyboard Navigation Hint */}
        <div className="text-xs text-gray-400 hidden md:block">
          <span>Use ← → arrow keys to navigate between chapters</span>
        </div>
      </div>
    </div>
  )
}