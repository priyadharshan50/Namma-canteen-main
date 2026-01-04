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
    <header className="bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Namma Canteen
              </h1>
              <p className="text-[9px] font-black text-dark-500 uppercase tracking-[0.3em] -mt-0.5">Academic Edition</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/50 p-1.5 rounded-2xl border border-dark-800">
            <Link
              to="/menu"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/menu') ? 'bg-primary-500 text-dark-950 shadow-lg' : 'text-dark-300 hover:text-primary-400 hover:bg-dark-800'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                isActive('/orders') ? 'bg-primary-500 text-dark-950 shadow-lg' : 'text-dark-300 hover:text-primary-400 hover:bg-dark-800'
              }`}
            >
              My Orders
              {activeOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-dark-950 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-dark-950 font-black">
                  {activeOrderCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/profile') ? 'bg-primary-500 text-dark-950 shadow-lg' : 'text-dark-300 hover:text-primary-400 hover:bg-dark-800'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/kitchen"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/kitchen') ? 'bg-primary-500 text-dark-950 shadow-lg' : 'text-dark-300 hover:text-primary-400 hover:bg-dark-800'
              }`}
            >
              Kitchen
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Credit Badge - Desktop */}
            {profile && creditData.tier > 0 && (
              <Link to="/profile" className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-900 border border-dark-800 hover:border-primary-500/50 transition-all group">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  creditData.tier === 3 ? 'bg-yellow-400' :
                  creditData.tier === 2 ? 'bg-slate-400' :
                  'bg-amber-400'
                }`}></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-dark-500 uppercase leading-none mb-1">{tierInfo.name} Credits</span>
                  <span className="text-sm font-bold text-white leading-none">
                    ₹{(creditData.limit - creditData.balance).toFixed(0)}
                  </span>
                </div>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated || profile ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-dark-900 border border-dark-800 p-1.5 pr-3 rounded-2xl hover:bg-dark-800 transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-dark-950 font-black text-sm relative shadow-inner">
                    {profile?.name?.[0] || authUser?.email?.[0]?.toUpperCase() || '?'}
                    {/* Verified badge */}
                    {authUser?.isVerified && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-dark-950 flex items-center justify-center shadow-lg">
                        <svg className="w-2.5 h-2.5 text-dark-950" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-bold text-white max-w-[100px] truncate leading-none mb-1">
                      {profile?.name?.split(' ')[0] || authUser?.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] font-black text-primary-500 uppercase leading-none">Active User</span>
                  </div>
                  <svg className={`w-4 h-4 text-dark-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-dark-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-800 py-3 z-50 overflow-hidden animate-slide-up">
                    <div className="px-5 py-3 border-b border-dark-800 mb-2">
                      <p className="text-[10px] text-dark-500 font-black uppercase tracking-widest mb-1">Identity Profile</p>
                      <p className="text-sm font-bold text-white truncate mb-1">{authUser?.email || profile?.contact}</p>
                      {authUser?.isVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-primary-400 font-bold bg-primary-500/10 px-2 py-1 rounded-lg w-fit">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified Member
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 px-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800 rounded-xl transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">👤</span>
                        My Dashboard
                      </Link>
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800 rounded-xl transition-all"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-primary-400">📦</span>
                        Order History
                      </Link>
                    </div>

                    <div className="mt-3 pt-3 border-t border-dark-800 px-2">
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all"
                      >
                        <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">🚪</span>
                        Disconnect Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-dark-300 px-4 py-2 rounded-xl text-sm font-bold hover:text-white hover:bg-dark-800 transition-all">
                  Log In
                </Link>
                <Link to="/signup" className="bg-primary-500 text-dark-950 px-6 py-2 rounded-xl text-sm font-black hover:bg-primary-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around mt-4 pt-4 border-t border-dark-800">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-primary-500' : 'text-dark-500'}`}
          >
            <div className={`p-2 rounded-xl ${isActive('/') ? 'bg-primary-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Home</span>
          </Link>
          <Link
            to="/menu"
            className={`flex flex-col items-center gap-1 transition-all ${isActive('/menu') ? 'text-primary-500' : 'text-dark-500'}`}
          >
            <div className={`p-2 rounded-xl ${isActive('/menu') ? 'bg-primary-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Menu</span>
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 transition-all relative ${isActive('/orders') ? 'text-primary-500' : 'text-dark-500'}`}
          >
            <div className={`p-2 rounded-xl ${isActive('/orders') ? 'bg-primary-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Orders</span>
            {activeOrderCount > 0 && (
              <span className="absolute top-1 right-2 bg-primary-500 text-dark-950 text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black border border-dark-950">
                {activeOrderCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 transition-all ${isActive('/profile') ? 'text-primary-500' : 'text-dark-500'}`}
          >
            <div className={`p-2 rounded-xl ${isActive('/profile') ? 'bg-primary-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Profile</span>
          </Link>
          <Link
            to="/kitchen"
            className={`flex flex-col items-center gap-1 transition-all ${isActive('/kitchen') ? 'text-primary-500' : 'text-dark-500'}`}
          >
            <div className={`p-2 rounded-xl ${isActive('/kitchen') ? 'bg-primary-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Kitchen</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
