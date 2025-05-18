"use client";

import { ChevronUp } from "lucide-react";

interface ScrollToTopButtonProps {
  showScrollTop: boolean;
  onClick: () => void;
}

export function ScrollToTopButton({ showScrollTop, onClick }: ScrollToTopButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`fixed bottom-20 right-4 bg-[#1EB53A] hover:bg-[#0A7B24] text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
