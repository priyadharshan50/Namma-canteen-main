import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getFoodPairingSuggestion } from '../services/geminiService';
import { OrderStatus } from '../components/AdminView';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [lastAiSuggestion, setLastAiSuggestion] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [discountPercentage] = useState(10);
  const [attendanceDiscountThreshold] = useState(75);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('student_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem('student_profile', JSON.stringify(profile));
    }
  }, [profile]);

  const addNotification = (message, type = 'sms') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif = { id, message, type, timestamp: new Date() };

    setNotifications(prev => [newNotif, ...prev]);
    setToasts(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const submitFeedback = (feedback) => {
    setFeedbackList(prev => [feedback, ...prev]);
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

  const activeOrderCount = useMemo(() => {
    return orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING).length;
  }, [orders]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const deleteFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (instructions, phoneNumber) => {
    if (cart.length === 0) return;
    
    setIsOrdering(true);
    const suggestion = await getFoodPairingSuggestion(cart);
    setLastAiSuggestion(suggestion);

    const newOrder = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      totalPrice: calculateCartTotals.finalPrice,
      originalTotalPrice: calculateCartTotals.subtotal,
      appliedDiscountPercentage: calculateCartTotals.appliedDiscountPercentage,
      status: OrderStatus.PLACED,
      aiSuggestion: suggestion,
      timestamp: new Date(),
      instructions: instructions || undefined,
      estimatedTime: 10 + (cart.length * 2),
      phoneNumber: phoneNumber,
      studentName: profile?.name,
      studentDept: profile?.dept,
      feedbackSubmitted: false,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsOrdering(false);
    addNotification(`SMS to +91 ${phoneNumber}: Order #${newOrder.id} is confirmed! 🥘`, 'sms');
  };

  const updateOrderStatus = (orderId, newStatus) => {
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

  const cancelOrder = (orderId) => {
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

  const value = {
    // State
    cart,
    orders,
    isOrdering,
    lastAiSuggestion,
    notifications,
    toasts,
    feedbackList,
    profile,
    discountPercentage,
    attendanceDiscountThreshold,
    activeOrderCount,
    
    // Computed
    ...calculateCartTotals,
    
    // Actions
    setProfile,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    addNotification,
    submitFeedback,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
