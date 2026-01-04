import React from 'react';

/**
 * LoadingScreen - Full-page loading overlay with animated logo
 * Use for initial app load or major data fetching operations
 */
const LoadingScreen = ({ message = 'Loading...', progress = null }) => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce">
            <span className="text-5xl">🍛</span>
          </div>
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            NAMMA CANTEEN
          </h1>
          <p className="text-dark-400 text-sm font-medium tracking-wider uppercase">
            {message}
          </p>
        </div>
        
        {/* Progress Bar (optional) */}
        {progress !== null && (
          <div className="w-64">
            <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-dark-500 text-xs mt-2">{progress}%</p>
          </div>
        )}
        
        {/* Spinner (when no progress) */}
        {progress === null && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-3 border-dark-700 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-dark-600 text-xs font-medium tracking-widest">
        SMART CAMPUS DINING
      </div>
    </div>
  );
};

export default LoadingScreen;
