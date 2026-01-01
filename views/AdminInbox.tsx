import React, { useState } from 'react';
import { Search, Settings, Briefcase, Filter, Inbox, ListFilter, MoreHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { OrderWorkspace } from '../components/orders/OrderWorkspace';
import { cn } from '../lib/utils';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';

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
        {/* Left List Pane: Inbox Sidebar */}
        <div className={cn(
            "w-full md:w-[420px] border-r border-zinc-200 bg-white flex flex-col h-full transition-all duration-300 relative z-20", 
            activeOrder ? "hidden md:flex shadow-2xl" : "flex"
        )}>
            <div className="p-5 border-b border-zinc-100 space-y-5 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <Inbox size={18} />
                         </div>
                         <h2 className="font-bold text-zinc-900 tracking-tight">Orders Inbox</h2>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-all"><ListFilter size={18} /></button>
                        <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-all"><MoreHorizontal size={18} /></button>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search IDs, titles, clients..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-zinc-900/5 focus:bg-white focus:border-zinc-900 transition-all"
                    />
                </div>

                <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200/50">
                    {(['all', 'attention', 'active'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all",
                                filter === f ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            {f === 'attention' ? 'Needs Action' : f}
                            {f === 'attention' && orders.filter(o => o.status === 'review').length > 0 && (
                                <span className="ml-1.5 w-2 h-2 rounded-full bg-red-500 inline-block align-middle" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-sm px-10 text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
                            <Filter size={24} className="opacity-20" />
                        </div>
                        <p className="font-medium text-zinc-900 mb-1">No orders found</p>
                        <p className="text-xs text-zinc-400">Try adjusting your filters or search query to find what you're looking for.</p>
                        <Button variant="ghost" size="sm" className="mt-4" onClick={() => {setFilter('all'); setSearchQuery('');}}>Clear All Filters</Button>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-50">
                        {filteredOrders.map(order => (
                            <div 
                                key={order.id}
                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                className={cn(
                                    "p-5 cursor-pointer transition-all duration-200 group relative border-l-4",
                                    activeOrder?.id === order.id 
                                        ? 'bg-zinc-50 border-l-zinc-900' 
                                        : 'hover:bg-zinc-50/50 bg-white border-l-transparent'
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "font-mono text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors",
                                            activeOrder?.id === order.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                                        )}>
                                            #{order.id}
                                        </span>
                                        {order.unreadMessages > 0 && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> NEW MESSAGE
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{order.activities[0].timestamp}</span>
                                </div>
                                
                                <h4 className={cn(
                                    "font-bold text-sm mb-3 line-clamp-2 leading-snug transition-colors", 
                                    activeOrder?.id === order.id ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900",
                                    order.unreadMessages > 0 ? "text-zinc-900" : ""
                                )}>
                                    {order.title}
                                </h4>
                                
                                <div className="flex items-center justify-between">
                                    <Badge status={order.status} />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-zinc-400">${order.amount.toFixed(0)}</span>
                                        <ArrowRight size={14} className={cn("transition-all", activeOrder?.id === order.id ? "translate-x-0 opacity-100 text-zinc-900" : "-translate-x-2 opacity-0")} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        {/* Right Details Pane: Workspace */}
        <div className={cn("flex-1 h-full overflow-hidden bg-white relative z-10", activeOrder ? "block" : "hidden md:block")}>
            {activeOrder ? (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="md:hidden p-4 border-b border-zinc-100 flex items-center gap-2 bg-white sticky top-0 z-20">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-zinc-50 rounded-full text-zinc-500 hover:text-zinc-900">
                             <ArrowRight size={20} className="rotate-180" />
                        </button>
                        <span className="text-sm font-bold text-zinc-900">Back to Inbox</span>
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
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-6 bg-zinc-50/50 p-10">
                    <div className="relative">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-zinc-200 border border-zinc-100 flex items-center justify-center transform -rotate-12 animate-in zoom-in duration-500">
                            <Briefcase size={40} className="text-zinc-200" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-900/20 transform rotate-12 animate-in zoom-in delay-200 duration-500">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="text-center max-w-sm">
                        <p className="text-xl font-black text-zinc-900 tracking-tight">Select an order to manage</p>
                        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                            Efficiently handle client requests, communicate with writers, and manage deliverables from this central workspace.
                        </p>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Live Ops</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Secure</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
