import React from 'react';
import { useApp } from '../context/AppContext';
import StudentView from '../components/StudentView';

const MenuPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    subtotal,
    discountAmount,
    finalPrice,
    placeOrder,
    cancelOrder,
    addNotification,
    isOrdering,
    lastAiSuggestion,
    orders,
    profile,
    setProfile,
    notifications,
    submitFeedback,
    discountPercentage,
    attendanceDiscountThreshold,
  } = useApp();

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <StudentView
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          deleteFromCart={deleteFromCart}
          clearCart={clearCart}
          subtotal={subtotal}
          discountAmount={discountAmount}
          finalPrice={finalPrice}
          onOrder={placeOrder}
          onCancel={cancelOrder}
          addNotification={addNotification}
          isOrdering={isOrdering}
          lastAiSuggestion={lastAiSuggestion}
          orders={[]} // Don't show orders on menu page
          profile={profile}
          setProfile={setProfile}
          notifications={notifications}
          submitFeedback={submitFeedback}
          discountPercentage={discountPercentage}
          attendanceDiscountThreshold={attendanceDiscountThreshold}
        />
      </div>
    </div>
  );
};

export default MenuPage;
