"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, FileText, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()

  // Last updated date
  const lastUpdated = "May 15, 2023"

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal with Border style */}
      <section className="relative py-24 md:py-28 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-[#1EB53A] font-medium hover:text-[#0A7B24] transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="border-b border-[#1EB53A] hover:border-[#0A7B24] transition-colors duration-300">
                Back to Home
              </span>
            </Link>

            <div className="border-l-4 border-[#1EB53A] pl-8">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">Privacy Policy</h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                How we protect your data and respect your privacy while making Kenya's constitution accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-[#4B5563] mb-4">
                At Katiba360, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, and safeguard your information when you
                use our platform.
              </p>
              <p className="text-[#4B5563] mb-4">
                We believe in transparency and respect for your privacy rights, which are also protected under Article
                31 of the Constitution of Kenya.
              </p>
              <p className="text-sm text-[#6B7280] italic">Last updated: {lastUpdated}</p>
            </div>

            {/* Data We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Information We Collect
              </h2>

              <div className="bg-[#F9FAFB] rounded-lg p-6 border-l-4 border-[#1EB53A] mb-6">
                <h3 className="font-semibold text-[#0A7B24] mb-2">Google Authentication</h3>
                <p className="text-[#4B5563]">When you sign in with Google, we only receive and store:</p>
                <ul className="mt-3 space-y-2">
                  {[
                    "Your public profile information (name and profile picture)",
                    "Your email address",
                    "We do NOT access your contacts, calendar, Google Drive, or any other private data",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-[#1EB53A] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-[#4B5563]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Usage Information</h3>
              <p className="text-[#4B5563] mb-4">We collect anonymous usage data to improve our service, including:</p>
              <ul className="space-y-2 mb-6 pl-5">
                {[
                  // "Pages visited and features used",
                  "Time spent on the platform",
                  // "Device information (browser type, operating system)",
                  // "General location information (country level only)",
                ].map((item, index) => (
                  <li key={index} className="text-[#4B5563] list-disc list-outside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-[#1EB53A]" />
                How We Use Your Information
              </h2>
              <p className="text-[#4B5563] mb-4">We use the information we collect for the following purposes:</p>
              <ul className="space-y-4 mb-6">
                {[
                  {
                    title: "To Provide Our Service",
                    description:
                      "We use your information to authenticate you, personalize your experience, and provide access to all features of Katiba360.",
                  },
                  {
                    title: "To Improve Our Platform",
                    description: "We analyze usage patterns to enhance our content, features, and user experience.",
                  },
                  {
                    title: "To Communicate With You",
                    description:
                      "We may send you service-related announcements, updates, and respond to your inquiries.",
                  },
                ].map((item, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-[#0A7B24] mb-1">{item.title}</h3>
                    <p className="text-[#4B5563]">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Protection */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <Lock className="h-6 w-6 mr-3 text-[#1EB53A]" />
                How We Protect Your Data
              </h2>
              <p className="text-[#4B5563] mb-6">
                We implement appropriate security measures to protect your personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    title: "Secure Authentication",
                    description: "We use Google's secure OAuth 2.0 protocol for authentication.",
                  },
                  {
                    title: "Encrypted Connections",
                    description: "All data is transmitted over HTTPS with SSL encryption.",
                  },
                  {
                    title: "Limited Data Collection",
                    description: "We only collect the minimum information needed to provide our service.",
                  },
                  {
                    title: "Regular Security Reviews",
                    description: "We periodically review our security practices to ensure your data is protected.",
                  },
                ].map((item, index) => (
                  <div key={index} className="bg-[#F9FAFB] p-4 rounded-lg">
                    <h3 className="font-semibold text-[#0A7B24] mb-1">{item.title}</h3>
                    <p className="text-[#4B5563] text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Your Rights
              </h2>
              <p className="text-[#4B5563] mb-4">
                In accordance with the Constitution of Kenya and data protection principles, you have the right to:
              </p>
              <ul className="space-y-2 mb-6 pl-5">
                {[
                  "Access the personal information we hold about you",
                  "Request correction of inaccurate information",
                  "Request deletion of your account and associated data",
                  "Opt-out of non-essential communications",
                  "Lodge a complaint with the relevant data protection authority",
                ].map((item, index) => (
                  <li key={index} className="text-[#4B5563] list-disc list-outside">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#4B5563]">
                To exercise any of these rights, please contact us through our{" "}
                <Link href="/about/contact" className="text-[#1EB53A] hover:text-[#0A7B24] underline">
                  Contact Page
                </Link>
                .
              </p>
            </div>

            {/* Constitutional Quote */}
            <div className="mb-12">
              <div className="bg-[#F9FAFB] p-8 rounded-lg border-l-4 border-[#1EB53A]">
                <p className="italic text-[#4B5563] text-lg">
                  "Every person has the right to privacy, which includes the right not to have information relating to
                  their family or private affairs unnecessarily required or revealed."
                </p>
                <p className="text-right text-[#6B7280] mt-4">— Constitution of Kenya, Article 31(c)</p>
              </div>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-4">Changes to This Policy</h2>
              <p className="text-[#4B5563] mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-[#4B5563]">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your
                information.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#F0FFF4] p-6 rounded-lg border border-[#1EB53A]/20">
              <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Contact Us</h2>
              <p className="text-[#4B5563] mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <Link
                href="/about/contact"
                className="inline-flex items-center text-[#1EB53A] font-medium hover:text-[#0A7B24] transition-colors duration-300"
              >
                <span className="border-b border-[#1EB53A] hover:border-[#0A7B24] transition-colors duration-300">
                  Visit our Contact Page
                </span>
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
