"use client"

import { ArrowLeft, Shield, BookOpen, Scale, FileText, ExternalLink, Gavel } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

// This would typically come from a database or API
const rightsDetails = {
  "fair-admin": {
    title: "Right to Fair Administrative Action",
    article: "Article 47",
    description:
      "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
    category: "Civil and Political Rights",
    fullText: `
      <p>1. Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.</p>
      <p>2. If a right or fundamental freedom of a person has been or is likely to be adversely affected by administrative action, the person has the right to be given written reasons for the action.</p>
      <p>3. Parliament shall enact legislation to give effect to the rights in clause (1) and that legislation shall—</p>
      <ul>
        <li>provide for the review of administrative action by a court or, if appropriate, an independent and impartial tribunal; and</li>
        <li>promote efficient administration.</li>
      </ul>
    `,
    plainLanguage: `
      <p>This right means that when a government official, department, or agency makes a decision that affects you, they must:</p>
      <ul>
        <li>Act quickly and efficiently</li>
        <li>Follow the law</li>
        <li>Be reasonable</li>
        <li>Follow fair procedures</li>
        <li>Give you written reasons if their decision affects your rights negatively</li>
      </ul>
      <p>If you believe a government body has not followed these principles, you can ask a court to review their decision.</p>
    `,
    examples: [
      {
        title: "License Revocation",
        description:
          "If a government agency revokes your business license, they must inform you why they did so in writing and give you a chance to respond.",
      },
      {
        title: "Land Allocation",
        description:
          "If you apply for land allocation and are denied, the relevant authority must provide reasons for the denial and follow proper procedures.",
      },
      {
        title: "Service Denial",
        description:
          "If a government office refuses to provide a service you're entitled to, they must explain why and follow fair procedures.",
      },
    ],
    relatedLaws: [
      {
        title: "Fair Administrative Action Act, 2015",
        description:
          "This Act gives effect to Article 47 of the Constitution by providing detailed procedures for fair administrative action.",
      },
    ],
    courtCases: [
      {
        title:
          "Republic v Public Procurement Administrative Review Board & another Ex-Parte Selex Sistemi Integrati (2008)",
        description: "The court held that administrative bodies must act fairly and give reasons for their decisions.",
      },
      {
        title: "Kenya Medical Supplies Authority v Biomedical Equipment & Supplies Ltd (2020)",
        description: "The court emphasized the importance of procedural fairness in administrative actions.",
      },
    ],
  },
}

// Translation mapping for rights details
const rightsDetailsTranslations = {
  en: rightsDetails,
  sw: {
    "fair-admin": {
      title: "Haki ya Hatua za Utawala Zinazofaa",
      article: "Kifungu 47",
      description:
        "Kila mtu ana haki ya hatua za utawala ambazo ni za haraka, zenye ufanisi, za kisheria, za busara na zinazofuata taratibu.",
      category: "Haki za Kiraia na Kisiasa",
      fullText: `
        <p>1. Kila mtu ana haki ya hatua za utawala ambazo ni za haraka, zenye ufanisi, za kisheria, za busara na zinazofuata taratibu.</p>
        <p>2. Ikiwa haki au uhuru wa msingi wa mtu umeathiriwa vibaya au unaweza kuathiriwa vibaya na hatua za utawala, mtu huyo ana haki ya kupewa sababu za maandishi za hatua hiyo.</p>
        <p>3. Bunge litapitisha sheria ili kutekeleza haki katika kifungu cha (1) na sheria hiyo itakuwa—</p>
        <ul>
          <li>kutoa mapitio ya hatua za utawala na mahakama au, ikifaa, mahakama huru na isiyopendelea; na</li>
          <li>kukuza utawala wenye ufanisi.</li>
        </ul>
      `,
      plainLanguage: `
        <p>Haki hii inamaanisha kwamba wakati afisa wa serikali, idara, au wakala anafanya uamuzi unaokuathiri, lazima:</p>
        <ul>
          <li>Kutenda haraka na kwa ufanisi</li>
          <li>Kufuata sheria</li>
          <li>Kuwa na busara</li>
          <li>Kufuata taratibu za haki</li>
          <li>Kukupa sababu za maandishi ikiwa uamuzi wao unaathiri haki zako vibaya</li>
        </ul>
        <p>Ikiwa unaamini kuwa chombo cha serikali hakijafuata kanuni hizi, unaweza kuomba mahakama kupitia uamuzi wao.</p>
      `,
      examples: [
        {
          title: "Kufutwa kwa Leseni",
          description:
            "Ikiwa wakala wa serikali unafuta leseni yako ya biashara, lazima wakujulishe kwa nini walifanya hivyo kwa maandishi na kukupa nafasi ya kujibu.",
        },
        {
          title: "Ugawaji wa Ardhi",
          description:
            "Ikiwa unaomba ugawaji wa ardhi na unakataliwa, mamlaka husika lazima itoe sababu za kukataa na kufuata taratibu zinazofaa.",
        },
        {
          title: "Kukataliwa kwa Huduma",
          description:
            "Ikiwa ofisi ya serikali inakataa kutoa huduma unayostahili, lazima waeleze kwa nini na kufuata taratibu za haki.",
        },
      ],
      relatedLaws: [
        {
          title: "Sheria ya Hatua za Utawala Zinazofaa, 2015",
          description:
            "Sheria hii inatekeleza Kifungu cha 47 cha Katiba kwa kutoa taratibu za kina za hatua za utawala zinazofaa.",
        },
      ],
      courtCases: [
        {
          title:
            "Jamhuri dhidi ya Bodi ya Mapitio ya Utawala wa Ununuzi wa Umma na mwingine Ex-Parte Selex Sistemi Integrati (2008)",
          description:
            "Mahakama ilisema kuwa vyombo vya utawala lazima vitende kwa haki na kutoa sababu za maamuzi yao.",
        },
        {
          title: "Mamlaka ya Vifaa vya Matibabu ya Kenya dhidi ya Biomedical Equipment & Supplies Ltd (2020)",
          description: "Mahakama ilisisitiza umuhimu wa haki ya taratibu katika hatua za utawala.",
        },
      ],
    },
  },
  // Other languages
}

