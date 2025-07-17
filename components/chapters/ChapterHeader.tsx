"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface ChapterHeaderProps {
  chapterTitle: string;
  chapterNumber: number;
  totalChapters?: number;
}

export function ChapterHeader({ 
  chapterTitle, 
  chapterNumber, 
  totalChapters = 18
}: ChapterHeaderProps) {
  const { t } = useLanguage();

  const progressPercentage = (chapterNumber / totalChapters) * 100;
  const hasPrevious = chapterNumber > 1;
  const hasNext = chapterNumber < totalChapters;

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <Link href="/chapters" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24] transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chapters
        </Link>
      </div>

      <div className="container mx-auto px-4 pt-2 pb-6">
        <div className="bg-[#1EB53A]/10 rounded-xl p-6">
          {/* Progress Context & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-[#6B7280]" />
              <span className="text-sm text-[#6B7280]">Chapter {chapterNumber} of {totalChapters}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {hasPrevious && (
                <Link href={`/chapters/${chapterNumber - 1}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Ch. {chapterNumber - 1}
                  </Button>
                </Link>
              )}
              {hasNext && (
                <Link href={`/chapters/${chapterNumber + 1}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ch. {chapterNumber + 1}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-[#1EB53A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A7B24] leading-tight break-words">
            {chapterTitle}
          </h1>
        </div>
      </div>
    </>
  );
}
