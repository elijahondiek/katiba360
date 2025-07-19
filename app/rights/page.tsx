"use client"

import { Search, Filter, Shield, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useChapter4 } from "@/hooks/useChapter4"
import { Article } from "@/lib/rightOfDay"
import Loading from "./loading"

// Define categories outside component to prevent recreation
const RIGHTS_CATEGORIES = [
  { id: "civil", name: "Civil and Political", articles: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42] },
  { id: "economic", name: "Economic and Social", articles: [43, 44, 45, 46, 47, 48, 49, 50, 51] },
  { id: "cultural", name: "Cultural", articles: [44, 52, 53, 54, 55, 56, 57] }
];

export default function RightsPage() {
  const { language, t } = useLanguage();
  const { articles, isLoading, error } = useChapter4();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles based on search query and selected category
  const filteredArticles = useMemo(() => {
    if (!articles || articles.length === 0) {
      return [];
    }

    let filtered = [...articles];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.article_title.toLowerCase().includes(query) ||
        (article.clauses && article.clauses.some(clause => 
          clause.content && clause.content.toLowerCase().includes(query)
        ))
      );
    }

    // Filter by category
    if (selectedCategory) {
      const categoryArticles = RIGHTS_CATEGORIES.find(cat => cat.id === selectedCategory)?.articles || [];
      filtered = filtered.filter(article => categoryArticles.includes(article.article_number));
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory]);

  // Handle category selection
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Get category name for an article
  const getArticleCategory = (articleNumber: number): string => {
    for (const category of RIGHTS_CATEGORIES) {
      if (category.articles.includes(articleNumber)) {
        return category.name;
      }
    }
    return "Other Rights";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Loading />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <span className="text-[#CE1126] text-xl font-bold">
                Failed to load rights. Please try again later.
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-4">{t("chapter.rights")}</h1>
          <p className="text-[#4B5563] mb-8">
            The Bill of Rights is an integral part of Kenya's democratic state and is the framework for social, economic
            and cultural policies. Explore all the rights guaranteed by the Constitution of Kenya.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder={t("search.placeholder")} 
                className="pl-10 py-2 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-[#6B7280]" />
                </button>
              )}
            </div>
            {selectedCategory && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-[#CE1126] text-[#CE1126] hover:bg-[#CE1126]/10"
                onClick={() => setSelectedCategory(null)}
              >
                <X className="h-4 w-4" />
                Clear Filter
              </Button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button 
              className={selectedCategory === null ? "bg-[#1EB53A] hover:bg-[#0A7B24] text-white" : "border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]"}
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => handleCategoryClick(null)}
            >
              All Rights
            </Button>
            {RIGHTS_CATEGORIES.map(category => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"} 
                className={selectedCategory === category.id 
                  ? "bg-[#1EB53A] hover:bg-[#0A7B24] text-white" 
                  : "border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]"}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Rights List */}
          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-[#6B7280] text-xl">
                  No rights found matching your search criteria.
                </span>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <Link href={`/chapters/4#article-${article.article_number}`} key={article.article_number}>
                  <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1EB53A]/10 p-3 rounded-full">
                        <Shield className="h-5 w-5 text-[#1EB53A]" />
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h2 className="text-xl font-bold text-[#0A7B24]">{article.article_title}</h2>
                          <span className="text-sm font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded sm:ml-2">
                            Article {article.article_number}
                          </span>
                        </div>
                        <p className="text-[#4B5563] mb-2">
                          {article.clauses && article.clauses[0]?.content || "No description available."}
                        </p>
                        <span className="text-xs font-medium text-[#6B7280]">
                          {getArticleCategory(article.article_number)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
