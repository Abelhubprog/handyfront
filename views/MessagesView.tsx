import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Send, ArrowLeft, MoreVertical, Paperclip, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { useMessages, Message } from '../contexts/MessageContext';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
    // simple "Today", "Yesterday", or date
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000 && now.getDate() === date.getDate()) return formatTime(date);
    if (diff < 172800000) return 'Yesterday';
    return date.toLocaleDateString();
};

// --- Sub-Components ---

const MessageSystem: React.FC<{ message: Message }> = ({ message }) => (
    <div className="flex justify-center my-4">
        <span className="text-xs text-zinc-400 italic bg-zinc-50 px-3 py-1 rounded border border-zinc-100">
            {message.text} • {formatTime(message.timestamp)}
        </span>
    </div>
);

const MessageAvatar = ({ isUser }: { isUser: boolean }) => (
    <div className={cn(
        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] border border-white shadow-sm",
        isUser ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-600"
    )}>
        {isUser ? 'ME' : 'AD'}
    </div>
);

const MessageBubble = ({ message, isUser }: { message: Message, isUser: boolean }) => (
    <div className={cn(
        "p-3 rounded-2xl shadow-sm max-w-[85%] md:max-w-[70%]",
        isUser ? "bg-zinc-900 text-white rounded-tr-none" : "bg-white border border-zinc-200 rounded-tl-none"
    )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={cn("flex items-center justify-end gap-1 mt-1", isUser ? "text-zinc-400" : "text-zinc-400")}>
            <span className="text-[10px]">{formatTime(message.timestamp)}</span>
            {isUser && <CheckCheck size={12} className={cn(message.read ? "text-blue-400" : "text-zinc-500")} />}
        </div>
    </div>
);

// --- Main View ---

export const MessagesView = () => {
  const { conversations, getConversationMessages, sendMessage, markAsRead } = useMessages();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get('c');
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived state
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? getConversationMessages(activeConversationId) : [];
  
  // Mobile view state helper
  const showThreadMobile = !!activeConversationId;

  // Scroll to bottom when messages change and mark as read
  useEffect(() => {
    if (activeConversationId) {
        // Small timeout to ensure DOM is updated before scrolling
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        markAsRead(activeConversationId);
        return () => clearTimeout(timer);
    }
  }, [activeConversationId, activeMessages.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, newMessage);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Mobile: h-[calc(100dvh-4rem)] fits exactly between top and bottom nav
    // Desktop: h-screen (sidebar handles its own structure)
    <div className="flex h-[calc(100dvh-4rem)] md:h-screen bg-white md:bg-zinc-50 overflow-hidden">
      
      {/* Sidebar / List View 
          - Mobile: Visible ONLY when NO conversation is selected
          - Desktop: Always visible (2-pane)
      */}
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full transition-all duration-300",
        showThreadMobile ? "hidden md:flex" : "flex"
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(convo => (
            <div 
              key={convo.id}
              onClick={() => setSearchParams({ c: convo.id })}
              className={cn(
                "p-4 border-b border-zinc-50 cursor-pointer hover:bg-zinc-50 transition-colors flex gap-3",
                activeConversationId === convo.id ? "bg-zinc-50 border-l-4 border-l-zinc-900 pl-[12px]" : "border-l-4 border-l-transparent"
              )}
            >
              <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative",
                  convo.type === 'support' ? "bg-zinc-900 text-white" : "bg-blue-100 text-blue-700"
              )}>
                  {convo.type === 'support' ? <ShieldCheck size={18} /> : <User size={18} />}
                  {convo.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={cn("font-medium text-sm truncate", activeConversationId === convo.id ? "text-zinc-900" : "text-zinc-700")}>
                          {convo.title}
                      </h3>
                      <span className={cn("text-[10px] flex-shrink-0 ml-2", convo.unreadCount > 0 ? "text-blue-600 font-bold" : "text-zinc-400")}>
                          {convo.lastMessage ? formatDate(convo.lastMessage.timestamp) : ''}
                      </span>
                  </div>
                  <p className={cn("text-xs truncate", convo.unreadCount > 0 ? "text-zinc-900 font-medium" : "text-zinc-500")}>
                      {convo.unreadCount > 0 ? (
                        <span>{convo.lastMessage?.text}</span>
                      ) : (
                        convo.lastMessage?.text || convo.subtitle
                      )}
                  </p>
              </div>
            </div>
          ))}
          {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-zinc-400 text-sm">No conversations found.</div>
          )}
        </div>
      </div>

      {/* Chat Area 
          - Mobile: Visible ONLY when conversation IS selected (full screen)
          - Desktop: Always visible (right pane)
      */}
      <div className={cn(
        "flex-1 flex flex-col bg-zinc-50/50 h-full",
        !showThreadMobile ? "hidden md:flex" : "flex"
      )}>
        {activeConversationId && activeConversation ? (
            <>
                {/* Chat Header */}
                <div className="h-16 px-4 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        {/* Back Button - Visible on Mobile Only */}
                        <button 
                            onClick={() => setSearchParams({})}
                            className="md:hidden p-2 -ml-2 mr-1 text-zinc-500 hover:text-zinc-900 active:bg-zinc-100 rounded-full transition-colors"
                            aria-label="Back to conversations"
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
                    {/* Optional actions like call/details could go here */}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400">
                        <MoreVertical size={18} />
                    </Button>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Date Separator */}
                    <div className="flex justify-center">
                        <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
                            {activeMessages.length > 0 ? formatDate(activeMessages[0].timestamp) : 'Today'}
                        </span>
                    </div>

                    {activeMessages.map((msg, index) => {
                         // sender can be 'user', 'admin', 'system'
                         // For UI purposes, 'user' is the current user (ME)
                         // 'admin' is the other party (AD)
                         const isUser = msg.sender === 'user';
                         
                         if (msg.sender === 'system') {
                             return <MessageSystem key={msg.id} message={msg} />;
                         }

                         return (
                            <div key={msg.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
                                <MessageAvatar isUser={isUser} />
                                <MessageBubble message={msg} isUser={isUser} />
                            </div>
                         );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div className="p-4 bg-white border-t border-zinc-200 pb-safe">
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
                {/* Fallback back button for mobile if an invalid ID is somehow active */}
                <Button 
                    variant="ghost" 
                    className="md:hidden mb-6"
                    onClick={() => setSearchParams({})}
                >
                    <ArrowLeft className="mr-2" size={16} /> Back to Messages
                </Button>

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