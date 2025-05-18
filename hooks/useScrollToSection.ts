import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook to handle scrolling to a specific section based on URL hash
 * This is used when navigating from search results to specific articles
 */
export function useScrollToSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Function to scroll to element with the given ID
  const scrollToElement = useCallback((elementId: string) => {
    // Wait for DOM to be ready - use a longer timeout when navigating between pages
    const timeout = isNavigating ? 500 : 100;
    
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        // Get the element's position relative to the document
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        // Scroll to the element with a small offset from the top to account for headers
        window.scrollTo({
          top: elementTop - 100, // 100px offset to account for sticky header
          behavior: 'smooth'
        });
        
        // Add a highlight effect to make it easier to spot
        element.classList.add('highlight-section');
        
        // Remove the highlight effect after 2 seconds
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 2000);
        
        // Reset navigation state
        setIsNavigating(false);
      }
    }, timeout);
  }, [isNavigating]);

  // Handle hash changes and initial load
  useEffect(() => {
    // Function to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # character
        const elementId = hash.substring(1);
        scrollToElement(elementId);
      }
    };

    // Check for hash on initial load
    if (typeof window !== 'undefined') {
      // Use a short delay to ensure the DOM is fully loaded
      setTimeout(handleHashChange, 300);
      
      // Add event listener for hash changes
      window.addEventListener('hashchange', handleHashChange);
      
      // Clean up
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
  }, [scrollToElement, pathname]);

  // Function to navigate to a specific section
  const navigateToSection = useCallback((url: string) => {
    // Set navigating state to true to use longer timeout for cross-page navigation
    setIsNavigating(true);
    
    // Extract the hash from the URL
    const hashIndex = url.indexOf('#');
    let elementId = '';
    
    if (hashIndex !== -1) {
      elementId = url.substring(hashIndex + 1);
    }
    
    // Check if we're navigating to a new page or just changing the hash
    const urlPath = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
    const currentPath = window.location.pathname;
    
    if (urlPath !== currentPath) {
      // If navigating to a new page, use router.push and handle scrolling after navigation
      router.push(url);
      // The scrolling will be handled by the useEffect that watches pathname
    } else {
      // If just changing the hash on the same page, scroll directly
      if (elementId) {
        // Update the URL hash without a full navigation
        window.history.pushState(null, '', `#${elementId}`);
        scrollToElement(elementId);
      }
    }
  }, [router, scrollToElement, pathname]);

  return { navigateToSection, scrollToElement };
}
