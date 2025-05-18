import { Shield, Landmark, Users, Gavel, Globe, Scale, FileText, TrendingUp, Bookmark, BookmarkCheck } from "lucide-react";
import type { JSX } from "react";

// Map each chapter number (1-18) to a relevant Lucide icon
export const chapterIconMap: Record<number, JSX.Element> = {
  1: <Shield className="h-6 w-6 text-[#1EB53A]" />, // Sovereignty
  2: <Landmark className="h-6 w-6 text-[#1EB53A]" />, // The Republic
  3: <Users className="h-6 w-6 text-[#1EB53A]" />, // Citizenship
  4: <Gavel className="h-6 w-6 text-[#1EB53A]" />, // Bill of Rights
  5: <Globe className="h-6 w-6 text-[#1EB53A]" />, // Land and Environment
  6: <Scale className="h-6 w-6 text-[#1EB53A]" />, // Leadership and Integrity
  7: <Scale className="h-6 w-6 text-[#1EB53A]" />, // Representation of the People
  8: <FileText className="h-6 w-6 text-[#1EB53A]" />, // The Legislature
  9: <TrendingUp className="h-6 w-6 text-[#1EB53A]" />, // The Executive
  10: <Gavel className="h-6 w-6 text-[#1EB53A]" />, // Judiciary
  11: <Globe className="h-6 w-6 text-[#1EB53A]" />, // Devolved Government
  12: <FileText className="h-6 w-6 text-[#1EB53A]" />, // Public Finance
  13: <Users className="h-6 w-6 text-[#1EB53A]" />, // Public Service
  14: <Shield className="h-6 w-6 text-[#1EB53A]" />, // National Security
  15: <Bookmark className="h-6 w-6 text-[#1EB53A]" />, // Commissions & Offices
  16: <Gavel className="h-6 w-6 text-[#1EB53A]" />, // Amendment
  17: <FileText className="h-6 w-6 text-[#1EB53A]" />, // General Provisions
  18: <BookmarkCheck className="h-6 w-6 text-[#1EB53A]" />, // Transitional
};
