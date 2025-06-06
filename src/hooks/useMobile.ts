
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

export const useCollapsible = (initialState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);
  const isMobile = useIsMobile();

  // Auto-collapse on mobile, auto-expand on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true);
    }
  }, [isMobile]);

  const toggle = () => setIsExpanded(!isExpanded);

  return {
    isExpanded: isMobile ? isExpanded : true,
    toggle,
    isMobile
  };
};
