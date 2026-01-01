import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/system/PageHeader';
import { EmptyState } from '../components/system/EmptyState';
import { ActiveOrderCard } from '../components/dashboard/ActiveOrderCard';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { RecentUpdatesList, UpdateItem } from '../components/dashboard/RecentUpdatesList';
import { SupportCard } from '../components/dashboard/SupportCard';

// Helper for sorting mock relative timestamps
const getTimestampScore = (timeStr: string) => {
    const now = Date.now();
    if (timeStr === 'Just now') return now;
    
    // Parse "2h ago", "5 mins ago", etc.
    const match = timeStr.match(/(\d+)\s*([a-z]+)/i);
    if (match) {
        const val = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        let multiplier = 1000;
        if (unit.startsWith('min')) multiplier *= 60;
        if (unit.startsWith('h')) multiplier *= 3600;
        if (unit.startsWith('d')) multiplier *= 86400;
        if (unit.startsWith('w')) multiplier *= 604800;
        if (unit.startsWith('mo')) multiplier *= 2592000;
        return now - (val * multiplier);
    }
    
    // Fallback for ISO dates
    const date = new Date(timeStr).getTime();
    return isNaN(date) ? 0 : date;
};

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { user } = useAuth();

  // 1. Determine Active Order (Priority: Awaiting Payment > Awaiting Files > In Progress > Review)
  const activeOrder = useMemo(() => {
    const priority = ['pending_payment', 'review', 'in_progress', 'draft'];
    const activeOrders = orders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status));
    
    if (activeOrders.length === 0) return null;

    return activeOrders.sort((a, b) => {
         const idxA = priority.indexOf(a.status);
         const idxB = priority.indexOf(b.status);
         // If status not in priority list, push to end
         const scoreA = idxA === -1 ? 999 : idxA;
         const scoreB = idxB === -1 ? 999 : idxB;
         
         if (scoreA !== scoreB) return scoreA - scoreB;
         // Secondary sort by date (newest first)
         return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    })[0];
  }, [orders]);

  // 2. Activity / Updates Feed
  const updates: UpdateItem[] = useMemo(() => {
      const allActivities = orders.flatMap(o => o.activities.map(a => ({ 
          ...a, 
          orderId: o.id, 
          orderTitle: o.title 
      })));
      
      return allActivities
          .sort((a, b) => getTimestampScore(b.timestamp) - getTimestampScore(a.timestamp))
          .slice(0, 5) as UpdateItem[];
  }, [orders]);

  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24 md:pb-8">
      
      {/* Header */}
      <PageHeader 
        title={`Welcome back, ${firstName}`}
        subtitle="Here's what's happening with your projects today."
        actions={
            <Button onClick={() => navigate('/app/new')} className="hidden md:flex shadow-lg shadow-zinc-900/10">
                <Plus size={18} className="mr-2" />
                New Order
            </Button>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Primary Focus */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Active Order Card */}
              <section className="space-y-4">
                  {activeOrder ? (
                      <ActiveOrderCard order={activeOrder} />
                  ) : (
                      <EmptyState 
                        icon={<FileText size={48} />}
                        title="No active orders"
                        description="Ready to get started? Place your first order to track its progress here."
                        action={{ label: "Create New Order", onClick: () => navigate('/app/new') }}
                      />
                  )}
              </section>

              {/* Updates Feed */}
              <RecentUpdatesList updates={updates} />

          </div>

          {/* Right Column: Quick Actions & Support */}
          <div className="space-y-6">
              
              <div className="hidden lg:block">
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Quick Actions</h3>
                  <QuickActionsGrid />
              </div>
              
              {/* Mobile version of Quick Actions is usually inline or via bottom nav, but we can show it here stacked on mobile too */}
              <div className="lg:hidden">
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">Shortcuts</h3>
                  <QuickActionsGrid />
              </div>

              <SupportCard />

          </div>
      </div>
      
      {/* Mobile Floating Action Button for New Order */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
          <button 
            onClick={() => navigate('/app/new')}
            className="w-14 h-14 bg-zinc-900 text-white rounded-full shadow-lg shadow-zinc-900/30 flex items-center justify-center active:scale-95 transition-transform hover:scale-105"
            aria-label="Create new order"
          >
              <Plus size={28} />
          </button>
      </div>

    </div>
  );
};