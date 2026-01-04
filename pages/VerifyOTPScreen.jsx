import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const VerifyOTPScreen = () => {
  const navigate = useNavigate();
  const { profile, verifyPhoneOtp, sendPhoneOtp, addNotification } = useApp();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (profile?.contact) {
      setPhone(profile.contact);
    }
  }, [profile]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      addNotification('Please enter a valid 10-digit number', 'error');
      return;
    }
    setIsLoading(true);
    const result = await sendPhoneOtp(phone);
    setIsLoading(false);
    
    if (result.success) {
      setStep('otp');
      setCountdown(60);
      addNotification(result.message || 'OTP sent successfully!', 'success');
    } else {
      addNotification(result.error || 'Failed to send OTP', 'error');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      addNotification('Please enter a valid OTP', 'error');
      return;
    }
    setIsLoading(true);
    const result = await verifyPhoneOtp(otp);
    setIsLoading(false);
    
    if (result.success) {
      addNotification('Phone verified successfully! 🎉', 'success');
      navigate('/');
    } else {
      addNotification(result.error || 'Invalid OTP', 'error');
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-3">
              <span className="text-3xl">📱</span>
            </div>
            <h1 className="text-2xl font-black text-white">Verify Phone</h1>
            <p className="text-dark-400 font-medium text-sm">
              {step === 'phone' ? 'Enter your phone number' : 'Enter the OTP sent to you'}
            </p>
          </div>

          {/* Card */}
          <div className="card-glass p-8 rounded-3xl">
            {step === 'phone' ? (
              <div className="space-y-5">
                <div className="input-group">
                  <label className="input-group-label">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="input w-20 text-center text-dark-300">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="input input-glow flex-1"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || phone.length < 10}
                  className="btn btn-primary btn-xl w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="spinner"></div>
                      Sending...
                    </span>
                  ) : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="input-group">
                  <label className="input-group-label">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="input input-glow text-center text-3xl font-black tracking-[0.5em]"
                    autoFocus
                  />
                </div>

                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <span className="text-dark-400">Resend OTP in {countdown}s</span>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      className="text-primary-400 font-bold hover:text-primary-300 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length < 4}
                  className="btn btn-primary btn-xl w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="spinner"></div>
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>

                <button
                  onClick={() => { setStep('phone'); setOtp(''); }}
                  className="w-full text-dark-400 font-bold text-sm hover:text-white transition-colors"
                >
                  ← Change Number
                </button>
              </div>
            )}
          </div>

          {/* Skip Link */}
          <div className="text-center mt-4">
            <Link to="/" className="text-dark-500 text-sm font-medium hover:text-dark-300 transition-colors">
              Skip for now →
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyOTPScreen;
