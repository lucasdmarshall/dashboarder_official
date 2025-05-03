import { useState, useEffect } from 'react';

/**
 * Custom hook to manage sidebar collapsed state across components
 * Handles both local state and subscribes to global sidebar events
 * @returns {boolean} - Whether the sidebar is collapsed
 */
const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load from localStorage on initial render
    const storedState = localStorage.getItem('instructorSidebarCollapsed');
    return storedState === 'true';
  });
  
  // Subscribe to custom event for sidebar toggle
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setIsCollapsed(event.detail.isCollapsed);
    };
    
    window.addEventListener('instructorSidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('instructorSidebarToggle', handleSidebarToggle);
  }, []);
  
  return isCollapsed;
};

export default useSidebarState; 