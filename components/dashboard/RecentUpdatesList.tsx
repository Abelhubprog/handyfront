import React from 'react';
import { Bell, CreditCard, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UpdateItem {
    id: string;
    type: 'status' | 'message' | 'upload' | 'payment';
    title: string;
    timestamp: string;
    description?: string;
    orderTitle?: string;
}

interface RecentUpdatesListProps {
    updates: UpdateItem[];
}

export const RecentUpdatesList = ({ updates }: RecentUpdatesListProps) => {
    return (
        <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-zinc-400" />
                Recent Updates
            </h2>
            <div className="bg-white border border-zinc-200 rounded-2xl divide-y divide-zinc-100 overflow-hidden">
                {updates.length > 0 ? updates.map((update, i) => (
                    <div key={i} className="p-4 hover:bg-zinc-50 transition-colors flex gap-4 items-start">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            update.type === 'payment' ? "bg-amber-50 text-amber-600" : 
                            update.type === 'upload' ? "bg-blue-50 text-blue-600" :
                            "bg-zinc-100 text-zinc-500"
                        )}>
                            {update.type === 'payment' ? <CreditCard size={14} /> :
                                update.type === 'upload' ? <Upload size={14} /> :
                                <CheckCircle2 size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900">{update.title}</p>
                            <p className="text-xs text-zinc-500 truncate mt-0.5">{update.description || `Update on ${update.orderTitle}`}</p>
                        </div>
                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">{update.timestamp}</span>
                    </div>
                )) : (
                    <div className="p-8 text-center text-zinc-400 text-sm">No recent updates.</div>
                )}
            </div>
        </section>
    );
};