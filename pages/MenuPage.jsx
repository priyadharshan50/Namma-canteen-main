import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../constants';
import PageTransition from '../components/PageTransition';
import { SkeletonMenuItem } from '../components/LoadingSkeleton';

const MenuPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    subtotal,
    discountAmount,
    finalPrice,
    greenTokenDiscount,
    placeOrder,
    addNotification,
    isOrdering,
    profile,
    setProfile,
    discountPercentage,
    attendanceDiscountThreshold,
    greenTokenEnabled,
    setGreenTokenEnabled,
    creditData,
    availableCredit,
    canOrder,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('morning');
  const [instructions, setInstructions] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(profile?.contact || '');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);

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
    if (!canOrder) {
      addNotification("❌ Ordering is blocked. Please clear college dues.", 'info');
      return;
    }
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
      if (paymentMethod === 'credit') {
        if (!creditData.isApproved) {
          addNotification("❌ Credit not approved. Please use cash or apply for credit.", 'info');
          return;
        }
        if (finalPrice > availableCredit) {
          addNotification(`❌ Insufficient credit! Available: ₹${availableCredit.toFixed(2)}`, 'info');
          return;
        }
      }
      
      placeOrder(instructions, phoneNumber, paymentMethod);
      setInstructions('');
      setOtp('');
      setGeneratedOtp('');
      setShowPhoneModal(false);
      setShowOtpStep(false);
      setPaymentMethod('cash');
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

  const getItemInitials = (itemName) => {
    const words = itemName.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const nearCreditLimit = creditData?.isApproved && 
    paymentMethod === 'credit' && 
    finalPrice > availableCredit * 0.8;

  return (
    <PageTransition>
      <div className="min-h-screen py-6 pb-32 md:pb-6">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4 modal-backdrop-enter">
              <div className="card-glass w-full max-w-md p-8 rounded-3xl modal-content-enter">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-white">Student Profile</h3>
                  <button onClick={() => setShowProfileModal(false)} className="text-dark-400 hover:text-white transition-colors">✕</button>
                </div>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="input-group">
                    <label className="input-group-label">Full Name *</label>
                    <input 
                      type="text" required placeholder="Arun Kumar"
                      value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="input input-glow"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-group-label">Department *</label>
                      <input 
                        type="text" required placeholder="CSE"
                        value={profileForm.dept} onChange={e => setProfileForm({...profileForm, dept: e.target.value})}
                        className="input input-glow"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Year</label>
                      <select 
                        value={profileForm.year} onChange={e => setProfileForm({...profileForm, year: e.target.value})}
                        className="input input-glow"
                      >
                        <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-group-label">Contact *</label>
                    <input 
                      type="tel" required placeholder="9876543210" maxLength={10}
                      value={profileForm.contact} onChange={e => setProfileForm({...profileForm, contact: e.target.value.replace(/\D/g, '')})}
                      className="input input-glow"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-group-label">Attendance %</label>
                    <input 
                      type="number" min="0" max="100"
                      value={profileForm.attendancePercentage || 0} onChange={e => setProfileForm({...profileForm, attendancePercentage: Number(e.target.value)})}
                      className="input input-glow"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-xl w-full">
                    Save Profile
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* OTP Modal */}
          {showPhoneModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 modal-backdrop-enter">
              <div className="card-glass w-full max-w-sm p-8 rounded-3xl modal-content-enter">
                {!showOtpStep ? (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mx-auto text-3xl">📱</div>
                    <h3 className="text-2xl font-black text-white">Verify Order</h3>
                    <p className="text-dark-400 text-sm">Hi {profile?.name}, we'll send a code to <b className="text-white">+91 {phoneNumber}</b></p>
                    
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <label className="input-group-label block text-left">Payment Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === 'cash' 
                              ? 'border-primary-500 bg-primary-500/10' 
                              : 'border-dark-700 hover:border-dark-600'
                          }`}
                        >
                          <span className="text-2xl block mb-1">💵</span>
                          <span className="font-bold text-sm text-white">Cash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('credit')}
                          disabled={!creditData?.isApproved}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === 'credit' 
                              ? 'border-purple-500 bg-purple-500/10' 
                              : 'border-dark-700 hover:border-dark-600'
                          } ${!creditData?.isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="text-2xl block mb-1">💳</span>
                          <span className="font-bold text-sm text-white">Credit</span>
                          {creditData?.isApproved && (
                            <span className="text-xs block text-green-400">₹{availableCredit?.toFixed(0)} avail</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <button onClick={handleSendOtp} className="btn btn-primary btn-xl w-full">
                      Send Code
                    </button>
                    <button onClick={() => setShowPhoneModal(false)} className="text-dark-500 font-bold text-sm hover:text-dark-300">Cancel</button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto text-3xl">🔐</div>
                    <h3 className="text-2xl font-black text-white">Enter OTP</h3>
                    <p className="text-dark-400 text-sm">Check your notification for the 4-digit code</p>
                    <input 
                      type="text" maxLength={4} autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="0000" 
                      className="input text-center text-4xl font-black tracking-[0.5em] py-6"
                      inputMode="numeric"
                    />
                    <div className="bg-dark-800/50 rounded-xl p-3 text-left border border-dark-700">
                      <p className="text-xs text-dark-400">Payment: <span className="font-bold text-white">{paymentMethod === 'credit' ? 'Namma Credit' : 'Cash'}</span></p>
                      <p className="text-xs text-dark-400">Amount: <span className="font-black text-primary-400">₹{finalPrice?.toFixed(2)}</span></p>
                    </div>
                    <button onClick={handleVerifyAndOrder} className="btn btn-primary btn-xl w-full bg-blue-600 hover:bg-blue-500">
                      Confirm Order
                    </button>
                    <button onClick={() => setShowOtpStep(false)} className="text-dark-500 font-bold text-sm hover:text-dark-300">Back</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* College Blocker Warning */}
          {!canOrder && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 mb-6 flex items-center gap-4 fade-in">
              <span className="text-3xl">🚫</span>
              <div>
                <h3 className="font-black text-red-400">Ordering Blocked</h3>
                <p className="text-red-300/80 text-sm">You have pending college fee dues. Please contact the admin office.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white">Today's Menu</h1>
                  <p className="text-primary-400 font-bold text-sm uppercase tracking-wider">Hot & Authentic • Canteen Fresh</p>
                </div>
                
                {/* Category Pills */}
                <div className="flex bg-dark-800/50 rounded-xl p-1 border border-dark-700">
                  <button 
                    onClick={() => setSelectedCategory('morning')} 
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      selectedCategory === 'morning' 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    🌅 Breakfast
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('afternoon')} 
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      selectedCategory === 'afternoon' 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                        : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    ☀️ Lunch
                  </button>
                </div>
              </div>

              {/* Discount Banner */}
              {studentQualifiesForDiscount && (
                <div className="bg-green-500/10 border border-green-500/50 text-white p-4 rounded-xl flex items-center gap-3 fade-in">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-black text-green-400">Attendance Discount Active!</p>
                    <p className="text-sm text-green-300/80">{discountPercentage}% off for {attendanceDiscountThreshold}%+ attendance</p>
                  </div>
                </div>
              )}

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                {filteredItems.map((item) => (
                  <div key={item.id} className={`card-elevated rounded-2xl overflow-hidden group ${!canOrder ? 'opacity-50' : ''}`}>
                    <div className="relative h-48 bg-dark-700 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-500/30 text-5xl font-black">
                          {getItemInitials(item.name)}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-dark-900/90 backdrop-blur px-3 py-1.5 rounded-full font-black text-primary-400 border border-dark-700">
                        ₹{item.price}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-xl text-white mb-1">{item.name}</h3>
                      <p className="text-dark-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                      <button 
                        onClick={() => canOrder && addToCart(item)} 
                        disabled={!canOrder}
                        className="btn btn-ghost w-full hover:bg-primary-500 hover:border-primary-500 hover:text-white disabled:opacity-50"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="space-y-6">
              <div className="card-glass rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-black flex items-center gap-3 mb-6 text-white">
                  <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-lg">🛒</span>
                  Your Cart
                </h2>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-dark-500">
                    <span className="text-4xl block mb-2 opacity-30">🍽️</span>
                    <p className="font-bold">Cart is Empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-dark-700">
                          <div className="flex-1">
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <p className="text-xs text-primary-400">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-dark-700 rounded-lg font-bold hover:bg-red-500/20 hover:text-red-400 text-dark-300 transition-colors">-</button>
                            <span className="font-black text-sm w-6 text-center text-white">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="w-7 h-7 bg-dark-700 rounded-lg font-bold hover:bg-green-500/20 hover:text-green-400 text-dark-300 transition-colors">+</button>
                            <button onClick={() => deleteFromCart(item.id)} className="text-dark-500 hover:text-red-400 ml-1 transition-colors">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Green Token Toggle */}
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌿</span>
                          <div>
                            <p className="font-bold text-green-400 text-sm">Green Token (BYOP)</p>
                            <p className="text-xs text-green-300/60">Bring Your Own Plate - ₹5 off</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => setGreenTokenEnabled(!greenTokenEnabled)}
                          className={`w-12 h-6 rounded-full transition-all cursor-pointer ${greenTokenEnabled ? 'bg-green-500' : 'bg-dark-600'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all mt-0.5 ${greenTokenEnabled ? 'ml-6' : 'ml-0.5'}`} />
                        </div>
                      </label>
                    </div>

                    {/* Special Instructions */}
                    <div className="input-group">
                      <label className="input-group-label">Special Requests</label>
                      <textarea 
                        value={instructions} onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g. Extra chutney..."
                        className="input input-glow resize-none text-sm" rows={2}
                      />
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pt-4 border-t-2 border-dashed border-dark-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-400">Subtotal</span>
                        <span className="font-bold text-white">₹{(subtotal + (greenTokenEnabled ? 5 : 0)).toFixed(2)}</span>
                      </div>
                      {greenTokenDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>Green Token 🌿</span>
                          <span className="font-bold">-₹5.00</span>
                        </div>
                      )}
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>Attendance Discount</span>
                          <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <span className="font-bold text-dark-300">Total</span>
                        <span className="text-2xl font-black text-primary-400">₹{finalPrice?.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Order Button */}
                    <button 
                      onClick={startOrderFlow} 
                      disabled={isOrdering || !canOrder}
                      className="btn btn-primary btn-xl w-full btn-ripple disabled:opacity-50"
                    >
                      {isOrdering ? (
                        <span className="flex items-center gap-2">
                          <div className="spinner"></div>
                          Processing...
                        </span>
                      ) : 'Checkout'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Cart Footer */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 md:hidden flex justify-between items-center shadow-2xl z-50 border-t border-primary-400/30">
            <div>
              <p className="text-xs uppercase font-bold text-primary-200">Total</p>
              <p className="text-xl font-black">₹{finalPrice?.toFixed(2)}</p>
            </div>
            <button 
              onClick={startOrderFlow}
              disabled={!canOrder}
              className="bg-white text-primary-600 px-6 py-2.5 rounded-xl font-black shadow-lg disabled:opacity-50"
            >
              Checkout ({cart.length})
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default MenuPage;
