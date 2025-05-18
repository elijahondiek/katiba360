export default function Loading() {
  // Create an array of 12 items for the skeleton loader
  const skeletonItems = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-8" aria-label="Loading chapters">
      {/* Page title skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Search bar skeleton */}
      <div className="mb-8">
        <div className="h-12 w-full max-w-md bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Categories skeleton */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={`category-${i}`} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Chapters grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonItems.map((item) => (
          <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
 
            <div className="p-6">
              {/* Chapter number */}
              <div className="h-6 w-16 bg-[#E5F7E8] rounded-full animate-pulse mb-4"></div>
              
              {/* Chapter title */}
              <div className="h-7 w-5/6 bg-gray-200 rounded-md animate-pulse mb-3"></div>
              
              {/* Chapter description lines */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-11/12 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              {/* Articles count */}
              <div className="mt-4 h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen reader only text */}
      <div className="sr-only" aria-live="polite">
        Loading chapters
      </div>
    </div>
  );
}
