import { useMemo } from 'react';
import billOfRightsData from '@/data/bill-of-rights.json';

export interface Right {
  id: number;
  article: string;
  title: string;
  description: string;
  key_provisions: string[];
  category: string;
}

export interface BillOfRightsData {
  chapter: string;
  source: string;
  rights: Right[];
  total_rights: number;
}

/**
 * Hook to get Bill of Rights data and calculate the right of the day
 */
export function useBillOfRights() {
  const data = billOfRightsData as BillOfRightsData;

  const getRightOfTheDay = (date: Date = new Date()): Right => {
    // Use day of year for rotation (1-365/366)
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate which right to show (1-based indexing)
    const rightIndex = (dayOfYear % data.total_rights) + 1;
    
    // Find the right with this ID
    const right = data.rights.find(r => r.id === rightIndex);
    return right || data.rights[0]; // Fallback to first right
  };

  const currentRight = useMemo(() => getRightOfTheDay(), []);

  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      fundamental_rights: "⚖️",
      equality_rights: "🤝",
      liberty_rights: "🗽",
      privacy_rights: "🔒",
      expression_rights: "💬",
      association_rights: "👥",
      political_rights: "🗳️",
      property_rights: "🏠",
      economic_rights: "💼",
      environmental_rights: "🌱",
      cultural_rights: "🎭",
      family_rights: "👨‍👩‍👧‍👦",
      consumer_rights: "🛒",
      administrative_rights: "📋",
      justice_rights: "⚖️",
      children_rights: "👶",
      special_groups_rights: "🤲"
    };
    return iconMap[category] || "📜";
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      fundamental_rights: "bg-red-50 text-red-700 border-red-200",
      equality_rights: "bg-blue-50 text-blue-700 border-blue-200",
      liberty_rights: "bg-green-50 text-green-700 border-green-200",
      privacy_rights: "bg-purple-50 text-purple-700 border-purple-200",
      expression_rights: "bg-orange-50 text-orange-700 border-orange-200",
      association_rights: "bg-indigo-50 text-indigo-700 border-indigo-200",
      political_rights: "bg-pink-50 text-pink-700 border-pink-200",
      property_rights: "bg-yellow-50 text-yellow-700 border-yellow-200",
      economic_rights: "bg-teal-50 text-teal-700 border-teal-200",
      environmental_rights: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cultural_rights: "bg-violet-50 text-violet-700 border-violet-200",
      family_rights: "bg-rose-50 text-rose-700 border-rose-200",
      consumer_rights: "bg-cyan-50 text-cyan-700 border-cyan-200",
      administrative_rights: "bg-slate-50 text-slate-700 border-slate-200",
      justice_rights: "bg-amber-50 text-amber-700 border-amber-200",
      children_rights: "bg-lime-50 text-lime-700 border-lime-200",
      special_groups_rights: "bg-sky-50 text-sky-700 border-sky-200"
    };
    return colorMap[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return {
    data,
    currentRight,
    getRightOfTheDay,
    getCategoryIcon,
    getCategoryColor,
    isLoading: false,
    error: null
  };
}