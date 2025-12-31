
import React from 'react';
import { Briefcase, User, CreditCard, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, switchRole } = useAuth();
  
  // Define visibility rules
  const canViewUsers = ['admin', 'support'].includes(user?.role || '');
  const canViewFinance = ['admin'].includes(user?.role || '');

  return (
    <div className="h-screen bg-zinc-50 flex overflow-hidden">
        {/* Compact Admin Sidebar */}
        <aside className="w-16 flex flex-col items-center border-r border-zinc-200 bg-zinc-900 py-4 gap-6 z-50">
            <Link to="/" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer">
                <span className="text-zinc-900 font-serif font-bold text-lg">H</span>
            </Link>
            
            <div className="w-8 h-1 bg-zinc-700 rounded-full" />
            
            <Link 
                to="/admin" 
                className="p-3 bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/20 group relative" 
                title="Inbox"
            >
                <Briefcase size={20} />
                <span className="absolute left-14 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Inbox</span>
            </Link>

            {canViewUsers && (
                <Link 
                    to="/admin/users" 
                    className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors group relative" 
                    title="Writers & Users"
                >
                    <User size={20} />
                    <span className="absolute left-14 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Users</span>
                </Link>
            )}

            {canViewFinance && (
                <Link 
                    to="/admin/payments" 
                    className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors group relative" 
                    title="Finance"
                >
                    <CreditCard size={20} />
                    <span className="absolute left-14 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Finance</span>
                </Link>
            )}

            <div className="mt-auto flex flex-col items-center gap-4">
                <div 
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold cursor-help border border-zinc-700"
                    title={`Logged in as ${user?.role}`}
                >
                    {user?.role.substring(0, 2).toUpperCase()}
                </div>
                <Link to="/" className="p-3 text-zinc-500 hover:text-white transition-colors" title="Log Out">
                    <LogOut size={20} />
                </Link>
            </div>
        </aside>
        {children}
    </div>
  );
};
