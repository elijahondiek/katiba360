"use client";

import { BookOpen, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShareDialog } from "@/components/ui/share-dialog";
import { cn } from "@/lib/utils";

interface Article {
  article_number: number;
  article_title: string;
}

interface ChapterSidebarProps {
  articles: Article[];
  activeSection: string | null;
  isBookmarked: boolean;
  isSimplified: boolean;
  onArticleClick: (articleNumber: number) => void;
  onBookmarkToggle: () => void;
  onSimplifiedChange: (value: boolean) => void;
  chapterNumber?: number;
  chapterTitle?: string;
}

export function ChapterSidebar({
  articles,
  activeSection,
  isBookmarked,
  isSimplified,
  onArticleClick,
  onBookmarkToggle,
  onSimplifiedChange,
  chapterNumber = 0,
  chapterTitle = "Chapter",
}: ChapterSidebarProps) {
  return (
    <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-[#1EB53A]" />
        <h3 className="font-bold text-lg">In This Chapter</h3>
      </div>

      <ul className="space-y-2 mb-6">
        {articles.map((article) => (
          <li key={article.article_number}>
            <button
              onClick={() => onArticleClick(article.article_number)}
              data-article-id={`article-${article.article_number}`}
              className={cn(
                "block w-full text-left p-2 rounded text-[#4B5563] hover:text-[#0A7B24] transition-colors",
                activeSection === article.article_number.toString()
                  ? "bg-[#E5E7EB] text-[#0A7B24] font-medium"
                  : "hover:bg-[#E5E7EB]",
              )}
            >
              Article {article.article_number}: {article.article_title ?? ""}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
        <h3 className="font-bold text-lg mb-4">Tools</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start text-[#4B5563]" onClick={onBookmarkToggle}>
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2 text-[#1EB53A]" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            {isBookmarked ? "Saved" : "Save for Later"}
          </Button>

          <ShareDialog
            title={`Chapter ${chapterNumber}: ${chapterTitle} - Katiba360`}
            description={`Learn about ${chapterTitle} in the Kenyan Constitution`}
            triggerButton={
              <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            }
          />

          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm text-[#4B5563]">Simplified Text</span>
            <Switch
              checked={isSimplified}
              onCheckedChange={onSimplifiedChange}
              className="data-[state=checked]:bg-[#1EB53A]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
