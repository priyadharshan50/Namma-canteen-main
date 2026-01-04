import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import KitchenPage from './pages/KitchenPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import VerifyOTPScreen from './pages/VerifyOTPScreen';
import EmailVerificationScreen from './pages/EmailVerificationScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import PhoneVerification from './components/auth/PhoneVerification';

// Toast Notifications Component with Color-Coded Status
const ToastNotifications = () => {
  const { toasts } = useApp();

  // Get label background color based on notification type
  const getLabelBgColor = (type) => {
    switch(type) {
      case 'cooking': return 'bg-amber-500';
      case 'ready': return 'bg-primary-500';
      case 'delivered': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'success': return 'bg-primary-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-dark-600';
      default: return 'bg-primary-600';
    }
  };

  return (
    <div className="fixed top-24 right-4 z-[9999] w-full max-w-sm space-y-3 pointer-events-none">
      {toasts.map(n => (
        <div 
          key={n.id} 
          className="pointer-events-auto card-glass p-4 rounded-2xl shadow-2xl transition-all animate-slide-in border-l-4"
          style={{ 
            borderLeftColor: n.borderColor || '#10b981',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span 
              className={`${getLabelBgColor(n.type)} text-[9px] font-black px-2 py-0.5 rounded text-dark-950 uppercase tracking-wider`}
            >
              {n.label || (n.type === 'sms' ? 'SMS' : 'INFO')}
            </span>
            <span className="text-[10px] text-dark-500 font-bold">Just Now</span>
          </div>
          <p className="text-sm font-bold text-white leading-snug">{n.message}</p>
        </div>
      ))}
    </div>
  );
};

// App Routes Component (needs context)
const AppRoutes = () => {
  const location = useLocation();
  
  // Hide navbar on auth pages
  const authPages = ['/login', '/signup', '/verify', '/verify-phone', '/email-verification', '/forgot-password'];
  const showNavbar = !authPages.includes(location.pathname);

  return (
    <>
      <ToastNotifications />
      {showNavbar && <Navbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/verify" element={<VerifyOTPScreen />} />
        <Route path="/verify-phone" element={<PhoneVerification />} />
        <Route path="/email-verification" element={<EmailVerificationScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        
        {/* Main App Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
