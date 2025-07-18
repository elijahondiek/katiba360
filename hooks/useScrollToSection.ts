import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook to handle scrolling to a specific section based on URL hash
 * This is used when navigating from search results to specific articles
 */
export function useScrollToSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const initialLoadRef = useRef(true);
  const maxRetries = 10; // Maximum number of retries to find the element
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Function to scroll to element with the given ID with retry mechanism
  const scrollToElement = useCallback((elementId: string) => {
    // Clear any existing retry interval
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
    
    retryCountRef.current = 0;
    
    // Function to attempt scrolling with retry logic
    const attemptScroll = () => {
      // Try to find the element directly
      let element = document.getElementById(elementId);
      
      // If element not found and it's a clause-level ID, try to find the parent article
      if (!element && elementId.includes('-clause-')) {
        // For article-46-clause-1-c, try finding article-46 first
        const articleId = elementId.split('-clause-')[0];
        console.log(`Element #${elementId} not found, trying parent article #${articleId}`);
        element = document.getElementById(articleId);
      }
      
      if (element) {
        // Element found, clear interval and scroll
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }
        
        // Get the element's position relative to the document
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        // Scroll to the element with a small offset from the top to account for headers
        window.scrollTo({
          top: elementTop - 100, // 100px offset to account for sticky header
          behavior: 'smooth'
        });
        
        // Add enhanced highlight effect
        element.classList.add('highlight-section');
        
        // After scrolling to the element, try to find the specific clause again
        // This handles cases where the DOM might be updated after scrolling
        if (elementId.includes('-clause-') && element.id !== elementId) {
          setTimeout(() => {
            const specificElement = document.getElementById(elementId);
            if (specificElement) {
              // Remove highlight from parent and add to specific element
              element.classList.remove('highlight-section');
              specificElement.classList.add('highlight-section');
              
              // Enhanced removal with fade-out class
              setTimeout(() => {
                specificElement.classList.add('fade-out');
                setTimeout(() => {
                  specificElement.classList.remove('highlight-section', 'fade-out');
                }, 800);
              }, 4000);
            }
          }, 500); // Give the DOM a moment to update
        } else {
          // Enhanced removal with fade-out class for main element
          setTimeout(() => {
            element.classList.add('fade-out');
            setTimeout(() => {
              element.classList.remove('highlight-section', 'fade-out');
            }, 800);
          }, 4000);
        }
        
        // Reset navigation state
        setIsNavigating(false);
        console.log(`Successfully scrolled to element: #${element.id}`);
      } else {
        // Element not found, increment retry count
        retryCountRef.current += 1;
        
        // If we've reached max retries, stop trying
        if (retryCountRef.current >= maxRetries) {
          if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
          }
          console.warn(`Failed to find element #${elementId} after ${maxRetries} attempts`);
          setIsNavigating(false);
          
          // As a fallback, try to at least scroll to the top of the page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          console.log(`Attempt ${retryCountRef.current} to find element #${elementId}`);
        }
      }
    };
    
    // Initial wait time depends on whether we're navigating between pages
    const initialDelay = isNavigating ? 500 : 100;
    
    // First attempt after initial delay
    setTimeout(() => {
      attemptScroll();
      
      // If element not found on first try, set up retry interval
      if (!document.getElementById(elementId)) {
        retryIntervalRef.current = setInterval(attemptScroll, 200);
      }
    }, initialDelay);
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

    // Check for hash on initial load or pathname change
    if (typeof window !== 'undefined') {
      if (initialLoadRef.current || isNavigating) {
        // Use a short delay to ensure the DOM is fully loaded
        setTimeout(handleHashChange, 100);
        initialLoadRef.current = false;
      }
      
      // Add event listener for hash changes
      window.addEventListener('hashchange', handleHashChange);
      
      // Clean up
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        // Clear any pending retry intervals on unmount
        if (retryIntervalRef.current) {
          clearInterval(retryIntervalRef.current);
        }
      };
    }
  }, [scrollToElement, pathname, isNavigating]);

  // Function to navigate to a specific section
  const navigateToSection = useCallback((url: string) => {
    // Set navigating state to true to use longer timeout for cross-page navigation
    setIsNavigating(true);
    
    // Use router.push for all navigation to ensure proper Next.js handling
    router.push(url);
  }, [router]);

  return { navigateToSection, scrollToElement };
}
