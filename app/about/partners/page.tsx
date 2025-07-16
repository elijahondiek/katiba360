"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Twitter,
  ExternalLink,
  Handshake,
  Code,
  Users,
  Globe,
  BookOpen,
  MessageSquare,
  Shield,
  Laptop,
  UserCircle,
  Heart,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function PartnersPage() {
  const { t } = useLanguage()

  // Partner profile data
  const partnerProfiles = [
    {
      name: "The People of Kenya & Kenyan Developer Community",
      role: "Technical Contributors",
      bio: "Open-source collaborators and civic tech advocates advancing digital civic education in Kenya.",
      isConceptual: true,
      focus: [
        "Code contributions",
        "Testing & QA",
        "Community feedback",
        "Civic tech advocacy",
      ],
    },
  ];
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal with Border style (matching Team page) */}
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
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">Our Partners</h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                Meet the organizations and individuals who collaborate with us to make Kenya's constitution accessible
                to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Philosophy Section */}
      <section className="py-16 md:py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 rounded-full bg-[#F0FFF4] flex items-center justify-center flex-shrink-0">
                <Handshake className="h-12 w-12 text-[#0A7B24]" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#0A7B24] mb-6">Our Partnership Philosophy</h2>
                <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                  At Katiba360, we believe that making Kenya's constitution accessible requires collaboration across
                  sectors. Our partnerships bring together technical expertise, constitutional knowledge, and community
                  engagement to create a platform that serves all Kenyans.
                </p>

                <div className="bg-white p-6 rounded-lg border-l-4 border-[#1EB53A] shadow-sm">
                  <p className="italic text-[#4B5563]">
                    "The sovereign power belongs to the people of Kenya and shall be exercised only in accordance with
                    this Constitution. The people may exercise their sovereign power either directly or through their
                    democratically elected representatives."
                  </p>
                  <p className="text-right text-[#6B7280] mt-4">— Constitution of Kenya, Article 1(1-2)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Profiles - Styled like Team page */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center">
              {/* The People of Kenya Partner Profile */}
              <div className="w-full max-w-3xl bg-gradient-to-br from-white to-[#F9FAFB] border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group">
                {/* Kenya people icon - positioned with space above and less gap below */}
                <div className="flex justify-center -mb-8 relative z-10 mt-8">
                  <div className="w-32 h-32 rounded-full bg-[#CE1126] border-4 border-white shadow-lg flex items-center justify-center">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="relative pt-12 px-8 pb-8 flex flex-col items-center">

                  {/* Kenya map outline in the background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-10" preserveAspectRatio="xMidYMid meet">
                      <path
                        d="M60,20 C70,25 80,35 85,45 C90,55 90,65 85,75 C80,85 70,90 60,95 C50,100 40,100 30,95 C20,90 15,80 10,70 C5,60 5,50 10,40 C15,30 25,20 35,15 C45,10 55,15 60,20 Z"
                        fill="none"
                        stroke="#0A7B24"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="inline-block bg-[#0A7B24] text-white text-xs font-bold px-2 py-1 rounded-full mb-4">
                      Constitutional Stakeholders
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A7B24]">{partnerProfiles[0].name}</h3>
                    <p className="text-[#6B7280] mb-4">{partnerProfiles[0].role}</p>

                    <div className="flex justify-center space-x-2 mb-6">
                      <span className="inline-flex items-center bg-[#F0FFF4] text-[#0A7B24] text-xs px-2 py-1 rounded-full">
                        <Users className="h-3 w-3 mr-1" />
                        <span>47+ Million Partners</span>
                      </span>
                      <span className="inline-flex items-center bg-[#F0FFF4] text-[#0A7B24] text-xs px-2 py-1 rounded-full">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>Since 2010</span>
                      </span>
                    </div>

                    <div className="mt-2 text-[#4B5563]">
                      <p>{partnerProfiles[0].bio}</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-[#0A7B24] mb-4 text-left">Partnership Focus:</h4>
                      <ul className="space-y-2 text-left">
                        {partnerProfiles[0].focus.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 text-[#1EB53A]">•</div>
                            <span className="text-[#4B5563]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner - Enhanced CTA */}
      <section className="py-16 bg-[#F9FAFB] border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border-2 border-[#F3F4F6] hover:border-[#1EB53A] transition-all duration-300 hover:shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0A7B24] to-[#1EB53A] flex items-center justify-center flex-shrink-0">
                  <Handshake className="h-12 w-12 text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#0A7B24] mb-4 text-center md:text-left">Become a Partner</h2>
                  <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                    Interested in partnering with Katiba360 to make Kenya's constitution more accessible? We welcome
                    collaborations with organizations and individuals who share our vision.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link
                      href="/about/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Contact Us
                    </Link>
                    <Link
                      href="/about/mission"
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0A7B24] text-[#0A7B24] rounded-lg hover:bg-[#F0FFF4] transition-colors duration-300"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Learn About Our Mission
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0A7B24] mb-12 text-center">Types of Partnerships</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Technical Partnership */}
              <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mb-6">
                  <Code className="h-8 w-8 text-[#0A7B24]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A7B24] mb-3">Technical Partnership</h3>
                <p className="text-[#4B5563]">
                  Contribute technical expertise, development resources, or digital infrastructure to help us improve
                  the platform.
                </p>
              </div>

              {/* Content Partnership */}
              <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-[#0A7B24]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A7B24] mb-3">Content Partnership</h3>
                <p className="text-[#4B5563]">
                  Help create, translate, or validate constitutional content to ensure accuracy and accessibility.
                </p>
              </div>

              {/* Community Partnership */}
              <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-[#0A7B24]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A7B24] mb-3">Community Partnership</h3>
                <p className="text-[#4B5563]">
                  Engage with communities across Kenya to promote constitutional awareness and gather feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
