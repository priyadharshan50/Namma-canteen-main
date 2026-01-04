import React from 'react';

/**
 * LoadingSkeleton - Shimmer loading placeholders for async content
 * Provides visual feedback while data is being fetched
 */

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = '', ...props }) => (
  <div 
    className={`skeleton bg-dark-800 ${className}`}
    {...props}
  />
);

// Text line skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase 
        key={i} 
        className={`h-4 rounded ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

// Circle skeleton (for avatars)
export const SkeletonCircle = ({ size = 48, className = '' }) => (
  <SkeletonBase 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

// Card skeleton
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-dark-800 rounded-2xl p-6 border border-dark-700 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <SkeletonCircle size={48} />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-1/2 rounded mb-2" />
        <SkeletonBase className="h-3 w-1/3 rounded" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

// Menu item skeleton
export const SkeletonMenuItem = ({ className = '' }) => (
  <div className={`bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 ${className}`}>
    {/* Image placeholder */}
    <SkeletonBase className="h-48 w-full rounded-none" />
    {/* Content */}
    <div className="p-5 space-y-3">
      <SkeletonBase className="h-6 w-3/4 rounded" />
      <SkeletonBase className="h-4 w-full rounded" />
      <SkeletonBase className="h-4 w-2/3 rounded" />
      <div className="flex justify-between items-center pt-2">
        <SkeletonBase className="h-8 w-20 rounded" />
        <SkeletonBase className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

// Order card skeleton
export const SkeletonOrderCard = ({ className = '' }) => (
  <div className={`bg-dark-800 rounded-2xl p-6 border border-dark-700 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <SkeletonBase className="h-6 w-24 rounded" />
        <SkeletonBase className="h-4 w-32 rounded" />
      </div>
      <SkeletonBase className="h-8 w-20 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonBase className="h-4 w-full rounded" />
      <SkeletonBase className="h-4 w-3/4 rounded" />
    </div>
    <div className="flex gap-3">
      <SkeletonBase className="h-10 flex-1 rounded-xl" />
      <SkeletonBase className="h-10 flex-1 rounded-xl" />
    </div>
  </div>
);

// Dashboard widget skeleton
export const SkeletonWidget = ({ className = '' }) => (
  <div className={`bg-dark-800 rounded-2xl p-5 border border-dark-700 ${className}`}>
    <SkeletonBase className="h-4 w-24 rounded mb-3" />
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBase className="h-8 w-20 rounded" />
        <SkeletonBase className="h-3 w-16 rounded" />
      </div>
      <SkeletonCircle size={56} />
    </div>
  </div>
);

// Table row skeleton
export const SkeletonTableRow = ({ cols = 4, className = '' }) => (
  <div className={`flex gap-4 py-4 border-b border-dark-700 ${className}`}>
    {Array.from({ length: cols }).map((_, i) => (
      <SkeletonBase 
        key={i} 
        className={`h-4 rounded ${i === 0 ? 'w-1/4' : 'flex-1'}`}
      />
    ))}
  </div>
);

// Grid of menu items
export const SkeletonMenuGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonMenuItem key={i} />
    ))}
  </div>
);

// Default export as container component
const LoadingSkeleton = ({ 
  variant = 'card', 
  count = 1,
  className = '' 
}) => {
  const SkeletonComponent = {
    card: SkeletonCard,
    menuItem: SkeletonMenuItem,
    order: SkeletonOrderCard,
    widget: SkeletonWidget,
    text: SkeletonText,
  }[variant] || SkeletonCard;

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
