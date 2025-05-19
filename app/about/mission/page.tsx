"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function MissionPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal with Border style */}
      <section className="relative py-24 md:py-28 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/about"
              className="inline-flex items-center text-[#1EB53A] font-medium hover:text-[#0A7B24] transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="border-b border-[#1EB53A] hover:border-[#0A7B24] transition-colors duration-300">
                Back to About
              </span>
            </Link>

            <div className="border-l-4 border-[#1EB53A] pl-8">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">Our Mission</h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                Making Kenya's constitution accessible to everyone through simple language and practical examples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Content - Enhanced with minimal style */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              {/* Vision Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-4 flex items-center">
                  <span className="w-8 h-[2px] bg-[#1EB53A] mr-4 hidden md:block"></span>
                  Our Vision
                </h2>
                <p className="text-lg text-[#4B5563] leading-relaxed pl-0 md:pl-12">
                  We envision a Kenya where every citizen understands their constitutional rights and responsibilities,
                  empowering them to participate fully in the nation's democratic processes.
                </p>
              </div>

              {/* Mission Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-4 flex items-center">
                  <span className="w-8 h-[2px] bg-[#1EB53A] mr-4 hidden md:block"></span>
                  Our Mission
                </h2>
                <p className="text-lg text-[#4B5563] leading-relaxed pl-0 md:pl-12">
                  Katiba360 exists to make Kenya's constitution accessible, understandable, and actionable for all
                  citizens, regardless of their educational background, language preference, or technical expertise.
                </p>
              </div>

              {/* Values Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                  <span className="w-8 h-[2px] bg-[#1EB53A] mr-4 hidden md:block"></span>
                  Our Values
                </h2>
                <ul className="space-y-4 pl-0 md:pl-12">
                  {[
                    {
                      title: "Accessibility",
                      description:
                        "We believe constitutional knowledge should be available to everyone, not just legal experts.",
                    },
                    {
                      title: "Simplicity",
                      description: "We transform complex legal language into clear, straightforward explanations.",
                    },
                    {
                      title: "Inclusivity",
                      description: "We provide content in multiple languages and formats to reach all Kenyans.",
                    },
                    {
                      title: "Accuracy",
                      description: "While simplifying, we maintain the integrity and meaning of the constitution.",
                    },
                    {
                      title: "Empowerment",
                      description: "We equip citizens with knowledge that helps them advocate for their rights.",
                    },
                  ].map((value, index) => (
                    <li key={index} className="flex">
                      <div className="mr-4 mt-1">
                        <div className="w-4 h-4 rounded-full border-2 border-[#1EB53A]"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0A7B24]">{value.title}</h3>
                        <p className="text-[#4B5563]">{value.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approach Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-4 flex items-center">
                  <span className="w-8 h-[2px] bg-[#1EB53A] mr-4 hidden md:block"></span>
                  Our Approach
                </h2>
                <p className="text-lg text-[#4B5563] leading-relaxed pl-0 md:pl-12">
                  We use plain language, practical examples, and modern technology to make constitutional concepts
                  relatable to everyday life. Our platform is designed to be user-friendly, interactive, and accessible
                  across various devices, including feature phones common in rural Kenya.
                </p>
              </div>

              {/* Quote Block - Matching the clean style in the screenshot */}
              <div className="pl-0 md:pl-12">
                <div className="relative bg-[#F9FAFB] p-8 rounded-lg border-l-4 border-[#1EB53A]">
                  <p className="italic text-[#4B5563] text-lg">
                    The sovereign power belongs to the people of Kenya and shall be exercised only in accordance with
                    this Constitution.
                  </p>
                  <p className="text-right text-[#6B7280] mt-4">— Constitution of Kenya, Article 1(1)</p>
                </div>
              </div>

              {/* Closing Statement */}
              <div className="pl-0 md:pl-12">
                <p className="text-lg text-[#4B5563] leading-relaxed">
                  We believe that by making the constitution accessible to all Kenyans, we contribute to building a more
                  informed, engaged, and democratic society where the sovereign power truly belongs to the people.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
