import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const OrdersPage = () => {
  const {
    orders,
    cancelOrder,
    submitFeedback,
    profile,
    addNotification,
    OrderStatus,
  } = useApp();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

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

  const activeOrders = orders.filter(o => 
    o.status === OrderStatus?.PLACED || 
    o.status === OrderStatus?.COOKING || 
    o.status === OrderStatus?.READY
  );

  const completedOrders = orders.filter(o => 
    o.status === OrderStatus?.DELIVERED || 
    o.status === OrderStatus?.CANCELLED
  );

  // Status step indicator
  const getStatusStep = (status) => {
    if (status === OrderStatus?.PLACED) return 1;
    if (status === OrderStatus?.COOKING) return 2;
    if (status === OrderStatus?.READY) return 3;
    return 0;
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2">My Orders</h1>
            <p className="text-dark-400">Track and manage your orders</p>
          </div>

          {/* Feedback Modal */}
          {showFeedbackModal && selectedOrderForFeedback && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[103] flex items-center justify-center p-4 modal-backdrop-enter">
              <div className="card-glass w-full max-w-md p-8 rounded-3xl modal-content-enter">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-white">Rate Order #{selectedOrderForFeedback.id}</h3>
                  <button onClick={() => setShowFeedbackModal(false)} className="text-dark-400 hover:text-white transition-colors">✕</button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="input-group-label block mb-3">Your Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`text-4xl transition-all hover:scale-110 ${feedbackRating >= star ? 'text-yellow-400' : 'text-dark-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-group-label">Comments (Optional)</label>
                    <textarea 
                      value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                      placeholder="Tell us what you loved or how we can improve..."
                      className="input input-glow resize-none" rows={4}
                    ></textarea>
                  </div>
                  <button 
                    onClick={handleFeedbackSubmit} 
                    disabled={feedbackRating === 0}
                    className="btn btn-primary btn-xl w-full"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="mb-8 fade-in">
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Active Orders ({activeOrders.length})
              </h2>
              <div className="space-y-4 stagger-children">
                {activeOrders.map((order) => (
                  <div key={order.id} className="card-elevated rounded-2xl p-6 border-l-4 border-primary-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-white">Order #{order.id}</h3>
                        <p className="text-sm text-dark-400">{formatTime(order.timestamp)}</p>
                      </div>
                      <span className={`badge ${
                        order.status === OrderStatus?.READY ? 'badge-success' :
                        order.status === OrderStatus?.COOKING ? 'badge-warning' :
                        'bg-blue-500 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Status Timeline */}
                    <div className="flex items-center justify-between mb-6 px-4">
                      {[
                        { step: 1, label: 'Placed', icon: '📝' },
                        { step: 2, label: 'Cooking', icon: '🍳' },
                        { step: 3, label: 'Ready', icon: '✅' },
                      ].map((s, i) => (
                        <React.Fragment key={s.step}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                              getStatusStep(order.status) >= s.step 
                                ? 'bg-primary-500 text-white scale-110' 
                                : 'bg-dark-700 text-dark-500'
                            }`}>
                              {s.icon}
                            </div>
                            <span className={`text-xs mt-2 font-bold ${
                              getStatusStep(order.status) >= s.step ? 'text-primary-400' : 'text-dark-500'
                            }`}>
                              {s.label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${
                              getStatusStep(order.status) > s.step ? 'bg-primary-500' : 'bg-dark-700'
                            }`}></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-2 mb-4 bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-dark-300">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.appliedDiscountPercentage > 0 && (
                      <div className="text-sm text-green-400 font-bold mb-2">
                        💰 Saved ₹{(order.originalTotalPrice - order.totalPrice).toFixed(2)} ({order.appliedDiscountPercentage}% discount)
                      </div>
                    )}

                    <div className="pt-4 border-t border-dark-700 flex justify-between items-center">
                      <span className="text-lg font-black text-white">Total: <span className="text-primary-400">₹{order.totalPrice.toFixed(2)}</span></span>
                      {order.status === OrderStatus?.PLACED && (
                        <button 
                          onClick={() => cancelOrder(order.id)}
                          className="text-red-400 font-bold text-sm hover:text-red-300 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {order.aiSuggestion && (
                      <div className="mt-4 bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
                        <p className="text-xs font-black text-purple-400 uppercase mb-1">🤖 AI Suggestion</p>
                        <p className="text-sm text-purple-300">{order.aiSuggestion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <div className="fade-in">
              <h2 className="text-2xl font-black text-white mb-4">Order History</h2>
              <div className="space-y-4 stagger-children">
                {completedOrders.map((order) => (
                  <div key={order.id} className={`card-elevated rounded-2xl p-6 ${
                    order.status === OrderStatus?.CANCELLED ? 'opacity-50' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-black text-white">Order #{order.id}</h3>
                        <p className="text-sm text-dark-400">{formatTime(order.timestamp)}</p>
                      </div>
                      <span className={`badge ${
                        order.status === OrderStatus?.DELIVERED ? 'bg-dark-600 text-dark-300' :
                        'badge-error'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-dark-400">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-dark-300">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-dark-700 flex justify-between items-center">
                      <span className="text-lg font-black text-white">Total: ₹{order.totalPrice.toFixed(2)}</span>
                      {order.status === OrderStatus?.DELIVERED && !order.feedbackSubmitted && (
                        <button
                          onClick={() => { setSelectedOrderForFeedback(order); setShowFeedbackModal(true); }}
                          className="text-primary-400 font-bold text-sm hover:text-primary-300 transition-colors flex items-center gap-1"
                        >
                          ⭐ Leave Feedback
                        </button>
                      )}
                      {order.feedbackSubmitted && (
                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                          ✓ Feedback Submitted
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="card-glass rounded-3xl p-16 text-center">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <h3 className="text-2xl font-black text-white mb-2">No Orders Yet</h3>
              <p className="text-dark-400 mb-6">Start browsing our delicious menu!</p>
              <Link to="/menu" className="btn btn-primary btn-xl">
                Browse Menu
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default OrdersPage;
