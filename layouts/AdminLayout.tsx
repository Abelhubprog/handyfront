import React, { useEffect } from 'react';
import { Briefcase, User, CreditCard, LogOut, PenTool, ClipboardList, FolderTree, Settings } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Role Protection
  useEffect(() => {
    if (!isLoading) {
        if (!user) {
            navigate('/sign-in');
        } else if (!['admin', 'writer', 'support'].includes(user.role)) {
            // Regular users should not see admin interface
            navigate('/app');
        }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;
  
  // Define visibility rules
  const canViewUsers = ['admin', 'support'].includes(user?.role || '');
  const canViewFinance = ['admin'].includes(user?.role || '');
  const canPublish = ['admin', 'editor'].includes(user?.role || '');

  const handleLogout = () => {
      logout();
      navigate('/sign-in');
  };

  const NavItem = ({ to, icon: Icon, title, end = false }: { to: string, icon: any, title: string, end?: boolean }) => (
    <NavLink 
        to={to} 
        end={end}
        className={({ isActive }) => cn(
            "p-3 rounded-xl transition-all group relative",
            isActive ? "bg-zinc-800 text-white shadow-lg shadow-black/20" : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
        )}
        title={title}
    >
        <Icon size={20} />
        <span className="absolute left-14 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-zinc-800">
            {title}
        </span>
    </NavLink>
  );

  return (
    <div className="h-screen bg-zinc-50 flex overflow-hidden">
        {/* Compact Admin Sidebar */}
        <aside className="w-16 flex flex-col items-center border-r border-zinc-200 bg-zinc-900 py-4 gap-4 z-50">
            <Link to="/" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer mb-2">
                <span className="text-zinc-900 font-serif font-bold text-lg">H</span>
            </Link>
            
            <div className="w-8 h-px bg-zinc-800 mb-2" />
            
            <NavItem to="/admin" icon={Briefcase} title="Inbox" end />
            <NavItem to="/admin/orders" icon={ClipboardList} title="Orders" />
            
            {canViewUsers && (
                <NavItem to="/admin/users" icon={User} title="Users" />
            )}

            <NavItem to="/admin/files" icon={FolderTree} title="Global Vault" />

            {canPublish && (
                <NavItem to="/admin/publishing" icon={PenTool} title="Content" />
            )}

            {canViewFinance && (
                <NavItem to="/admin/payments" icon={CreditCard} title="Finance" />
            )}

            <div className="w-8 h-px bg-zinc-800 mt-4 mb-2" />
            
            <NavItem to="/admin/settings" icon={Settings} title="Settings" />

            <div className="mt-auto flex flex-col items-center gap-4">
                <div 
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold cursor-help border border-zinc-700 hover:border-zinc-500 transition-colors"
                    title={`Logged in as ${user?.role}`}
                >
                    {user?.role.substring(0, 2).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="p-3 text-zinc-500 hover:text-white transition-colors" title="Log Out">
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
        <div className="flex-1 overflow-hidden">
            {children}
        </div>
    </div>
  );
};