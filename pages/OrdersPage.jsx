import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
    o.status === OrderStatus.PLACED || 
    o.status === OrderStatus.COOKING || 
    o.status === OrderStatus.READY
  );

  const completedOrders = orders.filter(o => 
    o.status === OrderStatus.DELIVERED || 
    o.status === OrderStatus.CANCELLED
  );

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

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

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Active Orders ({activeOrders.length})
            </h2>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                      order.status === OrderStatus.READY ? 'bg-green-100 text-green-700' :
                      order.status === OrderStatus.COOKING ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.appliedDiscountPercentage > 0 && (
                    <div className="text-sm text-green-600 font-bold mb-2">
                      💰 Saved ₹{(order.originalTotalPrice - order.totalPrice).toFixed(2)} ({order.appliedDiscountPercentage}% discount)
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">Total: ₹{order.totalPrice.toFixed(2)}</span>
                    {order.status === OrderStatus.PLACED && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-500 font-bold text-sm hover:underline"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {order.aiSuggestion && (
                    <div className="mt-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <p className="text-xs font-black text-purple-600 uppercase mb-1">🤖 AI Suggestion</p>
                      <p className="text-sm text-purple-900">{order.aiSuggestion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Order History</h2>
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <div key={order.id} className={`bg-white rounded-2xl p-6 shadow-md ${
                  order.status === OrderStatus.CANCELLED ? 'opacity-50' : ''
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                      order.status === OrderStatus.DELIVERED ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">Total: ₹{order.totalPrice.toFixed(2)}</span>
                    {order.status === OrderStatus.DELIVERED && !order.feedbackSubmitted && (
                      <button
                        onClick={() => { setSelectedOrderForFeedback(order); setShowFeedbackModal(true); }}
                        className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Leave Feedback
                      </button>
                    )}
                    {order.feedbackSubmitted && (
                      <span className="text-gray-400 text-sm font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Feedback Submitted
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
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start browsing our delicious menu!</p>
            <a href="/menu" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all">
              Browse Menu
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
