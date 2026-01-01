import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, Clock, MoreHorizontal, FileText, Ban, Edit3, Star, Camera, CheckCircle2, Save, X, User as UserIcon, Mail } from 'lucide-react';
import { MOCK_USERS, INITIAL_ORDERS } from '../mocks';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusChip } from '../components/system/StatusChip';
import { cn } from '../lib/utils';
import { User, UserStatus } from '../types';

export const UserProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // State
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Edit Form State
    const [editForm, setEditForm] = useState({ name: '', email: '' });

    // Internal Notes State
    const [internalNote, setInternalNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    useEffect(() => {
        // Simulate API Fetch
        setTimeout(() => {
            const foundUser = MOCK_USERS.find(u => u.id === id);
            if (foundUser) {
                setUser(foundUser);
                setEditForm({ name: foundUser.name, email: foundUser.email });
                setInternalNote(`Notes for ${foundUser.name}...`); // Mock fetching existing notes
            }
            setIsLoading(false);
        }, 300);
    }, [id]);

    // Derived Data: Find orders for this user
    const userOrders = INITIAL_ORDERS.filter(o => o.userId === id || o.writerId === id);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTimeout(() => {
                    setUser(prev => prev ? { ...prev, avatar: reader.result as string } : prev);
                    setIsUploading(false);
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleUserStatus = () => {
        if (!user) return;
        const newStatus: UserStatus = user.status === 'suspended' ? 'active' : 'suspended';
        setUser({ ...user, status: newStatus });
    };

    const saveEdit = () => {
        if (!user) return;
        setUser({ ...user, name: editForm.name, email: editForm.email });
        setIsEditing(false);
    };

    const saveNote = () => {
        setIsSavingNote(true);
        setTimeout(() => setIsSavingNote(false), 800);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-zinc-50">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <UserIcon size={40} className="text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">User Not Found</h2>
                <p className="text-zinc-500 mb-6 max-w-xs text-center">The user ID "{id}" does not exist or has been deleted from the system.</p>
                <Button onClick={() => navigate('/admin/users')}>Return to Users</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 overflow-hidden">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />

            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/users')}
                        className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-zinc-200" />
                    <h1 className="text-lg font-bold text-zinc-900">User Profile</h1>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-500">{user.id}</span>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                            user.status === 'suspended' 
                                ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50" 
                                : "text-red-600 border-red-200 hover:bg-red-50"
                        )}
                        onClick={toggleUserStatus}
                    >
                        {user.status === 'suspended' ? (
                            <><CheckCircle2 size={16} className="mr-2" /> Activate User</>
                        ) : (
                            <><Ban size={16} className="mr-2" /> Suspend User</>
                        )}
                    </Button>
                    
                    {isEditing ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={saveEdit}>Save Changes</Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit3 size={16} className="mr-2" /> Edit Details
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col: Identity Card */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar Container */}
                                <div 
                                    className="group relative w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center text-3xl font-bold text-zinc-400 border-4 border-white shadow-lg mb-4 overflow-hidden cursor-pointer"
                                    onClick={handleAvatarClick}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        <span>{user.name.charAt(0)}</span>
                                    )}
                                    
                                    {/* Overlay */}
                                    <div className={cn(
                                        "absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity",
                                        isUploading && "opacity-100"
                                    )}>
                                        {isUploading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <Camera size={20} className="mb-1" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="w-full space-y-3 mb-4 animate-in fade-in">
                                        <input 
                                            type="text" 
                                            value={editForm.name}
                                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full text-center font-bold text-lg border-b border-zinc-300 focus:border-zinc-900 outline-none pb-1"
                                            placeholder="Full Name"
                                        />
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={e => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full text-center text-sm text-zinc-500 border-b border-zinc-300 focus:border-zinc-900 outline-none pb-1"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 justify-center">
                                            {user.name}
                                        </h2>
                                        <p className="text-zinc-500 text-sm mb-4 flex items-center gap-1.5">
                                            <Mail size={12} /> {user.email}
                                        </p>
                                    </>
                                )}
                                
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
                                        "px-3 py-1 rounded-full text-xs font-medium border capitalize flex items-center gap-1.5",
                                        user.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        user.status === 'suspended' ? "bg-red-50 text-red-700 border-red-200" :
                                        "bg-amber-50 text-amber-700 border-amber-200"
                                    )}>
                                        {user.status === 'suspended' && <Ban size={10} />}
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
                                        <div className="h-full bg-zinc-900" style={{ width: `${Math.min((user.stats?.totalOrders || 0) * 5, 100)}%` }} />
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
                                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>View All Orders</Button>
                            </div>
                            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                                {userOrders.length === 0 ? (
                                    <div className="p-12 text-center text-zinc-400">
                                        <FileText size={32} className="mx-auto mb-3 opacity-20" />
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
                                                <th className="w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {userOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-zinc-50 cursor-pointer group" onClick={() => navigate(`/admin/orders/${order.id}`)}>
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
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal size={16} className="text-zinc-400" />
                                                        </div>
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
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-zinc-900">Internal Notes</h3>
                                {isSavingNote && <span className="text-xs text-zinc-400 animate-pulse">Saving...</span>}
                            </div>
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 focus-within:ring-2 focus-within:ring-amber-200/50 transition-all">
                                <textarea 
                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-sm text-zinc-800 placeholder:text-zinc-400 leading-relaxed"
                                    placeholder="Add internal notes about this user (visible to admins only)..."
                                    rows={4}
                                    value={internalNote}
                                    onChange={e => setInternalNote(e.target.value)}
                                />
                                <div className="flex justify-end mt-2 pt-2 border-t border-amber-200/50">
                                    <Button size="sm" variant="outline" className="bg-white hover:bg-amber-50 text-amber-800 border-amber-200" onClick={saveNote}>
                                        <Save size={14} className="mr-2" /> Save Note
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};