import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../constants';

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
    notifications,
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
      // Check credit payment validity
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

  // Budget warning check
  const nearCreditLimit = creditData.isApproved && 
    paymentMethod === 'credit' && 
    finalPrice > availableCredit * 0.8;

  return (
    <div className="min-h-screen bg-orange-50 py-6 pb-32 md:pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Student Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                  <input 
                    type="text" required placeholder="Arun Kumar"
                    value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Department *</label>
                    <input 
                      type="text" required placeholder="CSE"
                      value={profileForm.dept} onChange={e => setProfileForm({...profileForm, dept: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                    <select 
                      value={profileForm.year} onChange={e => setProfileForm({...profileForm, year: e.target.value})}
                      className="w-full bg-gray-50 rounded-xl py-3 px-4 font-bold outline-none"
                    >
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Contact *</label>
                  <input 
                    type="tel" required placeholder="9876543210" maxLength={10}
                    value={profileForm.contact} onChange={e => setProfileForm({...profileForm, contact: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Attendance %</label>
                  <input 
                    type="number" min="0" max="100"
                    value={profileForm.attendancePercentage || 0} onChange={e => setProfileForm({...profileForm, attendancePercentage: Number(e.target.value)})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700">
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* OTP Modal */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
              {!showOtpStep ? (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl">📱</div>
                  <h3 className="text-2xl font-black text-gray-900">Verify Order</h3>
                  <p className="text-gray-500 text-sm">Hi {profile?.name}, we'll send a code to <b>+91 {phoneNumber}</b></p>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase block text-left">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'cash' 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1">💵</span>
                        <span className="font-bold text-sm">Cash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit')}
                        disabled={!creditData.isApproved}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'credit' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!creditData.isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-2xl block mb-1">💳</span>
                        <span className="font-bold text-sm">Credit</span>
                        {creditData.isApproved && (
                          <span className="text-xs block text-green-600">₹{availableCredit.toFixed(0)} avail</span>
                        )}
                      </button>
                    </div>
                    {!creditData.isApproved && (
                      <p className="text-xs text-gray-400">Credit not yet approved. <a href="/profile" className="text-orange-600 underline">Apply here</a></p>
                    )}
                  </div>

                  <button onClick={handleSendOtp} className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700">
                    Send Code
                  </button>
                  <button onClick={() => setShowPhoneModal(false)} className="w-full text-gray-400 font-bold text-sm">Cancel</button>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">🔐</div>
                  <h3 className="text-2xl font-black text-gray-900">Enter OTP</h3>
                  <p className="text-gray-500 text-sm">Check your notification for the 4-digit code</p>
                  <input 
                    type="text" maxLength={4} autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="0000" className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-6 text-center text-4xl font-black tracking-widest outline-none"
                    inputMode="numeric"
                  />
                  <div className="bg-gray-50 rounded-xl p-3 text-left">
                    <p className="text-xs text-gray-500">Payment: <span className="font-bold text-gray-900">{paymentMethod === 'credit' ? 'Namma Credit' : 'Cash'}</span></p>
                    <p className="text-xs text-gray-500">Amount: <span className="font-black text-orange-600">₹{finalPrice.toFixed(2)}</span></p>
                  </div>
                  <button onClick={handleVerifyAndOrder} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700">
                    Confirm Order
                  </button>
                  <button onClick={() => setShowOtpStep(false)} className="w-full text-gray-400 font-bold text-sm">Back</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* College Blocker Warning */}
        {!canOrder && (
          <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <span className="text-3xl">🚫</span>
            <div>
              <h3 className="font-black text-red-700">Ordering Blocked</h3>
              <p className="text-red-600 text-sm">You have pending college fee dues. Please contact the admin office.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Today's Menu</h1>
                <p className="text-orange-600 font-bold text-sm uppercase tracking-wider">Hot & Authentic • Canteen Fresh</p>
              </div>
              <div className="flex bg-gray-200/50 rounded-xl p-1">
                <button onClick={() => setSelectedCategory('morning')} className={`px-5 py-2 rounded-lg text-sm font-black transition-all ${selectedCategory === 'morning' ? 'bg-white text-orange-600 shadow' : 'text-gray-500'}`}>
                  Breakfast
                </button>
                <button onClick={() => setSelectedCategory('afternoon')} className={`px-5 py-2 rounded-lg text-sm font-black transition-all ${selectedCategory === 'afternoon' ? 'bg-white text-orange-600 shadow' : 'text-gray-500'}`}>
                  Lunch
                </button>
              </div>
            </div>

            {/* Discount Banner */}
            {studentQualifiesForDiscount && (
              <div className="bg-green-500 text-white p-4 rounded-xl flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-black">Attendance Discount Active!</p>
                  <p className="text-sm opacity-90">{discountPercentage}% off for {attendanceDiscountThreshold}%+ attendance</p>
                </div>
              </div>
            )}

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group ${!canOrder ? 'opacity-50' : ''}`}>
                  <div className="relative h-48 bg-orange-100 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-600 text-4xl font-black opacity-30">
                        {getItemInitials(item.name)}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full font-black text-orange-600">₹{item.price}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-xl text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <button 
                      onClick={() => canOrder && addToCart(item)} 
                      disabled={!canOrder}
                      className="w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white font-black py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-black flex items-center gap-2 mb-6">
                <span className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">🛒</span>
                Your Cart
              </h2>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-gray-300">
                  <span className="text-4xl block mb-2">🍽️</span>
                  <p className="font-bold">Cart is Empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-orange-600">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-gray-100 rounded-lg font-bold hover:bg-red-100 hover:text-red-600">-</button>
                          <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="w-7 h-7 bg-gray-100 rounded-lg font-bold hover:bg-green-100 hover:text-green-600">+</button>
                          <button onClick={() => deleteFromCart(item.id)} className="text-gray-300 hover:text-red-500 ml-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Green Token Toggle */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌿</span>
                        <div>
                          <p className="font-bold text-green-800 text-sm">Green Token (BYOP)</p>
                          <p className="text-xs text-green-600">Bring Your Own Plate - ₹5 off</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all ${greenTokenEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all mt-0.5 ${greenTokenEnabled ? 'ml-6' : 'ml-0.5'}`} 
                          onClick={() => setGreenTokenEnabled(!greenTokenEnabled)}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Special Requests</label>
                    <textarea 
                      value={instructions} onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Extra chutney..."
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl p-3 text-sm font-bold outline-none resize-none" rows={2}
                    />
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t-2 border-dashed border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold">₹{(subtotal + (greenTokenEnabled ? 5 : 0)).toFixed(2)}</span>
                    </div>
                    {greenTokenDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Green Token 🌿</span>
                        <span className="font-bold">-₹5.00</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Attendance Discount</span>
                        <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <span className="font-bold text-gray-700">Total</span>
                      <span className="text-2xl font-black text-orange-600">₹{finalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Budget Alert */}
                  {nearCreditLimit && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <p className="text-xs text-yellow-800 font-bold">Budget Alert: This order will use most of your available credit!</p>
                    </div>
                  )}

                  {/* Order Button */}
                  <button 
                    onClick={startOrderFlow} 
                    disabled={isOrdering || !canOrder}
                    className="w-full py-4 rounded-xl font-black text-lg transition-all bg-orange-600 text-white hover:bg-orange-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOrdering ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white p-4 md:hidden flex justify-between items-center shadow-2xl z-50">
          <div>
            <p className="text-xs uppercase font-bold text-orange-200">Total</p>
            <p className="text-xl font-black">₹{finalPrice.toFixed(2)}</p>
          </div>
          <button 
            onClick={startOrderFlow}
            disabled={!canOrder}
            className="bg-white text-orange-600 px-6 py-2 rounded-lg font-black shadow disabled:opacity-50"
          >
            Checkout ({cart.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
