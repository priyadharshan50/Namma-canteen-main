import React, { useEffect, useRef } from 'react';

/**
 * PageTransition - Wrapper component for smooth page transitions
 * Wraps page content with fade-slide animation on mount
 */
const PageTransition = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.classList.add('page-transition');
    }
  }, []);

  return (
    <div ref={ref} className={`${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;
