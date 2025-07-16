"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Twitter,
  ExternalLink,
  Code,
  Users,
  Coffee,
  Star,
  Heart,
  Github,
  Plus,
  Database,
  UserCircle,
  Laptop,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";

export default function TeamPage() {
  const { t } = useLanguage();
  const [peopleCount, setPeopleCount] = useState(47000000);

  // Team profile data
  const teamProfiles = [
    {
      name: "We the People of Kenya",
      role: "The Foundation of Our Constitution",
      bio: "WE, THE PEOPLE OF KENYA— ACKNOWLEDGING the supremacy of the Almighty God of all creation: HONOURING those who heroically struggled to bring freedom and justice to our land: PROUD of our ethnic, cultural and religious diversity, and determined to live in peace and unity as one indivisible sovereign nation: RESPECTFUL of the environment, which is our heritage, and determined to sustain it for the benefit of future generations: COMMITTED to nurturing and protecting the well-being of the individual, the family, communities and the nation: RECOGNISING the aspirations of all Kenyans for a government based on the essential values of human rights, equality, freedom, democracy, social justice and the rule of law: EXERCISING our sovereign and inalienable right to determine the form of governance of our country and having participated fully in the making of this Constitution: ADOPT, ENACT and give this Constitution to ourselves and to our future generations.",
      isConceptual: true,
    },
  ];

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
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A7B24] mb-6 leading-tight">
                Our Team
              </h1>
              <p className="text-xl text-[#4B5563] max-w-2xl leading-relaxed">
                Meet the dedicated team behind Katiba360.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Team Profiles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center">
              {/* We the People - Grand and impressive */}
              <div className="w-full max-w-3xl bg-gradient-to-br from-white to-[#F9FAFB] border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group">
                {/* Header with gradient background */}
                <div className="h-48 bg-gradient-to-r from-[#0A7B24]/20 via-[#1EB53A]/20 to-[#CE1126]/20 relative overflow-hidden">
                  {/* Kenya map outline in the background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full opacity-20"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M60,20 C70,25 80,35 85,45 C90,55 90,65 85,75 C80,85 70,90 60,95 C50,100 40,100 30,95 C20,90 15,80 10,70 C5,60 5,50 10,40 C15,30 25,20 35,15 C45,10 55,15 60,20 Z"
                        fill="none"
                        stroke="#0A7B24"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* People icon - positioned separately */}
                <div className="flex justify-center -mt-20 mb-4">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-[#CE1126] border-4 border-white shadow-lg flex items-center justify-center">
                      <Shield className="h-20 w-20 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-2 -right-2 bg-[#0A7B24] text-white text-xs font-bold px-2 py-1 rounded-full cursor-pointer"
                      onClick={() => setPeopleCount((prev) => prev + 1)}
                    >
                      {peopleCount.toLocaleString()} people
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-4">
                  <div className="flex flex-col items-center relative z-10">
                    <h3 className="text-3xl font-bold text-[#0A7B24] mt-2 text-center">
                      {teamProfiles[0].name}
                    </h3>
                    <p className="text-[#6B7280] mb-4">
                      {teamProfiles[0].role}
                    </p>

                    <div className="flex space-x-2 mb-6">
                      <span className="inline-flex items-center bg-[#F0FFF4] text-[#0A7B24] text-xs px-2 py-1 rounded-full">
                        <Users className="h-3 w-3 mr-1" />
                        <span>47+ Million Contributors</span>
                      </span>
                      <span className="inline-flex items-center bg-[#F0FFF4] text-[#0A7B24] text-xs px-2 py-1 rounded-full">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>Since 2010</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-[#4B5563] relative z-10">
                    <div className="bg-white bg-opacity-70 p-4 rounded-lg border border-[#F3F4F6] text-sm">
                      {teamProfiles[0].bio.split(":").map((section, index) => (
                        <p
                          key={index}
                          className={`mb-2 ${
                            index === 0 ? "font-semibold" : ""
                          }`}
                        >
                          {index > 0 && (
                            <span className="text-[#1EB53A] font-semibold">
                              •
                            </span>
                          )}{" "}
                          {section.trim()}
                          {index ===
                            teamProfiles[0].bio.split(":").length - 1 && (
                            <span className="inline-block animate-pulse ml-1 text-[#CE1126]">
                              ♥
                            </span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Join the Team Section */}
            <div className="mt-16 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-[#0A7B24] mb-8 text-center">
                Join Our Team
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Developer Contribution Card */}
                <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mr-6">
                      <Github className="h-8 w-8 text-[#0A7B24]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0A7B24]">
                        Contribute Code
                      </h3>
                      <p className="text-[#6B7280]">
                        Help us improve Katiba360
                      </p>
                    </div>
                  </div>

                  <p className="text-[#4B5563] mb-6">
                    Are you a developer passionate about making information
                    accessible? Join our open-source project and help make
                    Kenya's constitution available to everyone.
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#1EB53A]">•</div>
                      <span className="text-[#4B5563]">
                        Frontend development (React, Next.js)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#1EB53A]">•</div>
                      <span className="text-[#4B5563]">
                        Backend development (Python: FastAPI)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#1EB53A]">•</div>
                      <span className="text-[#4B5563]">
                        Content creation and translation
                      </span>
                    </li>
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={
                        process.env.NEXT_PUBLIC_KATIBA360_APP_URL ||
                        "https://github.com/elijahondiek/katiba360"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      Frontend Repository
                    </a>
                    <a
                      href={
                        process.env.NEXT_PUBLIC_KATIBA360_BACKEND_URL ||
                        "https://github.com/elijahondiek/katiba360-backend"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-[#0A7B24] text-white rounded-lg hover:bg-[#1EB53A] transition-colors duration-300"
                    >
                      <Database className="h-5 w-5 mr-2" />
                      Backend Repository
                    </a>
                  </div>
                </div>

                {/* Financial Support Card - Simplified to just Buy Me a Coffee */}
                <div className="bg-white border-2 border-[#F3F4F6] hover:border-[#1EB53A] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#F0FFF4] flex items-center justify-center mr-6">
                      <Coffee className="h-8 w-8 text-[#0A7B24]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0A7B24]">
                      Bankroll the app
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#4B5563] mb-6">
                    Your financial support helps us maintain servers, improve
                    features, and dedicate more time to making Kenya's
                    constitution accessible to everyone.
                  </p>

                  <div className="flex justify-center">
                    <a
                      href={
                        process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#FFDD00] text-[#000000] rounded-lg hover:bg-[#FFDD00]/90 transition-colors duration-300 font-medium"
                    >
                      <Coffee className="h-5 w-5 mr-2" />
                      Coffee App
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Updated Team Distribution with invitation to join */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-[#F9FAFB] rounded-lg p-6 border-l-4 border-[#1EB53A]">
                <p className="mt-4 text-sm text-[#4B5563] italic">
                  "It takes a nation to build a constitution, and a community of
                  developers to build this platform."
                </p>

                <div className="mt-4 text-center">
                  <a
                    href={
                      process.env.NEXT_PUBLIC_KATIBA360_APP_URL ||
                      "https://github.com/elijahondiek/katiba360"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0A7B24] hover:text-[#1EB53A] transition-colors duration-300 font-medium"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span className="border-b border-[#1EB53A] hover:border-[#0A7B24] transition-colors duration-300">
                      Join our developer community
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
