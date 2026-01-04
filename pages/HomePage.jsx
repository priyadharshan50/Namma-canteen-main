import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../constants';
import PageTransition from '../components/PageTransition';

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
  const tierInfo = CREDIT_TIERS?.[creditData?.tier] || CREDIT_TIERS?.[0] || { name: 'Basic' };
  const creditUsagePercent = creditData?.limit > 0 
    ? Math.min(100, ((creditData.balance / creditData.limit) * 100)).toFixed(0)
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* College Blocker Alert */}
          {creditData?.collegeBlocker && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 mb-8 flex items-center gap-4 fade-in">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-black text-red-400">College No-Due Required</h3>
                <p className="text-red-300/80 text-sm">Your ordering is blocked due to pending college fee dues. Please contact the admin office.</p>
              </div>
            </div>
          )}

          {/* Dashboard Widgets */}
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 stagger-children">
              {/* Credit Status Widget */}
              <div className={`card-elevated rounded-2xl p-5 text-white ${
                creditData?.tier === 3 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' :
                creditData?.tier === 2 ? 'bg-gradient-to-br from-slate-400/20 to-slate-600/10 border-slate-400/30' :
                creditData?.tier === 1 ? 'bg-gradient-to-br from-amber-500/20 to-amber-700/10 border-amber-500/30' :
                'bg-gradient-to-br from-dark-700 to-dark-800 border-dark-600'
              }`}>
                <p className="text-xs font-bold uppercase opacity-60 mb-2">Namma Credit</p>
                {creditData?.tier > 0 ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black">₹{availableCredit?.toFixed(0) || 0}</p>
                      <p className="text-xs opacity-60">Available</p>
                    </div>
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 transform -rotate-90">
                        <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/>
                        <circle 
                          cx="28" cy="28" r="24" 
                          stroke="currentColor" strokeWidth="4" fill="none"
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - creditUsagePercent / 100)}`}
                          strokeLinecap="round"
                          className="text-primary-400"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black">{creditUsagePercent}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold">{ordersThisMonth || 0}/20 orders</p>
                    <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary-500 rounded-full h-2 transition-all"
                        style={{ width: `${Math.min(100, ((ordersThisMonth || 0) / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rush Hour Widget */}
              <div className="card-elevated rounded-2xl p-5">
                <p className="text-xs font-bold text-dark-400 uppercase mb-2">Kitchen Status</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    rushHourLevel?.level === 'high' ? 'bg-red-500/20 text-red-400' :
                    rushHourLevel?.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {rushHourLevel?.level === 'high' ? '🔥' : rushHourLevel?.level === 'medium' ? '⏳' : '✅'}
                  </div>
                  <div>
                    <p className={`text-lg font-black ${
                      rushHourLevel?.level === 'high' ? 'text-red-400' :
                      rushHourLevel?.level === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>{rushHourLevel?.label || 'Ready'}</p>
                    <p className="text-xs text-dark-500">{activeOrderCount || 0} orders in queue</p>
                  </div>
                </div>
              </div>

              {/* No-Due Status Widget */}
              <div className={`card-elevated rounded-2xl p-5 ${canOrder ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <p className="text-xs font-bold text-dark-400 uppercase mb-2">College Status</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    canOrder ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}>
                    {canOrder ? '✓' : '✕'}
                  </div>
                  <div>
                    <p className={`text-lg font-black ${canOrder ? 'text-green-400' : 'text-red-400'}`}>
                      {canOrder ? 'No Dues' : 'Blocked'}
                    </p>
                    <p className="text-xs text-dark-500">{canOrder ? 'Clear to order' : 'Contact admin'}</p>
                  </div>
                </div>
              </div>

              {/* Orders This Month Widget */}
              <div className="card-elevated rounded-2xl p-5">
                <p className="text-xs font-bold text-dark-400 uppercase mb-2">This Month</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-xl text-primary-400">
                    📊
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{ordersThisMonth || 0}</p>
                    <p className="text-xs text-dark-500">Orders placed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div className="text-center mb-12 stagger-children">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              {profile ? (
                <>Vanakkam, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">{profile.name}!</span></>
              ) : (
                <>Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Namma Canteen</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-dark-400 font-bold mb-2">
              Fresh Food • Smart Service • AI-Powered
            </p>
            <p className="text-dark-500 max-w-xl mx-auto text-sm">
              Order authentic South Indian cuisine with OTP verification, AI food pairing, and the new Namma Credit BNPL system!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 stagger-children">
            {/* Order Now */}
            <Link to="/menu" className="group">
              <div className={`card-elevated rounded-2xl p-6 transition-all hover:border-primary-500/50 ${!canOrder ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/25">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Browse Menu</h3>
                <p className="text-dark-400 text-sm mb-3">Order delicious food</p>
                <div className="flex items-center gap-1 text-primary-400 font-bold text-sm group-hover:gap-2 transition-all">
                  Order Now <span>→</span>
                </div>
              </div>
            </Link>

            {/* Track Orders */}
            <Link to="/orders" className="group">
              <div className="card-elevated rounded-2xl p-6 transition-all hover:border-blue-500/50 relative">
                {activeOrderCount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                    {activeOrderCount}
                  </span>
                )}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">My Orders</h3>
                <p className="text-dark-400 text-sm mb-3">Track in real-time</p>
                <div className="flex items-center gap-1 text-blue-400 font-bold text-sm group-hover:gap-2 transition-all">
                  View Orders <span>→</span>
                </div>
              </div>
            </Link>

            {/* Profile & Credit */}
            <Link to="/profile" className="group">
              <div className="card-elevated rounded-2xl p-6 transition-all hover:border-purple-500/50">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">My Profile</h3>
                <p className="text-dark-400 text-sm mb-3">Manage credit & profile</p>
                <div className="flex items-center gap-1 text-purple-400 font-bold text-sm group-hover:gap-2 transition-all">
                  {creditData?.tier > 0 ? `${tierInfo.name} Tier` : 'Setup Credit'} <span>→</span>
                </div>
              </div>
            </Link>

            {/* Kitchen View */}
            <Link to="/kitchen" className="group">
              <div className="card-elevated rounded-2xl p-6 transition-all hover:border-green-500/50">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Kitchen KDS</h3>
                <p className="text-dark-400 text-sm mb-3">Staff & admin view</p>
                <div className="flex items-center gap-1 text-green-400 font-bold text-sm group-hover:gap-2 transition-all">
                  Open Dashboard <span>→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Featured Items */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Today's Specials</h2>
              <p className="text-dark-400 text-sm">Handpicked dishes you'll love</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {featuredItems.map((item) => (
                <div key={item.id} className="card-elevated rounded-2xl overflow-hidden group">
                  <div className="relative h-48 bg-dark-700 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-500/30 text-5xl font-black">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-full font-black text-primary-400 text-sm border border-dark-700">
                      ₹{item.price}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black text-white mb-1">{item.name}</h3>
                    <p className="text-dark-400 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="card-glass rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-white mb-6 text-center">Why Namma Canteen?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
              {[
                { icon: '🤖', title: 'AI Food Pairing', desc: 'Personalized suggestions', color: 'purple' },
                { icon: '💳', title: 'Namma Credit', desc: 'Buy Now Pay Later', color: 'green' },
                { icon: '🌿', title: 'Green Token', desc: '₹5 off with BYOP', color: 'emerald' },
                { icon: '📱', title: 'Real-time Tracking', desc: 'Know when it\'s ready', color: 'emerald' },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h4 className="font-black text-white text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-dark-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
