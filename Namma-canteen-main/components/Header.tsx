
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  activeOrderCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, activeOrderCount }) => {
  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-2 rounded-lg shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Namma Canteen
          </h1>
        </div>

        <nav className="flex p-1 bg-orange-50 rounded-xl">
          <button
            onClick={() => setView('student')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'student' ? 'bg-white text-orange-600 shadow-md' : 'text-orange-900/60 hover:text-orange-600'
            }`}
          >
            Order Food
          </button>
          <button
            onClick={() => setView('admin')}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'admin' ? 'bg-white text-orange-600 shadow-md' : 'text-orange-900/60 hover:text-orange-600'
            }`}
          >
            Kitchen KDS
            {activeOrderCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
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
