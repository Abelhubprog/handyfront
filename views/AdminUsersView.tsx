import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, User, Mail, Calendar, Shield, Edit, Trash2, Ban, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MOCK_USERS } from '../mocks';
import { UserRole, UserStatus } from '../types';
import { cn } from '../lib/utils';

export const AdminUsersView = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    
    // Filter Users
    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: UserRole) => {
        const styles = {
            admin: "bg-purple-100 text-purple-700 border-purple-200",
            writer: "bg-blue-50 text-blue-700 border-blue-200",
            support: "bg-emerald-50 text-emerald-700 border-emerald-200",
            user: "bg-zinc-100 text-zinc-600 border-zinc-200",
        };
        return (
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize", styles[role])}>
                {role}
            </span>
        );
    };

    const getStatusIndicator = (status: UserStatus) => {
         const colors = {
             active: "bg-emerald-500",
             suspended: "bg-red-500",
             pending: "bg-amber-500",
         };
         return (
             <div className="flex items-center gap-2">
                 <span className={cn("w-2 h-2 rounded-full", colors[status])} />
                 <span className="text-sm text-zinc-600 capitalize">{status}</span>
             </div>
         );
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 bg-white border-b border-zinc-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Users</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage team members, writers, and clients.</p>
                    </div>
                    <Button onClick={() => {}} className="shadow-lg shadow-zinc-900/10">
                        <Plus size={18} className="mr-2" />
                        Invite User
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: MOCK_USERS.length, icon: User },
                        { label: 'Active Writers', value: MOCK_USERS.filter(u => u.role === 'writer' && u.status === 'active').length, icon: Edit },
                        { label: 'Pending Approval', value: MOCK_USERS.filter(u => u.status === 'pending').length, icon: CheckCircle2 },
                        { label: 'Suspended', value: MOCK_USERS.filter(u => u.status === 'suspended').length, icon: Ban },
                    ].map((stat, i) => (
                        <div key={i} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-500">
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase">{stat.label}</p>
                                <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users by name or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                    </div>
                    <div className="flex bg-zinc-100 p-1 rounded-lg">
                        {['all', 'user', 'writer', 'admin', 'support'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role as any)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                                    roleFilter === role ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-zinc-500 w-[30%]">User</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Role</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Joined</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Last Active</th>
                                <th className="px-6 py-3 font-medium text-zinc-500 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : filteredUsers.map(user => (
                                <tr 
                                    key={user.id} 
                                    className="group hover:bg-zinc-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-semibold border border-zinc-200">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-zinc-900">{user.name}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusIndicator(user.status)}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-zinc-400" />
                                            {user.joinedAt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${user.id}`) }}
                                        >
                                            <MoreHorizontal size={16} />
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