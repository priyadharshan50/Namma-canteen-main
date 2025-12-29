import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../constants';

const HomePage = () => {
  const { profile, activeOrderCount } = useApp();
  
  const featuredItems = MENU_ITEMS.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            Welcome to <br/>
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Namma Canteen
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-bold mb-4">
            Traditional Taste • Smart Service • AI-Powered Experience
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Order authentic South Indian cuisine with OTP verification, AI food pairing, and attendance-based discounts. Your digital canteen experience starts here!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Order Now */}
          <Link to="/menu" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-orange-500 transition-all hover:shadow-2xl">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Browse Menu</h3>
              <p className="text-gray-600 mb-4">Explore our delicious South Indian dishes</p>
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                Order Now
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Track Orders */}
          <Link to="/orders" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-2xl relative">
              {activeOrderCount > 0 && (
                <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  {activeOrderCount} Active
                </span>
              )}
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">My Orders</h3>
              <p className="text-gray-600 mb-4">Track your orders in real-time</p>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                View Orders
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Kitchen View */}
          <Link to="/kitchen" className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-green-500 transition-all hover:shadow-2xl">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Kitchen KDS</h3>
              <p className="text-gray-600 mb-4">For canteen staff and admins</p>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                Open Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Items */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Today's Specials</h2>
            <p className="text-gray-600">Handpicked dishes you'll love</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative h-48 bg-orange-100 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-600 text-4xl font-black">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full font-black text-orange-600">
                    ₹{item.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Why Choose Namma Canteen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-black text-gray-900 mb-2">AI Food Pairing</h4>
              <p className="text-sm text-gray-600">Get personalized drink suggestions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-black text-gray-900 mb-2">Attendance Rewards</h4>
              <p className="text-sm text-gray-600">10% off for 75%+ attendance</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h4 className="font-black text-gray-900 mb-2">OTP Verification</h4>
              <p className="text-sm text-gray-600">Secure order confirmation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-black text-gray-900 mb-2">Real-time Tracking</h4>
              <p className="text-sm text-gray-600">Know exactly when it's ready</p>
            </div>
          </div>
        </div>

        {/* Profile Greeting */}
        {profile && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Welcome back, <span className="font-black text-orange-600">{profile.name}</span>! 
              {profile.attendancePercentage >= 75 && (
                <span className="ml-2">🎉 You're eligible for the attendance discount!</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
