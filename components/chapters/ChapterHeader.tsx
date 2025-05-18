"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ChapterHeaderProps {
  chapterTitle: string;
  chapterNumber: number;
}

export function ChapterHeader({ chapterTitle, chapterNumber }: ChapterHeaderProps) {
  const { t } = useLanguage();

  return (
    <>

      <div className="container mx-auto px-4 py-4">
        <Link href="/chapters" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chapters
        </Link>
      </div>

      <div className="container mx-auto px-4 pt-2 pb-4">
        <div className="bg-[#1EB53A]/10 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-[#0A7B24] mb-2 break-words">{chapterTitle}</h1>
          <p className="text-[#4B5563]">{chapterNumber && `Chapter ${chapterNumber}`}</p>
        </div>
      </div>
    </>
  );
}
