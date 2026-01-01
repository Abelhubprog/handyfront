import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, CreditCard, CheckCircle2, Clock, Download, ArrowRight, FolderOpen, ShieldCheck, Upload, Save, X, ChevronDown, PenTool, Check, Send, Paperclip, Search, Plus, Info, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBanner } from './OrderStatusBanner';
import { StatusChip } from '../system/StatusChip';
import { useOrders } from '../../contexts/OrderContext';
import { useVault, VaultFile } from '../../contexts/VaultContext';
import { useMessages } from '../../contexts/MessageContext';

const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const OrderWorkspace: React.FC<{ order: Order, userType?: 'user' | 'admin', onPayment: () => void }> = ({ order, userType = 'user', onPayment }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'files' | 'payment' | 'notes'>('overview');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRequestDocOpen, setIsRequestDocOpen] = useState(false);
  const [isAttachFromVaultOpen, setIsAttachFromVaultOpen] = useState(false);
  const [vaultSearchQuery, setVaultSearchQuery] = useState('');
  const [noteDraft, setNoteDraft] = useState(order.adminNotes || '');
  const [isNotesSaving, setIsNotesSaving] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [requestDocType, setRequestDocType] = useState('Rubric');
  
  const navigate = useNavigate();
  const { updateOrder } = useOrders();
  const { files, addFile, updateFile } = useVault();
  const { getConversationMessages, sendMessage, markAsRead } = useMessages();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = getConversationMessages(order.id);
  const orderFiles = useMemo(() => files.filter(f => f.orderId === order.id), [files, order.id]);
  const requirements = useMemo(() => orderFiles.filter(f => f.uploadedBy === 'user'), [orderFiles]);
  const deliverables = useMemo(() => orderFiles.filter(f => f.uploadedBy === 'admin'), [orderFiles]);
  
  // Files in vault NOT yet linked to this order
  const unlinkedFiles = useMemo(() => files.filter(f => !f.orderId), [files]);

  // Sync note draft if order changes (e.g. switching between orders in admin inbox)
  useEffect(() => {
    setNoteDraft(order.adminNotes || '');
  }, [order.id]);

  // Auto-scroll to bottom of messages and mark as read
  useEffect(() => {
    if (activeTab === 'messages') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        markAsRead(order.id);
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
      let nextAction: Order['nextAction'] = 'none';
      switch (status) {
          case 'pending_payment': nextAction = 'pay'; break;
          case 'delivered': nextAction = 'download'; break;
          case 'review': nextAction = 'review'; break;
          default: nextAction = 'none';
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
      setIsNotesSaving(true);
      setTimeout(() => {
        updateOrder({ 
            ...order, 
            adminNotes: noteDraft,
            activities: [
                { id: Date.now().toString(), type: 'status', title: 'Internal Notes Updated', timestamp: 'Just now' },
                ...order.activities
            ]
        });
        setIsNotesSaving(false);
      }, 600);
  };

  const handleSendMessage = () => {
      if (!newMessage.trim()) return;
      sendMessage(order.id, newMessage, userType);
      setNewMessage('');
  };

  const handleRequestDocs = () => {
      const msg = `System Request: Admin has requested additional documentation (${requestDocType}). Please upload this to the vault for your order #${order.id}.`;
      sendMessage(order.id, msg, 'admin');
      setIsRequestDocOpen(false);
      setActiveTab('messages');
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
              uploadedBy: userType === 'admin' ? 'admin' : 'user',
              orderId: order.id
          };
          addFile(newFile);
          
          if (userType === 'admin' && (order.status === 'in_progress' || order.status === 'review')) {
              handleStatusUpdate('delivered');
          }
          setIsUploadOpen(false);
      }
  };

  const handleAttachExisting = (fileId: string) => {
    updateFile(fileId, { orderId: order.id });
    updateOrder({
        ...order,
        activities: [
            { id: Date.now().toString(), type: 'upload', title: 'File Attached from Vault', timestamp: 'Just now' },
            ...order.activities
        ]
    });
    setIsAttachFromVaultOpen(false);
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
            
            <div className="flex gap-2">
                {userType === 'user' ? (
                    <>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('messages')}>
                            <MessageSquare size={16} className="mr-2" />
                            Open Chat
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('files')}>
                            <FolderOpen size={16} className="mr-2" />
                            View Vault
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-2 relative">
                        <Button variant="outline" size="sm" onClick={() => setIsRequestDocOpen(true)}>
                            <Paperclip size={16} className="mr-2" />
                            Request Docs
                        </Button>
                        <div className="relative">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className={cn(isStatusOpen && "bg-zinc-100 border-zinc-300")}
                            >
                                Status: <span className="capitalize ml-1 text-zinc-900">{order.status.replace('_', ' ')}</span> <ChevronDown size={14} className="ml-2" />
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
                            Deliver Result
                        </Button>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex items-center gap-6 border-b border-zinc-100 overflow-x-auto no-scrollbar">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-[2px] before:bg-zinc-200">
                        {order.activities.map((activity) => (
                            <div key={activity.id} className="relative flex gap-6">
                                <div className={cn(
                                    "relative z-10 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-sm",
                                    activity.type === 'status' ? 'bg-zinc-900 text-white' : 
                                    activity.type === 'payment' ? 'bg-amber-100 text-amber-700' :
                                    activity.type === 'upload' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'
                                )}>
                                    {activity.type === 'payment' ? <CreditCard size={14} /> : 
                                     activity.type === 'upload' ? <Upload size={14} /> :
                                     <CheckCircle2 size={14} />}
                                </div>
                                <div className="pt-1 pb-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-zinc-900">{activity.title}</p>
                                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{activity.timestamp}</span>
                                    </div>
                                    {activity.description && (
                                        <div className="mt-2 p-3 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-600 shadow-sm leading-relaxed">
                                            {activity.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-6">
                    {userType === 'admin' && (
                        <Card className="p-5 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                            <div className="flex items-center gap-2 mb-4 text-amber-800 font-bold text-xs uppercase tracking-widest">
                                <ShieldCheck size={16} />
                                Financial Summary
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 text-left">Service Fee</span>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-100">${(order.amount * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 text-left">Writer Payout</span>
                                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-100">${(order.amount * 0.4).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-amber-200 mt-3 pt-3 flex justify-between items-center">
                                    <span className="text-amber-900 font-bold text-left">Platform Margin</span>
                                    <span className="font-bold font-mono text-amber-900 text-lg">${(order.amount * 0.5).toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                            <Clock size={16} />
                            Order Context
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="text-left">
                                <p className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Service Type</p>
                                <p className="font-medium text-zinc-900">{order.service}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Target Deadline</p>
                                <p className="font-medium text-zinc-900">{order.dueDate}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Amount</p>
                                <p className="font-bold text-lg text-zinc-900">${order.amount.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )}

        {activeTab === 'notes' && userType === 'admin' && (
            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 mx-auto">
                <Card className="p-6 border-zinc-200 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                                <PenTool size={18} className="text-zinc-400" />
                                Private Scratchpad
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">These notes are strictly internal and hidden from the client.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isNotesSaving && <span className="text-[10px] text-zinc-400 animate-pulse">Syncing...</span>}
                            <Button size="sm" onClick={handleNoteSave} isLoading={isNotesSaving}>
                                <Save size={16} className="mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                    <textarea 
                        className="w-full min-h-[400px] p-6 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none font-sans leading-relaxed"
                        placeholder="Draft internal strategy, writer instructions, or project bottlenecks here..."
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                    />
                </Card>
            </div>
        )}

        {activeTab === 'files' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                 <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                         <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                             <User size={16} className="text-zinc-400" />
                             Client Requirements
                         </h3>
                         <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500 hover:text-zinc-900" onClick={() => fileInputRef.current?.click()}>
                             <Upload size={14} className="mr-1.5" /> Upload
                         </Button>
                     </div>
                     <Card className="p-0 overflow-hidden bg-white/50 backdrop-blur-sm">
                        <div className="divide-y divide-zinc-100">
                            {requirements.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Info size={24} className="text-zinc-300" />
                                    </div>
                                    <p className="text-sm text-zinc-400">No requirement files uploaded yet.</p>
                                </div>
                            ) : requirements.map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-4 hover:bg-zinc-50 transition-colors group">
                                    <div className="w-10 h-10 bg-zinc-100 text-zinc-500 rounded-xl flex items-center justify-center border border-zinc-200 group-hover:bg-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{file.name}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{file.size} • {file.date}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
                                        <Download size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                     </Card>
                 </div>

                 <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                         <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                             <CheckCircle2 size={16} className="text-emerald-500" />
                             Deliverables
                         </h3>
                         {userType === 'admin' && (
                             <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500 hover:text-zinc-900" onClick={() => setIsAttachFromVaultOpen(true)}>
                                    <Paperclip size={14} className="mr-1.5" /> Link Existing
                                </Button>
                                <Button variant="primary" size="sm" className="h-8 text-xs" onClick={() => setIsUploadOpen(true)}>
                                    <Upload size={14} className="mr-1.5" /> Deliver
                                </Button>
                             </div>
                         )}
                     </div>
                     <Card className="p-0 overflow-hidden bg-emerald-50/10 border-emerald-100">
                        <div className="divide-y divide-zinc-100">
                            {deliverables.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Clock size={24} className="text-zinc-300" />
                                    </div>
                                    <p className="text-sm text-zinc-400">Waiting for final results...</p>
                                </div>
                            ) : deliverables.map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-4 hover:bg-emerald-50/50 transition-colors group">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-200">
                                        <Check size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-bold text-zinc-900 truncate">{file.name}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Ready for Review</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-8">
                                        <Download size={14} className="mr-1.5" /> Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                     </Card>
                 </div>
             </div>
        )}

        {activeTab === 'messages' && (
            <div className="flex flex-col h-full bg-zinc-50 -m-6 rounded-b-xl overflow-hidden border border-zinc-200 max-w-6xl mx-auto">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     {messages.length === 0 && (
                        <div className="text-center text-zinc-400 py-20">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={32} className="opacity-20" />
                            </div>
                            <h4 className="text-zinc-900 font-bold">Secure Project Channel</h4>
                            <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed">Directly communicate with your {userType === 'admin' ? 'client' : 'support team'}. All messages are encrypted.</p>
                        </div>
                     )}
                     
                     {messages.map(msg => {
                         const isMe = msg.sender === userType;
                         const isSystem = msg.sender === 'system';

                         if (isSystem) {
                             return (
                                 <div key={msg.id} className="flex justify-center">
                                     <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                                         {msg.text}
                                     </span>
                                 </div>
                             );
                         }

                         return (
                            <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] border border-white shadow-md",
                                    msg.sender === 'admin' ? "bg-zinc-900 text-white" : "bg-blue-600 text-white"
                                )}>
                                    {msg.sender === 'admin' ? <ShieldCheck size={16} /> : <span className="font-bold">U</span>}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm leading-relaxed",
                                    isMe 
                                        ? "bg-zinc-900 text-white rounded-tr-none" 
                                        : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-none"
                                )}>
                                    <p className="text-sm whitespace-pre-wrap text-left">{msg.text}</p>
                                    <span className={cn(
                                        "text-[10px] block mt-2 text-right opacity-60 font-medium", 
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
                
                <div className="p-4 bg-white border-t border-zinc-200 shadow-2xl">
                    <div className="flex items-end gap-3 max-w-4xl mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all">
                        <textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                            placeholder={`Message ${userType === 'admin' ? 'client' : 'support'}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 max-h-32 min-h-[44px] resize-none"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'payment' && (
            <div className="max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-4">
                {order.status === 'pending_payment' ? (
                    // INVOICE VIEW
                    <Card className="overflow-hidden border-zinc-200 shadow-xl">
                        <div className="bg-zinc-900 p-8 text-white flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2 opacity-80">
                                    <CreditCard size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Invoice Pending</span>
                                </div>
                                <h2 className="text-3xl font-bold">INV-{order.id}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-xs opacity-60 uppercase tracking-widest mb-1">Due Date</p>
                                <p className="font-mono font-bold">{order.dueDate}</p>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-end mb-8 border-b border-zinc-100 pb-8">
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Billed To</p>
                                    <p className="font-bold text-zinc-900">Client Account</p>
                                    <p className="text-sm text-zinc-500">user@example.com</p>
                                </div>
                                 <div className="text-right">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Due</p>
                                    <p className="text-4xl font-black text-zinc-900">${order.amount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Service: {order.service}</span>
                                    <span className="font-medium">${(order.amount * 0.85).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Expedited Delivery Fee</span>
                                    <span className="font-medium">${(order.amount * 0.10).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Platform & Processing</span>
                                    <span className="font-medium">${(order.amount * 0.05).toFixed(2)}</span>
                                </div>
                            </div>

                            {userType === 'user' && (
                                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col md:flex-row gap-4 items-center">
                                    <div className="flex-1">
                                        <p className="font-bold text-zinc-900 text-sm mb-1">Secure Payment</p>
                                        <p className="text-xs text-zinc-500">Processed encrypted via Stripe.</p>
                                    </div>
                                    <Button size="lg" className="w-full md:w-auto shadow-lg shadow-zinc-900/10" onClick={onPayment}>
                                        Pay ${order.amount.toFixed(2)}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                ) : (
                    // RECEIPT VIEW
                    <Card className="overflow-hidden border-zinc-200 shadow-sm relative">
                        {/* Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                        
                        <div className="p-8 text-center border-b border-zinc-100">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900">Payment Successful</h2>
                            <p className="text-zinc-500 text-sm mt-1">Receipt for Order #{order.id}</p>
                            <h3 className="text-4xl font-black text-zinc-900 mt-6">${order.amount.toFixed(2)}</h3>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Paid on {order.activities.find(a => a.type === 'payment')?.timestamp || 'Recently'}</p>
                        </div>

                        <div className="p-8 bg-zinc-50/50">
                            <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Transaction ID</p>
                                    <p className="font-mono text-zinc-700">tx_{order.id.replace('ORD-', '')}_{Math.floor(Math.random()*9000)+1000}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="font-medium text-zinc-700 flex items-center gap-2">
                                        <CreditCard size={14} /> Visa ending in 4242
                                    </p>
                                </div>
                                 <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Merchant</p>
                                    <p className="font-medium text-zinc-700">HandyWriterz LLC</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Succeeded
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700">
                                <Download size={16} className="mr-2" /> Download Official Receipt (PDF)
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        )}

        {/* Deliver/Upload Modal */}
        {isUploadOpen && (
            <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <Card className="w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 border-none">
                    <button onClick={() => setIsUploadOpen(false)} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900">
                        <X size={24} />
                    </button>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 border border-emerald-200 shadow-inner">
                            <Upload size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-zinc-900">Final Delivery</h2>
                        <p className="text-sm text-zinc-500 mt-2">Upload the results. The order status will automatically update to <b>Delivered</b>.</p>
                    </div>
                    
                    <div 
                        className="group relative cursor-pointer border-2 border-dashed border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all bg-zinc-50/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p className="text-sm font-bold text-zinc-900 mb-1">Click to browse or drop file</p>
                        <p className="text-xs text-zinc-400">PDF, DOCX, ZIP • Up to 100MB</p>
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

        {/* Request Document Modal */}
        {isRequestDocOpen && (
            <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <Card className="w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 border-none">
                    <button onClick={() => setIsRequestDocOpen(false)} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900">
                        <X size={24} />
                    </button>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 border border-blue-200 shadow-inner">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-zinc-900">Request Documentation</h2>
                        <p className="text-sm text-zinc-500 mt-2">Choose what you need from the client. This will send a system message to their chat.</p>
                    </div>
                    
                    <div className="space-y-4">
                        {(['Rubric', 'Lecture Notes', 'Assignment Brief', 'Reading List', 'Initial Draft']).map(type => (
                            <button 
                                key={type}
                                onClick={() => setRequestDocType(type)}
                                className={cn(
                                    "w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between",
                                    requestDocType === type ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-100 bg-zinc-50 hover:border-zinc-300 text-zinc-700"
                                )}
                            >
                                <span className="font-semibold text-sm">{type}</span>
                                {requestDocType === type && <Check size={16} />}
                            </button>
                        ))}
                    </div>

                    <Button className="w-full mt-8" onClick={handleRequestDocs}>
                        Send Request
                    </Button>
                </Card>
            </div>
        )}

        {/* Attach From Vault Modal */}
        {isAttachFromVaultOpen && (
            <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <Card className="w-full max-w-lg p-0 relative shadow-2xl animate-in zoom-in-95 border-none h-[600px] flex flex-col">
                    <div className="p-6 border-b border-zinc-100">
                        <button onClick={() => setIsAttachFromVaultOpen(false)} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-black text-zinc-900">Link from Vault</h2>
                        <p className="text-sm text-zinc-500 mt-1">Select an existing file from the global vault to attach here.</p>
                        
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search vault..."
                                value={vaultSearchQuery}
                                onChange={(e) => setVaultSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {unlinkedFiles.filter(f => f.name.toLowerCase().includes(vaultSearchQuery.toLowerCase())).length === 0 ? (
                            <div className="py-20 text-center text-zinc-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-10" />
                                <p>No unlinked files found in vault.</p>
                            </div>
                        ) : unlinkedFiles.filter(f => f.name.toLowerCase().includes(vaultSearchQuery.toLowerCase())).map(file => (
                            <div 
                                key={file.id} 
                                className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl hover:border-zinc-300 transition-all cursor-pointer group"
                                onClick={() => handleAttachExisting(file.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-zinc-200 text-zinc-400">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{file.size} • {file.date}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                    <Plus size={16} className="mr-2" /> Link
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};