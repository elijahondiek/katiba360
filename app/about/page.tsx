"use client"
import Link from "next/link"
import { ChevronRight, Target, Users, Handshake, MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  // Define about section pages with icons
  const aboutSections = [
    {
      title: "Our Mission",
      description: "Learn about our vision and mission to make Kenya's constitution accessible to everyone.",
      href: "/about/mission",
      icon: Target,
    },
    {
      title: "Team",
      description: "Meet the dedicated team behind Katiba360.",
      href: "/about/team",
      icon: Users,
    },
    {
      title: "Partners",
      description: "Discover the organizations and individuals supporting our mission.",
      href: "/about/partners",
      icon: Handshake,
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team for questions, feedback, or collaboration opportunities.",
      href: "/about/contact",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* HERO VARIATION 5: Minimal with Border */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto border-l-4 border-[#1EB53A] pl-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">
              About Katiba<span className="text-[#CE1126]">360</span>
            </h1>
            <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
              Making Kenya's constitution accessible to everyone through simple language and practical examples.
            </p>
          </div>
        </div>
      </section>

      {/* Creative, simple card layout */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Staggered, creative card layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {aboutSections.map((section, index) => {
              const IconComponent = section.icon
              // Alternate card styles for visual interest
              const isEven = index % 2 === 0

              return (
                <Link
                  href={section.href}
                  key={index}
                  className={`group relative flex ${isEven ? "md:translate-y-8" : ""} transition-all duration-300`}
                >
                  <div
                    className={`w-full bg-white border-2 border-transparent hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-300 flex flex-col ${
                      isEven ? "hover:translate-x-2" : "hover:translate-x-2"
                    } hover:shadow-lg`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="mr-4 p-3 bg-[#F9FAFB] rounded-lg group-hover:bg-[#F0FFF4] transition-colors duration-300">
                        <IconComponent size={28} className="text-[#0A7B24]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0A7B24]">{section.title}</h3>
                    </div>

                    <p className="text-[#4B5563] mb-6">{section.description}</p>

                    <div className="mt-auto flex items-center text-[#1EB53A] font-medium group-hover:text-[#0A7B24] transition-colors duration-300">
                      <span>Learn More</span>
                      <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Simple decorative element */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-[#F9FAFB] group-hover:border-r-[#F0FFF4] transition-colors duration-300"></div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Simple, impactful commitment section */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-6">Our Commitment</h2>
            <p className="text-lg text-[#4B5563] mb-8 leading-relaxed">
              At Katiba360, we believe that understanding the constitution is a right, not a privilege. Our platform is
              designed to break down complex legal concepts into accessible, easy-to-understand information for all
              Kenyans.
            </p>

            <Link
              href="/about/mission"
              className="inline-flex items-center text-[#1EB53A] font-medium hover:text-[#0A7B24] transition-colors duration-300"
            >
              <span className="border-b-2 border-[#1EB53A] hover:border-[#0A7B24] transition-colors duration-300">
                Learn More About Our Mission
              </span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}
