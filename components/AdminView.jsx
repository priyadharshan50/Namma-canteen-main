
import React, { useState, useEffect, useMemo } from 'react';

// Define OrderStatus enum as an object
export const OrderStatus = {
  PLACED: 'Order Placed',
  COOKING: 'Cooking',
  READY: 'Ready',
  CANCELLED: 'Cancelled',
  DELIVERED: 'Delivered'
};

const AdminView = ({ 
  orders, 
  updateStatus, 
  feedbackList,
}) => {
  const [filter, setFilter] = useState('ALL');
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
    const summary = {};
    activeOrders.forEach(order => {
      order.items.forEach(item => {
        summary[item.name] = (summary[item.name] || 0) + item.quantity;
      });
    });
    return summary;
  }, [orders]);

  const getElapsedTime = (timestamp) => {
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  const formatFeedbackTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="relative group">
             <div className="absolute -inset-2 bg-primary-500/20 rounded-3xl blur-xl group-hover:bg-primary-500/40 transition-all"></div>
             <div className="relative bg-dark-900 border border-dark-800 p-4 rounded-3xl shadow-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
             </div>
           </div>
           <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Kitchen Intelligence</h2>
              <p className="text-dark-400 font-black uppercase tracking-[0.3em] text-[10px] mt-1">HMR Ready • Live Command Center</p>
           </div>
        </div>

        <div className="flex p-1.5 bg-dark-900 border border-dark-800 rounded-2xl backdrop-blur-xl overflow-x-auto hide-scrollbar">
          {['ALL', OrderStatus.PLACED, OrderStatus.COOKING, OrderStatus.READY, OrderStatus.DELIVERED].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                filter === f 
                  ? 'bg-primary-500 text-dark-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                  : 'text-dark-400 hover:text-primary-400 hover:bg-dark-800'
              }`}
            >
              {f === 'ALL' ? 'Live Stream' : f.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Culinary Summary Bar */}
      {Object.keys(chefsSummary).length > 0 && filter === 'ALL' && (
        <div className="card-glass p-8 rounded-[2.5rem] border border-dark-800 fade-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center">🍱</span>
            Production Forecast
          </h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(chefsSummary).map(([name, count]) => (
              <div key={name} className="bg-dark-900/50 px-6 py-4 rounded-2xl flex items-center gap-6 border border-dark-800 hover:border-primary-500/30 transition-all shadow-inner">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{count}</span>
                  <span className="text-[9px] font-black text-dark-500 uppercase tracking-widest leading-none mt-1">Units</span>
                </div>
                <div className="h-8 w-px bg-dark-800"></div>
                <span className="text-sm font-bold text-dark-200">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-dark-900/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-dark-800 fade-in">
          <div className="text-8xl mb-8 opacity-20 filter grayscale group-hover:grayscale-0 transition-all">🌙</div>
          <h3 className="text-2xl font-black text-dark-600 uppercase tracking-widest">Kitchen Passive</h3>
          <p className="text-dark-500 mt-2 font-medium">Listening for new digital signals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
            const isPriority = totalItemsCount >= 5;

            return (
              <div 
                key={order.id} 
                className={`bg-dark-900 rounded-[2.5rem] shadow-2xl border border-dark-800 overflow-hidden transition-all flex flex-col hover:border-primary-500/30 group ${
                  order.status === OrderStatus.DELIVERED ? 'opacity-40' : ''
                }`}
              >
                {/* Header */}
                <div className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${
                  order.status === OrderStatus.READY ? 'from-primary-600 to-primary-800' : 
                  order.status === OrderStatus.COOKING ? 'from-amber-500 to-amber-700' : 
                  order.status === OrderStatus.DELIVERED ? 'from-dark-800 to-dark-900' : 'from-blue-600 to-blue-800'
                }`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none mb-2">Order #{order.id}</span>
                    <span className="font-black text-2xl text-white tracking-tight leading-none truncate max-w-[150px]">{order.studentName || 'Guest'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none">Clock</span>
                    <p className="text-xl font-black text-white tabular-nums leading-none mt-1">{getElapsedTime(order.timestamp)}</p>
                  </div>
                </div>

                <div className="p-8 flex-grow space-y-8">
                  {/* Status & Priority */}
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-1">Status</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            order.status === OrderStatus.READY ? 'bg-primary-500' : 
                            order.status === OrderStatus.COOKING ? 'bg-amber-400' : 'bg-blue-400'
                          }`}></div>
                          <span className="font-black text-sm text-dark-200 uppercase tracking-widest">{order.status}</span>
                        </div>
                     </div>
                     {isPriority && <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-500/30">Bulk Load</span>}
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-3 rounded-2xl bg-dark-950/50 border border-dark-800 shadow-inner">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                           order.status === OrderStatus.READY ? 'bg-primary-500/20 text-primary-400' :
                           order.status === OrderStatus.COOKING ? 'bg-amber-500/20 text-amber-400' :
                           'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.quantity}
                        </div>
                        <span className="font-bold text-lg text-white leading-tight">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {order.instructions && (
                    <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20">
                      <p className="text-[10px] font-black text-red-400 uppercase mb-2 tracking-widest">Special Notes</p>
                      <p className="text-sm font-bold text-red-200/80 leading-relaxed italic">"{order.instructions}"</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 bg-dark-950/50 border-t border-dark-800">
                  {order.status === OrderStatus.PLACED && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.COOKING)} className="btn btn-primary btn-xl w-full active:scale-95 transition-transform">Start Production</button>
                  )}
                  {order.status === OrderStatus.COOKING && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.READY)} className="w-full bg-amber-500 text-amber-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-500/10 text-lg hover:bg-amber-400 transition-all active:scale-95">Mark as Ready</button>
                  )}
                  {order.status === OrderStatus.READY && (
                    <button onClick={() => updateStatus(order.id, OrderStatus.DELIVERED)} className="w-full bg-emerald-500 text-emerald-950 font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/10 text-lg hover:bg-emerald-400 transition-all active:scale-95">Complete Handover</button>
                  )}
                  {order.status === OrderStatus.DELIVERED && (
                    <div className="w-full py-2 text-center font-black text-dark-500 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      Archived
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Feed */}
      {feedbackList.length > 0 && (
        <div className="card-glass p-8 rounded-[3rem] border border-dark-800 fade-in relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center">💌</span>
            Voice of Student
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackList.map((feedback) => (
              <div key={feedback.id} className="bg-dark-900 border border-dark-800 p-6 rounded-3xl space-y-4 hover:border-primary-500/30 transition-all">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${feedback.rating >= star ? 'text-primary-500' : 'text-dark-700'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white font-medium text-sm leading-relaxed italic">"{feedback.comment}"</p>
                <div className="text-[9px] text-dark-500 font-black uppercase tracking-widest pt-4 border-t border-dark-800 flex justify-between items-center">
                  <span className="text-primary-400">{feedback.studentName}</span>
                  <span>{formatFeedbackTime(feedback.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
