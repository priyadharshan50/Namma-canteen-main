import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  initRecaptcha, 
  sendPhoneOTP, 
  verifyPhoneOTP,
  IS_FIREBASE_ACTIVE 
} from '../../services/authService';

const PhoneVerification = () => {
  const navigate = useNavigate();
  const { authUser, addNotification, refreshAuthUser } = useApp();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState(''); // For demo mode
  const [countdown, setCountdown] = useState(0);
  const recaptchaRef = useRef(null);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    if (IS_FIREBASE_ACTIVE) {
      initRecaptcha('recaptcha-container');
    }
  }, []);

  // Redirect if already verified
  useEffect(() => {
    if (authUser?.isPhoneVerified) {
      navigate('/profile');
    }
  }, [authUser, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      addNotification('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    setIsLoading(true);
    const result = await sendPhoneOTP(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      setStep('otp');
      setCountdown(60);
      
      // For demo mode, show the OTP
      if (result.otp) {
        setDemoOtp(result.otp);
      }
      
      addNotification(result.message || 'OTP sent successfully!', 'success');
    } else {
      addNotification(result.error || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      addNotification('Please enter the 6-digit OTP', 'error');
      return;
    }

    setIsLoading(true);
    const result = await verifyPhoneOTP(otp);
    setIsLoading(false);

    if (result.success) {
      addNotification('Phone verified successfully! 🎉', 'success');
      
      // Refresh user state
      if (refreshAuthUser) {
        await refreshAuthUser();
      }
      
      navigate('/');
    } else {
      addNotification(result.error || 'Invalid OTP', 'error');
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  // OTP input handler with auto-focus
  const handleOtpChange = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
    
    // Auto-submit when 6 digits entered
    if (numericValue.length === 6) {
      setTimeout(() => handleVerifyOTP(), 500);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaRef}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-dark-900 border border-dark-800 rounded-3xl shadow-2xl mb-6 relative group">
            <div className="absolute inset-0 bg-primary-500/20 rounded-3xl blur-xl group-hover:bg-primary-500/40 transition-all"></div>
            <span className="text-5xl relative">{step === 'phone' ? '📱' : '🔐'}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {step === 'phone' ? 'Verify Identity' : 'Secure Entry'}
          </h1>
          <p className="text-dark-400 font-medium mt-3">
            {step === 'phone' 
              ? 'Multi-factor authentication for your security' 
              : `Verification code sent to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* Card */}
        <div className="card-glass p-8 rounded-[2.5rem] border border-dark-800 shadow-2xl overflow-hidden relative">
          {step === 'phone' ? (
            <div className="space-y-8">
              {/* Phone Input */}
              <div className="space-y-4">
                <label className="text-xs font-black text-dark-500 uppercase tracking-[0.2em] block ml-1">
                  Connect Your Mobile
                </label>
                <div className="flex gap-3">
                  <div className="bg-dark-900 border border-dark-800 rounded-2xl py-5 px-5 font-black text-white flex items-center shadow-inner">
                    <span className="mr-2">🇮🇳</span> +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-dark-900 border border-dark-800 focus:border-primary-500 rounded-2xl py-5 px-6 font-black outline-none transition-all text-xl tracking-widest text-white shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary-500/5 rounded-2xl p-5 border border-primary-500/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-primary-400 uppercase tracking-wider mb-1">Security Protocol</h4>
                    <p className="text-sm text-dark-300 leading-relaxed">
                      We'll send a one-time passcode to ensure it's really you.
                    </p>
                    {!IS_FIREBASE_ACTIVE && (
                      <p className="text-[10px] font-black text-primary-600 uppercase mt-2 tracking-widest">
                        Demo Mode Active
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length < 10}
                className="btn btn-primary btn-xl w-full flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="group-hover:translate-x-1 transition-transform">📲</span>
                    Request Access Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Demo OTP Display */}
              {demoOtp && (
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6 text-center animate-bounce-subtle">
                  <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.3em] mb-2">
                    DEMO BYPASS KEY
                  </p>
                  <p className="text-4xl font-black text-primary-400 tracking-[0.4em]">
                    {demoOtp}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-4">
                <label className="text-xs font-black text-dark-500 uppercase tracking-[0.2em] block text-center">
                  Enter 6-Digit Passphrase
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 focus:border-primary-500 rounded-2xl py-6 px-4 font-black outline-none transition-all text-4xl tracking-[0.6em] text-center text-white shadow-inner"
                  autoFocus
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="btn btn-primary btn-xl w-full flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>🛡️</span> Secure Verification
                  </>
                )}
              </button>

              {/* Resend & Back */}
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  {countdown > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                      <p className="text-dark-500 text-sm font-bold">
                        Retry available in <span className="text-primary-400">{countdown}s</span>
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-primary-400 font-black text-sm hover:text-primary-300 transition-colors uppercase tracking-widest"
                    >
                      Resend Passcode
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setDemoOtp('');
                  }}
                  className="w-full text-dark-500 font-black py-2 text-[10px] hover:text-dark-300 transition-colors uppercase tracking-[0.2em]"
                >
                  ← Modify Target Number
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User context info */}
        {authUser && (
          <div className="mt-8 flex flex-col items-center gap-3">
             <div className="px-4 py-2 bg-dark-900 border border-dark-800 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <p className="text-dark-300 text-xs font-bold truncate max-w-[200px]">
                  ID: {authUser.email}
                </p>
             </div>
             {authUser.emailVerified && (
              <div className="flex items-center gap-2 text-primary-500/60 font-black text-[10px] uppercase tracking-widest">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Email Cleared
              </div>
            )}
          </div>
        )}

        {/* Demo Navigation */}
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/profile')}
            className="text-dark-600 text-xs font-black uppercase tracking-[0.3em] hover:text-primary-500 transition-colors"
          >
            Skip to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
