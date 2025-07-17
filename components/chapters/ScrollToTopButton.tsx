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
      className={`fixed bottom-20 right-6 bg-[#1EB53A] hover:bg-[#0A7B24] text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-all duration-300 z-40 ${
        showScrollTop ? 'opacity-60 hover:opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </button>
  );
}
