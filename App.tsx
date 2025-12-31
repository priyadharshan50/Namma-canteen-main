
import React, { useState, useMemo, useEffect } from 'react';
import { View, Order, CartItem, OrderStatus, MenuItem, StudentProfile, AppNotification, Feedback } from './types';
import { MENU_ITEMS } from './constants';
import { getFoodPairingSuggestion } from './services/geminiService';
import Header from './components/Header';
import StudentView from './components/StudentView';
import AdminView from './components/AdminView';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<View>('student');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [lastAiSuggestion, setLastAiSuggestion] = useState<string | null>(null);
  
  // Separate state for persistent history and temporary toasts
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  // State for student feedback
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  // State for attendance and discount feature (now hardcoded for hackathon context)
  // attendancePercentage for a student is now part of their profile.
  const [discountPercentage] = useState(10); // Fixed discount offer: 10%
  const [attendanceDiscountThreshold] = useState(75); // Fixed threshold: 75% attendance needed


  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('student_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('student_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const addNotification = (message: string, type: 'sms' | 'info' = 'sms') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: AppNotification = { id, message, type, timestamp: new Date() };

    // Add to persistent history
    setNotifications(prev => [newNotif, ...prev]);

    // Add to ephemeral toasts
    setToasts(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const submitFeedback = (feedback: Feedback) => {
    setFeedbackList(prev => [feedback, ...prev]);
    // Mark the order as having feedback submitted
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === feedback.orderId ? { ...order, feedbackSubmitted: true } : order
    ));
    addNotification(`Thank you for your feedback for order #${feedback.orderId}!`, 'info');
  };

  const calculateCartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let appliedDiscount = 0;
    let finalPrice = subtotal;
    let actualDiscountPercentage = 0;

    // Student's attendance is now from their profile
    const studentQualifiesForDiscount = 
      profile?.attendancePercentage !== undefined && 
      profile.attendancePercentage >= attendanceDiscountThreshold &&
      discountPercentage > 0;

    if (studentQualifiesForDiscount) {
      actualDiscountPercentage = discountPercentage;
      appliedDiscount = (subtotal * actualDiscountPercentage) / 100;
      finalPrice = subtotal - appliedDiscount;
    }

    return {
      subtotal,
      discountAmount: appliedDiscount,
      finalPrice,
      appliedDiscountPercentage: actualDiscountPercentage,
    };
  }, [cart, profile?.attendancePercentage, discountPercentage, attendanceDiscountThreshold]);

  const { subtotal, discountAmount, finalPrice, appliedDiscountPercentage } = calculateCartTotals;


  const activeOrderCount = useMemo(() => {
    return orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING).length;
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (instructions: string, phoneNumber: string) => {
    if (cart.length === 0) return;
    
    setIsOrdering(true);
    const suggestion = await getFoodPairingSuggestion(cart);
    setLastAiSuggestion(suggestion);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      totalPrice: finalPrice, // Store final price
      originalTotalPrice: subtotal, // Store original total
      appliedDiscountPercentage: appliedDiscountPercentage, // Store applied discount
      status: OrderStatus.PLACED,
      aiSuggestion: suggestion,
      timestamp: new Date(),
      instructions: instructions || undefined,
      estimatedTime: 10 + (cart.length * 2),
      phoneNumber: phoneNumber,
      studentName: profile?.name,
      studentDept: profile?.dept,
      feedbackSubmitted: false, // Initialize feedback as not submitted
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsOrdering(false);
    addNotification(`SMS to +91 ${phoneNumber}: Order #${newOrder.id} is confirmed! 🥘`, 'sms');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order && order.status !== newStatus) {
        let smsMsg = `SMS to +91 ${order.phoneNumber}: Order #${orderId} is now ${newStatus.toUpperCase()}!`;
        if (newStatus === OrderStatus.READY) smsMsg += " 🚀 Come collect it!";
        addNotification(smsMsg, 'sms');
      }
      return prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order) {
        addNotification(`SMS to +91 ${order.phoneNumber}: Order #${orderId} has been CANCELLED.`, 'info');
      }
      return prev.map(o => {
        if (o.id === orderId && o.status === OrderStatus.PLACED) {
          return { ...o, status: OrderStatus.CANCELLED };
        }
        return o;
      });
    });
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 fade-in relative">
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

      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        activeOrderCount={activeOrderCount} 
      />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {currentView === 'student' ? (
          <StudentView 
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            deleteFromCart={deleteFromCart}
            clearCart={clearCart}
            subtotal={subtotal} // Pass subtotal
            discountAmount={discountAmount} // Pass discount amount
            finalPrice={finalPrice} // Pass final price
            onOrder={placeOrder}
            onCancel={cancelOrder}
            addNotification={addNotification}
            isOrdering={isOrdering}
            lastAiSuggestion={lastAiSuggestion}
            orders={orders}
            profile={profile}
            setProfile={setProfile}
            notifications={notifications}
            submitFeedback={submitFeedback}
            discountPercentage={discountPercentage} // Pass fixed discount to student view
            attendanceDiscountThreshold={attendanceDiscountThreshold} // Pass fixed threshold
          />
        ) : (
          <AdminView 
            orders={orders}
            updateStatus={updateOrderStatus}
            feedbackList={feedbackList}
          />
        )}
      </main>

      {currentView === 'student' && cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-orange-600 text-white p-4 rounded-2xl shadow-2xl md:hidden flex justify-between items-center fade-in z-50">
          <div>
            <p className="text-xs uppercase font-bold text-orange-200">Current Total</p>
            <p className="text-xl font-bold">₹{finalPrice.toFixed(2)}</p> {/* Show final price */}
          </div>
          <button 
            onClick={() => {
                const cartSection = document.getElementById('cart-section');
                cartSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold shadow-lg"
          >
            Review ({cart.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default App;