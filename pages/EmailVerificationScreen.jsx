import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resendVerificationEmail } from '../services/authService';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const EmailVerificationScreen = () => {
  const location = useLocation();
  const { addNotification } = useApp();
  const email = location.state?.email || '';
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    const result = await resendVerificationEmail();
    setIsResending(false);
    
    if (result.success) {
      addNotification('Verification email sent!', 'success');
    } else {
      addNotification(result.error || 'Failed to resend', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="card-glass p-8 rounded-3xl text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-full mb-6">
              <span className="text-4xl">📧</span>
            </div>
            
            <h1 className="text-2xl font-black text-white mb-2">Check Your Email</h1>
            <p className="text-dark-400 mb-6">
              We've sent a verification link to:
              <br />
              <span className="font-bold text-white">{email}</span>
            </p>

            {/* Steps */}
            <div className="bg-dark-800/50 rounded-xl p-4 text-left space-y-3 mb-6 border border-dark-700">
              <div className="flex items-start gap-3">
                <span className="bg-primary-500/20 text-primary-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span className="text-sm text-dark-300">Open the email from Namma Canteen</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-500/20 text-primary-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span className="text-sm text-dark-300">Click the verification link</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-primary-500/20 text-primary-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span className="text-sm text-dark-300">Return here to log in</span>
              </div>
            </div>

            {/* Resend Button */}
            <div className="text-center mb-6">
              <p className="text-dark-500 text-sm mb-2">Didn't receive the email?</p>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary-400 font-bold text-sm hover:text-primary-300 transition-colors"
              >
                {isResending ? 'Sending...' : 'Resend Email'}
              </button>
            </div>

            {/* Action Button */}
            <Link
              to="/login"
              className="btn btn-primary btn-xl w-full"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EmailVerificationScreen;
