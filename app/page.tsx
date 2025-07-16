"use client";

import {
  ChevronDown,
  BookOpen,
  Shield,
  Gavel,
  Users,
  Users2,
  Landmark,
  FileText,
  GraduationCap,
  Lock,
  Scale,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/AuthContext";

import { RightOfDaySection } from "./page.rightofday";
import { SearchBar } from "@/components/search/SearchBar";
import scenariosData from "@/data/scenarios";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#F3F4F6] to-white py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            {/* Simple AI Announcement Chip */}
            <div className="flex justify-center mb-8">
              <Link
                href="https://github.com/elijahondiek/katiba360"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-[#F0FFF4] text-[#0A7B24] rounded-full border border-[#1EB53A]/30 hover:bg-[#E6FFEC] transition-colors duration-200"
              >
                <Megaphone className="h-4 w-4 mr-1.5" />
                <span>
                  Whether you code, craft UX, translate or test – your talents can empower every Kenyan with Katiba360°!
                </span>
                <span className="ml-1 text-xs">→</span>
              </Link>
            </div>

            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-[#0A7B24] mb-4">
                {t("app.tagline")}
              </h1>
              <p className="text-lg md:text-xl text-[#4B5563] mb-6">
                {t("app.description")}
              </p>

              {/* Language Selector */}
              <div className="mb-8 flex justify-center">
                <LanguageSelector />
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-4">
                <SearchBar
                  placeholder={t("search.placeholder")}
                  className="w-full"
                />
                <div className="mt-2 text-center">
                  <Link
                    href="/search"
                    className="text-sm text-[#0A7B24] hover:text-[#1EB53A] hover:underline inline-flex items-center"
                  >
                    {t("search.advanced") || "Advanced Search"}
                    <ChevronDown className="h-3 w-3 ml-1 rotate-270" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Navigation */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {t("home.explore")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Featured Chapters */}
              {[
                {
                  id: 1,
                  href: "/chapters/1",
                  icon: <BookOpen className="h-6 w-6 text-[#1EB53A]" />,
                  title: t("chapter.sovereignty"),
                  description: t("chapter.sovereignty.desc"),
                },
                {
                  id: 4,
                  href: "/chapters/4",
                  icon: <Shield className="h-6 w-6 text-[#1EB53A]" />,
                  title: t("chapter.rights"),
                  description: t("chapter.rights.desc"),
                },
                {
                  id: 8,
                  href: "/chapters/8",
                  icon: <Gavel className="h-6 w-6 text-[#1EB53A]" />,
                  title: t("chapter.governance"),
                  description: t("chapter.governance.desc"),
                },
                {
                  id: 11,
                  href: "/chapters/11",
                  icon: <Users className="h-6 w-6 text-[#1EB53A]" />,
                  title: t("chapter.devolution"),
                  description: t("chapter.devolution.desc"),
                },
              ].map((chapter) => (
                <Link href={chapter.href} key={chapter.id}>
                  <div className="bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                    <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                      {chapter.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
                    <p className="text-[#6B7280] flex-grow">
                      {chapter.description}
                    </p>
                    <div className="mt-4 text-[#0A7B24] font-medium flex items-center">
                      {t("nav.chapters")}
                      <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/chapters">
                <Button
                  variant="outline"
                  className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10"
                >
                  {t("home.viewAllChapters")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Right of the Day */}
        <RightOfDaySection />

        {/* Common Scenarios Section */}
        <section className="py-12 px-4 bg-[#F9FAFB]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#0A7B24] mb-4">
                {t("home.commonScenarios")}
              </h2>
              <p className="text-[#4B5563] max-w-3xl mx-auto">
                {t("home.commonScenariosDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Display only popular scenarios from the imported data */}
              {scenariosData.categories
                .filter((category) => category.popular)
                .map((category) => (
                  <Link
                    href={`/scenarios?category=${category.id}`}
                    key={category.id}
                  >
                    <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md relative">
                      {category.popular && (
                        <div className="absolute top-4 right-4 bg-[#CE1126] text-white text-xs font-medium px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                        {category.id === "arrest" && (
                          <Gavel className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "protest" && (
                          <Users2 className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "property" && (
                          <Landmark className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "services" && (
                          <FileText className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "workplace" && (
                          <Users className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "education" && (
                          <GraduationCap className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "digital" && (
                          <Lock className="h-6 w-6 text-[#1EB53A]" />
                        )}
                        {category.id === "accountability" && (
                          <Scale className="h-6 w-6 text-[#1EB53A]" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">
                        {category.title}
                      </h3>
                      <p className="text-[#6B7280]">{category.description}</p>
                    </div>
                  </Link>
                ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/scenarios">
                <Button
                  variant="outline"
                  className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10"
                >
                  {t("home.viewAllScenarios")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
