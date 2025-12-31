
import React, { useState, useEffect, useMemo } from 'react';
import { Order, OrderStatus, Feedback } from '../types';

interface AdminViewProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  feedbackList: Feedback[];
  // attendancePercentage: number; // Removed
  // setAttendancePercentage: (percentage: number) => void; // Removed
  // discountPercentage: number; // Removed
  // setDiscountPercentage: (percentage: number) => void; // Removed
  // attendanceDiscountThreshold: number; // Removed
  // setAttendanceDiscountThreshold: (threshold: number) => void; // Removed
}

const AdminView: React.FC<AdminViewProps> = ({ 
  orders, 
  updateStatus, 
  feedbackList,
  // attendancePercentage, // Removed
  // setAttendancePercentage, // Removed
  // discountPercentage, // Removed
  // setDiscountPercentage, // Removed
  // attendanceDiscountThreshold, // Removed
  // setAttendanceDiscountThreshold, // Removed
}) => {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (o.status === OrderStatus.DELIVERED || o.status === OrderStatus.CANCELLED) return filter === o.status;
    return filter === 'ALL' || o.status === filter;
  });

  const chefsSummary = useMemo(() => {
    const activeOrders = orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING);
    const summary: Record<string, number> = {};
    activeOrders.forEach(order => {
      order.items.forEach(item => {
        summary[item.name] = (summary[item.name] || 0) + item.quantity;
      });
    });
    return summary;
  }, [orders]);

  const getElapsedTime = (timestamp: Date) => {
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  const formatFeedbackTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
           <div className="bg-orange-600 p-4 rounded-3xl shadow-xl shadow-orange-100">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
           </div>
           <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Kitchen KDS</h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Real-time Order Feed • Canteen Master</p>
           </div>
        </div>

        <div className="flex p-2 bg-white rounded-3xl shadow-sm border border-orange-100 overflow-x-auto hide-scrollbar">
          {['ALL', OrderStatus.PLACED, OrderStatus.COOKING, OrderStatus.READY, OrderStatus.DELIVERED].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                filter === f ? 'bg-orange-600 text-white shadow-xl' : 'text-gray-400 hover:text-orange-500'
              }`}
            >
              {f === 'ALL' ? 'Live Stream' : f.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Student Feedback Section */}
      {feedbackList.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-orange-500 fade-in relative overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">🌟</span>
            Student Feedback
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbackList.map((feedback) => (
              <div key={feedback.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${feedback.rating >= star ? 'text-orange-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-900 font-bold text-base leading-relaxed">"{feedback.comment}"</p>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span>{feedback.studentName} ({feedback.studentDept})</span>
                  <span>{feedback.orderId ? `#${feedback.orderId} • ` : ''}{formatFeedbackTime(feedback.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culinary Summary Bar */}
      {Object.keys(chefsSummary).length > 0 && filter === 'ALL' && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-orange-600 fade-in relative overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">🔥</span>
            Daily Prep List (Active Quantities)
          </h3>
          <div className="flex flex-wrap gap-5">
            {Object.entries(chefsSummary).map(([name, count]) => (
              <div key={name} className="bg-gray-50 px-6 py-4 rounded-[1.5rem] flex items-center gap-5 border-2 border-transparent hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-black text-orange-600">{count}</span>
                </div>
                <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-gray-100 fade-in">
          <div className="text-9xl mb-8 animate-pulse opacity-10">🍱</div>
          <h3 className="text-3xl font-black text-gray-300 uppercase tracking-widest">Kitchen Is Idle</h3>
          <p className="text-gray-400 mt-2 font-bold">New tickets will pop up as students order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
            const isPriority = totalItemsCount >= 5;

            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-[2.5rem] shadow-xl border-2 overflow-hidden transition-all flex flex-col hover:shadow-2xl ${
                  order.status === OrderStatus.READY ? 'border-green-500' : 
                  order.status === OrderStatus.COOKING ? 'border-yellow-400' : 
                  order.status === OrderStatus.DELIVERED ? 'border-gray-300 opacity-60' : 'border-blue-500'
                }`}
              >
                {/* Header with HUGE Order ID and Student Details */}
                <div className={`px-8 py-6 flex justify-between items-center ${
                  order.status === OrderStatus.READY ? 'bg-green-500 text-white' : 
                  order.status === OrderStatus.COOKING ? 'bg-yellow-400 text-gray-900' : 
                  order.status === OrderStatus.DELIVERED ? 'bg-gray-400 text-white' : 'bg-blue-500 text-white'
                }`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">#{order.id}</span>
                    <span className="font-black text-2xl tracking-tighter truncate max-w-[180px]">{order.studentName || 'Student'}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-90">{order.studentDept || 'General'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">ELAPSED</span>
                    <p className="text-xl font-black tabular-nums">{getElapsedTime(order.timestamp)}</p>
                  </div>
                </div>

                <div className="p-8 flex-grow space-y-6">
                  {/* Item Summary */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-gray-100 pb-4">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</span>
                        <span className="text-4xl font-black text-gray-900">{totalItemsCount} <span className="text-lg">Nos</span></span>
                     </div>
                     {isPriority && <span className="bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-lg">BULK ORDER</span>}
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 ${
                           order.status === OrderStatus.READY ? 'bg-green-50 border-green-100 text-green-600' :
                           order.status === OrderStatus.COOKING ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                           'bg-blue-50 border-blue-100 text-blue-600'
                        }`}>
                          {item.quantity}
                        </div>
                        <span className="font-black text-xl text-gray-800 leading-tight">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {order.instructions && (
                    <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-100 mt-4">
                      <p className="text-[10px] font-black text-red-600 uppercase mb-2 tracking-widest">Instructions:</p>
                      <p className="text-xl font-black text-red-900 leading-tight italic">"{order.instructions}"</p>
                    </div>
                  )}

                  {order.appliedDiscountPercentage && order.appliedDiscountPercentage > 0 && order.originalTotalPrice && (
                    <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-100 mt-4">
                      <p className="text-[10px] font-black text-green-600 uppercase mb-2 tracking-widest">Discount Applied:</p>
                      <p className="text-xl font-black text-green-900 leading-tight">
                        {order.appliedDiscountPercentage}% off (Saved ₹{(order.originalTotalPrice - order.totalPrice).toFixed(2)})
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  {order.status === OrderStatus.PLACED && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.COOKING)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl text-xl transition-all active:scale-95">Accept & Cook</button>
                  )}
                  {order.status === OrderStatus.COOKING && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.READY)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl text-xl transition-all active:scale-95">Ready to Pick</button>
                  )}
                  {order.status === OrderStatus.READY && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.DELIVERED)} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl text-xl transition-all active:scale-95">Complete Handover</button>
                  )}
                  {order.status === OrderStatus.DELIVERED && (
                    <div className="w-full py-4 text-center font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      Collected
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminView;