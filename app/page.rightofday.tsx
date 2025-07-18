import { Shield, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBillOfRights } from "@/hooks/useBillOfRights";
import { useLanguage } from "@/contexts/language-context";
import { ShareDialog } from "@/components/ui/share-dialog";
import { useScrollToSection } from "@/hooks/useScrollToSection";

export function RightOfDaySection() {
  const { currentRight, getCategoryIcon, getCategoryColor } = useBillOfRights();
  const { t } = useLanguage();
  const { navigateToSection } = useScrollToSection();

  // Show loading state or error
  if (!currentRight) return null;

  return (
    <section className="py-12 bg-[#F3F4F6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold">{t("home.rightOfDay")}</h2>
          </div>
          <p className="text-[#6B7280] text-sm">Discover your constitutional rights, one day at a time</p>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#E5E7EB]">
          {/* Constitutional Hierarchy Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-[#CE1126]/10 p-3 rounded-full flex-shrink-0">
                <Shield className="h-6 w-6 text-[#CE1126]" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#6B7280] font-medium mb-1">
                  Chapter Four - The Bill of Rights
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-[#0A7B24]">
                    {currentRight.article}: {currentRight.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(currentRight.category)}`}>
                    <span className="mr-1">{getCategoryIcon(currentRight.category)}</span>
                    {currentRight.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <p className="text-[#374151] text-lg leading-relaxed">
              {currentRight.description}
            </p>
          </div>

          {/* Key Provisions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#0A7B24]" />
              <h4 className="text-lg font-semibold text-[#0A7B24]">Key Provisions</h4>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
              <ul className="space-y-2">
                {currentRight.key_provisions.map((provision, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#0A7B24] text-sm mt-1">•</span>
                    <span className="text-[#374151] text-sm">{provision}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white flex items-center gap-2"
              onClick={() => {
                // Navigate to the chapter page
                const articleNumber = currentRight.article.replace('Article ', '');
                const url = `/chapters/4#article-${articleNumber}`;
                navigateToSection(url);
              }}
            >
              <BookOpen className="h-4 w-4" />
              {t("home.readFullArticle")}
            </Button>
            <ShareDialog 
              title={`${currentRight.article}: ${currentRight.title} - Katiba360`}
              description={`Learn about ${currentRight.title.toLowerCase()} in the Kenyan Constitution - ${currentRight.description}`}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/chapters/4#article-${currentRight.article.replace('Article ', '')}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
