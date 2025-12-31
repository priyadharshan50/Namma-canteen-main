import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../constants';

const HomePage = () => {
  const { 
    profile, 
    activeOrderCount, 
    creditData, 
    ordersThisMonth, 
    availableCredit,
    rushHourLevel,
    canOrder,
    CREDIT_TIERS,
  } = useApp();
  
  const featuredItems = MENU_ITEMS.slice(0, 3);
  const tierInfo = CREDIT_TIERS[creditData.tier] || CREDIT_TIERS[0];
  const creditUsagePercent = creditData.limit > 0 
    ? Math.min(100, ((creditData.balance / creditData.limit) * 100)).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        {/* College Blocker Alert */}
        {creditData.collegeBlocker && (
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-black text-red-700">College No-Due Required</h3>
              <p className="text-red-600 text-sm">Your ordering is blocked due to pending college fee dues. Please contact the admin office.</p>
            </div>
          </div>
        )}

        {/* Dashboard Widgets */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Credit Status Widget */}
            <div className={`rounded-2xl p-5 text-white ${
              creditData.tier === 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
              creditData.tier === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
              creditData.tier === 1 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
              'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}>
              <p className="text-xs font-bold uppercase opacity-80 mb-1">Namma Credit</p>
              {creditData.tier > 0 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">₹{availableCredit.toFixed(0)}</p>
                    <p className="text-xs opacity-80">Available</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="none"/>
                      <circle 
                        cx="28" cy="28" r="24" 
                        stroke="white" strokeWidth="4" fill="none"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - creditUsagePercent / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black">{creditUsagePercent}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold">{ordersThisMonth}/20 orders</p>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(100, (ordersThisMonth / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rush Hour Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Kitchen Status</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  rushHourLevel.level === 'high' ? 'bg-red-100 text-red-600' :
                  rushHourLevel.level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {rushHourLevel.level === 'high' ? '🔥' : rushHourLevel.level === 'medium' ? '⏳' : '✅'}
                </div>
                <div>
                  <p className={`text-lg font-black ${
                    rushHourLevel.level === 'high' ? 'text-red-600' :
                    rushHourLevel.level === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{rushHourLevel.label}</p>
                  <p className="text-xs text-gray-500">{activeOrderCount} orders in queue</p>
                </div>
              </div>
            </div>

            {/* No-Due Status Widget */}
            <div className={`rounded-2xl p-5 ${canOrder ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">College Status</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  canOrder ? 'bg-green-500' : 'bg-red-500'
                } text-white text-xl`}>
                  {canOrder ? '✓' : '✕'}
                </div>
                <div>
                  <p className={`text-lg font-black ${canOrder ? 'text-green-700' : 'text-red-700'}`}>
                    {canOrder ? 'No Dues' : 'Blocked'}
                  </p>
                  <p className="text-xs text-gray-500">{canOrder ? 'Clear to order' : 'Contact admin'}</p>
                </div>
              </div>
            </div>

            {/* Orders This Month Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">This Month</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
                  📊
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{ordersThisMonth}</p>
                  <p className="text-xs text-gray-500">Orders placed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            {profile ? `Vanakkam, ${profile.name}!` : 'Welcome to'} <br/>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Namma Canteen
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-bold mb-2">
            Traditional Taste • Smart Service • AI-Powered
          </p>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Order authentic South Indian cuisine with OTP verification, AI food pairing, and the new Namma Credit BNPL system!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Order Now */}
          <Link to="/menu" className="group">
            <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-orange-500 transition-all hover:shadow-xl ${!canOrder ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Browse Menu</h3>
              <p className="text-gray-600 text-sm mb-3">Order delicious food</p>
              <div className="flex items-center gap-1 text-orange-600 font-bold text-sm">
                Order Now →
              </div>
            </div>
          </Link>

          {/* Track Orders */}
          <Link to="/orders" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-xl relative">
              {activeOrderCount > 0 && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-full animate-pulse">
                  {activeOrderCount}
                </span>
              )}
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">My Orders</h3>
              <p className="text-gray-600 text-sm mb-3">Track in real-time</p>
              <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                View Orders →
              </div>
            </div>
          </Link>

          {/* Profile & Credit */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-purple-500 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">My Profile</h3>
              <p className="text-gray-600 text-sm mb-3">Manage credit & profile</p>
              <div className="flex items-center gap-1 text-purple-600 font-bold text-sm">
                {creditData.tier > 0 ? `${tierInfo.name} Tier` : 'Setup Credit'} →
              </div>
            </div>
          </Link>

          {/* Kitchen View */}
          <Link to="/kitchen" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-green-500 transition-all hover:shadow-xl">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Kitchen KDS</h3>
              <p className="text-gray-600 text-sm mb-3">Staff & admin view</p>
              <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                Open Dashboard →
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Items */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Today's Specials</h2>
            <p className="text-gray-600 text-sm">Handpicked dishes you'll love</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                <div className="relative h-40 bg-orange-100 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-3xl font-black">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full font-black text-orange-600 text-sm">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-black text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Why Namma Canteen v2.0?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1">AI Food Pairing</h4>
              <p className="text-xs text-gray-600">Personalized suggestions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1">Namma Credit</h4>
              <p className="text-xs text-gray-600">Buy Now Pay Later</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌿</span>
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1">Green Token</h4>
              <p className="text-xs text-gray-600">₹5 off with BYOP</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1">Real-time Tracking</h4>
              <p className="text-xs text-gray-600">Know when it's ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
