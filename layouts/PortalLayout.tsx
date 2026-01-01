import React, { useEffect } from 'react';
import { LayoutDashboard, FileText, MessageSquare, Settings, User as UserIcon, LogOut, Search, Plus, FolderOpen } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';

export const PortalLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { totalUnreadCount } = useMessages(); 
  const { user, logout, isLoading } = useAuth();

  // Route Protection
  useEffect(() => {
    if (!isLoading && !user) {
        navigate('/sign-in');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return null;

  const handleLogout = () => {
      logout();
      navigate('/sign-in');
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    cn(
      "w-full justify-start gap-3",
      isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
    );

  const getMobileLinkClass = ({ isActive }: { isActive: boolean }) => 
    cn(
      "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[3rem] relative",
      isActive ? "text-zinc-900" : "text-zinc-400"
    );

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 bg-white fixed h-full z-30">
        <Link to="/" className="h-16 flex items-center px-6 border-b border-zinc-100 cursor-pointer">
           <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-serif font-bold text-sm">H</span>
            </div>
          <span className="font-semibold text-zinc-900">HandyWriterz</span>
        </Link>
        
        <div className="p-4 space-y-1">
          <NavLink to="/app" end className={({isActive}) => cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors h-10 px-4 py-2 text-sm", getLinkClass({isActive}))}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/app/orders" className={({isActive}) => cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors h-10 px-4 py-2 text-sm", getLinkClass({isActive}))}>
            <FileText size={18} />
            My Orders
          </NavLink>
          <NavLink to="/app/messages" className={({isActive}) => cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors h-10 px-4 py-2 text-sm", getLinkClass({isActive}))}>
            <MessageSquare size={18} />
            Messages
            {totalUnreadCount > 0 && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {totalUnreadCount}
                </span>
            )}
          </NavLink>
          <NavLink to="/app/uploads" className={({isActive}) => cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors h-10 px-4 py-2 text-sm", getLinkClass({isActive}))}>
            <FolderOpen size={18} />
            Vault
          </NavLink>
          <NavLink to="/app/settings" className={({isActive}) => cn("inline-flex items-center justify-center rounded-lg font-medium transition-colors h-10 px-4 py-2 text-sm", getLinkClass({isActive}))}>
            <Settings size={18} />
            Settings
          </NavLink>
        </div>

        <div className="mt-auto p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
              <UserIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 flex items-center justify-between h-16 z-50 px-2 pb-safe">
        <NavLink to="/app" end className={getMobileLinkClass}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        <NavLink to="/app/orders" className={getMobileLinkClass}>
          <FileText size={20} />
          <span className="text-[10px] font-medium">Orders</span>
        </NavLink>
        <button 
          className="flex -mt-8 bg-zinc-900 text-white rounded-full p-3.5 shadow-lg shadow-zinc-900/20 active:scale-95 transition-transform"
          onClick={() => navigate('/app/new')}
        >
          <Plus size={24} />
        </button>
        <NavLink to="/app/uploads" className={getMobileLinkClass}>
          <FolderOpen size={20} />
          <span className="text-[10px] font-medium">Vault</span>
        </NavLink>
        <NavLink to="/app/messages" className={getMobileLinkClass}>
          <MessageSquare size={20} />
          <span className="text-[10px] font-medium">Chat</span>
          {totalUnreadCount > 0 && (
               <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border border-white"></span>
          )}
        </NavLink>
      </nav>
    </div>
  );
};