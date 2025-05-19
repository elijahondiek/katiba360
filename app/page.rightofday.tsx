import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getRightOfTheDay, Article } from "@/lib/rightOfDay";
import { useChapter4 } from "@/hooks/useChapter4";
import { useLanguage } from "@/contexts/language-context";
import { ShareDialog } from "@/components/ui/share-dialog";
import { useScrollToSection } from "@/hooks/useScrollToSection";

export function RightOfDaySection() {
  const { articles, isLoading, error } = useChapter4();
  const [right, setRight] = useState<Article | null>(null);
  const { t } = useLanguage();
  const { navigateToSection } = useScrollToSection();

  // Force update at midnight and when articles change
  useEffect(() => {
    // Function to update the right of the day
    const updateRightOfDay = () => {
      if (articles && articles.length > 0) {
        // Create a new Date object each time to get the current date
        const currentDate = new Date();
        setRight(getRightOfTheDay(articles, currentDate));
      }
    };
    
    // Update immediately
    updateRightOfDay();
    
    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Set a timeout to update at midnight
    const midnightTimeout = setTimeout(updateRightOfDay, timeUntilMidnight);
    
    // Clean up timeout on unmount
    return () => clearTimeout(midnightTimeout);
  }, [articles]);

  // Show loading state or error
  if (isLoading) return <div className="py-12 bg-[#F3F4F6] text-center">Loading rights...</div>;
  if (!right) return null;

  return (
    <section className="py-12 bg-[#F3F4F6]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("home.rightOfDay")}</h2>
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#CE1126]/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-[#CE1126]" />
            </div>
            <h3 className="text-xl font-bold">Article {right.article_number}: {right.article_title}</h3>
          </div>
          <div className="mb-4">
            {right.clauses.map((clause) => (
              <p className="text-[#374151] mb-2" key={clause.clause_number}>{clause.content}</p>
            ))}
          </div>
          {right.clauses.length > 0 && right.clauses[0].content && (
            <div className="bg-[#F3F4F6] rounded-lg p-4 mb-6">
              <p className="text-[#4B5563] italic">
                "{right.clauses[0].content}"
              </p>
              <p className="text-[#6B7280] text-sm mt-2">
                — Article {right.article_number}, Constitution of Kenya
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
              onClick={() => navigateToSection(`/chapters/4#article-${right.article_number}`)}
            >
              {t("home.readFullArticle")}
            </Button>
            <ShareDialog 
              title={`Article ${right.article_number}: ${right.article_title} - Katiba360`}
              description={`Learn about your right to ${right.article_title.toLowerCase()} in the Kenyan Constitution`}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/chapters/4#article-${right.article_number}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
