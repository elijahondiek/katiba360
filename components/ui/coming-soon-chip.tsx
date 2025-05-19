"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ComingSoonChipProps {
  className?: string
  variant?: "default" | "footer" | "profile"
  compact?: boolean
}

/**
 * Reusable ComingSoonChip component
 * @param className - Additional classes to apply
 * @param variant - Visual style variant: default (green), footer (white), or profile (gray)
 * @param compact - Whether to use a more compact version (smaller text, less padding)
 */
export function ComingSoonChip({ className = "", variant = "default", compact = false }: ComingSoonChipProps) {
  // Base classes for all variants
  const baseClasses = compact
    ? "inline-flex items-center justify-center px-1 py-0 text-[10px] font-medium rounded-full ml-auto"
    : "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full relative -top-1"
  
  // Different styles based on variant
  const variantClasses = 
    variant === "footer" ? "bg-white/20 text-white" : 
    variant === "profile" ? "bg-gray-100 text-gray-500" :
    "bg-[#1EB53A]/10 text-[#0A7B24]"
  
  return (
    <span 
      className={cn(baseClasses, variantClasses, className)}
      aria-label="Coming Soon"
    >
      Planned 
    </span>
  )
}
