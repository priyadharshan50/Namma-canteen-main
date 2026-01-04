import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * Toast Notification System
 * Provides slide-in notifications with auto-dismiss
 */

// Toast Context for global access
const ToastContext = createContext(null);

// Toast variants with styling
const variants = {
  success: {
    bg: 'bg-green-500/10 border-green-500/50',
    icon: '✓',
    iconBg: 'bg-green-500',
    text: 'text-green-400'
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/50',
    icon: '✕',
    iconBg: 'bg-red-500',
    text: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/10 border-yellow-500/50',
    icon: '!',
    iconBg: 'bg-yellow-500',
    text: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/50',
    icon: 'i',
    iconBg: 'bg-blue-500',
    text: 'text-blue-400'
  },
  sms: {
    bg: 'bg-primary-500/10 border-primary-500/50',
    icon: '📱',
    iconBg: 'bg-primary-500',
    text: 'text-primary-400'
  }
};

// Single Toast Component
const ToastItem = ({ id, message, type = 'info', onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const variant = variants[type] || variants.info;

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div 
      className={`
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        ${variant.bg}
        flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-lg
        shadow-xl max-w-sm w-full pointer-events-auto
      `}
    >
      {/* Icon */}
      <div className={`${variant.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-sm font-bold">{variant.icon}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`${variant.text} text-sm font-medium leading-tight`}>
          {message}
        </p>
      </div>
      
      {/* Close Button */}
      <button 
        onClick={handleDismiss}
        className="text-dark-400 hover:text-dark-200 transition-colors p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Toast Container
export const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-[300] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
    sms: (msg) => addToast(msg, 'sms'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Standalone Toast component for direct use
const Toast = ({ message, type = 'info', onClose }) => {
  return <ToastItem id="standalone" message={message} type={type} onDismiss={onClose} />;
};

export default Toast;
