import React from 'react';
import { Briefcase, User, CreditCard, LogOut } from 'lucide-react';
import { View } from '../types';

export const AdminLayout = ({ children, setView }: { children?: React.ReactNode, setView: (v: View) => void }) => (
  <div className="h-screen bg-zinc-50 flex overflow-hidden">
     {/* Compact Admin Sidebar */}
     <aside className="w-16 flex flex-col items-center border-r border-zinc-200 bg-zinc-900 py-4 gap-6 z-50">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer" onClick={() => setView('home')}>
             <span className="text-zinc-900 font-serif font-bold text-lg">H</span>
        </div>
        <div className="w-8 h-1 bg-zinc-700 rounded-full" />
        <button className="p-3 bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/20" title="Inbox">
            <Briefcase size={20} />
        </button>
        <button className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors" title="Writers">
            <User size={20} />
        </button>
        <button className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors" title="Finance">
            <CreditCard size={20} />
        </button>
        <div className="mt-auto">
            <button className="p-3 text-zinc-500 hover:text-white transition-colors" onClick={() => setView('home')}>
                <LogOut size={20} />
            </button>
        </div>
    </aside>
    {children}
  </div>
);
