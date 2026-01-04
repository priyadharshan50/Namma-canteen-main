import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

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

  const [activeTab, setActiveTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('all');

  const authUsers = useMemo(() => {
    try {
      return getAllAuthUsers?.() || [];
    } catch {
      return [];
    }
  }, [getAllAuthUsers]);

  const isStudentVerified = (contact) => {
    const authUser = authUsers.find(u => u.phoneNumber === contact || u.profile?.contact === contact);
    return authUser?.isVerified || authUser?.isPhoneVerified || false;
  };

  const getAuthDetails = (contact) => {
    return authUsers.find(u => u.phoneNumber === contact || u.profile?.contact === contact);
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return order.status !== OrderStatus?.CANCELLED;
    return order.status === statusFilter;
  });

  const placedOrders = filteredOrders.filter(o => o.status === OrderStatus?.PLACED);
  const cookingOrders = filteredOrders.filter(o => o.status === OrderStatus?.COOKING);
  const readyOrders = filteredOrders.filter(o => o.status === OrderStatus?.READY);

  const pendingApprovals = allStudentsCredit?.filter(s => s.authorizationRequested && !s.isApproved) || [];
  const activeCredits = allStudentsCredit?.filter(s => s.isApproved && s.balance > 0) || [];
  const overdueAccounts = allStudentsCredit?.filter(s => {
    if (!s.dueDate || s.balance === 0) return false;
    return new Date(s.dueDate) < new Date();
  }) || [];

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const ingredientSummary = {};
  filteredOrders.filter(o => o.status !== OrderStatus?.DELIVERED && o.status !== OrderStatus?.CANCELLED).forEach(order => {
    order.items.forEach(item => {
      if (ingredientSummary[item.name]) {
        ingredientSummary[item.name] += item.quantity;
      } else {
        ingredientSummary[item.name] = item.quantity;
      }
    });
  });

  return (
    <PageTransition>
      <div className="min-h-screen py-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Kitchen Dashboard</h1>
              <p className="text-dark-400">Manage orders and credit</p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-dark-800/50 rounded-xl p-1 border border-dark-700">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                🍳 Orders ({filteredOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('credit')}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                  activeTab === 'credit' 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                💳 Credit
                {pendingApprovals.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-black animate-pulse">
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
                {['all', OrderStatus?.PLACED, OrderStatus?.COOKING, OrderStatus?.READY, OrderStatus?.DELIVERED].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                      statusFilter === status 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'
                    }`}
                  >
                    {status === 'all' ? 'All Active' : status}
                  </button>
                ))}
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Placed Column */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                  <h3 className="font-black text-blue-400 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Placed ({placedOrders.length})
                  </h3>
                  <div className="space-y-3">
                    {placedOrders.map(order => (
                      <div key={order.id} className="card-elevated rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-black text-white">#{order.id}</span>
                            <p className="text-xs text-dark-400">{order.studentName} • {formatTime(order.timestamp)}</p>
                          </div>
                          {order.paymentMethod === 'credit' && (
                            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-0.5 rounded border border-purple-500/30">Credit</span>
                          )}
                        </div>
                        <div className="text-sm text-dark-400 mb-3">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <button
                          onClick={() => updateOrderStatus(order.id, OrderStatus?.COOKING)}
                          className="w-full bg-yellow-500 text-dark-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
                        >
                          🍳 Start Cooking
                        </button>
                      </div>
                    ))}
                    {placedOrders.length === 0 && (
                      <p className="text-center text-dark-500 py-8 text-sm">No orders</p>
                    )}
                  </div>
                </div>

                {/* Cooking Column */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                  <h3 className="font-black text-yellow-400 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    Cooking ({cookingOrders.length})
                  </h3>
                  <div className="space-y-3">
                    {cookingOrders.map(order => (
                      <div key={order.id} className="card-elevated rounded-xl p-4 border-l-4 border-yellow-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-black text-white">#{order.id}</span>
                            <p className="text-xs text-dark-400">{order.studentName}</p>
                          </div>
                        </div>
                        <div className="text-sm text-dark-400 mb-3">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <button
                          onClick={() => updateOrderStatus(order.id, OrderStatus?.READY)}
                          className="w-full bg-green-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-400 transition-colors"
                        >
                          ✅ Mark Ready
                        </button>
                      </div>
                    ))}
                    {cookingOrders.length === 0 && (
                      <p className="text-center text-dark-500 py-8 text-sm">No orders</p>
                    )}
                  </div>
                </div>

                {/* Ready Column */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                  <h3 className="font-black text-green-400 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Ready ({readyOrders.length})
                  </h3>
                  <div className="space-y-3">
                    {readyOrders.map(order => (
                      <div key={order.id} className="card-elevated rounded-xl p-4 border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-black text-white">#{order.id}</span>
                            <p className="text-xs text-dark-400">{order.studentName}</p>
                          </div>
                        </div>
                        <div className="text-sm text-dark-400 mb-3">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <button
                          onClick={() => updateOrderStatus(order.id, OrderStatus?.DELIVERED)}
                          className="w-full bg-dark-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-dark-500 transition-colors"
                        >
                          📦 Mark Delivered
                        </button>
                      </div>
                    ))}
                    {readyOrders.length === 0 && (
                      <p className="text-center text-dark-500 py-8 text-sm">No orders</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Culinary Summary & Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prep List */}
                <div className="card-elevated rounded-2xl p-6">
                  <h3 className="font-black text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span> Culinary Summary
                  </h3>
                  {Object.keys(ingredientSummary).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(ingredientSummary).map(([item, qty]) => (
                        <div key={item} className="flex justify-between items-center py-2 border-b border-dark-700">
                          <span className="font-medium text-dark-300">{item}</span>
                          <span className="font-black text-primary-400 text-lg">{qty}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dark-500 text-center py-8">No active orders</p>
                  )}
                </div>

                {/* Recent Feedback */}
                <div className="card-elevated rounded-2xl p-6">
                  <h3 className="font-black text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">⭐</span> Recent Feedback
                  </h3>
                  {feedbackList?.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {feedbackList.slice(0, 5).map((fb) => (
                        <div key={fb.id} className="border-b border-dark-700 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <span key={star} className={star <= fb.rating ? 'text-yellow-400' : 'text-dark-600'}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-dark-400">{fb.studentName}</span>
                          </div>
                          {fb.comment && <p className="text-sm text-dark-300">{fb.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dark-500 text-center py-8">No feedback yet</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Credit Management Tab */
            <div className="space-y-6 stagger-children">
              {/* Pending Approvals */}
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="font-black text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">📝</span>
                  Pending Credit Approvals ({pendingApprovals.length})
                </h3>
                {pendingApprovals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-bold text-dark-400 uppercase border-b border-dark-700">
                          <th className="pb-3">Student</th>
                          <th className="pb-3">Department</th>
                          <th className="pb-3">Orders</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map(student => {
                          const verified = isStudentVerified(student.contact);
                          return (
                            <tr key={student.contact} className="border-b border-dark-700">
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{student.name}</span>
                                  {verified && (
                                    <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 text-dark-400">{student.dept}</td>
                              <td className="py-3">
                                <span className="badge badge-success">{student.ordersThisMonth} orders</span>
                              </td>
                              <td className="py-3 text-dark-400">{student.contact}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => approveCredit(student.contact)}
                                  className="btn btn-primary btn-sm"
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
                  <p className="text-dark-500 text-center py-8">No pending approvals</p>
                )}
              </div>

              {/* Active Credit Users */}
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="font-black text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">💳</span>
                  Active Credit Users ({activeCredits.length})
                </h3>
                {activeCredits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-bold text-dark-400 uppercase border-b border-dark-700">
                          <th className="pb-3">Student</th>
                          <th className="pb-3">Tier</th>
                          <th className="pb-3">Limit</th>
                          <th className="pb-3">Balance</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCredits.map(student => (
                          <tr key={student.contact} className="border-b border-dark-700">
                            <td className="py-3 font-bold text-white">{student.name}</td>
                            <td className="py-3">
                              <span className={`badge ${
                                student.tier === 3 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                student.tier === 2 ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                                'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {CREDIT_TIERS?.[student.tier]?.name || 'None'}
                              </span>
                            </td>
                            <td className="py-3 font-bold text-white">₹{student.limit}</td>
                            <td className="py-3 font-bold text-red-400">₹{student.balance?.toFixed(2) || 0}</td>
                            <td className="py-3">
                              <span className="badge badge-success">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-dark-500 text-center py-8">No active credit users</p>
                )}
              </div>

              {/* Overdue Accounts */}
              <div className="card-elevated rounded-2xl p-6 border-2 border-red-500/30">
                <h3 className="font-black text-red-400 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center">⚠️</span>
                  Overdue Accounts ({overdueAccounts.length})
                </h3>
                {overdueAccounts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-bold text-dark-400 uppercase border-b border-dark-700">
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
                            <tr key={student.contact} className="border-b border-dark-700 bg-red-500/5">
                              <td className="py-3 font-bold text-white">{student.name}</td>
                              <td className="py-3 font-bold text-white">₹{student.balance?.toFixed(2) || 0}</td>
                              <td className="py-3">
                                <span className="badge badge-error">{daysLate} days</span>
                              </td>
                              <td className="py-3 font-bold text-red-400">₹{penalty}</td>
                              <td className="py-3 font-black text-red-400">₹{totalDue.toFixed(2)}</td>
                              <td className="py-3">
                                <button
                                  onClick={() => toggleCollegeBlocker(student.contact, true)}
                                  className="bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-sm hover:bg-red-400 transition-colors"
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
                  <p className="text-dark-500 text-center py-8">No overdue accounts 🎉</p>
                )}
              </div>

              {/* Blocked Students */}
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="font-black text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-dark-600 text-dark-400 rounded-lg flex items-center justify-center">🚫</span>
                  Blocked Students
                </h3>
                {allStudentsCredit?.filter(s => s.collegeBlocker).length > 0 ? (
                  <div className="space-y-3">
                    {allStudentsCredit.filter(s => s.collegeBlocker).map(student => (
                      <div key={student.contact} className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-sm text-dark-400">{student.dept} • {student.contact}</p>
                        </div>
                        <button
                          onClick={() => toggleCollegeBlocker(student.contact, false)}
                          className="btn btn-primary btn-sm"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-500 text-center py-8">No blocked students</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default KitchenPage;