import React from 'react'

export default function RightDetailPage({ params }: { params: { id: string } }) {
  const { language, t } = useLanguage()

  // Unwrap params with React.use()
  const resolvedParams = React.use(params)

  // Get the appropriate content based on the current language
  const translatedRightsDetails =
    rightsDetailsTranslations[language as keyof typeof rightsDetailsTranslations] || rightsDetails
  const right = translatedRightsDetails[resolvedParams.id as keyof typeof translatedRightsDetails]

  if (!right) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0A7B24] mb-4">Right Not Found</h1>
          <p className="text-[#6B7280] mb-6">The right you're looking for doesn't exist.</p>
          <Link href="/rights">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">View All Rights</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Katiba360 Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold text-[#0A7B24]">{t("app.title")}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/chapters" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.chapters")}
              </Link>
              <Link href="/rights" className="text-[#0A7B24] font-medium">
                {t("nav.rights")}
              </Link>
              <Link href="/learn" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/about" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.about")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/rights" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Rights
          </Link>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="order-2 md:order-1">
            <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-[#1EB53A]" />
                <h3 className="font-bold text-lg">On This Page</h3>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="#overview"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="#full-text"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Full Text
                  </Link>
                </li>
                <li>
                  <Link
                    href="#plain-language"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Plain Language
                  </Link>
                </li>
                <li>
                  <Link
                    href="#examples"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Examples
                  </Link>
                </li>
                <li>
                  <Link
                    href="#related-laws"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Related Laws
                  </Link>
                </li>
                <li>
                  <Link
                    href="#court-cases"
                    className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                  >
                    Court Cases
                  </Link>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <h3 className="font-bold text-lg mb-4">Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="order-1 md:order-2">
            <div id="overview" className="bg-[#1EB53A]/10 rounded-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-[#0A7B24]">{right.title}</h1>
                <span className="text-sm font-medium text-[#6B7280] bg-white px-2 py-1 rounded sm:ml-2">
                  {right.article}
                </span>
              </div>
              <p className="text-[#4B5563] mb-2">{right.description}</p>
              <span className="text-xs font-medium text-[#6B7280]">{right.category}</span>
            </div>

            <div id="full-text" className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-[#1EB53A]" />
                <h2 className="text-xl font-bold">Full Text</h2>
              </div>
              <div className="prose prose-green max-w-none">
                <div dangerouslySetInnerHTML={{ __html: right.fullText }} />
              </div>
            </div>

            <div id="plain-language" className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-[#1EB53A]" />
                <h2 className="text-xl font-bold">Plain Language Explanation</h2>
              </div>
              <div className="prose prose-green max-w-none">
                <div dangerouslySetInnerHTML={{ __html: right.plainLanguage }} />
              </div>
            </div>

            <div id="examples" className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-[#1EB53A]" />
                <h2 className="text-xl font-bold">Examples</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {right.examples.map((example, index) => (
                  <div key={index} className="border border-[#E5E7EB] rounded-lg p-4">
                    <h3 className="font-bold text-[#0A7B24] mb-2">{example.title}</h3>
                    <p className="text-sm text-[#4B5563]">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="related-laws" className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-[#1EB53A]" />
                <h2 className="text-xl font-bold">Related Laws</h2>
              </div>
              <div className="space-y-4">
                {right.relatedLaws.map((law, index) => (
                  <div key={index} className="border border-[#E5E7EB] rounded-lg p-4">
                    <h3 className="font-bold text-[#0A7B24] mb-2">{law.title}</h3>
                    <p className="text-sm text-[#4B5563] mb-2">{law.description}</p>
                    <Link href="#" className="text-sm text-[#1EB53A] hover:text-[#0A7B24] inline-flex items-center">
                      Read the full law
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div id="court-cases" className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-5 w-5 text-[#1EB53A]" />
                <h2 className="text-xl font-bold">Court Cases</h2>
              </div>
              <div className="space-y-4">
                {right.courtCases.map((case_, index) => (
                  <div key={index} className="border border-[#E5E7EB] rounded-lg p-4">
                    <h3 className="font-bold text-[#0A7B24] mb-2">{case_.title}</h3>
                    <p className="text-sm text-[#4B5563] mb-2">{case_.description}</p>
                    <Link href="#" className="text-sm text-[#1EB53A] hover:text-[#0A7B24] inline-flex items-center">
                      Read the full case
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <h3 className="text-xl font-bold mb-4">Related Rights</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/rights/fair-hearing">
                  <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                    <h4 className="font-bold text-[#0A7B24]">Right to Fair Hearing</h4>
                    <p className="text-sm text-[#6B7280]">
                      Article 50: Every person has the right to have disputes resolved in a fair and public hearing.
                    </p>
                  </div>
                </Link>
                <Link href="/rights/access-information">
                  <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                    <h4 className="font-bold text-[#0A7B24]">Right to Access Information</h4>
                    <p className="text-sm text-[#6B7280]">
                      Article 35: Every citizen has the right of access to information held by the State.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A7B24] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Katiba360. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
