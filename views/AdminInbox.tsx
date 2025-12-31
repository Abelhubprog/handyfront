import React, { useState } from 'react';
import { Search, Settings, Briefcase, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { OrderWorkspace } from '../components/orders/OrderWorkspace';
import { cn } from '../lib/utils';
import { useOrders } from '../contexts/OrderContext';

export const AdminInbox = () => {
  const [filter, setFilter] = useState<'all' | 'attention' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { id: currentOrderId } = useParams();
  const { orders } = useOrders();
  
  // Get active order from full list to persist selection even if filtered out of sidebar
  const activeOrder = orders.find(o => o.id === currentOrderId) || null;
  
  const filteredOrders = orders.filter(o => {
      // Search
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            o.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter Tabs
      let matchesFilter = true;
      if (filter === 'attention') matchesFilter = o.status === 'review' || o.status === 'pending_payment';
      if (filter === 'active') matchesFilter = o.status === 'in_progress';
      
      return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="flex flex-1 overflow-hidden h-full">
        {/* Left List Pane */}
        <div className={cn(
            "w-full md:w-[400px] border-r border-zinc-200 bg-white flex flex-col h-full transition-all duration-300", 
            activeOrder ? "hidden md:flex" : "flex"
        )}>
            <div className="p-4 border-b border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
                        <Briefcase size={18} />
                        Inbox
                    </h2>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500 transition-colors"><Settings size={16} /></button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-zinc-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                    />
                </div>

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
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-400 text-sm">
                        <Filter size={24} className="mb-2 opacity-20" />
                        <p>No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div 
                            key={order.id}
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className={cn(
                                "p-4 border-b border-zinc-50 cursor-pointer transition-all duration-200 group relative",
                                activeOrder?.id === order.id ? 'bg-zinc-100' : 'hover:bg-zinc-50 bg-white'
                            )}
                        >
                            {/* Selection Indicator Bar */}
                            {activeOrder?.id === order.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900" />
                            )}
                            
                            <div className="flex justify-between items-start mb-1.5">
                                <span className={cn(
                                    "font-mono text-[10px] px-1.5 py-0.5 rounded transition-colors",
                                    activeOrder?.id === order.id ? "bg-white text-zinc-600 border border-zinc-200" : "bg-zinc-100 text-zinc-400"
                                )}>
                                    #{order.id}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {order.unreadMessages > 0 && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-sm" title="New messages" />
                                    )}
                                    <span className="text-[10px] text-zinc-400">{order.activities[0].timestamp}</span>
                                </div>
                            </div>
                            
                            <h4 className={cn(
                                "font-medium text-sm mb-2 truncate transition-colors", 
                                activeOrder?.id === order.id ? "text-zinc-900" : "text-zinc-700 group-hover:text-zinc-900",
                                order.unreadMessages > 0 ? "font-bold text-zinc-900" : ""
                            )}>
                                {order.title}
                            </h4>
                            
                            <div className="flex items-center justify-between">
                                <Badge status={order.status} />
                                {order.unreadMessages > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                                        {order.unreadMessages}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        
        {/* Right Details Pane */}
        <div className={cn("flex-1 h-full overflow-hidden bg-white relative", activeOrder ? "block" : "hidden md:block")}>
            {activeOrder ? (
                <div className="h-full flex flex-col animate-in fade-in duration-300">
                    <div className="md:hidden p-4 border-b border-zinc-100 flex items-center gap-2 bg-white sticky top-0 z-20">
                        <button onClick={() => navigate('/admin')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center">
                             ← Back to Inbox
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                         <OrderWorkspace 
                            key={activeOrder.id} 
                            order={activeOrder} 
                            userType="admin" 
                            onPayment={() => {}} 
                        />
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 bg-zinc-50/50">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center">
                        <Briefcase size={32} className="text-zinc-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-medium text-zinc-900">No Order Selected</p>
                        <p className="text-sm text-zinc-500 mt-1">Select an order from the inbox to view details.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};