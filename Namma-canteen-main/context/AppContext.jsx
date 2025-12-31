import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { getFoodPairingSuggestion } from '../services/geminiService';
import * as authService from '../services/authService';

// Order Status Constants
export const OrderStatus = {
  PLACED: 'Order Placed',
  COOKING: 'Cooking',
  READY: 'Ready',
  CANCELLED: 'Cancelled',
  DELIVERED: 'Delivered'
};

// Credit Tier Constants
export const CREDIT_TIERS = {
  0: { name: 'None', limit: 0, color: 'gray' },
  1: { name: 'Bronze', limit: 500, color: 'amber' },
  2: { name: 'Silver', limit: 1000, color: 'slate' },
  3: { name: 'Gold', limit: 2000, color: 'yellow' },
};

// Transaction Types
export const TRANSACTION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  PENALTY: 'penalty',
  REFUND: 'refund',
};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Helper: Check if date is in current month
const isThisMonth = (date) => {
  const now = new Date();
  const d = new Date(date);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// Helper: Get current month key (YYYY-MM)
const getMonthKey = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const AppProvider = ({ children }) => {
  // ==================== EXISTING STATE ====================
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('namma_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOrdering, setIsOrdering] = useState(false);
  const [lastAiSuggestion, setLastAiSuggestion] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [discountPercentage] = useState(10);
  const [attendanceDiscountThreshold] = useState(75);
  const [greenTokenEnabled, setGreenTokenEnabled] = useState(false);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('student_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // ==================== AUTHENTICATION STATE ====================
  const [authUser, setAuthUser] = useState(() => authService.getCurrentUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Computed: Check if user is fully authenticated (email + phone verified)
  const isFullyAuthenticated = authUser?.emailVerified && authUser?.isPhoneVerified;

  // Initialize auth state on mount
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
      
      // Sync profile with auth user's profile if exists
      if (user?.profile && !profile) {
        setProfile(user.profile);
      }
    });
    return () => unsubscribe();
  }, []);

  // Refresh auth user from Firestore
  const refreshAuthUser = useCallback(async () => {
    if (!authUser?.uid) return;
    
    const userData = await authService.getUserDocument(authUser.uid);
    if (userData) {
      setAuthUser({ ...authUser, ...userData });
    }
  }, [authUser]);

  // ==================== NAMMA CREDIT STATE ====================
  const [creditData, setCreditData] = useState(() => {
    const saved = localStorage.getItem('namma_credit');
    return saved ? JSON.parse(saved) : {
      isEligible: false,
      isApproved: false,
      authorizationRequested: false,
      tier: 0,
      limit: 0,
      balance: 0,
      dueDate: null,
      daysLate: 0,
      penalty: 0,
      isProbation: false,
      monthsOnTime: 0,
      collegeBlocker: false,
      transactions: [],
    };
  });

  const [monthlyOrders, setMonthlyOrders] = useState(() => {
    const saved = localStorage.getItem('namma_monthly_orders');
    return saved ? JSON.parse(saved) : {};
  });

  // Admin: All students credit data (simulated for demo)
  const [allStudentsCredit, setAllStudentsCredit] = useState(() => {
    const saved = localStorage.getItem('namma_all_students_credit');
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    if (profile) {
      localStorage.setItem('student_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('namma_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('namma_credit', JSON.stringify(creditData));
  }, [creditData]);

  useEffect(() => {
    localStorage.setItem('namma_monthly_orders', JSON.stringify(monthlyOrders));
  }, [monthlyOrders]);

  useEffect(() => {
    localStorage.setItem('namma_all_students_credit', JSON.stringify(allStudentsCredit));
  }, [allStudentsCredit]);

  // ==================== NOTIFICATIONS ====================
  // Status color mapping for notifications
  const STATUS_COLORS = {
    cooking: { border: '#FBBF24', bg: 'bg-yellow-900/20', label: '👨‍🍳 Cooking' },
    ready: { border: '#10B981', bg: 'bg-green-900/20', label: '✅ Ready' },
    delivered: { border: '#3B82F6', bg: 'bg-blue-900/20', label: '🎉 Delivered' },
    cancelled: { border: '#EF4444', bg: 'bg-red-900/20', label: '❌ Cancelled' },
    sms: { border: '#F97316', bg: 'bg-orange-900/20', label: '📱 SMS' },
    info: { border: '#8B5CF6', bg: 'bg-purple-900/20', label: 'ℹ️ Info' },
    success: { border: '#10B981', bg: 'bg-green-900/20', label: '✅ Success' },
    error: { border: '#EF4444', bg: 'bg-red-900/20', label: '❌ Error' },
  };

  const addNotification = useCallback((message, type = 'sms', orderStatus = null) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Determine notification theme based on order status or type
    let notifType = type;
    if (orderStatus) {
      if (orderStatus === OrderStatus.COOKING) notifType = 'cooking';
      else if (orderStatus === OrderStatus.READY) notifType = 'ready';
      else if (orderStatus === OrderStatus.DELIVERED) notifType = 'delivered';
      else if (orderStatus === OrderStatus.CANCELLED) notifType = 'cancelled';
    }
    
    const colorConfig = STATUS_COLORS[notifType] || STATUS_COLORS.sms;
    
    const newNotif = { 
      id, 
      message, 
      type: notifType, 
      timestamp: new Date(),
      borderColor: colorConfig.border,
      bgClass: colorConfig.bg,
      label: colorConfig.label,
    };

    setNotifications(prev => [newNotif, ...prev]);
    setToasts(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  // ==================== CREDIT ELIGIBILITY & CALCULATIONS ====================
  
  // Calculate orders this month
  const ordersThisMonth = useMemo(() => {
    return orders.filter(o => 
      isThisMonth(o.timestamp) && 
      o.status !== OrderStatus.CANCELLED
    ).length;
  }, [orders]);

  // Check if student is eligible for credit (20+ orders this month)
  const checkCreditEligibility = useCallback(() => {
    return ordersThisMonth >= 20;
  }, [ordersThisMonth]);

  // Calculate penalty for late payment
  const calculatePenalty = useCallback(() => {
    if (!creditData.dueDate || creditData.balance === 0) return 0;
    
    const now = new Date();
    const due = new Date(creditData.dueDate);
    const daysLate = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
    return daysLate * 5; // ₹5 per day
  }, [creditData.dueDate, creditData.balance]);

  // Update eligibility status
  useEffect(() => {
    const isEligible = checkCreditEligibility();
    if (isEligible !== creditData.isEligible) {
      setCreditData(prev => ({ ...prev, isEligible }));
      if (isEligible && !creditData.isApproved) {
        addNotification('🎉 Congratulations! You are now eligible for Namma Credit!', 'info');
      }
    }
  }, [ordersThisMonth, creditData.isEligible, creditData.isApproved, checkCreditEligibility, addNotification]);

  // Update penalty daily
  useEffect(() => {
    const penalty = calculatePenalty();
    if (penalty !== creditData.penalty) {
      setCreditData(prev => ({ 
        ...prev, 
        penalty,
        daysLate: Math.max(0, Math.floor((new Date() - new Date(prev.dueDate)) / (1000 * 60 * 60 * 24)))
      }));
    }
  }, [calculatePenalty, creditData.penalty]);

  // ==================== CREDIT ACTIONS ====================

  // Student requests credit authorization
  const requestCreditAuthorization = useCallback(() => {
    if (!creditData.isEligible) {
      addNotification('❌ You need 20 orders this month to be eligible for credit.', 'info');
      return false;
    }
    if (creditData.authorizationRequested) {
      addNotification('⏳ Authorization already requested. Awaiting admin approval.', 'info');
      return false;
    }
    
    setCreditData(prev => ({ ...prev, authorizationRequested: true }));
    
    // Add to admin queue
    if (profile) {
      setAllStudentsCredit(prev => {
        const exists = prev.find(s => s.contact === profile.contact);
        if (exists) {
          return prev.map(s => s.contact === profile.contact 
            ? { ...s, authorizationRequested: true, ordersThisMonth } 
            : s
          );
        }
        return [...prev, {
          ...profile,
          authorizationRequested: true,
          isApproved: false,
          tier: 0,
          limit: 0,
          balance: 0,
          ordersThisMonth,
          collegeBlocker: false,
        }];
      });
    }
    
    addNotification('✅ Credit authorization requested! Awaiting manager approval.', 'info');
    return true;
  }, [creditData.isEligible, creditData.authorizationRequested, profile, ordersThisMonth, addNotification]);

  // Admin approves credit for student
  const approveCredit = useCallback((studentContact) => {
    // Update the student in allStudentsCredit
    setAllStudentsCredit(prev => prev.map(s => {
      if (s.contact === studentContact) {
        const updatedStudent = {
          ...s,
          isApproved: true,
          tier: 1,
          limit: CREDIT_TIERS[1].limit,
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        };
        return updatedStudent;
      }
      return s;
    }));

    // If it's the current user, update their credit data
    if (profile && profile.contact === studentContact) {
      setCreditData(prev => ({
        ...prev,
        isApproved: true,
        tier: 1,
        limit: CREDIT_TIERS[1].limit,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      }));
      addNotification('🎉 Your Namma Credit has been approved! Tier 1: ₹500 limit.', 'sms');
    }
  }, [profile, addNotification]);

  // Admin blocks/unblocks student (college fee default)
  const toggleCollegeBlocker = useCallback((studentContact, block) => {
    setAllStudentsCredit(prev => prev.map(s => 
      s.contact === studentContact ? { ...s, collegeBlocker: block } : s
    ));

    if (profile && profile.contact === studentContact) {
      setCreditData(prev => ({ ...prev, collegeBlocker: block }));
      if (block) {
        addNotification('⚠️ Your ordering has been blocked due to college fee defaults.', 'info');
      } else {
        addNotification('✅ Your ordering block has been lifted.', 'info');
      }
    }
  }, [profile, addNotification]);

  // Pay with credit
  const payWithCredit = useCallback((amount) => {
    const effectiveLimit = creditData.isProbation 
      ? creditData.limit * 0.5 
      : creditData.limit;
    
    const availableCredit = effectiveLimit - creditData.balance;
    
    if (amount > availableCredit) {
      addNotification(`❌ Insufficient credit! Available: ₹${availableCredit.toFixed(2)}`, 'info');
      return false;
    }

    const transaction = {
      type: TRANSACTION_TYPES.ORDER,
      amount,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    };

    setCreditData(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [transaction, ...prev.transactions],
    }));

    // Update in allStudentsCredit
    if (profile) {
      setAllStudentsCredit(prev => prev.map(s => 
        s.contact === profile.contact 
          ? { ...s, balance: s.balance + amount }
          : s
      ));
    }

    return true;
  }, [creditData, profile, addNotification]);

  // Make payment (repay credit)
  const makePayment = useCallback((amount) => {
    if (amount <= 0) return false;
    
    const totalDue = creditData.balance + creditData.penalty;
    const paymentAmount = Math.min(amount, totalDue);

    const transaction = {
      type: TRANSACTION_TYPES.PAYMENT,
      amount: paymentAmount,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    };

    // Check if payment clears the debt on time
    const isOnTime = creditData.daysLate === 0;

    setCreditData(prev => {
      let newBalance = prev.balance - paymentAmount;
      let newPenalty = prev.penalty;
      
      // Apply to penalty first, then balance
      if (paymentAmount >= prev.penalty) {
        newPenalty = 0;
        newBalance = prev.balance - (paymentAmount - prev.penalty);
      } else {
        newPenalty = prev.penalty - paymentAmount;
        newBalance = prev.balance;
      }

      let newMonthsOnTime = isOnTime && newBalance <= 0 ? prev.monthsOnTime + 1 : 0;
      let newTier = prev.tier;
      let newLimit = prev.limit;
      let newProbation = prev.isProbation;

      // Tier upgrade check (2 consecutive on-time months)
      if (newMonthsOnTime >= 2 && newTier < 3) {
        newTier = newTier + 1;
        newLimit = CREDIT_TIERS[newTier].limit;
        addNotification(`🎉 Upgraded to ${CREDIT_TIERS[newTier].name} tier! New limit: ₹${newLimit}`, 'sms');
      }

      // Clear probation if paid on time
      if (newBalance <= 0 && isOnTime) {
        newProbation = false;
      }

      return {
        ...prev,
        balance: Math.max(0, newBalance),
        penalty: newPenalty,
        monthsOnTime: newMonthsOnTime,
        tier: newTier,
        limit: newLimit,
        isProbation: newProbation,
        dueDate: newBalance <= 0 ? null : prev.dueDate,
        transactions: [transaction, ...prev.transactions],
      };
    });

    addNotification(`✅ Payment of ₹${paymentAmount.toFixed(2)} received. Thank you!`, 'sms');
    return true;
  }, [creditData, addNotification]);

  // Apply probation (called when late payment detected)
  const applyProbation = useCallback(() => {
    setCreditData(prev => ({
      ...prev,
      isProbation: true,
      monthsOnTime: 0,
    }));
    addNotification('⚠️ Late payment detected. Your credit limit has been reduced by 50%.', 'info');
  }, [addNotification]);

  // ==================== CART CALCULATIONS ====================
  const calculateCartTotals = useMemo(() => {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply Green Token discount
    if (greenTokenEnabled && subtotal > 0) {
      subtotal = Math.max(0, subtotal - 5);
    }
    
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
      greenTokenDiscount: greenTokenEnabled ? 5 : 0,
    };
  }, [cart, profile?.attendancePercentage, discountPercentage, attendanceDiscountThreshold, greenTokenEnabled]);

  const activeOrderCount = useMemo(() => {
    return orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING).length;
  }, [orders]);

  // Rush hour calculation (active orders in kitchen)
  const rushHourLevel = useMemo(() => {
    const activeCount = orders.filter(o => 
      o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING
    ).length;
    
    if (activeCount >= 10) return { level: 'high', label: 'Very Busy', color: 'red' };
    if (activeCount >= 5) return { level: 'medium', label: 'Moderate', color: 'yellow' };
    return { level: 'low', label: 'Quick Service', color: 'green' };
  }, [orders]);

  // Credit available check
  const availableCredit = useMemo(() => {
    if (!creditData.isApproved) return 0;
    const effectiveLimit = creditData.isProbation 
      ? creditData.limit * 0.5 
      : creditData.limit;
    return Math.max(0, effectiveLimit - creditData.balance);
  }, [creditData]);

  // Can order check (blocked by college fee default)
  const canOrder = useMemo(() => {
    return !creditData.collegeBlocker;
  }, [creditData.collegeBlocker]);

  // ==================== CART ACTIONS ====================
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const deleteFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ==================== ORDER ACTIONS ====================
  const placeOrder = useCallback(async (instructions, phoneNumber, paymentMethod = 'cash') => {
    if (cart.length === 0) return;
    if (!canOrder) {
      addNotification('❌ Ordering is blocked. Please clear college dues.', 'info');
      return;
    }
    
    const { finalPrice, subtotal, appliedDiscountPercentage, greenTokenDiscount } = calculateCartTotals;

    // Handle credit payment
    if (paymentMethod === 'credit') {
      if (!creditData.isApproved) {
        addNotification('❌ Credit not approved. Please use cash payment.', 'info');
        return;
      }
      if (!payWithCredit(finalPrice)) {
        return;
      }
    }

    setIsOrdering(true);
    const suggestion = await getFoodPairingSuggestion(cart);
    setLastAiSuggestion(suggestion);

    const newOrder = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      totalPrice: finalPrice,
      originalTotalPrice: subtotal,
      appliedDiscountPercentage,
      greenTokenDiscount,
      status: OrderStatus.PLACED,
      aiSuggestion: suggestion,
      timestamp: new Date().toISOString(),
      instructions: instructions || undefined,
      estimatedTime: 10 + (cart.length * 2),
      phoneNumber,
      studentName: profile?.name,
      studentDept: profile?.dept,
      feedbackSubmitted: false,
      paymentMethod,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsOrdering(false);

    // Update monthly order count
    const monthKey = getMonthKey();
    setMonthlyOrders(prev => ({
      ...prev,
      [monthKey]: (prev[monthKey] || 0) + 1,
    }));

    addNotification(`SMS to +91 ${phoneNumber}: Order #${newOrder.id} confirmed! ${paymentMethod === 'credit' ? '(Paid via Credit)' : ''} 🥘`, 'sms');
  }, [cart, canOrder, calculateCartTotals, creditData.isApproved, payWithCredit, profile, addNotification]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order && order.status !== newStatus) {
        let smsMsg = '';
        if (newStatus === OrderStatus.COOKING) {
          smsMsg = `👨‍🍳 Order #${orderId}: Chef started preparing your meal!`;
        } else if (newStatus === OrderStatus.READY) {
          smsMsg = `✅ Order #${orderId}: Your order is ready for pickup! 🚀`;
        } else if (newStatus === OrderStatus.DELIVERED) {
          smsMsg = `🎉 Order #${orderId}: Enjoy your meal! Please leave feedback.`;
        } else {
          smsMsg = `SMS to +91 ${order.phoneNumber}: Order #${orderId} is now ${newStatus.toUpperCase()}!`;
        }
        addNotification(smsMsg, 'sms', newStatus);
      }
      return prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    });
  }, [addNotification]);

  const cancelOrder = useCallback((orderId) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order) {
        addNotification(`SMS to +91 ${order.phoneNumber}: Order #${orderId} has been CANCELLED.`, 'info');
        
        // Refund credit if paid via credit
        if (order.paymentMethod === 'credit') {
          setCreditData(cred => ({
            ...cred,
            balance: Math.max(0, cred.balance - order.totalPrice),
            transactions: [{
              type: TRANSACTION_TYPES.REFUND,
              amount: order.totalPrice,
              date: new Date().toISOString(),
              orderId,
              id: Math.random().toString(36).substr(2, 9),
            }, ...cred.transactions],
          }));
          addNotification(`✅ ₹${order.totalPrice.toFixed(2)} refunded to your credit.`, 'info');
        }
      }
      return prev.map(o => {
        if (o.id === orderId && o.status === OrderStatus.PLACED) {
          return { ...o, status: OrderStatus.CANCELLED };
        }
        return o;
      });
    });
  }, [addNotification]);

  const submitFeedback = useCallback((feedback) => {
    setFeedbackList(prev => [feedback, ...prev]);
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === feedback.orderId ? { ...order, feedbackSubmitted: true } : order
    ));
    addNotification(`Thank you for your feedback for order #${feedback.orderId}!`, 'info');
  }, [addNotification]);

  // ==================== AUTHENTICATION ACTIONS ====================
  
  const handleSignup = useCallback(async (email, password) => {
    const result = await authService.signUp(email, password);
    if (result.success) {
      setAuthUser(result.user);
    }
    return result;
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    const result = await authService.logIn(email, password);
    if (result.success) {
      setAuthUser(result.user);
      // Sync profile if exists
      if (result.user.profile) {
        setProfile(result.user.profile);
      }
    }
    return result;
  }, []);

  const handleLogout = useCallback(async () => {
    await authService.logOut();
    setAuthUser(null);
    // Optionally clear other state
    // setProfile(null);
    // setCart([]);
    addNotification('You have been logged out.', 'info');
  }, [addNotification]);

  const handleForgotPassword = useCallback(async (email) => {
    return await authService.sendPasswordReset(email);
  }, []);

  const handleSendOTP = useCallback(async (phoneNumber) => {
    const result = await authService.sendPhoneOTP(phoneNumber);
    if (result.success) {
      addNotification(`OTP sent to +91 ${phoneNumber}`, 'sms');
    }
    return result;
  }, [addNotification]);

  const handleVerifyOTP = useCallback(async (phoneNumber, otp) => {
    const result = await authService.verifyPhoneOTP(otp);
    if (result.success) {
      // Refresh auth user state
      const updatedUser = authService.getCurrentUser();
      setAuthUser(updatedUser);
      addNotification('Phone verified successfully! ✅', 'success');
    }
    return result;
  }, [addNotification]);

  const handleUpdateAuthProfile = useCallback(async (profileData) => {
    const result = await authService.updateUserProfile(profileData);
    if (result.success) {
      setAuthUser(result.user);
      setProfile(profileData);
      addNotification('Profile updated successfully! ✨', 'success');
    }
    return result;
  }, [addNotification]);

  const getAllAuthUsers = useCallback(() => {
    return authService.getAllUsers();
  }, []);

  // ==================== CONTEXT VALUE ====================
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
    greenTokenEnabled,
    
    // Credit State
    creditData,
    monthlyOrders,
    ordersThisMonth,
    allStudentsCredit,
    availableCredit,
    canOrder,
    rushHourLevel,
    
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
    setGreenTokenEnabled,
    
    // Credit Actions
    requestCreditAuthorization,
    approveCredit,
    toggleCollegeBlocker,
    payWithCredit,
    makePayment,
    applyProbation,
    setCreditData,
    setAllStudentsCredit,
    
    // Constants
    OrderStatus,
    CREDIT_TIERS,
    TRANSACTION_TYPES,
    
    // Authentication State
    authUser,
    isAuthLoading,
    isAuthenticated: !!authUser,
    isVerified: authUser?.isVerified || false,
    isProfileCompleted: authUser?.profileCompleted || false,
    isFullyAuthenticated,
    emailVerified: authUser?.emailVerified || false,
    isPhoneVerified: authUser?.isPhoneVerified || false,
    
    // Auth Actions
    handleSignup,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    handleSendOTP,
    handleVerifyOTP,
    handleUpdateAuthProfile,
    getAllAuthUsers,
    refreshAuthUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
