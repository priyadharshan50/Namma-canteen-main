import React from 'react';
import { useApp } from '../context/AppContext';
import AdminView from '../components/AdminView';

const KitchenPage = () => {
  const { orders, updateOrderStatus, feedbackList } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <AdminView
          orders={orders}
          updateStatus={updateOrderStatus}
          feedbackList={feedbackList}
        />
      </div>
    </div>
  );
};

export default KitchenPage;
