import React, { useState } from 'react';
import { Search, Settings, Briefcase } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { OrderWorkspace } from '../components/orders/OrderWorkspace';
import { cn } from '../lib/utils';
import { View, Order } from '../types';

export const AdminInbox = ({ setView, currentOrderId, setCurrentOrderId, orders, onUpdateOrder }: { setView: (v: View) => void, currentOrderId: string | null, setCurrentOrderId: (id: string) => void, orders: Order[], onUpdateOrder: (o: Order) => void }) => {
  const [filter, setFilter] = useState<'all' | 'attention' | 'active'>('all');
  
  const filteredOrders = orders.filter(o => {
      if (filter === 'attention') return o.status === 'review' || o.status === 'pending_payment';
      if (filter === 'active') return o.status === 'in_progress';
      return true;
  });

  // Prioritize current selection if it exists in the filtered list, otherwise default to top of list
  const activeOrder = filteredOrders.find(o => o.id === currentOrderId) || filteredOrders[0] || null;
  
  return (
    <div className="flex flex-1 overflow-hidden h-full">
        {/* Left List */}
        <div className="w-full md:w-[400px] border-r border-zinc-200 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-zinc-900">Inbox</h2>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"><Search size={16} /></button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"><Settings size={16} /></button>
                    </div>
                </div>
                {/* Status Filters */}
                <div className="flex p-1 bg-zinc-100 rounded-lg">
                    {['all', 'attention', 'active'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                                filter === f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            {f === 'attention' ? 'Needs Action' : f}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 text-sm">No orders found</div>
                ) : (
                    filteredOrders.map(order => (
                        <div 
                            key={order.id}
                            onClick={() => setCurrentOrderId(order.id)}
                            className={cn(
                                "p-4 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors group",
                                activeOrder?.id === order.id ? 'bg-zinc-50 border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs text-zinc-400">#{order.id}</span>
                                <span className="text-xs text-zinc-500">{order.activities[0].timestamp}</span>
                            </div>
                            <h4 className={cn("font-medium text-sm mb-1 truncate transition-colors", activeOrder?.id === order.id ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900")}>
                                {order.title}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                                <Badge status={order.status} />
                                {order.unreadMessages > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        
        {/* Right Details */}
        <div className="hidden md:block flex-1 h-full overflow-hidden bg-white">
            {activeOrder ? (
                <OrderWorkspace 
                    key={activeOrder.id} // Forces reset of tabs when switching orders
                    order={activeOrder} 
                    userType="admin" 
                    onPayment={() => {}} // Admin doesn't pay
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-3">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center">
                        <Briefcase size={32} className="opacity-20 text-zinc-900" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500">Select an order to view details</p>
                </div>
            )}
        </div>
    </div>
  );
};
