import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './contexts/OrderContext';
import { MessageProvider } from './contexts/MessageContext';
import { VaultProvider } from './contexts/VaultContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PublishingProvider } from './contexts/PublishingContext';

import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { HomePage } from './views/HomePage';
import { UserDashboard } from './views/UserDashboard';
import { CreateOrderView } from './views/CreateOrderView';
import { PortalOrderView } from './views/PortalOrderView';
import { AdminInbox } from './views/AdminInbox';
import { AdminPublishingView } from './views/AdminPublishingView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminOrdersListView } from './views/AdminOrdersListView';
import { AdminPaymentsView } from './views/AdminPaymentsView';
import { AdminFilesView } from './views/AdminFilesView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { UserProfileView } from './views/UserProfileView';
import { ArticleView } from './views/ArticleView';
import { MessagesView } from './views/MessagesView';
import { UploadsView } from './views/UploadsView';
import { OrdersListView } from './views/OrdersListView';
import { AuthView } from './views/AuthView';
import { UserRole } from './types';

const DevTools = () => {
    const { switchRole, user, isLoading } = useAuth();
    
    if (isLoading) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
            <div className="bg-black/80 backdrop-blur text-white text-xs p-2 rounded-lg flex gap-2">
                <span className="text-zinc-400">View:</span>
                <a href="#/" className="hover:text-blue-300">Public</a>
                <span>|</span>
                <a href="#/app" className="hover:text-blue-300">User</a>
                <span>|</span>
                <a href="#/admin" className="hover:text-blue-300">Admin</a>
                 <span>|</span>
                <a href="#/sign-in" className="hover:text-blue-300">Auth</a>
            </div>
            
            <div className="bg-zinc-900/90 backdrop-blur text-white text-xs p-2 rounded-lg flex gap-2 items-center">
                 <span className="text-zinc-400">Role:</span>
                 {(['user', 'admin', 'writer', 'support'] as UserRole[]).map(role => (
                     <button 
                        key={role}
                        onClick={() => switchRole(role)}
                        className={`capitalize hover:text-blue-300 ${user?.role === role ? 'text-blue-400 font-bold' : 'text-zinc-300'}`}
                     >
                        {role}
                     </button>
                 ))}
            </div>
        </div>
    );
};

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><ArticleView /></PublicLayout>} />
        <Route path="/article" element={<PublicLayout><ArticleView /></PublicLayout>} />

        {/* Auth Routes */}
        <Route path="/sign-in" element={<AuthView mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthView mode="sign-up" />} />

        {/* User Portal Routes */}
        <Route path="/app" element={<PortalLayout><UserDashboard /></PortalLayout>} />
        <Route path="/app/new" element={<PortalLayout><CreateOrderView /></PortalLayout>} />
        <Route path="/app/orders/:id" element={<PortalLayout><PortalOrderView /></PortalLayout>} />
        <Route path="/app/orders" element={<PortalLayout><OrdersListView /></PortalLayout>} />
        <Route path="/app/messages" element={<PortalLayout><MessagesView /></PortalLayout>} />
        <Route path="/app/uploads" element={<PortalLayout><UploadsView /></PortalLayout>} />
        <Route path="/app/settings" element={<PortalLayout><UserDashboard /></PortalLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminInbox /></AdminLayout>} />
        <Route path="/admin/inbox" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersListView /></AdminLayout>} />
        <Route path="/admin/orders/:id" element={<AdminLayout><AdminInbox /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsersView /></AdminLayout>} />
        <Route path="/admin/users/:id" element={<AdminLayout><UserProfileView /></AdminLayout>} />
        <Route path="/admin/publishing" element={<AdminLayout><AdminPublishingView /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPaymentsView /></AdminLayout>} />
        <Route path="/admin/files" element={<AdminLayout><AdminFilesView /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettingsView /></AdminLayout>} />
        
      </Routes>

      <DevTools />
    </HashRouter>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <MessageProvider>
          <VaultProvider>
              <PublishingProvider>
                <AppContent />
              </PublishingProvider>
          </VaultProvider>
        </MessageProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;