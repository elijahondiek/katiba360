"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Scale, AlertTriangle, Globe, BookOpen } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function TermsPage() {
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
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">Terms of Service</h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                The rules and guidelines for using Katiba360 and accessing Kenya's constitutional information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-[#4B5563] mb-4">
                Welcome to Katiba360. These Terms of Service ("Terms") govern your use of the Katiba360 website,
                services, and applications (collectively, the "Service"). By accessing or using the Service, you agree
                to be bound by these Terms.
              </p>
              <p className="text-[#4B5563] mb-4">
                Please read these Terms carefully. If you do not agree with these Terms, you should not use our Service.
              </p>
              <p className="text-sm text-[#6B7280] italic">Last updated: {lastUpdated}</p>
            </div>

            {/* Using Our Service */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Using Our Service
              </h2>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Account Creation</h3>
              <p className="text-[#4B5563] mb-4">
                To access certain features of our Service, you may need to create an account. When you create an
                account:
              </p>
              <ul className="space-y-2 mb-6 pl-5">
                {[
                  "You must provide accurate and complete information",
                  "You are responsible for maintaining the security of your account",
                  "You are responsible for all activities that occur under your account",
                  "We only collect your public profile information and email from Google authentication",
                ].map((item, index) => (
                  <li key={index} className="text-[#4B5563] list-disc list-outside">
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Acceptable Use</h3>
              <p className="text-[#4B5563] mb-4">When using our Service, you agree not to:</p>
              <ul className="space-y-2 mb-6 pl-5">
                {[
                  "Use the Service for any illegal purpose or in violation of any laws",
                  "Attempt to gain unauthorized access to any part of the Service",
                  "Interfere with or disrupt the integrity or performance of the Service",
                  "Collect or harvest any information from the Service without authorization",
                  "Use the Service to send unsolicited communications",
                  "Impersonate any person or entity or misrepresent your affiliation",
                ].map((item, index) => (
                  <li key={index} className="text-[#4B5563] list-disc list-outside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Content and Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Content and Intellectual Property
              </h2>

              <div className="bg-[#F9FAFB] rounded-lg p-6 border-l-4 border-[#1EB53A] mb-6">
                <h3 className="font-semibold text-[#0A7B24] mb-2">Constitutional Content</h3>
                <p className="text-[#4B5563]">
                  The Constitution of Kenya is a public document. While we provide access to constitutional content, we
                  do not claim ownership of the constitutional text itself. Our goal is to make this information
                  accessible to all Kenyans.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Our Content</h3>
              <p className="text-[#4B5563] mb-4">
                The Service contains content owned or licensed by Katiba360, including but not limited to text,
                graphics, logos, icons, images, audio clips, and software ("Our Content"). Our Content is protected by
                copyright, trademark, and other laws.
              </p>
              <p className="text-[#4B5563] mb-6">
                We grant you a limited, non-exclusive, non-transferable license to access and use Our Content solely for
                personal, non-commercial purposes related to learning about and understanding the Constitution of Kenya.
              </p>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">User Content</h3>
              <p className="text-[#4B5563] mb-4">
                You may have the opportunity to submit content to the Service, such as comments, feedback, or
                suggestions ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive,
                royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User
                Content in connection with the Service.
              </p>
              <p className="text-[#4B5563] mb-6">
                You represent and warrant that you own or have the necessary rights to your User Content and that it
                does not violate the rights of any third party.
              </p>
            </div>

            {/* Disclaimers and Limitations */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Disclaimers and Limitations
              </h2>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Not Legal Advice</h3>
              <div className="bg-[#FEF2F2] rounded-lg p-6 border-l-4 border-[#CE1126] mb-6">
                <p className="text-[#4B5563]">
                  <strong>Important:</strong> The information provided on Katiba360 is for general informational
                  purposes only and is not intended to be legal advice. While we strive for accuracy, we cannot
                  guarantee that all information is complete, accurate, or up-to-date.
                </p>
                <p className="text-[#4B5563] mt-3">
                  For specific legal advice, please consult with a qualified legal professional.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Service Availability</h3>
              <p className="text-[#4B5563] mb-6">
                We strive to provide a reliable Service, but we do not guarantee that the Service will be available at
                all times. We may suspend or discontinue the Service or any part of it without notice.
              </p>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Limitation of Liability</h3>
              <p className="text-[#4B5563] mb-6">
                To the maximum extent permitted by law, Katiba360 and its affiliates, officers, employees, agents,
                partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </div>

            {/* Changes and Termination */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Changes and Termination
              </h2>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Changes to Terms</h3>
              <p className="text-[#4B5563] mb-6">
                We may modify these Terms at any time. If we make changes, we will provide notice by updating the "Last
                Updated" date at the top of these Terms. Your continued use of the Service after any changes indicates
                your acceptance of the modified Terms.
              </p>

              <h3 className="text-xl font-semibold text-[#0A7B24] mb-3">Termination</h3>
              <p className="text-[#4B5563] mb-6">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability,
                for any reason, including if you breach these Terms. Upon termination, your right to use the Service
                will immediately cease.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A7B24] mb-6 flex items-center">
                <Scale className="h-6 w-6 mr-3 text-[#1EB53A]" />
                Governing Law
              </h2>
              <p className="text-[#4B5563] mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to
                its conflict of law provisions.
              </p>
              <p className="text-[#4B5563] mb-6">
                Any disputes arising under or in connection with these Terms shall be subject to the exclusive
                jurisdiction of the courts located in Kenya.
              </p>
            </div>

            {/* Constitutional Quote */}
            <div className="mb-12">
              <div className="bg-[#F9FAFB] p-8 rounded-lg border-l-4 border-[#1EB53A]">
                <p className="italic text-[#4B5563] text-lg">
                  "The purpose of recognising and protecting human rights and fundamental freedoms is to preserve the
                  dignity of individuals and communities and to promote social justice and the realisation of the
                  potential of all human beings."
                </p>
                <p className="text-right text-[#6B7280] mt-4">— Constitution of Kenya, Article 19(2)</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[#F0FFF4] p-6 rounded-lg border border-[#1EB53A]/20">
              <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Contact Us</h2>
              <p className="text-[#4B5563] mb-4">If you have any questions about these Terms, please contact us:</p>
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
