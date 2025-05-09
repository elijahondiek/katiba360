"use client"

import { Search, Menu, ChevronDown, BookOpen, Shield, Gavel, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Katiba360 Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl font-bold text-[#0A7B24]">{t("app.title")}</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/chapters" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.chapters")}
              </Link>
              <Link href="/rights" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.rights")}
              </Link>
              <Link href="/learn" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/about" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.about")}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-[#374151] hover:text-[#0A7B24] hover:bg-[#F3F4F6]">
                {t("auth.signin")}
              </Button>
              <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">{t("auth.signup")}</Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#F3F4F6] to-white py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-[#0A7B24] mb-4">{t("app.tagline")}</h1>
              <p className="text-lg md:text-xl text-[#4B5563] mb-8">{t("app.description")}</p>

              {/* Language Selector */}
              <div className="mb-8">
                <LanguageSelector />
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <Input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="pl-12 py-6 rounded-full border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
              </div>
            </div>
          </div>
        </section>

        {/* Chapter Navigation */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("home.explore")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Chapter Card 1 */}
              <Link href="/chapters/sovereignty">
                <div className="bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    <BookOpen className="h-6 w-6 text-[#1EB53A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("chapter.sovereignty")}</h3>
                  <p className="text-[#6B7280] flex-grow">{t("chapter.sovereignty.desc")}</p>
                  <div className="mt-4 text-[#0A7B24] font-medium flex items-center">
                    {t("nav.chapters")}
                    <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                  </div>
                </div>
              </Link>

              {/* Chapter Card 2 */}
              <Link href="/chapters/rights">
                <div className="bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    <Shield className="h-6 w-6 text-[#1EB53A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("chapter.rights")}</h3>
                  <p className="text-[#6B7280] flex-grow">{t("chapter.rights.desc")}</p>
                  <div className="mt-4 text-[#0A7B24] font-medium flex items-center">
                    {t("nav.chapters")}
                    <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                  </div>
                </div>
              </Link>

              {/* Chapter Card 3 */}
              <Link href="/chapters/governance">
                <div className="bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    <Gavel className="h-6 w-6 text-[#1EB53A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("chapter.governance")}</h3>
                  <p className="text-[#6B7280] flex-grow">{t("chapter.governance.desc")}</p>
                  <div className="mt-4 text-[#0A7B24] font-medium flex items-center">
                    {t("nav.chapters")}
                    <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                  </div>
                </div>
              </Link>

              {/* Chapter Card 4 */}
              <Link href="/chapters/devolution">
                <div className="bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl p-6 transition-all duration-200 h-full flex flex-col">
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    <Users className="h-6 w-6 text-[#1EB53A]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("chapter.devolution")}</h3>
                  <p className="text-[#6B7280] flex-grow">{t("chapter.devolution.desc")}</p>
                  <div className="mt-4 text-[#0A7B24] font-medium flex items-center">
                    {t("nav.chapters")}
                    <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10">
                {t("home.viewAllChapters")}
              </Button>
            </div>
          </div>
        </section>

        {/* Right of the Day */}
        <section className="py-12 bg-[#F3F4F6]">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("home.rightOfDay")}</h2>

            <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#CE1126]/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-[#CE1126]" />
                </div>
                <h3 className="text-xl font-bold">Right to Fair Administrative Action</h3>
              </div>

              <p className="text-[#374151] mb-4">
                Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable
                and procedurally fair.
              </p>

              <div className="bg-[#F3F4F6] rounded-lg p-4 mb-6">
                <p className="text-[#4B5563] italic">
                  "If a right or fundamental freedom of a person has been or is likely to be adversely affected by
                  administrative action, the person has the right to be given written reasons for the action."
                </p>
                <p className="text-[#6B7280] text-sm mt-2">— Article 47, Constitution of Kenya</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">{t("home.readFullArticle")}</Button>
                <Button variant="outline" className="border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]">
                  {t("home.shareRight")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Scenarios */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t("home.commonScenarios")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link href="/scenarios/arrest">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.arrest")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.arrest.desc")}</p>
                </div>
              </Link>

              <Link href="/scenarios/property">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.property")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.property.desc")}</p>
                </div>
              </Link>

              <Link href="/scenarios/services">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.services")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.services.desc")}</p>
                </div>
              </Link>

              <Link href="/scenarios/workplace">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.workplace")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.workplace.desc")}</p>
                </div>
              </Link>

              <Link href="/scenarios/healthcare">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.healthcare")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.healthcare.desc")}</p>
                </div>
              </Link>

              <Link href="/scenarios/education">
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 text-[#0A7B24]">{t("scenario.education")}</h3>
                  <p className="text-[#6B7280]">{t("scenario.education.desc")}</p>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10">
                {t("home.viewAllScenarios")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A7B24] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo-white.svg" alt="Katiba360 Logo" width={40} height={40} className="h-10 w-auto" />
                <span className="text-xl font-bold">{t("app.title")}</span>
              </div>
              <p className="text-[#E5E7EB]">{t("footer.mission")}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.explore")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/chapters" className="text-[#E5E7EB] hover:text-white">
                    {t("nav.chapters")}
                  </Link>
                </li>
                <li>
                  <Link href="/rights" className="text-[#E5E7EB] hover:text-white">
                    {t("nav.rights")}
                  </Link>
                </li>
                <li>
                  <Link href="/scenarios" className="text-[#E5E7EB] hover:text-white">
                    {t("home.commonScenarios")}
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="text-[#E5E7EB] hover:text-white">
                    {t("nav.learn")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.about")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-[#E5E7EB] hover:text-white">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-[#E5E7EB] hover:text-white">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-[#E5E7EB] hover:text-white">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#E5E7EB] hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.connect")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/newsletter" className="text-[#E5E7EB] hover:text-white">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com/katiba360" className="text-[#E5E7EB] hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://facebook.com/katiba360" className="text-[#E5E7EB] hover:text-white">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="https://instagram.com/katiba360" className="text-[#E5E7EB] hover:text-white">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1EB53A] mt-8 pt-8 text-center text-[#E5E7EB]">
            <p>
              &copy; {new Date().getFullYear()} Katiba360. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
