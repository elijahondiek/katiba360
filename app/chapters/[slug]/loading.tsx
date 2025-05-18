"use client";

import React from "react";

export default function ChapterDetailLoading() {
  // Create an array for article skeleton items
  const articleItems = Array.from({ length: 5 }, (_, i) => i);
  // Create an array for sidebar navigation items
  const sidebarItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-white" aria-label="Loading chapter details">
      {/* Header Skeleton */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-[#1EB53A] rounded-md animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`nav-${i}`} className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              ))}
            </nav>
          </div>

          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </header>

      {/* Back to Chapters Link Skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Chapter Title Skeleton */}
      <div className="container mx-auto px-4 pt-2 pb-4">
        <div className="bg-[#1EB53A]/10 rounded-xl p-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
          <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Skeleton */}
          <div className="order-2 md:order-1">
            <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-[#1EB53A] rounded-md animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>

              <ul className="space-y-2 mb-6">
                {sidebarItems.map((item) => (
                  <li key={`sidebar-${item}`}>
                    <div className={`block w-full p-2 rounded ${item === 0 ? 'bg-[#E5E7EB]' : ''}`}>
                      <div className="h-5 w-full bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-6 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="order-1 md:order-2">
            {/* Audio Player Skeleton */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-grow">
                  <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex justify-between mt-1">
                    <div className="h-3 w-10 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-3 w-10 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>

            {/* Article Content Skeleton */}
            <div className="prose prose-green max-w-none">
              {articleItems.map((item) => (
                <div key={`article-${item}`} className="mb-12">
                  <div className="h-8 w-2/3 bg-[#E5F7E8] rounded-md animate-pulse mb-6"></div>
                  
                  {/* Clause skeletons */}
                  <div className="space-y-6">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={`clause-${item}-${i}`} className="space-y-4">
                        <div className="h-5 w-full bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-5 w-11/12 bg-gray-200 rounded-md animate-pulse"></div>
                        
                        {/* Sub-clause skeletons */}
                        <div className="pl-6 space-y-3">
                          {Array.from({ length: 2 }, (_, j) => (
                            <div key={`subclause-${item}-${i}-${j}`} className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Related Articles Skeleton */}
            <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse mb-6"></div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={`related-${i}`} className="border border-[#E5E7EB] rounded-lg p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                    <div className="h-5 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                    <div className="h-5 w-24 bg-[#E5F7E8] rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Screen reader only text */}
      <div className="sr-only" aria-live="polite">
        Loading chapter details
      </div>
    </div>
  );
}
