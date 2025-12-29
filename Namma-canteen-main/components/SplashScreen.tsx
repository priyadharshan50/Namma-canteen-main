
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-orange-600 flex flex-col items-center justify-center z-[100] transition-opacity duration-1000">
      <div className="relative">
        {/* Animated Background Circles */}
        <div className="absolute -inset-10 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -inset-20 bg-orange-400 rounded-full blur-3xl opacity-10 animate-ping"></div>
        
        <div className="relative text-center space-y-8 flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-bounce mb-4 rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter animate-pulse">
              NAMMA CANTEEN
            </h1>
            <p className="text-orange-100 font-bold tracking-[0.2em] text-xs uppercase animate-pulse">
              Traditional Taste • Smart Service
            </p>
          </div>

          <div className="w-64 space-y-3">
             <div className="w-full h-1.5 bg-orange-800/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
             </div>
             <p className="text-orange-200 text-[10px] font-bold uppercase tracking-widest text-center">
               {progress < 40 ? 'Heating the Sambar...' : progress < 80 ? 'Grinding the Batter...' : 'Serving Warmth...'}
             </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-orange-300 text-[10px] font-bold tracking-widest">
        HANDCRAFTED IN TAMIL NADU
      </div>
    </div>
  );
};

export default SplashScreen;
