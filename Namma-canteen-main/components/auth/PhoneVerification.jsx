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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaRef}></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">{step === 'phone' ? '📱' : '🔐'}</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter OTP'}
          </h1>
          <p className="text-orange-100 font-medium mt-2">
            {step === 'phone' 
              ? 'We\'ll send a verification code to your phone' 
              : `Code sent to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {step === 'phone' ? (
            <div className="space-y-6">
              {/* Phone Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="bg-gray-100 rounded-xl py-4 px-4 font-bold text-gray-600 flex items-center">
                    <span className="mr-1">🇮🇳</span> +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-4 px-4 font-bold outline-none transition-all text-lg tracking-wider"
                    autoFocus
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      A 6-digit OTP will be sent via SMS to verify your identity.
                    </p>
                    {!IS_FIREBASE_ACTIVE && (
                      <p className="text-xs text-blue-500 mt-1">
                        Demo Mode: OTP will be displayed on screen
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>📲</span> Send Verification Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Demo OTP Display */}
              {demoOtp && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">
                    Demo Mode - Your OTP
                  </p>
                  <p className="text-3xl font-black text-green-700 tracking-[0.3em]">
                    {demoOtp}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2 text-center">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl py-6 px-4 font-black outline-none transition-all text-4xl tracking-[0.5em] text-center"
                  autoFocus
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>✓</span> Verify & Continue
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-400 text-sm">
                    Resend OTP in <span className="font-bold text-gray-600">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-orange-600 font-bold text-sm hover:underline"
                  >
                    Didn't receive the code? Resend OTP
                  </button>
                )}
              </div>

              {/* Change Number */}
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setDemoOtp('');
                }}
                className="w-full text-gray-500 font-bold py-2 text-sm hover:text-gray-700"
              >
                ← Change Phone Number
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        {authUser && (
          <div className="text-center mt-6">
            <p className="text-white/80 text-sm">
              Logged in as: <span className="font-bold">{authUser.email}</span>
            </p>
            {authUser.emailVerified && (
              <span className="inline-flex items-center gap-1 text-green-200 text-xs font-bold mt-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Email Verified
              </span>
            )}
          </div>
        )}

        {/* Skip for Demo */}
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/profile')}
            className="text-white/60 text-sm font-medium hover:text-white underline"
          >
            Skip for now (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
