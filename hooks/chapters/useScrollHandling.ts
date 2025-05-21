import { useState, useEffect, useCallback, useRef } from "react";
import { useScrollToSection } from "@/hooks/useScrollToSection";

interface Article {
  article_number: number;
}

export function useScrollHandling(contentRef: React.RefObject<HTMLDivElement>, articles: Article[]) {
  const { scrollToElement } = useScrollToSection();
  const initialLoadRef = useRef(true);
  const [activeSection, setActiveSection] = useState("article-1");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Handle hash-based scroll on mount and hashchange
  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;
      
      if (hash) {
        // Remove the # character
        const elementId = hash.substring(1);
        
        // Only scroll if not already active
        if (elementId !== activeSection) {
          // Use the enhanced scrollToElement function from useScrollToSection
          scrollToElement(elementId);
          setActiveSection(elementId);
        }
      }
    };
    
    // On initial load or when articles change
    if (initialLoadRef.current && articles.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(scrollToHash, 100);
      initialLoadRef.current = false;
    }
    
    // On hashchange
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [scrollToElement, articles, activeSection]);

  // Handle scroll to update active section and show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button when user scrolls down 300px
      setShowScrollTop(window.scrollY > 300);
      if (!contentRef.current) return;
      
      // Find all article sections
      const articleSections = document.querySelectorAll('div[id^="article-"]');
      if (articleSections.length === 0) return;
      
      // Set a threshold for when an article is considered "active"
      // The article is active when its top is within 200px of the viewport top
      const threshold = 200;
      let activeArticleId = '';
      
      // Find the article that's currently most visible
      articleSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Article is considered active when its top is close to the viewport top
        // or when it's the first article that's partially visible
        if (rect.top <= threshold && rect.bottom > 0) {
          activeArticleId = section.id;
        }
      });
      
      // Update the active section if we found one
      if (activeArticleId && activeArticleId !== activeSection) {
        setActiveSection(activeArticleId);
        
        // Removed URL hash update to prevent unwanted scrolling
        // We'll only update the URL when explicitly navigating to a section
      }
    };
    
    // Throttle the scroll event to improve performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, [activeSection, contentRef]);

  // Scroll to top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Update active section to the first article
    if (articles.length > 0) {
      const firstArticleId = `article-${articles[0].article_number}`;
      setActiveSection(firstArticleId);
      history.pushState(null, '', `#${firstArticleId}`);
    }
  };

  // Handle sidebar link clicks directly instead of relying on hash changes
  const scrollToArticle = useCallback((articleNumber: number) => {
    if (!contentRef.current) return;
    
    const articleId = `article-${articleNumber}`;
    const articleElement = document.getElementById(articleId);
    
    if (articleElement) {
      // Get the article's position relative to the document
      const rect = articleElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const articleTop = rect.top + scrollTop;
      
      // First update the active section
      setActiveSection(articleId);
      
      // Then update URL hash without scrolling
      if (typeof history !== 'undefined') {
        // Use replaceState instead of pushState to avoid adding to browser history
        history.replaceState(null, '', `#${articleId}`);
      }
      
      // Finally scroll to the article with a small offset from the top
      // Use a small timeout to ensure the hash change doesn't interfere
      setTimeout(() => {
        window.scrollTo({
          top: articleTop - 100, // 100px offset to account for sticky header
          behavior: 'smooth'
        });
      }, 10);
    }
  }, [contentRef]);

  return {
    activeSection,
    showScrollTop,
    scrollToTop,
    scrollToArticle
  };
}
