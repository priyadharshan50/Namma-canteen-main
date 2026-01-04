import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

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

  const totalDue = (creditData?.balance || 0) + (creditData?.penalty || 0);
  const creditUsagePercent = creditData?.limit > 0 
    ? ((creditData.balance / creditData.limit) * 100).toFixed(0)
    : 0;

  const tierInfo = CREDIT_TIERS?.[creditData?.tier] || CREDIT_TIERS?.[0] || { name: 'Basic' };

  return (
    <PageTransition>
      <div className="min-h-screen py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Profile Modal */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4 modal-backdrop-enter">
              <div className="card-glass w-full max-w-md p-8 rounded-3xl modal-content-enter">
                <h3 className="text-2xl font-black text-white mb-6">
                  {profile ? 'Edit Profile' : 'Create Your Profile'}
                </h3>
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
                    <label className="input-group-label">College</label>
                    <input 
                      type="text" placeholder="Anna University"
                      value={profileForm.college} onChange={e => setProfileForm({...profileForm, college: e.target.value})}
                      className="input input-glow"
                    />
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

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[101] flex items-center justify-center p-4 modal-backdrop-enter">
              <div className="card-glass w-full max-w-sm p-8 rounded-3xl modal-content-enter">
                <h3 className="text-2xl font-black text-white mb-4">Make Payment</h3>
                <p className="text-dark-400 mb-4">Total Due: <span className="font-black text-red-400">₹{totalDue.toFixed(2)}</span></p>
                
                {/* Quick Pay Buttons */}
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setPaymentAmount(totalDue.toFixed(2))}
                    className="flex-1 bg-green-500/20 text-green-400 font-bold py-2 rounded-lg text-sm hover:bg-green-500/30 border border-green-500/30"
                  >
                    Pay Full
                  </button>
                  {totalDue > 100 && (
                    <button 
                      onClick={() => setPaymentAmount('100')}
                      className="flex-1 bg-blue-500/20 text-blue-400 font-bold py-2 rounded-lg text-sm hover:bg-blue-500/30 border border-blue-500/30"
                    >
                      Pay ₹100
                    </button>
                  )}
                </div>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  min="0"
                  max={totalDue}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="input text-center text-2xl font-black mb-4"
                />

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setShowPaymentModal(false); setPaymentAmount(''); }}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayment}
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > totalDue}
                    className="btn btn-primary flex-1"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">My Profile</h1>
            <p className="text-dark-400">Manage your profile and Namma Credit</p>
          </div>

          {!profile ? (
            <div className="card-glass rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4 opacity-50">👤</div>
              <h3 className="text-2xl font-black text-white mb-2">No Profile Yet</h3>
              <p className="text-dark-400 mb-6">Create your profile to start ordering and unlock Namma Credit</p>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="btn btn-primary btn-xl"
              >
                Create Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6 stagger-children">
              {/* Profile Card */}
              <div className="card-elevated rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-primary-500/25">
                      {profile.name[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{profile.name}</h2>
                      <p className="text-dark-400">{profile.dept} • {profile.year}</p>
                      {profile.college && <p className="text-dark-500 text-sm">{profile.college}</p>}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                    <p className="text-3xl font-black text-primary-400">{ordersThisMonth || 0}</p>
                    <p className="text-xs font-bold text-dark-400 uppercase">This Month</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-3xl font-black text-blue-400">{profile.attendancePercentage || 0}%</p>
                    <p className="text-xs font-bold text-dark-400 uppercase">Attendance</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-3xl font-black text-green-400">{orders?.length || 0}</p>
                    <p className="text-xs font-bold text-dark-400 uppercase">Total Orders</p>
                  </div>
                </div>
              </div>

              {/* College Blocker Warning */}
              {creditData?.collegeBlocker && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 flex items-center gap-4 fade-in">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-black text-red-400 text-lg">Ordering Blocked</h3>
                    <p className="text-red-300/80">You have pending college fee dues. Please clear them to resume ordering.</p>
                  </div>
                </div>
              )}

              {/* Namma Credit Card */}
              <div className={`rounded-3xl p-6 shadow-xl relative overflow-hidden ${
                creditData?.tier === 3 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30' :
                creditData?.tier === 2 ? 'bg-gradient-to-br from-slate-400/20 to-slate-600/10 border border-slate-400/30' :
                creditData?.tier === 1 ? 'bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30' :
                'bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600'
              }`}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase text-dark-400">Namma Credit</p>
                      <h3 className="text-2xl font-black text-white">{tierInfo.name} {creditData?.tier > 0 ? 'Tier' : ''}</h3>
                    </div>
                    {creditData?.isProbation && (
                      <span className="badge badge-error">PROBATION</span>
                    )}
                  </div>

                  {creditData?.tier === 0 ? (
                    <div className="space-y-4">
                      <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                        <p className="font-bold text-white mb-2">
                          {creditData?.isEligible ? '✅ Eligible for Credit!' : `Progress: ${ordersThisMonth || 0}/20 orders`}
                        </p>
                        <div className="w-full bg-dark-700 rounded-full h-3">
                          <div 
                            className="bg-primary-500 rounded-full h-3 transition-all"
                            style={{ width: `${Math.min(100, ((ordersThisMonth || 0) / 20) * 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      {creditData?.isEligible && !creditData?.authorizationRequested && (
                        <button
                          onClick={requestCreditAuthorization}
                          className="btn btn-primary btn-xl w-full"
                        >
                          Request Credit Authorization
                        </button>
                      )}
                      
                      {creditData?.authorizationRequested && !creditData?.isApproved && (
                        <div className="bg-dark-800/50 rounded-xl p-4 text-center border border-dark-700">
                          <span className="text-2xl">⏳</span>
                          <p className="font-bold text-white mt-2">Awaiting Manager Approval</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Credit Limit Circle */}
                      <div className="flex items-center justify-between">
                        <div className="relative w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                            <circle 
                              cx="48" cy="48" r="40" 
                              stroke="currentColor" strokeWidth="8" fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - creditUsagePercent / 100)}`}
                              strokeLinecap="round"
                              className="text-primary-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-white">{creditUsagePercent}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase text-dark-400">Available Credit</p>
                          <p className="text-3xl font-black text-white">₹{(availableCredit || 0).toFixed(0)}</p>
                          <p className="text-sm text-dark-500">of ₹{creditData?.isProbation ? ((creditData.limit || 0) * 0.5).toFixed(0) : (creditData?.limit || 0)}</p>
                        </div>
                      </div>

                      {/* Balance & Due */}
                      {creditData?.balance > 0 && (
                        <div className="bg-dark-800/50 rounded-xl p-4 space-y-2 border border-dark-700">
                          <div className="flex justify-between text-sm">
                            <span className="text-dark-400">Current Balance:</span>
                            <span className="font-black text-white">₹{creditData.balance.toFixed(2)}</span>
                          </div>
                          {creditData?.penalty > 0 && (
                            <div className="flex justify-between text-sm text-red-400">
                              <span>Late Fee ({creditData.daysLate} days):</span>
                              <span className="font-black">₹{creditData.penalty.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-dark-600 pt-2">
                            <span className="font-bold text-white">Total Due:</span>
                            <span className="font-black text-xl text-primary-400">₹{totalDue.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="btn btn-primary w-full mt-2"
                          >
                            Make Payment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction History */}
              {creditData?.transactions?.length > 0 && (
                <div className="card-elevated rounded-3xl p-6">
                  <h3 className="text-xl font-black text-white mb-4">Transaction History</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {creditData.transactions.slice(0, 10).map((txn) => (
                      <div key={txn.id} className="flex justify-between items-center py-3 border-b border-dark-700 last:border-0">
                        <div>
                          <p className="font-bold text-white capitalize">{txn.type}</p>
                          <p className="text-xs text-dark-500">
                            {new Date(txn.date).toLocaleDateString()} • {new Date(txn.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`font-black text-lg ${
                          txn.type === TRANSACTION_TYPES?.PAYMENT || txn.type === TRANSACTION_TYPES?.REFUND
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {txn.type === TRANSACTION_TYPES?.PAYMENT || txn.type === TRANSACTION_TYPES?.REFUND ? '+' : '-'}₹{txn.amount.toFixed(2)}
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
    </PageTransition>
  );
};

export default ProfilePage;
