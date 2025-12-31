import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './contexts/OrderContext';

import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { HomePage } from './views/HomePage';
import { UserDashboard } from './views/UserDashboard';
import { CreateOrderView } from './views/CreateOrderView';
import { PortalOrderView } from './views/PortalOrderView';
import { AdminInbox } from './views/AdminInbox';
import { ArticleView } from './views/ArticleView';

const App = () => {
  return (
    <OrderProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><ArticleView /></PublicLayout>} />
          <Route path="/article" element={<PublicLayout><ArticleView /></PublicLayout>} />

          {/* User Portal Routes */}
          <Route path="/app" element={<PortalLayout><UserDashboard /></PortalLayout>} />
          <Route path="/app/new" element={<PortalLayout><CreateOrderView /></PortalLayout>} />
          <Route path="/app/orders/:id" element={<PortalLayout><PortalOrderView /></PortalLayout>} />
          {/* Placeholder routes for now */}
          <Route path="/app/orders" element={<PortalLayout><UserDashboard /></PortalLayout>} />
          <Route path="/app/messages" element={<PortalLayout><UserDashboard /></PortalLayout>} />
          <Route path="/app/settings" element={<PortalLayout><UserDashboard /></PortalLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminInbox /></AdminLayout>} />
          <Route path="/admin/orders/:id" element={<AdminLayout><AdminInbox /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminInbox /></AdminLayout>} />
          <Route path="/admin/payments" element={<AdminLayout><AdminInbox /></AdminLayout>} />
          
        </Routes>

        {/* Dev Switcher - URL based now */}
        <div className="fixed bottom-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur text-white text-xs p-2 rounded-lg flex gap-2">
                <a href="#/" className="hover:text-blue-300">Public</a>
                <span>|</span>
                <a href="#/app" className="hover:text-blue-300">User</a>
                <span>|</span>
                <a href="#/admin" className="hover:text-blue-300">Admin</a>
            </div>
        </div>
      </HashRouter>
    </OrderProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;
