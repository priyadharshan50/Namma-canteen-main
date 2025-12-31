import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const KitchenPage = () => {
  const { 
    orders, 
    updateOrderStatus, 
    feedbackList,
    allStudentsCredit,
    approveCredit,
    toggleCollegeBlocker,
    OrderStatus,
    CREDIT_TIERS,
    getAllAuthUsers,
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'credit'
  const [statusFilter, setStatusFilter] = useState('all');

  // Get all authenticated users for verification status
  const authUsers = useMemo(() => {
    try {
      return getAllAuthUsers?.() || [];
    } catch {
      return [];
    }
  }, [getAllAuthUsers]);

  // Helper to check if a student is verified
  const isStudentVerified = (contact) => {
    const authUser = authUsers.find(u => u.phoneNumber === contact || u.profile?.contact === contact);
    return authUser?.isVerified || authUser?.isPhoneVerified || false;
  };

  // Helper to get auth details
  const getAuthDetails = (contact) => {
    return authUsers.find(u => u.phoneNumber === contact || u.profile?.contact === contact);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return order.status !== OrderStatus.CANCELLED;
    return order.status === statusFilter;
  });

  // Kanban columns
  const placedOrders = filteredOrders.filter(o => o.status === OrderStatus.PLACED);
  const cookingOrders = filteredOrders.filter(o => o.status === OrderStatus.COOKING);
  const readyOrders = filteredOrders.filter(o => o.status === OrderStatus.READY);

  // Credit management data
  const pendingApprovals = allStudentsCredit.filter(s => s.authorizationRequested && !s.isApproved);
  const activeCredits = allStudentsCredit.filter(s => s.isApproved && s.balance > 0);
  const overdueAccounts = allStudentsCredit.filter(s => {
    if (!s.dueDate || s.balance === 0) return false;
    return new Date(s.dueDate) < new Date();
  });

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Culinary Summary
  const ingredientSummary = {};
  filteredOrders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).forEach(order => {
    order.items.forEach(item => {
      if (ingredientSummary[item.name]) {
        ingredientSummary[item.name] += item.quantity;
      } else {
        ingredientSummary[item.name] = item.quantity;
      }
    });
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Kitchen Dashboard</h1>
            <p className="text-gray-600">Manage orders and credit</p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'orders' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Orders ({filteredOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('credit')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all relative ${
                activeTab === 'credit' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Credit Management
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <>
            {/* Status Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', OrderStatus.PLACED, OrderStatus.COOKING, OrderStatus.READY, OrderStatus.DELIVERED].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                    statusFilter === status ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {status === 'all' ? 'All Active' : status}
                </button>
              ))}
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Placed Column */}
              <div className="bg-blue-50 rounded-2xl p-4">
                <h3 className="font-black text-blue-800 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Placed ({placedOrders.length})
                </h3>
                <div className="space-y-3">
                  {placedOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-black text-gray-900">#{order.id}</span>
                          <p className="text-xs text-gray-500">{order.studentName} • {formatTime(order.timestamp)}</p>
                        </div>
                        {order.paymentMethod === 'credit' && (
                          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">Credit</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <button
                        onClick={() => updateOrderStatus(order.id, OrderStatus.COOKING)}
                        className="w-full bg-yellow-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-yellow-600"
                      >
                        Start Cooking
                      </button>
                    </div>
                  ))}
                  {placedOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders</p>
                  )}
                </div>
              </div>

              {/* Cooking Column */}
              <div className="bg-yellow-50 rounded-2xl p-4">
                <h3 className="font-black text-yellow-800 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                  Cooking ({cookingOrders.length})
                </h3>
                <div className="space-y-3">
                  {cookingOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-black text-gray-900">#{order.id}</span>
                          <p className="text-xs text-gray-500">{order.studentName}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <button
                        onClick={() => updateOrderStatus(order.id, OrderStatus.READY)}
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-600"
                      >
                        Mark Ready
                      </button>
                    </div>
                  ))}
                  {cookingOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders</p>
                  )}
                </div>
              </div>

              {/* Ready Column */}
              <div className="bg-green-50 rounded-2xl p-4">
                <h3 className="font-black text-green-800 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Ready ({readyOrders.length})
                </h3>
                <div className="space-y-3">
                  {readyOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-black text-gray-900">#{order.id}</span>
                          <p className="text-xs text-gray-500">{order.studentName}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <button
                        onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                        className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg text-sm hover:bg-gray-900"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  ))}
                  {readyOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders</p>
                  )}
                </div>
              </div>
            </div>

            {/* Culinary Summary & Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prep List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">📋 Culinary Summary</h3>
                {Object.keys(ingredientSummary).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(ingredientSummary).map(([item, qty]) => (
                      <div key={item} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium">{item}</span>
                        <span className="font-black text-orange-600 text-lg">{qty}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No active orders</p>
                )}
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">⭐ Recent Feedback</h3>
                {feedbackList.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {feedbackList.slice(0, 5).map((fb) => (
                      <div key={fb.id} className="border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{fb.studentName}</span>
                        </div>
                        {fb.comment && <p className="text-sm text-gray-600">{fb.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No feedback yet</p>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Credit Management Tab */
          <div className="space-y-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">📝</span>
                Pending Credit Approvals ({pendingApprovals.length})
              </h3>
              {pendingApprovals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase border-b">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Orders This Month</th>
                        <th className="pb-3">Contact</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.map(student => {
                        const authDetails = getAuthDetails(student.contact);
                        const verified = isStudentVerified(student.contact);
                        return (
                          <tr key={student.contact} className="border-b border-gray-100">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{student.name}</span>
                                {verified && (
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center" title="Phone Verified">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              {authDetails?.email && (
                                <p className="text-xs text-gray-400">{authDetails.email}</p>
                              )}
                            </td>
                            <td className="py-3 text-gray-600">{student.dept}</td>
                            <td className="py-3">
                              <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded">
                                {student.ordersThisMonth} orders
                              </span>
                            </td>
                            <td className="py-3 text-gray-600">{student.contact}</td>
                            <td className="py-3">
                              <button
                                onClick={() => approveCredit(student.contact)}
                                className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                              >
                                Approve ₹500
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No pending approvals</p>
              )}
            </div>

            {/* Active Credit Users */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">💳</span>
                Active Credit Users ({activeCredits.length})
              </h3>
              {activeCredits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase border-b">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Tier</th>
                        <th className="pb-3">Limit</th>
                        <th className="pb-3">Balance</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCredits.map(student => {
                        const authDetails = getAuthDetails(student.contact);
                        const verified = isStudentVerified(student.contact);
                        return (
                          <tr key={student.contact} className="border-b border-gray-100">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{student.name}</span>
                                {verified && (
                                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center" title="Phone Verified">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              {authDetails && (
                                <div className="text-xs text-gray-400">
                                  {authDetails.email && <span>{authDetails.email}</span>}
                                  {authDetails.uid && <span className="ml-2 font-mono">UID: {authDetails.uid.slice(0, 8)}...</span>}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              <span className={`font-bold px-2 py-1 rounded ${
                                student.tier === 3 ? 'bg-yellow-100 text-yellow-700' :
                                student.tier === 2 ? 'bg-gray-100 text-gray-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {CREDIT_TIERS[student.tier]?.name || 'None'}
                              </span>
                            </td>
                            <td className="py-3 font-bold">₹{student.limit}</td>
                            <td className="py-3 font-bold text-red-600">₹{student.balance?.toFixed(2) || 0}</td>
                            <td className="py-3">
                              <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">
                                Active
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No active credit users</p>
              )}
            </div>

            {/* Overdue Accounts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-100">
              <h3 className="font-black text-red-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">⚠️</span>
                Overdue Accounts ({overdueAccounts.length})
              </h3>
              {overdueAccounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-500 uppercase border-b">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Balance</th>
                        <th className="pb-3">Days Late</th>
                        <th className="pb-3">Penalty</th>
                        <th className="pb-3">Total Due</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueAccounts.map(student => {
                        const daysLate = Math.floor((new Date() - new Date(student.dueDate)) / (1000*60*60*24));
                        const penalty = daysLate * 5;
                        const totalDue = (student.balance || 0) + penalty;
                        return (
                          <tr key={student.contact} className="border-b border-gray-100 bg-red-50">
                            <td className="py-3 font-bold">{student.name}</td>
                            <td className="py-3 font-bold">₹{student.balance?.toFixed(2) || 0}</td>
                            <td className="py-3">
                              <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded">
                                {daysLate} days
                              </span>
                            </td>
                            <td className="py-3 font-bold text-red-600">₹{penalty}</td>
                            <td className="py-3 font-black text-red-700">₹{totalDue.toFixed(2)}</td>
                            <td className="py-3">
                              <button
                                onClick={() => toggleCollegeBlocker(student.contact, true)}
                                className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
                              >
                                Block
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No overdue accounts 🎉</p>
              )}
            </div>

            {/* College Fee Blockers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">🚫</span>
                Blocked Students (College Fee Defaults)
              </h3>
              {allStudentsCredit.filter(s => s.collegeBlocker).length > 0 ? (
                <div className="space-y-3">
                  {allStudentsCredit.filter(s => s.collegeBlocker).map(student => (
                    <div key={student.contact} className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-200">
                      <div>
                        <p className="font-bold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.dept} • {student.contact}</p>
                      </div>
                      <button
                        onClick={() => toggleCollegeBlocker(student.contact, false)}
                        className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No blocked students</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenPage;
