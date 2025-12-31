import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, activeOrderCount, profile, creditData, CREDIT_TIERS, authUser, handleLogout, isAuthenticated } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;
  const tierInfo = CREDIT_TIERS[creditData.tier] || CREDIT_TIERS[0];

  const onLogout = async () => {
    await handleLogout();
    setShowUserMenu(false);
    // Clear all app-related local storage
    localStorage.removeItem('namma_auth_session');
    localStorage.removeItem('namma_orders');
    localStorage.removeItem('namma_credit');
    localStorage.removeItem('namma_monthly_orders');
    localStorage.removeItem('student_profile');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Namma Canteen
              </h1>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest -mt-0.5">v2.0</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/menu"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/menu') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
                isActive('/orders') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
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
              to="/profile"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/profile') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/kitchen"
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive('/kitchen') ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              Kitchen
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart Badge - Mobile */}
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

            {/* Credit Badge - Desktop */}
            {profile && creditData.tier > 0 && (
              <Link to="/profile" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 transition-all">
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  creditData.tier === 3 ? 'bg-yellow-100 text-yellow-700' :
                  creditData.tier === 2 ? 'bg-gray-100 text-gray-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {tierInfo.name}
                </span>
                <span className="text-sm font-bold text-gray-600">
                  ₹{(creditData.limit - creditData.balance).toFixed(0)}
                </span>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated || profile ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition-all"
                >
                  <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm relative">
                    {profile?.name?.[0] || authUser?.email?.[0]?.toUpperCase() || '?'}
                    {/* Verified badge */}
                    {authUser?.isVerified && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-800 max-w-[80px] truncate">
                    {profile?.name?.split(' ')[0] || authUser?.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{authUser?.email || profile?.contact}</p>
                      {authUser?.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold mt-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">
                  Log In
                </Link>
                <Link to="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around mt-3 border-t border-orange-100 pt-3">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 ${isActive('/') ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link
            to="/menu"
            className={`flex flex-col items-center gap-0.5 ${isActive('/menu') ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[10px] font-bold">Menu</span>
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-0.5 relative ${isActive('/orders') ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] font-bold">Orders</span>
            {activeOrderCount > 0 && (
              <span className="absolute -top-1 right-2 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                {activeOrderCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 ${isActive('/profile') ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
          <Link
            to="/kitchen"
            className={`flex flex-col items-center gap-0.5 ${isActive('/kitchen') ? 'text-orange-600' : 'text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[10px] font-bold">Kitchen</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
