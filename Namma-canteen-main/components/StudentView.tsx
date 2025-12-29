
import React, { useState } from 'react';
import { MenuItem, CartItem, Order, FoodCategory, OrderStatus, StudentProfile, AppNotification, Feedback } from '../types';
import { MENU_ITEMS } from '../constants';

interface StudentViewProps {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number; // New prop for subtotal
  discountAmount: number; // New prop for discount amount
  finalPrice: number; // New prop for final price after discount
  onOrder: (instructions: string, phoneNumber: string) => void;
  onCancel: (id: string) => void;
  addNotification: (message: string, type?: 'sms' | 'info') => void;
  isOrdering: boolean;
  lastAiSuggestion: string | null;
  orders: Order[];
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile) => void;
  notifications: AppNotification[];
  submitFeedback: (feedback: Feedback) => void;
  discountPercentage: number; // Admin-set fixed discount %
  attendanceDiscountThreshold: number; // Admin-set fixed threshold
}

const StudentView: React.FC<StudentViewProps> = ({ 
  cart, 
  addToCart, 
  removeFromCart, 
  deleteFromCart,
  clearCart,
  subtotal, // Use subtotal
  discountAmount, // Use discountAmount
  finalPrice, // Use finalPrice
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
  discountPercentage, // Received fixed discount % from App.tsx
  attendanceDiscountThreshold // Received fixed threshold from App.tsx
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('morning');
  const [instructions, setInstructions] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(profile?.contact || '');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState<Order | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Local state for profile form
  const [profileForm, setProfileForm] = useState<StudentProfile>(profile || {
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.dept || !profileForm.contact) {
      addNotification("Please fill all mandatory fields!", 'info');
      return;
    }
    // Student's attendance is now directly from profileForm state
    setProfile({...profileForm}); 
    setShowProfileModal(false);
    addNotification("Profile updated successfully! ✨", 'info');
  };

  const handleFeedbackSubmit = () => {
    if (!profile || !selectedOrderForFeedback || feedbackRating === 0) {
      addNotification("Please provide a rating and ensure you're logged in.", 'info');
      return;
    }

    const newFeedback: Feedback = {
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getItemInitials = (itemName: string) => {
    const words = itemName.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[102] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-orange-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-xl">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                 </div>
                 <div>
                   <h3 className="text-xl font-black">Notifications</h3>
                   <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">Order Updates & SMS</p>
                 </div>
              </div>
              <button onClick={() => setShowNotificationModal(false)} className="bg-white/20 hover:bg-white/40 w-8 h-8 rounded-full flex items-center justify-center transition-colors" aria-label="Close notifications">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-4xl mb-4">📭</p>
                  <p className="font-bold text-gray-400">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-4 items-start">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'sms' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-bold text-sm leading-relaxed">{notif.message}</p>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">{formatTime(notif.timestamp)}</p>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[103] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative border-t-8 border-orange-500 overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Feedback for Order #{selectedOrderForFeedback.id}</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-gray-400 hover:text-gray-600 font-bold" aria-label="Close feedback form">✕</button>
             </div>
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 block mb-2">Your Rating</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-10 h-10 cursor-pointer transition-colors ${feedbackRating >= star ? 'text-orange-500' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        onClick={() => setFeedbackRating(star)}
                        aria-label={`${star} star${star === 1 ? '' : 's'}`}
                        role="radio"
                        aria-checked={feedbackRating === star}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 block mb-2">Your Comments</label>
                  <textarea 
                    value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Tell us what you loved or how we can improve..."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl p-4 text-sm font-bold transition-all resize-none outline-none" rows={4}
                  ></textarea>
                </div>
                <button 
                  onClick={handleFeedbackSubmit} 
                  disabled={feedbackRating === 0}
                  className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative border-t-8 border-orange-500 overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Student Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 font-bold" aria-label="Close profile form">✕</button>
             </div>
             <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="student-name" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Full Name</label>
                    <input 
                      id="student-name" type="text" required placeholder="Arun Kumar" 
                      value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="student-dept" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Department</label>
                    <input 
                      id="student-dept" type="text" required placeholder="CSE / ECE" 
                      value={profileForm.dept} onChange={e => setProfileForm({...profileForm, dept: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="student-year" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Year</label>
                    <select 
                      id="student-year" value={profileForm.year} onChange={e => setProfileForm({...profileForm, year: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    >
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="student-college" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">College</label>
                    <input 
                      id="student-college" type="text" placeholder="IIT Madras / Anna University" 
                      value={profileForm.college} onChange={e => setProfileForm({...profileForm, college: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="student-contact" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Contact No.</label>
                    <input 
                      id="student-contact" type="tel" required placeholder="9876543210" maxLength={10}
                      value={profileForm.contact} onChange={e => setProfileForm({...profileForm, contact: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="student-attendance" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">My Attendance (%)</label>
                    <input 
                      id="student-attendance" type="number" min="0" max="199" 
                      value={profileForm.attendancePercentage ?? 0} onChange={e => setProfileForm({...profileForm, attendancePercentage: Number(e.target.value)})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl py-4 px-4 font-bold outline-none transition-all"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-orange-700 transition-all active:scale-95">
                  Save My Profile
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Phone/OTP Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-8 shadow-2xl relative border-t-8 border-orange-600">
            {!showOtpStep ? (
              <div className="space-y-6 fade-in text-center">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Verify Order</h3>
                <p className="text-gray-500 text-sm">Hi {profile?.name}, we'll send a code to <b>+91 {phoneNumber}</b></p>
                <div className="space-y-4">
                  <button onClick={handleSendOtp} className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-orange-700 transition-all active:scale-95">
                    Send Code
                  </button>
                  <button onClick={() => setShowPhoneModal(false)} className="w-full text-gray-400 font-bold text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 fade-in text-center">
                 <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V12m0 0l8.382 4.191M12 12L3.618 16.191"/></svg>
                 </div>
                 <h3 className="text-2xl font-black text-gray-900">Enter OTP</h3>
                 <p className="text-gray-500 text-sm">Check your notification for the 4-digit code</p>
                 <input 
                    type="text" maxLength={4} autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="0000" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.4em] outline-none"
                    inputMode="numeric"
                 />
                 <button onClick={handleVerifyAndOrder} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                    Confirm Order
                 </button>
                 <button onClick={() => setShowOtpStep(false)} className="w-full text-gray-400 font-bold text-sm">Change Number</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Card / Header */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg rotate-2">
                 {profile?.name ? profile.name[0] : '?'}
              </div>
              <div>
                 {profile ? (
                   <>
                     <h3 className="text-xl font-black text-gray-900">Vanakkam, {profile.name}!</h3>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{profile.dept} • {profile.year}</p>
                   </>
                 ) : (
                   <>
                     <h3 className="text-xl font-black text-gray-900">Vanakkam, Student!</h3>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Profile not created yet</p>
                   </>
                 )}
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                   Attendance: {profile?.attendancePercentage !== undefined ? `${profile.attendancePercentage}%` : 'N/A'}
                 </p>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-3">
             <button 
               onClick={() => setShowNotificationModal(true)}
               className="relative p-3 bg-gray-50 rounded-xl hover:bg-orange-100 hover:text-orange-600 transition-colors"
               title="Notifications"
               aria-label="View notifications"
             >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                {notifications.length > 0 && (
                   <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" aria-label={`${notifications.length} new notifications`}></span>
                )}
             </button>
             <button 
               onClick={() => setShowProfileModal(true)}
               className="px-6 py-3 bg-gray-50 text-gray-800 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-100 hover:text-orange-600 transition-all"
               aria-label={profile ? 'Edit your student profile' : 'Create your student profile'}
             >
               {profile ? 'Edit Profile' : 'Create Profile'}
             </button>
           </div>
        </div>

        {/* Discount Banner */}
        {studentQualifiesForDiscount && (
          <div className="bg-green-500 text-white p-5 rounded-2xl shadow-lg flex items-center gap-4 animate-bounce-subtle">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <div>
              <p className="font-black text-xl leading-tight">Discount Unlocked!</p>
              <p className="text-xs font-bold uppercase tracking-widest text-green-100">{discountPercentage}% off your order for having {attendanceDiscountThreshold}%+ attendance.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Today's Menu</h2>
            <p className="text-orange-600 font-bold text-xs uppercase tracking-[0.2em]">Hot & Authentic • Canteen Fresh</p>
          </div>
          <div className="inline-flex p-1.5 bg-gray-200/50 rounded-2xl backdrop-blur-md">
            <button onClick={() => setSelectedCategory('morning')} className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${selectedCategory === 'morning' ? 'bg-white text-orange-600 shadow-lg' : 'text-gray-500'}`} aria-pressed={selectedCategory === 'morning'}>Breakfast</button>
            <button onClick={() => setSelectedCategory('afternoon')} className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${selectedCategory === 'afternoon' ? 'bg-white text-orange-600 shadow-lg' : 'text-gray-500'}`} aria-pressed={selectedCategory === 'afternoon'}>Lunch</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" key={selectedCategory}>
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] border border-orange-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col">
              <div className="relative overflow-hidden h-64 bg-orange-100 flex items-center justify-center"> {/* Placeholder div */}
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="text-orange-600 text-5xl font-black opacity-30">
                    {getItemInitials(item.name)}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full font-black text-orange-600 shadow-xl text-lg">₹{item.price}</div>
              </div>
              <div className="p-7 flex flex-col flex-grow">
                <h3 className="font-black text-2xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-8 flex-grow leading-relaxed">{item.description}</p>
                <button onClick={() => addToCart(item)} className="w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="space-y-6">
        <div id="cart-section" className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl p-8 sticky top-24">
          <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
            <div className="bg-orange-600 p-2.5 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            Selection
          </h2>

          {cart.length === 0 ? (
            <div className="py-16 text-center text-gray-300">
              <p className="font-black text-xl">Plate is Empty</p>
              <p className="text-xs mt-2 font-bold uppercase tracking-widest">Pick some items to eat!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="max-h-72 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-base">{item.name}</h4>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">₹{item.price} Unit</p>
                      </div>
                      <button onClick={() => deleteFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors" aria-label={`Remove ${item.name} from cart`}>✕</button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-sm font-black text-gray-800">₹{item.price * item.quantity}</span>
                       <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-red-50 text-gray-400 font-black" aria-label={`Decrease quantity of ${item.name}`}>-</button>
                        <span className="font-black text-sm">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 text-gray-400 font-black" aria-label={`Increase quantity of ${item.name}`}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label htmlFor="special-requests" className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Special Requests</label>
                <textarea 
                  id="special-requests" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Extra chutney, Less sugar..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl p-4 text-sm font-bold transition-all resize-none outline-none" rows={2}
                />
              </div>

              <div className="pt-6 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-black text-gray-800">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">Attendance Discount</span>
                    <span className="text-xl font-black text-green-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black text-orange-600">₹{finalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={startOrderFlow} disabled={isOrdering}
                  className="w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-orange-200 active:scale-95 bg-orange-600 text-white hover:bg-orange-700"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Orders with Profile Context */}
        {orders.length > 0 && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b border-gray-50 pb-4">My Orders History</h3>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className={`space-y-3 ${order.status === OrderStatus.CANCELLED ? 'opacity-40 grayscale' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-gray-800">#{order.id}</span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{order.studentName || 'Student'} • {order.studentDept || 'Dept'}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      order.status === OrderStatus.READY ? 'bg-green-100 text-green-700' :
                      order.status === OrderStatus.COOKING ? 'bg-yellow-100 text-yellow-700' :
                      order.status === OrderStatus.CANCELLED ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                    {order.items.map(item => (
                       <span key={item.id} className="text-[10px] bg-gray-50 text-gray-500 px-3 py-1 rounded-lg border border-gray-100 whitespace-nowrap font-bold">
                         {item.quantity}x {item.name}
                       </span>
                    ))}
                  </div>
                  {order.appliedDiscountPercentage && order.appliedDiscountPercentage > 0 && order.originalTotalPrice && (
                     <div className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">
                       Saved ₹{(order.originalTotalPrice - order.totalPrice).toFixed(2)} ({order.appliedDiscountPercentage}%)!
                     </div>
                  )}
                  {order.status === OrderStatus.PLACED && (
                    <button onClick={() => onCancel(order.id)} className="w-full text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline mt-2">Cancel Order</button>
                  )}
                  {order.status === OrderStatus.DELIVERED && !order.feedbackSubmitted && (
                    <button 
                      onClick={() => { setSelectedOrderForFeedback(order); setShowFeedbackModal(true); }}
                      className="w-full text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline mt-2 flex items-center justify-center gap-1"
                      aria-label={`Leave feedback for order ${order.id}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Leave Feedback
                    </button>
                  )}
                  {order.status === OrderStatus.DELIVERED && order.feedbackSubmitted && (
                    <div className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Feedback Submitted
                    </div>
                  )}
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