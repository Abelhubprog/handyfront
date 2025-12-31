import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, FileText, Clock, AlertCircle, CheckCircle2, Plus, Filter, LayoutList } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export const OrdersListView = () => {
    const navigate = useNavigate();
    const { orders } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'attention' | 'active' | 'completed'>('all');

    // Stats Calculation
    const stats = useMemo(() => {
        return {
            attention: orders.filter(o => o.status === 'pending_payment').length,
            active: orders.filter(o => ['in_progress', 'review'].includes(o.status)).length,
            completed: orders.filter(o => o.status === 'delivered').length,
            total: orders.length
        };
    }, [orders]);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                order.id.toLowerCase().includes(searchQuery.toLowerCase());
            
            let matchesStatus = true;
            if (statusFilter === 'attention') matchesStatus = order.status === 'pending_payment';
            else if (statusFilter === 'active') matchesStatus = ['in_progress', 'review'].includes(order.status);
            else if (statusFilter === 'completed') matchesStatus = order.status === 'delivered';

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    // Mock Writer Logic
    const getMockWriterName = (id: string) => {
        const writers = ['Sarah J.', 'Dr. Mike', 'Emma W.', 'Prof. David', 'Assigning...'];
        const index = id.charCodeAt(id.length - 1) % writers.length;
        return writers[index];
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-zinc-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8 pb-12">
                    
                    {/* Header & Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">My Orders</h1>
                            <p className="text-zinc-500 text-sm mt-1">Manage your projects, track progress, and download deliverables.</p>
                        </div>
                        <Button onClick={() => navigate('/app/new')} className="shadow-lg shadow-zinc-900/10 hover:shadow-zinc-900/20 transition-all">
                            <Plus size={18} className="mr-2" />
                            New Order
                        </Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card 
                            className={cn(
                                "p-4 flex flex-col justify-between transition-all cursor-pointer border-l-4",
                                statusFilter === 'all' ? "border-l-zinc-900 shadow-md scale-[1.02]" : "border-l-transparent hover:border-l-zinc-300"
                            )}
                            onClick={() => setStatusFilter('all')}
                        >
                            <div className="flex items-center gap-3 text-zinc-500 mb-2">
                                <LayoutList size={18} />
                                <span className="text-xs font-semibold uppercase tracking-wider">All Orders</span>
                            </div>
                            <span className="text-2xl font-bold text-zinc-900">{stats.total}</span>
                        </Card>

                        <Card 
                            className={cn(
                                "p-4 flex flex-col justify-between transition-all cursor-pointer border-l-4 bg-amber-50/30",
                                statusFilter === 'attention' ? "border-l-amber-500 shadow-md scale-[1.02] bg-amber-50" : "border-l-transparent hover:border-l-amber-300"
                            )}
                            onClick={() => setStatusFilter('attention')}
                        >
                            <div className="flex items-center gap-3 text-amber-700 mb-2">
                                <AlertCircle size={18} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Action Required</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-900">{stats.attention}</span>
                        </Card>

                        <Card 
                            className={cn(
                                "p-4 flex flex-col justify-between transition-all cursor-pointer border-l-4 bg-blue-50/30",
                                statusFilter === 'active' ? "border-l-blue-500 shadow-md scale-[1.02] bg-blue-50" : "border-l-transparent hover:border-l-blue-300"
                            )}
                            onClick={() => setStatusFilter('active')}
                        >
                            <div className="flex items-center gap-3 text-blue-700 mb-2">
                                <Clock size={18} />
                                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-900">{stats.active}</span>
                        </Card>

                        <Card 
                            className={cn(
                                "p-4 flex flex-col justify-between transition-all cursor-pointer border-l-4 bg-emerald-50/30",
                                statusFilter === 'completed' ? "border-l-emerald-500 shadow-md scale-[1.02] bg-emerald-50" : "border-l-transparent hover:border-l-emerald-300"
                            )}
                            onClick={() => setStatusFilter('completed')}
                        >
                            <div className="flex items-center gap-3 text-emerald-700 mb-2">
                                <CheckCircle2 size={18} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                            </div>
                            <span className="text-2xl font-bold text-emerald-900">{stats.completed}</span>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-zinc-200 flex flex-col md:flex-row gap-4 justify-between bg-zinc-50/50">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by title or Order ID..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                                />
                            </div>
                            {/* Mobile Filters Scroll */}
                            <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
                                {(['all', 'attention', 'active', 'completed'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setStatusFilter(tab)}
                                        className={cn(
                                            "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap flex items-center gap-2",
                                            statusFilter === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                                        )}
                                    >
                                        {tab === 'attention' ? 'Action Required' : tab}
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-full text-[10px] tabular-nums",
                                            statusFilter === tab ? "bg-zinc-100 text-zinc-900" : "bg-zinc-200 text-zinc-500"
                                        )}>
                                            {stats[tab]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-50 border-b border-zinc-200">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-zinc-500 w-[40%]">Order Details</th>
                                        <th className="px-6 py-3 font-medium text-zinc-500">Service</th>
                                        <th className="px-6 py-3 font-medium text-zinc-500">Writer</th>
                                        <th className="px-6 py-3 font-medium text-zinc-500">Due Date</th>
                                        <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                                        <th className="px-6 py-3 font-medium text-zinc-500 text-right">Amount</th>
                                        <th className="w-[50px]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-16 text-center text-zinc-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                                                        <Filter size={20} />
                                                    </div>
                                                    <p className="text-zinc-900 font-medium">No orders found</p>
                                                    <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map(order => (
                                            <tr 
                                                key={order.id} 
                                                className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/app/orders/${order.id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 truncate max-w-[280px]">{order.title}</p>
                                                        <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">#{order.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-600">
                                                    {order.service}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 shrink-0">
                                                            <User size={12} />
                                                        </div>
                                                        <span className="text-zinc-700 text-xs whitespace-nowrap">{getMockWriterName(order.id)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-zinc-600">
                                                        <Calendar size={14} className="text-zinc-400" />
                                                        <span className="whitespace-nowrap">{order.dueDate}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge status={order.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-zinc-900">
                                                    ${order.amount}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-zinc-300 group-hover:text-zinc-600 transition-colors">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden flex flex-col divide-y divide-zinc-100">
                            {filteredOrders.length === 0 ? (
                                <div className="p-12 text-center text-zinc-400">
                                    <p>No orders found.</p>
                                </div>
                            ) : filteredOrders.map(order => (
                                <div 
                                    key={order.id}
                                    className="p-4 active:bg-zinc-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/app/orders/${order.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col min-w-0 pr-4">
                                            <span className="font-mono text-[10px] text-zinc-400 mb-1">#{order.id}</span>
                                            <h3 className="font-semibold text-zinc-900 truncate">{order.title}</h3>
                                        </div>
                                        <Badge status={order.status} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {order.dueDate}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} />
                                                {getMockWriterName(order.id)}
                                            </span>
                                        </div>
                                        <span className="font-bold text-sm text-zinc-900">${order.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};