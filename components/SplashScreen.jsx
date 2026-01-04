
import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const diff = Math.random() * 5;
        return Math.min(prev + diff, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-[9999] overflow-hidden">
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary-500/10 blur-xl animate-float"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8">
        {/* Professional 3D-style Logo */}
        <div className="relative mb-12 group transition-transform duration-500 hover:scale-105">
          <div className="absolute -inset-6 bg-primary-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary-500/30 transition-all duration-700"></div>
          <div className="relative w-32 h-32 bg-dark-900 border border-dark-800 rounded-[2rem] shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        {/* Brand Reveal */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-white animate-fade-in">
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              NAMMA
            </span>
            <span className="text-white ml-2">CANTEEN</span>
          </h1>
          <p className="text-dark-400 font-black tracking-[0.4em] text-[10px] uppercase opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Traditional Heritage <span className="text-primary-500 mx-2">•</span> Digital Future
          </p>
        </div>

        {/* Performance-style Progress */}
        <div className="w-full space-y-4">
           <div className="relative w-full h-1 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary-500 shadow-[0_0_10px_#10b981] transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
             <span className="text-primary-500 animate-pulse">
               {progress < 30 ? 'Initializing Core...' : progress < 70 ? 'Optimizing Menu...' : 'System Ready'}
             </span>
             <span className="text-dark-500">{Math.round(progress)}%</span>
           </div>
        </div>
      </div>
      
      {/* Footer Signature */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-8 bg-gradient-to-t from-primary-500 to-transparent"></div>
        <p className="text-white text-[9px] font-black tracking-[0.4em] uppercase">
          Namma Canteen v2.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
