import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Eye, Download, User, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/system/StatusChip';
import { cn } from '../lib/utils';

export const AdminOrdersListView = () => {
    const navigate = useNavigate();
    const { orders } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  o.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    return (
        <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
            <header className="p-6 md:p-8 bg-white border-b border-zinc-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Order Management</h1>
                        <p className="text-zinc-500 text-sm mt-1">Full inventory of all platform orders.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                    </div>
                    <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto">
                        {['all', 'draft', 'pending_payment', 'in_progress', 'review', 'delivered'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap",
                                    statusFilter === s ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-zinc-500 w-[35%]">Order Details</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Service</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Due Date</th>
                                <th className="px-6 py-3 font-medium text-zinc-500 text-right">Amount</th>
                                <th className="w-[80px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            ) : filteredOrders.map(order => (
                                <tr 
                                    key={order.id} 
                                    className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-zinc-900 truncate max-w-xs">{order.title}</p>
                                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1 py-0.5 rounded">#{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-600">{order.service}</td>
                                    <td className="px-6 py-4">
                                        <StatusChip status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {order.dueDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-zinc-900">
                                        ${order.amount}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 p-0 h-8 w-8">
                                            <ArrowRight size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};