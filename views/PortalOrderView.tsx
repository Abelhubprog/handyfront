import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { OrderWorkspace } from '../components/orders/OrderWorkspace';
import { Order } from '../types';

export const PortalOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder } = useOrders();
  const order = id ? getOrder(id) : undefined;

  const handlePayment = () => {
    if (order) {
      const updatedOrder: Order = {
        ...order,
        status: 'in_progress',
        nextAction: 'none',
        activities: [
          {
            id: Date.now().toString(),
            type: 'payment',
            title: 'Payment Successful',
            timestamp: 'Just now',
            description: 'Processed securely via Stripe'
          },
          ...order.activities
        ]
      };
      updateOrder(updatedOrder);
    }
  };

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Order not found</h2>
        <button onClick={() => navigate('/app')} className="text-blue-600 hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <OrderWorkspace order={order} onPayment={handlePayment} />
  );
};
