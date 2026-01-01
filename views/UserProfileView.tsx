import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Calendar, Clock, MoreHorizontal, FileText, Ban, Trash2, Edit3, Star, CreditCard } from 'lucide-react';
import { MOCK_USERS, INITIAL_ORDERS } from '../mocks';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatusChip } from '../components/system/StatusChip';
import { cn } from '../lib/utils';

export const UserProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const user = MOCK_USERS.find(u => u.id === id);
    // Find orders where user is either the client or the assigned writer
    const userOrders = INITIAL_ORDERS.filter(o => o.userId === id || o.writerId === id);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-zinc-50">
                <p className="text-zinc-500 mb-4">User not found</p>
                <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/users')}
                        className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-zinc-200" />
                    <h1 className="text-lg font-bold text-zinc-900">User Profile</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Ban size={16} className="mr-2" /> Suspend
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit3 size={16} className="mr-2" /> Edit Details
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col: Identity Card */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center text-3xl font-bold text-zinc-400 border-4 border-white shadow-lg mb-4">
                                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
                                <p className="text-zinc-500 text-sm mb-4">{user.email}</p>
                                
                                <div className="flex gap-2 mb-6">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                                        user.role === 'admin' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                        user.role === 'writer' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-zinc-100 text-zinc-600 border-zinc-200"
                                    )}>
                                        {user.role}
                                    </span>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium border capitalize",
                                        user.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        "bg-red-50 text-red-700 border-red-200"
                                    )}>
                                        {user.status}
                                    </span>
                                </div>

                                <div className="w-full border-t border-zinc-100 pt-6 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 flex items-center gap-2"><Calendar size={14} /> Joined</span>
                                        <span className="font-medium text-zinc-900">{user.joinedAt}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 flex items-center gap-2"><Clock size={14} /> Last Active</span>
                                        <span className="font-medium text-zinc-900">{user.lastActive}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 flex items-center gap-2"><Shield size={14} /> ID</span>
                                        <span className="font-mono text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">{user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Stats Card */}
                        <Card className="p-6">
                            <h3 className="font-bold text-zinc-900 mb-4">Performance</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-zinc-500">Total Orders</span>
                                        <span className="font-medium">{user.stats?.totalOrders}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-zinc-900 w-[60%]" />
                                    </div>
                                </div>
                                
                                {user.role === 'writer' ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-zinc-500">Rating</span>
                                                <span className="font-medium flex items-center gap-1 text-amber-500">
                                                    {user.stats?.rating} <Star size={12} fill="currentColor" />
                                                </span>
                                            </div>
                                            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400" style={{ width: `${(user.stats?.rating || 0) * 20}%` }} />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-zinc-100">
                                            <p className="text-xs text-zinc-500 mb-1">Total Earned</p>
                                            <p className="text-2xl font-bold text-zinc-900">${user.stats?.totalEarned.toLocaleString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="pt-4 border-t border-zinc-100">
                                        <p className="text-xs text-zinc-500 mb-1">Total Spent</p>
                                        <p className="text-2xl font-bold text-zinc-900">${user.stats?.totalSpent.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Col: Activity & Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Order History */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-zinc-900">Order History</h3>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                                {userOrders.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-400">
                                        <FileText size={32} className="mx-auto mb-2 opacity-20" />
                                        <p>No orders found for this user.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Order</th>
                                                <th className="px-6 py-3 font-medium">Service</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {userOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-zinc-50 cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-zinc-900 truncate max-w-[200px]">{order.title}</p>
                                                        <p className="text-xs text-zinc-400">#{order.id}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-600">{order.service}</td>
                                                    <td className="px-6 py-4">
                                                        <StatusChip status={order.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium text-zinc-900">
                                                        ${order.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>

                        {/* Recent Notes/Logs */}
                        <section>
                            <h3 className="font-bold text-zinc-900 mb-4">Internal Notes</h3>
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6">
                                <textarea 
                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-sm text-zinc-800 placeholder:text-zinc-400"
                                    placeholder="Add internal notes about this user (visible to admins only)..."
                                    rows={3}
                                />
                                <div className="flex justify-end mt-2">
                                    <Button size="sm" variant="outline" className="bg-white">Save Note</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};