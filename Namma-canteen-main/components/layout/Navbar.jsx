import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { cart, activeOrderCount, notifications, profile } = useApp();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Namma Canteen
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/menu"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/menu') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                isActive('/orders') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              My Orders
              {activeOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                  {activeOrderCount}
                </span>
              )}
            </Link>
            <Link
              to="/kitchen"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/kitchen') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Kitchen
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Badge - Mobile Only */}
            {cart.length > 0 && (
              <Link to="/menu" className="md:hidden relative">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                </div>
              </Link>
            )}

            {/* Profile */}
            {profile && (
              <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {profile.name[0]}
                </div>
                <span className="text-sm font-bold text-gray-800">{profile.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around mt-4 border-t border-orange-100 pt-4">
          <Link
            to="/menu"
            className={`flex flex-col items-center gap-1 ${isActive('/menu') ? 'text-orange-600' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-bold">Menu</span>
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 relative ${isActive('/orders') ? 'text-orange-600' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-bold">Orders</span>
            {activeOrderCount > 0 && (
              <span className="absolute -top-1 right-3 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                {activeOrderCount}
              </span>
            )}
          </Link>
          <Link
            to="/kitchen"
            className={`flex flex-col items-center gap-1 ${isActive('/kitchen') ? 'text-orange-600' : 'text-gray-500'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs font-bold">Kitchen</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
