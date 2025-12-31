import React from 'react';
import { LayoutDashboard, FileText, MessageSquare, Settings, User, LogOut, Search, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { View } from '../types';

export const PortalLayout = ({ children, setView, activeTab = 'dashboard' }: { children?: React.ReactNode, setView: (v: View) => void, activeTab?: string }) => (
  <div className="min-h-screen bg-zinc-50 flex">
    {/* Desktop Sidebar */}
    <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 bg-white fixed h-full z-30">
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 cursor-pointer" onClick={() => setView('home')}>
         <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-serif font-bold text-sm">H</span>
          </div>
        <span className="font-semibold text-zinc-900">HandyWriterz</span>
      </div>
      
      <div className="p-4 space-y-1">
        <Button 
          variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
          onClick={() => setView('portal-dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <FileText size={18} />
          My Orders
        </Button>
        <Button 
          variant={activeTab === 'messages' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <MessageSquare size={18} />
          Messages
          <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
        </Button>
        <Button 
          variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <Settings size={18} />
          Settings
        </Button>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">Alex Student</p>
            <p className="text-xs text-zinc-500 truncate">alex@uni.edu</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400" onClick={() => setView('home')}>
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
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 flex items-center justify-around h-16 z-50 px-2 pb-safe">
      <button 
        className={cn("flex flex-col items-center gap-1 p-2 rounded-lg", activeTab === 'dashboard' ? 'text-zinc-900' : 'text-zinc-400')}
        onClick={() => setView('portal-dashboard')}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <Search size={20} />
        <span className="text-[10px] font-medium">Explore</span>
      </button>
      <button 
        className="flex -mt-8 bg-zinc-900 text-white rounded-full p-4 shadow-lg shadow-zinc-900/20 active:scale-95 transition-transform"
        onClick={() => setView('create-order')}
      >
        <Plus size={24} />
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <MessageSquare size={20} />
        <span className="text-[10px] font-medium">Chat</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <User size={20} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  </div>
);
