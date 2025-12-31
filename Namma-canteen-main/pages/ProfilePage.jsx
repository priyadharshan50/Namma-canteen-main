import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const {
    profile,
    setProfile,
    creditData,
    ordersThisMonth,
    availableCredit,
    requestCreditAuthorization,
    makePayment,
    addNotification,
    orders,
    CREDIT_TIERS,
    TRANSACTION_TYPES,
  } = useApp();

  const [showProfileModal, setShowProfileModal] = useState(!profile);
  const [profileForm, setProfileForm] = useState(profile || {
    name: '', dept: '', year: '1st Year', college: '', contact: '', attendancePercentage: 0
  });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification("Please enter a valid positive amount.", 'error');
      return;
    }
    if (amount > totalDue) {
      addNotification(`Amount cannot exceed total due (₹${totalDue.toFixed(2)})`, 'error');
      return;
    }
    makePayment(amount);
    setPaymentAmount('');
    setShowPaymentModal(false);
  };

  const totalDue = creditData.balance + creditData.penalty;
  const creditUsagePercent = creditData.limit > 0 
    ? ((creditData.balance / creditData.limit) * 100).toFixed(0)
    : 0;

  const tierInfo = CREDIT_TIERS[creditData.tier] || CREDIT_TIERS[0];

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                {profile ? 'Edit Profile' : 'Create Your Profile'}
              </h3>
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
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">College</label>
                  <input 
                    type="text" placeholder="Anna University"
                    value={profileForm.college} onChange={e => setProfileForm({...profileForm, college: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none"
                  />
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
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all">
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 mb-4">Make Payment</h3>
              <p className="text-gray-600 mb-2">Total Due: <span className="font-black text-red-600">₹{totalDue.toFixed(2)}</span></p>
              
              {/* Quick Pay Buttons */}
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setPaymentAmount(totalDue.toFixed(2))}
                  className="flex-1 bg-green-100 text-green-700 font-bold py-2 rounded-lg text-sm hover:bg-green-200"
                >
                  Pay Full (₹{totalDue.toFixed(2)})
                </button>
                {totalDue > 100 && (
                  <button 
                    onClick={() => setPaymentAmount('100')}
                    className="flex-1 bg-blue-100 text-blue-700 font-bold py-2 rounded-lg text-sm hover:bg-blue-200"
                  >
                    Pay ₹100
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  min="0"
                  max={totalDue}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow empty or valid numbers only
                    if (val === '' || parseFloat(val) >= 0) {
                      setPaymentAmount(val);
                    }
                  }}
                  className={`w-full bg-gray-50 border-2 rounded-xl py-4 px-4 font-bold outline-none text-2xl text-center mb-2 ${
                    parseFloat(paymentAmount) > totalDue 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-transparent focus:border-green-500'
                  }`}
                />
                {/* Validation Error Message */}
                {parseFloat(paymentAmount) > totalDue && (
                  <p className="text-red-500 text-xs font-bold text-center mb-2">
                    ⚠️ Amount cannot exceed total due (₹{totalDue.toFixed(2)})
                  </p>
                )}
                {parseFloat(paymentAmount) < 0 && (
                  <p className="text-red-500 text-xs font-bold text-center mb-2">
                    ⚠️ Amount must be a positive number
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={
                    !paymentAmount || 
                    parseFloat(paymentAmount) <= 0 || 
                    parseFloat(paymentAmount) > totalDue ||
                    isNaN(parseFloat(paymentAmount))
                  }
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile and Namma Credit</p>
        </div>

        {!profile ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Profile Yet</h3>
            <p className="text-gray-600 mb-6">Create your profile to start ordering and unlock Namma Credit</p>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                    {profile.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">{profile.dept} • {profile.year}</p>
                    <p className="text-gray-500 text-sm">{profile.college}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-3xl font-black text-orange-600">{ordersThisMonth}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Orders This Month</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-3xl font-black text-blue-600">{profile.attendancePercentage || 0}%</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Attendance</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-3xl font-black text-green-600">{orders.length}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Orders</p>
                </div>
              </div>
            </div>

            {/* College Blocker Warning */}
            {creditData.collegeBlocker && (
              <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="font-black text-red-700 text-lg">Ordering Blocked</h3>
                  <p className="text-red-600">You have pending college fee dues. Please clear them to resume ordering.</p>
                </div>
              </div>
            )}

            {/* Namma Credit Card */}
            <div className={`rounded-3xl p-6 shadow-lg ${
              creditData.tier === 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
              creditData.tier === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
              creditData.tier === 1 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
              'bg-gradient-to-br from-gray-400 to-gray-600'
            } text-white`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold uppercase opacity-80">Namma Credit</p>
                  <h3 className="text-2xl font-black">{tierInfo.name} {creditData.tier > 0 ? 'Tier' : ''}</h3>
                </div>
                {creditData.isProbation && (
                  <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
                    PROBATION
                  </span>
                )}
              </div>

              {creditData.tier === 0 ? (
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="font-bold mb-2">
                      {creditData.isEligible ? '✅ Eligible for Credit!' : `Progress: ${ordersThisMonth}/20 orders`}
                    </p>
                    <div className="w-full bg-white/30 rounded-full h-3">
                      <div 
                        className="bg-white rounded-full h-3 transition-all"
                        style={{ width: `${Math.min(100, (ordersThisMonth / 20) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {creditData.isEligible && !creditData.authorizationRequested && (
                    <button
                      onClick={requestCreditAuthorization}
                      className="w-full bg-white text-orange-600 font-black py-4 rounded-xl hover:bg-orange-50 transition-all"
                    >
                      Request Credit Authorization
                    </button>
                  )}
                  
                  {creditData.authorizationRequested && !creditData.isApproved && (
                    <div className="bg-white/20 rounded-xl p-4 text-center">
                      <span className="text-2xl">⏳</span>
                      <p className="font-bold">Awaiting Manager Approval</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Credit Limit Circle */}
                  <div className="flex items-center justify-between">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="none"/>
                        <circle 
                          cx="48" cy="48" r="40" 
                          stroke="white" strokeWidth="8" fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - creditUsagePercent / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black">{creditUsagePercent}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase opacity-80">Available Credit</p>
                      <p className="text-3xl font-black">₹{availableCredit.toFixed(0)}</p>
                      <p className="text-sm opacity-80">of ₹{creditData.isProbation ? (creditData.limit * 0.5).toFixed(0) : creditData.limit}</p>
                    </div>
                  </div>

                  {/* Balance & Due */}
                  {creditData.balance > 0 && (
                    <div className="bg-white/20 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Current Balance:</span>
                        <span className="font-black">₹{creditData.balance.toFixed(2)}</span>
                      </div>
                      {creditData.penalty > 0 && (
                        <div className="flex justify-between text-red-200">
                          <span>Late Fee ({creditData.daysLate} days):</span>
                          <span className="font-black">₹{creditData.penalty.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-white/20 pt-2">
                        <span className="font-bold">Total Due:</span>
                        <span className="font-black text-xl">₹{totalDue.toFixed(2)}</span>
                      </div>
                      {creditData.dueDate && (
                        <p className="text-xs opacity-80">
                          Due by: {new Date(creditData.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full bg-white text-green-600 font-black py-3 rounded-xl mt-2 hover:bg-green-50"
                      >
                        Make Payment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Transaction History */}
            {creditData.transactions.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4">Transaction History</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {creditData.transactions.slice(0, 10).map((txn) => (
                    <div key={txn.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{txn.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(txn.date).toLocaleDateString()} • {new Date(txn.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`font-black text-lg ${
                        txn.type === TRANSACTION_TYPES.PAYMENT || txn.type === TRANSACTION_TYPES.REFUND
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {txn.type === TRANSACTION_TYPES.PAYMENT || txn.type === TRANSACTION_TYPES.REFUND ? '+' : '-'}₹{txn.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
