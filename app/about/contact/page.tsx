"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Twitter,
  ExternalLink,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  UserCircle,
  AtSign,
  Hash,
  Bell,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ContactPage() {
  const { t } = useLanguage()

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Contact information
  const contactInfo = {
    xProfile: process.env.NEXT_PUBLIC_CONTACT_PROFILE_URL || "https://x.com/WebShrewd",
    xHandle: "@WebShrewd",
  }

  // FAQ data
  const faqItems = [
    {
      question: "How can I contribute to Katiba360?",
      answer:
        "We welcome contributions in various forms, including content suggestions, technical expertise, translation help, and feedback on our platform. Please reach out to us on X with your specific interest in contributing.",
    },
    {
      question: "How quickly do you respond to messages?",
      answer:
        "We aim to respond to all inquiries within 24-48 hours. For urgent matters, direct messages on X typically receive faster responses.",
    },
    {
      question: "Can I request a specific constitutional topic to be covered?",
      answer:
        "We welcome suggestions for topics that matter to you. Your input helps us prioritize content that's most relevant to our users.",
    },
    {
      question: "Is Katiba360 available in multiple languages?",
      answer:
        "We're working to make Katiba360 available in multiple languages spoken in Kenya. Currently, we support English, with plans to add more languages in the future.",
    },
    {
      question: "How can I report inaccurate information?",
      answer:
        "We strive for accuracy in all our content. If you find any inaccuracies, please let us know via direct message on X. We appreciate your help in maintaining the quality of our platform.",
    },
  ]

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal with Border style (matching Team and Partners pages) */}
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
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">Contact Us</h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                Get in touch with our team for questions, feedback, or collaboration opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced X/Twitter Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* X/Twitter Contact Card */}
            <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative p-8 md:p-12">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#F0FFF4] rounded-bl-full opacity-50"></div>


                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="w-24 h-24 rounded-full bg-[#F0FFF4] flex items-center justify-center flex-shrink-0">
                      <Twitter className="h-12 w-12 text-[#0A7B24]" />
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold text-[#0A7B24] mb-4 text-center md:text-left">
                        Connect With Us on X
                      </h2>
                      <p className="text-lg text-[#4B5563] mb-6 leading-relaxed">
                        All our communications are handled through X (formerly Twitter). Follow us, mention us, or send
                        us a direct message to get in touch with our team.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                          href={contactInfo.xProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                        >
                          <Twitter className="h-5 w-5 mr-2" />
                          Visit Our Profile
                        </a>
                        <a
                          href={`${contactInfo.xProfile}/messages`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0A7B24] text-[#0A7B24] rounded-lg hover:bg-[#F0FFF4] transition-colors duration-300"
                        >
                          <MessageSquare className="h-5 w-5 mr-2" />
                          Send a Direct Message
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Ways to Connect on X */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-[#F9FAFB] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#F0FFF4]">
                      <div className="w-12 h-12 rounded-full bg-[#1EB53A]/20 flex items-center justify-center mb-4">
                        <AtSign className="h-6 w-6 text-[#0A7B24]" />
                      </div>
                      <h3 className="font-medium text-[#0A7B24] text-lg mb-2">Mention Us</h3>
                      <p className="text-[#4B5563]">
                        Tag {contactInfo.xHandle} in your posts to ask questions publicly or share your thoughts about
                        Katiba360.
                      </p>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#F0FFF4]">
                      <div className="w-12 h-12 rounded-full bg-[#1EB53A]/20 flex items-center justify-center mb-4">
                        <MessageSquare className="h-6 w-6 text-[#0A7B24]" />
                      </div>
                      <h3 className="font-medium text-[#0A7B24] text-lg mb-2">Direct Message</h3>
                      <p className="text-[#4B5563]">
                        Send us a private message for specific questions, feedback, or collaboration inquiries. We
                        typically respond within 24-48 hours.
                      </p>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#F0FFF4]">
                      <div className="w-12 h-12 rounded-full bg-[#1EB53A]/20 flex items-center justify-center mb-4">
                        <Bell className="h-6 w-6 text-[#0A7B24]" />
                      </div>
                      <h3 className="font-medium text-[#0A7B24] text-lg mb-2">Follow Us</h3>
                      <p className="text-[#4B5563]">
                        Follow our account to stay updated on the latest constitutional insights, platform updates, and
                        community discussions.
                      </p>
                    </div>
                  </div>

                  {/* X Handle Card */}
                  <div className="mt-12 bg-[#F0FFF4] rounded-xl p-6 border-l-4 border-[#1EB53A]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center">
                        <Twitter className="h-8 w-8 text-[#0A7B24] mr-4" />
                        <div>
                          <h3 className="font-bold text-[#0A7B24] text-xl">{contactInfo.xHandle}</h3>
                          <p className="text-[#4B5563]">Our official X account</p>
                        </div>
                      </div>
                      <a
                        href={contactInfo.xProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Visit Profile
                      </a>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="mt-8">
                    <h3 className="font-medium text-[#0A7B24] text-lg mb-4">Join the Conversation with Hashtags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {["#Katiba360", "#KenyaConstitution", "#ConstitutionalRights", "#CivicEducation"].map(
                        (hashtag) => (
                          <a
                            key={hashtag}
                            href={`https://x.com/search?q=${encodeURIComponent(hashtag)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#F9FAFB] hover:bg-[#F0FFF4] text-[#0A7B24] px-3 py-2 rounded-full transition-colors duration-300"
                          >
                            <Hash className="h-4 w-4 mr-1" />
                            {hashtag.substring(1)}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section - Enhanced with accordion */}
            <div className="mt-20">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                  <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mr-4">
                    <BookOpen className="h-8 w-8 text-[#0A7B24]" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0A7B24]">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                        openFaq === index ? "border-[#1EB53A] shadow-md" : "border-[#F3F4F6] hover:border-[#1EB53A]/50"
                      }`}
                    >
                      <button
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        onClick={() => toggleFaq(index)}
                      >
                        <h3
                          className={`font-medium text-lg ${openFaq === index ? "text-[#0A7B24]" : "text-[#4B5563]"}`}
                        >
                          {item.question}
                        </h3>
                        {openFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-[#1EB53A]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#4B5563]" />
                        )}
                      </button>

                      {openFaq === index && (
                        <div className="px-6 pb-6 pt-0">
                          <div className="w-full h-px bg-gray-200 mb-4"></div>
                          <p className="text-[#4B5563]">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Community Engagement Call to Action */}
            <div className="mt-20 max-w-4xl mx-auto bg-[#F9FAFB] rounded-xl border-2 border-[#F3F4F6] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1EB53A]/10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0A7B24]/10 rounded-tr-full"></div>

              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-[#0A7B24] mb-4">Join Our Community</h3>
                <p className="text-[#4B5563] max-w-2xl mx-auto mb-8">
                  Be part of our growing community of Kenyans passionate about constitutional knowledge. Together, we
                  can make Kenya's constitution accessible and actionable for everyone.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={contactInfo.xProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                  >
                    <Twitter className="h-5 w-5 mr-2" />
                    Follow on X
                  </a>
                  <Link
                    href="/about/partners"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#0A7B24] text-[#0A7B24] rounded-lg hover:bg-[#F0FFF4] transition-colors duration-300"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    View Our Partners
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
