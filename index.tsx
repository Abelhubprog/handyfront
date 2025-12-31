import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { View, Order } from './types';
import { INITIAL_ORDERS } from './mocks';
import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './views/HomePage';
import { UserDashboard } from './views/UserDashboard';
import { CreateOrderView } from './views/CreateOrderView';
import { AdminInbox } from './views/AdminInbox';
import { ArticleView } from './views/ArticleView';
import { OrderWorkspace } from './components/orders/OrderWorkspace';

const App = () => {
  const [view, setView] = useState<View>('home');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Helper to toggle admin view easily for demo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'm') {
            setView(v => v === 'admin-inbox' ? 'home' : 'admin-inbox');
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCreateOrder = (newOrder: Order) => {
      setOrders([newOrder, ...orders]);
      setCurrentOrderId(newOrder.id);
      setView('portal-order');
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
      setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handlePayment = (orderId: string) => {
      const order = orders.find(o => o.id === orderId);
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
          handleUpdateOrder(updatedOrder);
      }
  };

  const getActiveOrder = () => orders.find(o => o.id === currentOrderId) || orders[0];

  const renderView = () => {
    switch (view) {
      case 'home':
        return <PublicLayout setView={setView}><HomePage setView={setView} /></PublicLayout>;
      case 'portal-dashboard':
        return <PortalLayout setView={setView}><UserDashboard setView={setView} setCurrentOrderId={setCurrentOrderId} orders={orders} /></PortalLayout>;
      case 'create-order':
        return <PortalLayout setView={setView} activeTab="dashboard"><CreateOrderView setView={setView} onSubmit={handleCreateOrder} /></PortalLayout>;
      case 'portal-order':
        const activeOrder = getActiveOrder();
        return (
            <PortalLayout setView={setView} activeTab="orders">
                <OrderWorkspace 
                    order={activeOrder} 
                    onPayment={() => handlePayment(activeOrder.id)} 
                />
            </PortalLayout>
        );
      case 'admin-inbox':
        return (
            <AdminLayout setView={setView}>
                <AdminInbox 
                    setView={setView} 
                    currentOrderId={currentOrderId} 
                    setCurrentOrderId={setCurrentOrderId} 
                    orders={orders}
                    onUpdateOrder={handleUpdateOrder}
                />
            </AdminLayout>
        );
      case 'article':
        return <PublicLayout setView={setView}><ArticleView setView={setView} /></PublicLayout>;
      default:
        return <PublicLayout setView={setView}><HomePage setView={setView} /></PublicLayout>;
    }
  };

  return (
    <>
        {renderView()}
        {/* Dev Switcher */}
        <div className="fixed bottom-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur text-white text-xs p-2 rounded-lg flex gap-2">
                <button onClick={() => setView('home')} className="hover:text-blue-300">Public</button>
                <span>|</span>
                <button onClick={() => setView('portal-dashboard')} className="hover:text-blue-300">User</button>
                <span>|</span>
                <button onClick={() => setView('admin-inbox')} className="hover:text-blue-300">Admin</button>
            </div>
        </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;
