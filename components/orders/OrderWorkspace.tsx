import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, CreditCard, CheckCircle2, Clock, Download, ArrowRight, FolderOpen, ShieldCheck, Upload, Save, X, ChevronDown, PenTool, Check, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBanner } from './OrderStatusBanner';
import { useOrders } from '../../contexts/OrderContext';
import { useVault, VaultFile } from '../../contexts/VaultContext';
import { useMessages } from '../../contexts/MessageContext';

const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const OrderWorkspace = ({ order, userType = 'user', onPayment }: { order: Order, userType?: 'user' | 'admin', onPayment: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'files' | 'payment' | 'notes'>('overview');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(order.adminNotes || '');
  const [newMessage, setNewMessage] = useState('');
  
  const navigate = useNavigate();
  const { updateOrder } = useOrders();
  const { addFile } = useVault();
  const { getConversationMessages, sendMessage, markAsRead } = useMessages();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = getConversationMessages(order.id);

  // Auto-scroll to bottom of messages and mark as read
  useEffect(() => {
    if (activeTab === 'messages') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // 1. Mark conversation as read in MessageContext (Clear User's "New Message" badge)
        markAsRead(order.id);

        // 2. Clear unreadMessages on the Order object (Clear Admin's "Inbox" badge)
        if (order.unreadMessages > 0) {
            updateOrder({ ...order, unreadMessages: 0 });
        }
    }
  }, [activeTab, messages.length]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'files', label: 'Vault', icon: FileText },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  if (userType === 'admin') {
      tabs.push({ id: 'notes', label: 'Admin Notes', icon: PenTool });
  }

  const handleStatusUpdate = (status: OrderStatus) => {
      // Automatically determine the next action based on the new status
      let nextAction: Order['nextAction'] = 'none';
      switch (status) {
          case 'pending_payment':
              nextAction = 'pay';
              break;
          case 'delivered':
              nextAction = 'download';
              break;
          case 'review':
              nextAction = 'review';
              break;
          default:
              nextAction = 'none';
      }

      updateOrder({
          ...order,
          status,
          nextAction,
          activities: [
              { 
                  id: Date.now().toString(), 
                  type: 'status', 
                  title: 'Status Updated', 
                  timestamp: 'Just now', 
                  description: `Order status changed to ${status.replace('_', ' ')} by Admin.` 
              },
              ...order.activities
          ]
      });
      setIsStatusOpen(false);
  };

  const handleNoteSave = () => {
      updateOrder({
          ...order,
          adminNotes: noteDraft
      });
  };

  const handleSendMessage = () => {
      if (!newMessage.trim()) return;
      sendMessage(order.id, newMessage, userType);
      setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const newFile: VaultFile = {
              id: Date.now().toString(),
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.name.split('.').pop()?.toLowerCase() || 'file',
              date: new Date().toISOString().split('T')[0],
              uploadedBy: 'admin',
              orderId: order.id
          };
          addFile(newFile);
          
          // If delivering, update status
          const isDelivering = order.status === 'in_progress' || order.status === 'review';
          const newStatus = isDelivering ? 'delivered' : order.status;
          
          updateOrder({
              ...order,
              status: newStatus,
              nextAction: newStatus === 'delivered' ? 'download' : order.nextAction,
              activities: [
                  {
                      id: Date.now().toString(),
                      type: 'upload',
                      title: isDelivering ? 'Order Delivered' : 'File Uploaded',
                      timestamp: 'Just now',
                      description: `File ${file.name} uploaded by Admin.${isDelivering ? ' Order marked as Delivered.' : ''}`
                  },
                  ...order.activities
              ]
          });
          setIsUploadOpen(false);
      }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {userType === 'user' && <OrderStatusBanner order={order} onPayment={onPayment} />}

      {/* Workspace Header */}
      <div className="px-6 py-6 border-b border-zinc-100 bg-white z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-400">#{order.id}</span>
                    <Badge status={order.status} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{order.title}</h1>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
                {userType === 'user' ? (
                    <>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/app/messages?c=${order.id}`)}>
                            <MessageSquare size={16} className="mr-2" />
                            Open Chat
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/app/uploads?order=${order.id}`)}>
                            <FolderOpen size={16} className="mr-2" />
                            View Vault
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-2 relative">
                        <div className="relative">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className={cn(isStatusOpen && "bg-zinc-100 border-zinc-300")}
                            >
                                Update Status <ChevronDown size={14} className="ml-2" />
                            </Button>
                            {isStatusOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        {(['draft', 'pending_payment', 'in_progress', 'review', 'delivered'] as OrderStatus[]).map(s => (
                                            <button 
                                                key={s}
                                                className={cn(
                                                    "flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                                                    s === order.status ? "bg-zinc-100 font-medium text-zinc-900" : "hover:bg-zinc-50 text-zinc-600"
                                                )}
                                                onClick={() => handleStatusUpdate(s)}
                                            >
                                                <span className="capitalize">{s.replace('_', ' ')}</span>
                                                {s === order.status && <Check size={14} className="text-zinc-900" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)}>
                            <Upload size={16} className="mr-2" />
                            Deliver
                        </Button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-6 border-b border-zinc-100 overflow-x-auto">
             {tabs.map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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
                                     activity.type === 'upload' ? <Upload size={14} /> :
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
                {userType === 'admin' && (
                    <div className="lg:col-span-1">
                        <Card className="p-4 bg-amber-50/50 border-amber-100">
                            <div className="flex items-center gap-2 mb-2 text-amber-800 font-semibold text-sm">
                                <ShieldCheck size={16} />
                                Admin Quick Info
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Service Fee</span>
                                    <span className="font-mono">${(order.amount * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Writer Payout</span>
                                    <span className="font-mono">${(order.amount * 0.4).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-amber-200 my-2 pt-2 flex justify-between font-semibold">
                                    <span className="text-amber-900">Net Profit</span>
                                    <span className="font-mono text-amber-900">${(order.amount * 0.5).toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'notes' && userType === 'admin' && (
            <div className="max-w-2xl">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-zinc-900">Internal Notes</h3>
                        <span className="text-xs text-zinc-400">Only visible to admins</span>
                    </div>
                    <textarea 
                        className="w-full min-h-[200px] p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-y"
                        placeholder="Add internal notes about this order, the client, or the writer..."
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleNoteSave}>
                            <Save size={16} className="mr-2" />
                            Save Notes
                        </Button>
                    </div>
                </Card>
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
                         {userType === 'admin' && (
                             <Button variant="primary" size="sm" className="h-7 text-xs" onClick={() => setIsUploadOpen(true)}>
                                 <Upload size={12} className="mr-1.5" />
                                 Add New
                             </Button>
                         )}
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
            <div className="flex flex-col h-full bg-zinc-50 -m-6 rounded-b-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {messages.length === 0 && (
                        <div className="text-center text-zinc-400 text-sm mt-8">
                            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                            <p>No messages yet.</p>
                            <p className="text-xs">Start the conversation below.</p>
                        </div>
                     )}
                     
                     {messages.map(msg => {
                         const isMe = msg.sender === userType; // 'admin' === 'admin' OR 'user' === 'user'
                         const isSystem = msg.sender === 'system';

                         if (isSystem) {
                             return (
                                 <div key={msg.id} className="flex justify-center my-2">
                                     <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium px-2">
                                         {msg.text}
                                     </span>
                                 </div>
                             );
                         }

                         return (
                            <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] border border-white shadow-sm",
                                    msg.sender === 'admin' ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-700"
                                )}>
                                    {msg.sender === 'admin' ? <ShieldCheck size={14} /> : <span className="font-bold">U</span>}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl shadow-sm",
                                    isMe 
                                        ? "bg-zinc-900 text-white rounded-tr-none" 
                                        : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-none"
                                )}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    <span className={cn(
                                        "text-[10px] block mt-1 text-right opacity-70", 
                                        isMe ? "text-zinc-300" : "text-zinc-400"
                                    )}>
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                         );
                     })}
                     <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white border-t border-zinc-200">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${userType === 'admin' ? 'client' : 'support'}...`}
                            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
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
                     {order.status === 'pending_payment' && userType === 'user' && (
                         <div className="p-4">
                             <Button className="w-full" onClick={onPayment}>Pay Securely via Stripe</Button>
                         </div>
                     )}
                 </Card>
            </div>
        )}

        {/* Upload Modal (For Delivery) */}
        {isUploadOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <Card className="w-full max-w-md p-6 relative shadow-2xl">
                    <button onClick={() => setIsUploadOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900">
                        <X size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-zinc-900 mb-1">Deliver Files</h2>
                    <p className="text-sm text-zinc-500 mb-6">Upload the final deliverables. The client will be notified immediately.</p>
                    
                    <div 
                        className="relative cursor-pointer border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-medium text-zinc-900 mb-1">Click to upload Final Draft</p>
                        <p className="text-xs text-zinc-500">DOCX, PDF up to 50MB</p>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};