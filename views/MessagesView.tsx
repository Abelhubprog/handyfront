import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Send, ArrowLeft, MoreVertical, Paperclip, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  type: 'support' | 'order';
  title: string;
  subtitle: string;
  lastMessageTime: string;
  unreadCount: number;
  status?: string;
}

// Initial Mock Data Generator
const generateInitialMessages = (orderId: string): Message[] => {
  if (orderId === 'support') {
    return [
      { id: 'm1', text: 'Welcome to HandyWriterz! How can we help you today?', sender: 'admin', timestamp: '10:00 AM', read: true },
    ];
  }
  return [
    { id: `m-${orderId}-1`, text: `System: Order #${orderId} has been created.`, sender: 'system', timestamp: '2 days ago', read: true },
    { id: `m-${orderId}-2`, text: 'Hi, I have assigned a writer to your task. They will review your requirements shortly.', sender: 'admin', timestamp: '1 day ago', read: true },
  ];
};

export const MessagesView = () => {
  const { orders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get('c');
  const navigate = useNavigate();
  
  // Local state for messages (persisted in memory while navigating)
  const [messagesStore, setMessagesStore] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages store on load
  useEffect(() => {
    const initialStore: Record<string, Message[]> = {
      'support': generateInitialMessages('support')
    };
    orders.forEach(o => {
      initialStore[o.id] = generateInitialMessages(o.id);
    });
    setMessagesStore(prev => ({ ...initialStore, ...prev })); // Merge to keep existing if re-mounting
  }, [orders.length]); // Only re-run if orders change significantly (naive check)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationId, messagesStore]);

  const conversations: Conversation[] = [
    {
      id: 'support',
      type: 'support',
      title: 'Customer Support',
      subtitle: 'General inquiries',
      lastMessageTime: '10:00 AM',
      unreadCount: 0
    },
    ...orders.map(o => ({
      id: o.id,
      type: 'order' as const,
      title: o.title,
      subtitle: `Order #${o.id} • ${o.status.replace('_', ' ')}`,
      lastMessageTime: '1 day ago',
      unreadCount: o.unreadMessages,
      status: o.status
    }))
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessagesStore(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), msg]
    }));
    setNewMessage('');

    // Mock reply
    setTimeout(() => {
       const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message. We'll get back to you shortly.",
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessagesStore(prev => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), reply]
      }));
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeMessages = activeConversationId ? messagesStore[activeConversationId] || [] : [];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-white md:bg-zinc-50 overflow-hidden">
      
      {/* Sidebar / List View */}
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full",
        activeConversationId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold text-zinc-900">Messages</h1>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <MoreVertical size={18} />
          </Button>
        </div>
        
        <div className="p-4 pt-2">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => (
            <div 
              key={convo.id}
              onClick={() => setSearchParams({ c: convo.id })}
              className={cn(
                "p-4 border-b border-zinc-50 cursor-pointer hover:bg-zinc-50 transition-colors flex gap-3",
                activeConversationId === convo.id ? "bg-zinc-50 border-l-4 border-l-zinc-900 pl-[12px]" : "border-l-4 border-l-transparent"
              )}
            >
              <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  convo.type === 'support' ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-700"
              )}>
                  {convo.type === 'support' ? <ShieldCheck size={18} /> : <User size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={cn("font-medium text-sm truncate", activeConversationId === convo.id ? "text-zinc-900" : "text-zinc-700")}>
                          {convo.title}
                      </h3>
                      <span className="text-[10px] text-zinc-400 flex-shrink-0 ml-2">{convo.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{convo.subtitle}</p>
              </div>
              {convo.unreadCount > 0 && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-zinc-50/50 h-full",
        !activeConversationId ? "hidden md:flex" : "flex"
      )}>
        {activeConversationId ? (
            <>
                {/* Chat Header */}
                <div className="h-16 px-4 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSearchParams({})}
                            className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            activeConversation?.type === 'support' ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-700"
                        )}>
                            {activeConversation?.type === 'support' ? <ShieldCheck size={14} /> : <User size={14} />}
                        </div>
                        <div>
                            <h2 className="font-semibold text-zinc-900 text-sm md:text-base">{activeConversation?.title}</h2>
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                                {activeConversation?.type === 'support' ? 'Typically replies in 1h' : activeConversation?.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Timestamp separator example */}
                    <div className="flex justify-center">
                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">Today</span>
                    </div>

                    {activeMessages.map((msg, index) => {
                         const isUser = msg.sender === 'user';
                         const isSystem = msg.sender === 'system';
                         
                         if (isSystem) {
                             return (
                                 <div key={msg.id} className="flex justify-center my-4">
                                     <span className="text-xs text-zinc-400 italic bg-zinc-50 px-3 py-1 rounded border border-zinc-100">
                                         {msg.text} • {msg.timestamp}
                                     </span>
                                 </div>
                             );
                         }

                         return (
                            <div key={msg.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]",
                                    isUser ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-600"
                                )}>
                                    {isUser ? 'ME' : 'AD'}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl shadow-sm max-w-[85%] md:max-w-[70%]",
                                    isUser ? "bg-zinc-900 text-white rounded-tr-none" : "bg-white border border-zinc-200 rounded-tl-none"
                                )}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <div className={cn("flex items-center justify-end gap-1 mt-1", isUser ? "text-zinc-400" : "text-zinc-400")}>
                                        <span className="text-[10px]">{msg.timestamp}</span>
                                        {isUser && <CheckCheck size={12} className={cn(msg.read ? "text-blue-400" : "text-zinc-500")} />}
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div className="p-4 bg-white border-t border-zinc-200">
                    <div className="flex items-end gap-2 max-w-4xl mx-auto">
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-zinc-400 hover:text-zinc-600">
                            <Paperclip size={20} />
                        </Button>
                        <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-transparent transition-all">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none focus:ring-0 p-3 text-sm max-h-32 resize-none"
                                rows={1}
                                style={{ minHeight: '44px' }}
                            />
                        </div>
                        <Button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className={cn(
                                "h-10 w-10 p-0 rounded-xl transition-all", 
                                newMessage.trim() ? "bg-zinc-900" : "bg-zinc-200 text-zinc-400"
                            )}
                        >
                            <Send size={18} className={newMessage.trim() ? "ml-0.5" : ""} />
                        </Button>
                    </div>
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                    <User size={32} className="opacity-20 text-zinc-900" />
                </div>
                <h3 className="text-zinc-900 font-medium mb-1">Your Messages</h3>
                <p className="text-sm text-center max-w-xs">Select a conversation from the list to start chatting with your writers or support team.</p>
            </div>
        )}
      </div>
    </div>
  );
};
