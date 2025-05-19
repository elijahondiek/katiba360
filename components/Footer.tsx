"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Twitter, ExternalLink } from "lucide-react";
import { ComingSoonChip } from "@/components/ui/coming-soon-chip";

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Hide footer on onboarding page - placed after all hooks are called
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return null;
  }
  return (
    <>
      {/* Minimal footer accent */}
      <div className="h-2 bg-gradient-to-r from-[#0A7B24] via-[#1EB53A] to-[#CE1126]"></div>
      <footer className="bg-[#0A7B24] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="font-bold text-2xl">
                  <span className="text-white">Katiba</span>
                  <span className="text-[#E5E7EB]">360</span>
                  <span className="text-[#CE1126] text-sm align-text-top ml-0.5">
                    °
                  </span>
                </div>
              </div>
              <p className="text-[#E5E7EB]">{t("footer.mission")}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.explore")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/chapters"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    {t("nav.chapters")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rights"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    {t("nav.rights")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/scenarios"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    {t("home.commonScenarios")}
                  </Link>
                </li>
                {/* <li>
                  <div className="flex items-center">
                    <span
                      className="text-[#E5E7EB] opacity-70 cursor-not-allowed"
                      aria-disabled="true"
                    >
                      {t("nav.learn")}
                    </span>
                    <ComingSoonChip
                      className="ml-1"
                      variant="footer"
                      compact={true}
                    />
                  </div>
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.about")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    About Katiba360
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/mission"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/team"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/partners"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/contact"
                    className="text-[#E5E7EB] hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("footer.connect")}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={
                      process.env.NEXT_PUBLIC_CONTACT_PROFILE_URL ||
                      "https://x.com/WebShrewd"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E5E7EB] hover:text-white flex items-center"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    X (Twitter)
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1EB53A] mt-8 pt-8 text-center text-[#E5E7EB]">
            <p>
              &copy; {new Date().getFullYear()} Katiba360.{" "}
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
