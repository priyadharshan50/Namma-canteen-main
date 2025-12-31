import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resendEmailVerification } from '../services/authService';
import { useApp } from '../context/AppContext';

const EmailVerificationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  
  const email = location.state?.email || '';
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    const result = await resendEmailVerification();
    setIsResending(false);

    if (result.success) {
      addNotification('Verification email sent!', 'success');
      setCountdown(60);
    } else {
      addNotification(result.error || 'Failed to resend email', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <span className="text-4xl">📧</span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Check Your Email
          </h1>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification link to:
            <br />
            <span className="font-bold text-gray-900">{email || 'your email address'}</span>
          </p>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-2 text-sm">Next Steps:</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Click the verification link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Return here and log in</span>
              </li>
            </ol>
          </div>

          {/* Resend Button */}
          <div className="mb-4">
            {countdown > 0 ? (
              <p className="text-gray-400 text-sm">
                Resend email in <span className="font-bold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-orange-600 font-bold text-sm hover:underline"
              >
                {isResending ? 'Sending...' : "Didn't receive the email? Resend"}
              </button>
            )}
          </div>

          {/* Login Button */}
          <Link
            to="/login"
            className="block w-full bg-orange-600 text-white font-black py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg"
          >
            Go to Login
          </Link>

          {/* Spam Reminder */}
          <p className="text-xs text-gray-400 mt-4">
            💡 Check your spam folder if you don't see the email
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-white/80 text-sm font-medium hover:text-white"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
