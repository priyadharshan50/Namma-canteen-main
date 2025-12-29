import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import KitchenPage from './pages/KitchenPage';
import NotFoundPage from './pages/NotFoundPage';
import { useApp } from './context/AppContext';

// Toast Notifications Component
const ToastNotifications = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed top-20 right-4 z-[1000] w-full max-w-xs space-y-2 pointer-events-none">
      {toasts.map(n => (
        <div key={n.id} className="pointer-events-auto bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border-l-4 border-orange-500 animate-bounce transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Incoming SMS</span>
            <span className="text-[10px] text-gray-400">just now</span>
          </div>
          <p className="text-sm font-medium">{n.message}</p>
        </div>
      ))}
    </div>
  );
};

// App Routes Component (needs context)
const AppRoutes = () => {
  return (
    <>
      <ToastNotifications />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
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
    }, 4500);
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
