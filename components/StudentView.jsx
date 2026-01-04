
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { OrderStatus } from './AdminView';

const StudentView = ({ 
  cart, 
  addToCart, 
  removeFromCart, 
  deleteFromCart,
  clearCart,
  subtotal,
  discountAmount,
  finalPrice,
  onOrder,
  onCancel,
  addNotification,
  isOrdering,
  lastAiSuggestion,
  orders,
  profile,
  setProfile,
  notifications,
  submitFeedback,
  discountPercentage,
  attendanceDiscountThreshold
}) => {
  const [selectedCategory, setSelectedCategory] = useState('morning');
  const [instructions, setInstructions] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(profile?.contact || '');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Local state for profile form
  const [profileForm, setProfileForm] = useState(profile || {
    name: '', dept: '', year: '1st Year', college: '', contact: '', attendancePercentage: 0
  });

  const filteredItems = MENU_ITEMS.filter(item => item.category === selectedCategory);

  const studentQualifiesForDiscount = 
    profile?.attendancePercentage !== undefined && 
    profile.attendancePercentage >= attendanceDiscountThreshold &&
    discountPercentage > 0;

  const startOrderFlow = () => {
    if (cart.length === 0) return;
    if (!profile) {
      addNotification("Please create your profile first!", 'info');
      setShowProfileModal(true);
      return;
    }
    setPhoneNumber(profile.contact);
    setShowPhoneModal(true);
  };

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      addNotification("Error: Please enter a 10-digit number.", 'info');
      return;
    }
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setShowOtpStep(true);
    addNotification(`[SMS to ${phoneNumber}] Your verification code is ${randomOtp}`, 'sms');
  };

  const handleVerifyAndOrder = () => {
    if (otp === generatedOtp && generatedOtp !== '') {
      onOrder(instructions, phoneNumber);
      setInstructions('');
      setOtp('');
      setGeneratedOtp('');
      setShowPhoneModal(false);
      setShowOtpStep(false);
    } else {
      addNotification("Invalid OTP! Check the simulated SMS notification.", 'info');
      setOtp('');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.dept || !profileForm.contact) {
      addNotification("Please fill all mandatory fields!", 'info');
      return;
    }
    setProfile({...profileForm}); 
    setShowProfileModal(false);
    addNotification("Profile updated successfully! ✨", 'info');
  };

  const handleFeedbackSubmit = () => {
    if (!profile || !selectedOrderForFeedback || feedbackRating === 0) {
      addNotification("Please provide a rating and ensure you're logged in.", 'info');
      return;
    }

    const newFeedback = {
      id: Math.random().toString(36).substr(2, 9),
      orderId: selectedOrderForFeedback.id,
      studentName: profile.name,
      studentDept: profile.dept,
      rating: feedbackRating,
      comment: feedbackComment,
      timestamp: new Date(),
    };

    submitFeedback(newFeedback);
    setFeedbackRating(0);
    setFeedbackComment('');
    setSelectedOrderForFeedback(null);
    setShowFeedbackModal(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getItemInitials = (itemName) => {
    const words = itemName.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-primary-500 p-6 flex justify-between items-center text-dark-950">
              <div className="flex items-center gap-3">
                 <div className="bg-dark-950/10 p-2 rounded-xl">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                 </div>
                 <div>
                   <h3 className="text-xl font-black">Digital Signals</h3>
                   <p className="text-dark-950/60 text-[9px] font-black uppercase tracking-widest">Live Updates & Notifications</p>
                 </div>
              </div>
              <button onClick={() => setShowNotificationModal(false)} className="bg-dark-950/10 hover:bg-dark-950/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-10 opacity-20">
                  <p className="text-4xl mb-4">📭</p>
                  <p className="font-black text-white">Inbox Passive</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="bg-dark-950/50 p-4 rounded-2xl border border-dark-800 flex gap-4 items-start group hover:border-primary-500/30 transition-all">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'sms' ? 'bg-primary-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-dark-100 font-bold text-sm leading-relaxed">{notif.message}</p>
                      <p className="text-dark-500 text-[9px] font-black uppercase tracking-widest mt-2">{formatTime(notif.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedOrderForFeedback && (
        <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-[3rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem] -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
             <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white">Experience Feedback</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-dark-500 hover:text-white transition-colors">✕</button>
             </div>
             <div className="space-y-8 relative z-10">
                <div className="text-center">
                  <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.3em] mb-4 block">Signal Strength</label>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        className={`transition-all duration-300 transform ${feedbackRating >= star ? 'text-primary-500 scale-110' : 'text-dark-700 hover:text-dark-500 hover:scale-105'}`}
                        onClick={() => setFeedbackRating(star)}
                      >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.3em] mb-3 block">Observations</label>
                  <textarea 
                    value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Transmission your thoughts..."
                    className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl p-4 text-sm font-bold text-white transition-all resize-none outline-none h-32"
                  ></textarea>
                </div>
                <button 
                  onClick={handleFeedbackSubmit} 
                  disabled={feedbackRating === 0}
                  className="btn btn-primary btn-xl w-full"
                >
                  Broadcast Feedback
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-[3rem] w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Identity Core</h3>
                  <p className="text-dark-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Institutional Authentication</p>
                </div>
                <button onClick={() => setShowProfileModal(false)} className="text-dark-500 hover:text-white transition-colors">✕</button>
             </div>
             <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.2em] mb-2 block">Personnel Name</label>
                    <input 
                      type="text" required placeholder="Full Name" 
                      value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl py-4 px-5 font-bold text-white outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.2em] mb-2 block">Primary Sector</label>
                    <input 
                      type="text" required placeholder="CSE / ECE" 
                      value={profileForm.dept} onChange={e => setProfileForm({...profileForm, dept: e.target.value})}
                      className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl py-4 px-5 font-bold text-white outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.2em] mb-2 block">Temporal Phase</label>
                    <select 
                      value={profileForm.year} onChange={e => setProfileForm({...profileForm, year: e.target.value})}
                      className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl py-4 px-5 font-bold text-white outline-none transition-all shadow-inner appearance-none"
                    >
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.2em] mb-2 block">Comms Protocol</label>
                    <input 
                      type="tel" required placeholder="Contact Number" maxLength={10}
                      value={profileForm.contact} onChange={e => setProfileForm({...profileForm, contact: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl py-4 px-5 font-bold text-white outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-dark-500 tracking-[0.2em] mb-2 block">Engagement Level (%)</label>
                    <input 
                      type="number" min="0" max="100" 
                      value={profileForm.attendancePercentage ?? 0} onChange={e => setProfileForm({...profileForm, attendancePercentage: Number(e.target.value)})}
                      className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl py-4 px-5 font-bold text-white outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-xl w-full mt-4">
                  Synchronize Identity
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Phone/OTP Verification Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-shimmer"></div>
            
            {!showOtpStep ? (
              <div className="space-y-8 animate-fade-in">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-dark-950 border border-dark-800 text-primary-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Security Key</h3>
                  <p className="text-dark-400 text-sm font-medium">Validating connection to <br/><b className="text-white">+91 {phoneNumber}</b></p>
                </div>
                <div className="space-y-4">
                  <button onClick={handleSendOtp} className="btn btn-primary btn-xl w-full">Request Code</button>
                  <button onClick={() => setShowPhoneModal(false)} className="text-dark-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Abort Mission</button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                 <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-dark-950 border border-dark-800 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 0l8.382 4.191M12 12L3.618 16.191"/></svg>
                    </div>
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-3xl font-black text-white">Validate OTP</h3>
                   <p className="text-dark-400 text-sm font-medium">Check your digital receiver for the code</p>
                 </div>
                 <input 
                    type="text" maxLength={4} autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="----" className="w-full bg-dark-950 border border-dark-800 focus:border-blue-500 rounded-3xl py-6 text-center text-4xl font-black tracking-[0.4em] outline-none text-white shadow-inner"
                    inputMode="numeric"
                 />
                 <button onClick={handleVerifyAndOrder} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-blue-500 transition-all active:scale-95 text-xl">Integrate & Confirm</button>
                 <button onClick={() => setShowOtpStep(false)} className="text-dark-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Change Frequency</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Card / Header */}
        <div className="bg-dark-900 rounded-[2.5rem] p-8 border border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-bl-[5rem] -mr-24 -mt-24 transition-transform group-hover:scale-110"></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="relative">
                <div className="absolute -inset-2 bg-primary-500/20 rounded-2xl blur-lg group-hover:bg-primary-500/30 transition-all"></div>
                <div className="relative w-20 h-20 bg-dark-950 border border-dark-800 rounded-2xl flex items-center justify-center text-3xl font-black text-primary-500 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                   {profile?.name ? profile.name[0] : 'U'}
                </div>
              </div>
              <div className="space-y-1">
                 {profile ? (
                   <>
                     <h3 className="text-2xl font-black text-white leading-none">Vanakkam, {profile.name}!</h3>
                     <p className="text-dark-400 text-[10px] font-black uppercase tracking-[0.3em]">{profile.dept} <span className="text-primary-500 mx-1">•</span> {profile.year}</p>
                   </>
                 ) : (
                   <>
                     <h3 className="text-2xl font-black text-white leading-none">Vanakkam, Citizen!</h3>
                     <p className="text-dark-400 text-[10px] font-black uppercase tracking-[0.3em]">Identity Hub <span className="text-primary-500 mx-1">•</span> Unregistered</p>
                   </>
                 )}
                 <div className="flex items-center gap-2 pt-2">
                    <div className="h-1.5 w-24 bg-dark-800 rounded-full overflow-hidden">
                       <div className="h-full bg-primary-500 shadow-[0_0_10px_#10b981]" style={{ width: `${profile?.attendancePercentage ?? 0}%` }}></div>
                    </div>
                    <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest whitespace-nowrap">
                      Attendance: {profile?.attendancePercentage ?? 0}%
                    </span>
                 </div>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-4">
             <button 
               onClick={() => setShowNotificationModal(true)}
               className="relative p-4 bg-dark-950 border border-dark-800 rounded-2xl hover:border-primary-500/50 hover:text-primary-500 transition-all shadow-inner group/btn"
             >
                <svg className="w-6 h-6 text-dark-400 group-hover/btn:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                {notifications.length > 0 && (
                   <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-950 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                )}
             </button>
             <button 
               onClick={() => setShowProfileModal(true)}
               className="bg-dark-950 border border-dark-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:border-primary-500/50 hover:bg-dark-900 transition-all shadow-inner"
             >
               {profile ? 'Edit Profile' : 'Setup Profile'}
             </button>
           </div>
        </div>

        {/* Discount Banner */}
        {studentQualifiesForDiscount && (
          <div className="bg-primary-500/10 border border-primary-500/30 text-primary-500 p-6 rounded-[2rem] shadow-[0_0_30px_rgba(16,185,129,0.1)] flex items-center gap-5 animate-pulse">
            <div className="bg-primary-500/20 p-3 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            </div>
            <div>
              <p className="font-black text-2xl leading-tight">Privilege Unlocked</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-1">{discountPercentage}% System Discount Applied <span className="mx-2">•</span> Score {profile.attendancePercentage}%</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">Culinary Feed</h2>
            <p className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Hot & Local <span className="mx-2">•</span> Digital Supply</p>
          </div>
          <div className="inline-flex p-1.5 bg-dark-900 border border-dark-800 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setSelectedCategory('morning')} 
              className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${selectedCategory ==='morning' ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'text-dark-500 hover:text-dark-300'}`}
            >
              SOLAR FEED
            </button>
            <button 
              onClick={() => setSelectedCategory('afternoon')} 
              className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${selectedCategory === 'afternoon' ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'text-dark-500 hover:text-dark-300'}`}
            >
              LUNAR FEED
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" key={selectedCategory}>
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-dark-900 rounded-[2.5rem] border border-dark-800 shadow-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-500 group flex flex-col">
              <div className="relative overflow-hidden h-64 bg-dark-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60 z-10"></div>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="text-dark-800 text-6xl font-black opacity-30 z-0">
                    {getItemInitials(item.name)}
                  </div>
                )}
                <div className="absolute top-6 right-6 bg-dark-900 border border-dark-800/50 backdrop-blur-xl px-5 py-2.5 rounded-2xl font-black text-primary-500 shadow-2xl text-xl z-20">₹{item.price}</div>
              </div>
              <div className="p-8 flex flex-col flex-grow relative z-20">
                <h3 className="font-black text-2xl text-white mb-3 group-hover:text-primary-400 transition-colors leading-tight">{item.name}</h3>
                <p className="text-dark-500 text-sm mb-8 flex-grow leading-relaxed font-medium">{item.description}</p>
                <button 
                  onClick={() => addToCart(item)} 
                  className="w-full bg-dark-950 border border-dark-800 text-primary-500 hover:bg-primary-500 hover:text-dark-950 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-inner group/add"
                >
                  <span className="text-lg group-hover/add:scale-125 transition-transform">+</span>
                  Sync to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="space-y-8">
        <div id="cart-section" className="bg-dark-900 border border-dark-800 rounded-[3rem] p-8 sticky top-24 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem] -mr-16 -mt-16"></div>
          
          <h2 className="text-2xl font-black flex items-center gap-4 mb-10 relative z-10 text-white">
            <div className="bg-primary-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dark-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            Active Tray
          </h2>

          {cart.length === 0 ? (
            <div className="py-20 text-center relative z-10">
              <div className="text-6xl mb-6 opacity-10 filter grayscale">🍲</div>
              <p className="font-black text-xl text-dark-600">Tray Is Empty</p>
              <p className="text-[9px] mt-2 font-black uppercase tracking-[0.3em] text-dark-800">Operational signals Required</p>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              <div className="max-h-[40vh] overflow-y-auto space-y-5 pr-3 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="group border-b border-dark-800 pb-5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-black text-white text-base leading-tight">{item.name}</h4>
                        <p className="text-[9px] text-primary-500 font-black uppercase tracking-widest mt-1">₹{item.price} / Unit</p>
                      </div>
                      <button onClick={() => deleteFromCart(item.id)} className="text-dark-700 hover:text-red-500 transition-colors">✕</button>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-lg font-black text-white">₹{item.price * item.quantity}</span>
                       <div className="flex items-center gap-4 bg-dark-950 border border-dark-800 p-1 rounded-xl shadow-inner">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-dark-400 font-black transition-all">-</button>
                        <span className="font-black text-sm text-white">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center hover:bg-primary-500/10 hover:text-primary-500 text-dark-400 font-black transition-all">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-dark-800">
                <label className="text-[10px] font-black uppercase text-dark-600 tracking-[0.3em] block">Preparation Notes</label>
                <textarea 
                  value={instructions} onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Encryption keys for the chef..."
                  className="w-full bg-dark-950 border border-dark-800 focus:border-primary-500 rounded-2xl p-4 text-xs font-bold text-white transition-all resize-none outline-none shadow-inner" rows={2}
                />
              </div>

              <div className="pt-8 border-t-2 border-dashed border-dark-800 space-y-4">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-dark-400 text-[10px] font-black uppercase tracking-[0.2em]">Initial Load</span>
                  <span className="text-lg font-black text-dark-200 tabular-nums">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.2em]">Privilege Offset</span>
                    <span className="text-lg font-black text-primary-500 tabular-nums">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Net Total</span>
                  <span className="text-4xl font-black text-primary-500 tabular-nums">₹{finalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={startOrderFlow} disabled={isOrdering}
                  className="btn btn-primary btn-xl w-full mt-4 active:scale-95 transition-transform"
                >
                  Generate Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Orders with Profile Context */}
        {orders.length > 0 && (
          <div className="bg-dark-900 border border-dark-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/5 rounded-bl-[5rem] -ml-16 -mt-16"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-white">Chronicle Feed</h2>
                <p className="text-[10px] font-black uppercase text-dark-500 tracking-[0.3em] mt-1">Order History & Temporal Logs</p>
              </div>
              <span className="bg-dark-950 border border-dark-800 text-primary-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{orders.length} Records</span>
            </div>

            <div className="space-y-6 relative z-10">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-dark-950 border border-dark-800 rounded-3xl p-6 hover:border-primary-500/30 transition-all group/item"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-primary-500/10 text-primary-500' : 
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-dark-500 text-[10px] font-black uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-dark-900/50 p-3 rounded-xl border border-dark-800/50">
                             <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
                                <span className="text-dark-100 font-bold text-sm">{item.name}</span>
                             </div>
                             <span className="text-dark-400 text-xs font-black">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col justify-between items-end gap-4 min-w-[120px]">
                      <div className="text-right">
                        <p className="text-dark-500 text-[9px] font-black uppercase tracking-widest mb-1">{order.timestamp}</p>
                        <p className="text-2xl font-black text-white">₹{order.total}</p>
                      </div>
                      
                      {order.status === 'delivered' && !order.feedback && (
                        <button 
                          onClick={() => { setSelectedOrderForFeedback(order); setShowFeedbackModal(true); }}
                          className="bg-primary-500 hover:bg-primary-400 text-dark-950 font-black text-[9px] px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(16,185,129,0.2)]"
                        >
                          Send Log
                        </button>
                      )}
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button 
                          onClick={() => onCancel(order.id)}
                          className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          Abort
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
