import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/system/PageHeader';
import { EmptyState } from '../components/system/EmptyState';
import { ActiveOrderCard } from '../components/dashboard/ActiveOrderCard';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { RecentUpdatesList, UpdateItem } from '../components/dashboard/RecentUpdatesList';
import { SupportCard } from '../components/dashboard/SupportCard';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  // 1. Determine Active Order (Priority: Awaiting Payment > Awaiting Files > In Progress > Review)
  const activeOrder = useMemo(() => {
    const priority = ['pending_payment', 'review', 'in_progress', 'draft'];
    return orders
        .filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status))
        .sort((a, b) => {
             const idxA = priority.indexOf(a.status);
             const idxB = priority.indexOf(b.status);
             if (idxA === -1 && idxB === -1) return 0;
             if (idxA === -1) return 1;
             if (idxB === -1) return -1;
             return idxA - idxB;
        })[0] || null;
  }, [orders]);

  // 2. Activity / Updates Feed (Mock derivation from orders)
  const updates: UpdateItem[] = useMemo(() => {
      const allActivities = orders.flatMap(o => o.activities.map(a => ({ 
          ...a, 
          orderId: o.id, 
          orderTitle: o.title 
      })));
      return allActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Assuming timestamp is parsable or mock logic
          .slice(0, 5) as UpdateItem[];
  }, [orders]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <PageHeader 
        title="Home" 
        subtitle="Track your active orders and messages."
        actions={
            <Button onClick={() => navigate('/app/new')} className="hidden md:flex shadow-lg shadow-zinc-900/10">
                <Plus size={18} className="mr-2" />
                New Order
            </Button>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Primary Focus */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Active Order Card */}
              {activeOrder ? (
                  <ActiveOrderCard order={activeOrder} />
              ) : (
                  <EmptyState 
                    icon={<FileText size={48} />}
                    title="No active orders"
                    description="Ready to get started? Place your first order today."
                    action={{ label: "Create New Order", onClick: () => navigate('/app/new') }}
                  />
              )}

              {/* Updates Feed */}
              <RecentUpdatesList updates={updates} />

          </div>

          {/* Right Column: Quick Actions & Support */}
          <div className="space-y-6">
              
              {/* Quick Actions Grid */}
              <QuickActionsGrid />

              {/* Support Card */}
              <SupportCard />

          </div>
      </div>
      
      {/* Mobile Floating Action Button for New Order */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
          <button 
            onClick={() => navigate('/app/new')}
            className="w-14 h-14 bg-zinc-900 text-white rounded-full shadow-lg shadow-zinc-900/30 flex items-center justify-center active:scale-95 transition-transform"
          >
              <Plus size={28} />
          </button>
      </div>

    </div>
  );
};