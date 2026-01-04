
import React from 'react';

const Header = ({ currentView, setView, activeOrderCount }) => {
  return (
    <header className="bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-primary-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-none">
              Namma Canteen
            </h1>
            <span className="text-[9px] font-black text-dark-500 uppercase tracking-[0.3em] mt-1">Institutional Hub</span>
          </div>
        </div>

        <nav className="flex p-1.5 bg-dark-900/50 rounded-2xl border border-dark-800 backdrop-blur-md">
          <button
            onClick={() => setView('student')}
            className={`px-5 py-2 rounded-xl text-sm font-black transition-all duration-300 ${
              currentView === 'student' 
                ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'text-dark-400 hover:text-primary-400 hover:bg-dark-800'
            }`}
          >
            Digital Canteen
          </button>
          <button
            onClick={() => setView('admin')}
            className={`relative px-5 py-2 rounded-xl text-sm font-black transition-all duration-300 ${
              currentView === 'admin' 
                ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'text-dark-400 hover:text-primary-400 hover:bg-dark-800'
            }`}
          >
            Kitchen Control
            {activeOrderCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark-950 font-black animate-bounce-subtle">
                {activeOrderCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
