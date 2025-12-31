import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, FileText, CreditCard, CheckCircle2, Clock, Download, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { Order } from '../../types';
import { OrderStatusBanner } from './OrderStatusBanner';

export const OrderWorkspace = ({ order, userType = 'user', onPayment }: { order: Order, userType?: 'user' | 'admin', onPayment: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'files' | 'payment'>('overview');

  return (
    <div className="flex flex-col h-full bg-white relative">
      <OrderStatusBanner order={order} onPayment={onPayment} />

      {/* Workspace Header */}
      <div className="px-6 py-6 border-b border-zinc-100">
        <div className="flex items-start justify-between mb-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-400">#{order.id}</span>
                    <Badge status={order.status} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{order.title}</h1>
            </div>
            {userType === 'admin' && (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Update Status</Button>
                    <Button variant="primary" size="sm">Deliver</Button>
                </div>
            )}
        </div>
        
        <div className="flex items-center gap-6 border-b border-zinc-100">
             {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
                { id: 'files', label: 'Vault', icon: FileText },
                { id: 'payment', label: 'Payment', icon: CreditCard },
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === tab.id 
                            ? "border-zinc-900 text-zinc-900" 
                            : "border-transparent text-zinc-500 hover:text-zinc-700"
                    )}
                 >
                    <tab.icon size={16} />
                    {tab.label}
                 </button>
             ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-6">
        {activeTab === 'overview' && (
            <div className="max-w-2xl">
                <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-[2px] before:bg-zinc-200">
                    {order.activities.map((activity, idx) => (
                        <div key={activity.id} className="relative flex gap-6">
                            <div className={cn(
                                "relative z-10 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0",
                                activity.type === 'status' ? 'bg-zinc-900 text-white' : 
                                activity.type === 'payment' ? 'bg-amber-100 text-amber-700' :
                                activity.type === 'upload' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'
                            )}>
                                {activity.type === 'payment' ? <CreditCard size={14} /> : 
                                 activity.type === 'upload' ? <FileText size={14} /> :
                                 <CheckCircle2 size={14} />}
                            </div>
                            <div className="pt-1 pb-4">
                                <p className="text-sm font-semibold text-zinc-900">{activity.title}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{activity.timestamp}</p>
                                {activity.description && (
                                    <div className="mt-2 p-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 shadow-sm">
                                        {activity.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'files' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="p-0">
                     <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                         <h3 className="font-semibold text-sm">Requirements</h3>
                         <Button variant="outline" size="sm" className="h-7 text-xs">Upload</Button>
                     </div>
                     <div className="p-2">
                        <div className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-lg group cursor-pointer">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900 truncate">assignment_rubric.pdf</p>
                                <p className="text-xs text-zinc-500">2.4 MB • Uploaded 2d ago</p>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100"><Download size={16} /></Button>
                        </div>
                     </div>
                 </Card>

                 <Card className="p-0">
                     <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                         <h3 className="font-semibold text-sm">Deliverables</h3>
                         {userType === 'admin' && <Button variant="primary" size="sm" className="h-7 text-xs">Add New</Button>}
                     </div>
                     <div className="p-8 text-center">
                        {order.status === 'delivered' ? (
                            <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-zinc-900 truncate">Final_Draft_v2.docx</p>
                                    <p className="text-xs text-zinc-500">Ready for download</p>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                            </div>
                        ) : (
                            <div className="text-zinc-400">
                                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock size={24} />
                                </div>
                                <p className="text-sm">No files delivered yet.</p>
                            </div>
                        )}
                     </div>
                 </Card>
             </div>
        )}

        {activeTab === 'messages' && (
            <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4">
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex-shrink-0" />
                        <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                            <p className="text-sm text-zinc-700">Hello! I've assigned a writer to your order. They will start reviewing the requirements shortly.</p>
                            <span className="text-[10px] text-zinc-400 mt-1 block">Admin • 10:30 AM</span>
                        </div>
                     </div>
                     <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 flex-shrink-0" />
                        <div className="bg-zinc-900 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                            <p className="text-sm">Great, thanks! Please let me know if you need any more sources.</p>
                            <span className="text-[10px] text-zinc-400 mt-1 block">You • 10:35 AM</span>
                        </div>
                     </div>
                </div>
                <div className="mt-auto relative">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                    />
                    <button className="absolute right-2 top-2 p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-600 transition-colors">
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'payment' && (
            <div className="max-w-md mx-auto mt-8">
                 <Card className="p-0">
                     <div className="p-6 text-center border-b border-zinc-100">
                         <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-900">
                             <CreditCard size={24} />
                         </div>
                         <p className="text-sm text-zinc-500 mb-1">Total Amount</p>
                         <h2 className="text-4xl font-bold tracking-tight text-zinc-900">${order.amount.toFixed(2)}</h2>
                         <Badge status={order.status === 'pending_payment' ? 'pending_payment' : 'delivered'} />
                     </div>
                     <div className="p-6 bg-zinc-50/50 space-y-3">
                         <div className="flex justify-between text-sm">
                             <span className="text-zinc-500">Service Fee</span>
                             <span className="font-medium text-zinc-900">${(order.amount * 0.9).toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-zinc-500">Processing</span>
                             <span className="font-medium text-zinc-900">${(order.amount * 0.1).toFixed(2)}</span>
                         </div>
                         <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm">
                             <span className="font-semibold text-zinc-900">Total</span>
                             <span className="font-semibold text-zinc-900">${order.amount.toFixed(2)}</span>
                         </div>
                     </div>
                     {order.status === 'pending_payment' && (
                         <div className="p-4">
                             <Button className="w-full" onClick={onPayment}>Pay Securely via Stripe</Button>
                         </div>
                     )}
                 </Card>
            </div>
        )}
      </div>
    </div>
  );
};
