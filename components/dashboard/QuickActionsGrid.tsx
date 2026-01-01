import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, MessageSquare, FileText } from 'lucide-react';
import { useMessages } from '../../contexts/MessageContext';

export const QuickActionsGrid = () => {
    const navigate = useNavigate();
    const { totalUnreadCount } = useMessages();

    return (
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => navigate('/app/new')}
                className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all text-left group"
            >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                </div>
                <div className="font-semibold text-zinc-900 text-sm">New Order</div>
                <div className="text-[10px] text-zinc-500">Get a quote</div>
            </button>

            <button 
                onClick={() => navigate('/app/uploads')}
                className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all text-left group"
            >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={20} />
                </div>
                <div className="font-semibold text-zinc-900 text-sm">Upload Files</div>
                <div className="text-[10px] text-zinc-500">To Vault</div>
            </button>
            
            <button 
                onClick={() => navigate('/app/messages')}
                className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all text-left group"
            >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                </div>
                <div className="font-semibold text-zinc-900 text-sm">Support</div>
                <div className="text-[10px] text-zinc-500">{totalUnreadCount > 0 ? `${totalUnreadCount} unread` : 'Contact us'}</div>
            </button>
            
            <button 
                onClick={() => navigate('/app/orders')}
                className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all text-left group"
            >
                <div className="w-10 h-10 bg-zinc-100 text-zinc-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                </div>
                <div className="font-semibold text-zinc-900 text-sm">All Orders</div>
                <div className="text-[10px] text-zinc-500">View history</div>
            </button>
        </div>
    );
};