import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const VerifyOTPScreen = () => {
  const navigate = useNavigate();
  const { authUser, handleSendOTP, handleVerifyOTP, addNotification } = useApp();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState(''); // For demo display
  const [countdown, setCountdown] = useState(0);

  // Redirect if already verified
  useEffect(() => {
    if (authUser?.isVerified) {
      if (!authUser.profileCompleted) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }
  }, [authUser, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      addNotification('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    setIsLoading(true);
    const result = await handleSendOTP(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      setStep('otp');
      setSentOtp(result.otp); // For demo - shows the OTP
      setCountdown(60); // 60 second resend cooldown
      addNotification(`OTP sent to +91 ${phoneNumber}`, 'success');
    } else {
      addNotification(result.error || 'Failed to send OTP', 'error');
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      addNotification('Please enter the 6-digit OTP', 'error');
      return;
    }

    setIsLoading(true);
    const result = await handleVerifyOTP(phoneNumber, otp);
    setIsLoading(false);

    if (result.success) {
      addNotification('Phone verified successfully! 🎉', 'success');
      navigate('/profile');
    } else {
      addNotification(result.error || 'Invalid OTP', 'error');
      setOtp('');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await handleSendCode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">{step === 'phone' ? '📱' : '🔐'}</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {step === 'phone' ? 'Verify Your Phone' : 'Enter OTP'}
          </h1>
          <p className="text-orange-100 font-medium">
            {step === 'phone' 
              ? 'We\'ll send a verification code' 
              : `Code sent to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {step === 'phone' ? (
            <div className="space-y-5">
              {/* Phone Number Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="bg-gray-50 rounded-xl py-4 px-4 font-bold text-gray-500">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-4 px-4 font-bold outline-none transition-all text-lg tracking-wider"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">
                  📱 A 6-digit OTP will be sent to this number to verify your identity.
                </p>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Demo OTP Display */}
              {sentOtp && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 font-bold uppercase mb-1">Demo Mode - Your OTP</p>
                  <p className="text-3xl font-black text-green-700 tracking-widest">{sentOtp}</p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-6 px-4 font-black outline-none transition-all text-3xl tracking-[0.5em] text-center"
                  autoFocus
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-400 text-sm">
                    Resend OTP in <span className="font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-orange-600 font-bold text-sm hover:underline"
                  >
                    Didn't receive? Resend OTP
                  </button>
                )}
              </div>

              {/* Change Number */}
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setSentOtp('');
                }}
                className="w-full text-gray-500 font-bold py-2 text-sm"
              >
                ← Change Phone Number
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        {authUser && (
          <div className="text-center mt-6 text-white/80 text-sm">
            Logged in as: <span className="font-bold">{authUser.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPScreen;
