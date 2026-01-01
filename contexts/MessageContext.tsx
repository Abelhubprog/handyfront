import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useOrders } from './OrderContext';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin' | 'system';
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  type: 'support' | 'order';
  referenceId?: string; // e.g. Order ID
  title: string;
  subtitle: string;
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessageContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  totalUnreadCount: number;
  sendMessage: (conversationId: string, text: string, sender?: 'user' | 'admin') => void;
  markAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { orders, updateOrder } = useOrders();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  
  // Track which orders we have already initialized chats for to prevent duplicates
  const processedOrderIds = useRef<Set<string>>(new Set());

  // Initialize and Sync Data
  useEffect(() => {
    // 1. Handle Support Chat (Once)
    if (!processedOrderIds.current.has('support')) {
        const supportId = 'support';
        const welcomeMsg: Message = { 
            id: 'm1', 
            text: 'Welcome to HandyWriterz! How can we help you today?', 
            sender: 'admin', 
            timestamp: new Date(Date.now() - 86400000), 
            read: true 
        };

        setMessages(prev => ({ ...prev, [supportId]: [welcomeMsg] }));
        setConversations(prev => [{
            id: supportId,
            type: 'support',
            title: 'Customer Support',
            subtitle: 'General inquiries',
            lastMessage: welcomeMsg,
            unreadCount: 0
        }, ...prev]);
        
        processedOrderIds.current.add('support');
    }

    // 2. Sync Orders
    const newOrders = orders.filter(o => !processedOrderIds.current.has(o.id));

    if (newOrders.length > 0) {
        newOrders.forEach(order => {
            // Determine if this is an initial mock load or a fresh live order
            const isMock = order.id.startsWith('ORD-249'); 
            const msgs: Message[] = [];
            
            // System Message
            msgs.push({ 
                id: `sys-${order.id}`, 
                text: `Order #${order.id} created.`, 
                sender: 'system', 
                timestamp: isMock ? new Date(Date.now() - 172800000) : new Date(), 
                read: true 
            });

            // Admin greeting for non-drafts
            if (order.status !== 'draft') {
                msgs.push({ 
                    id: `adm-${order.id}`, 
                    text: `Hi! I'm the case manager for your ${order.service} order. Let me know if you have questions.`, 
                    sender: 'admin', 
                    timestamp: isMock ? new Date(Date.now() - 80000000) : new Date(), 
                    read: true 
                });
            }
            
            // Special mock data for specific ID
            let unread = 0;
            if (order.id === 'ORD-2491') {
                msgs.push({
                    id: `adm-${order.id}-new`,
                    text: "We've found a writer perfectly matched for your Economics topic.",
                    sender: 'admin',
                    timestamp: new Date(),
                    read: false
                });
                unread = 1;
            }

            // Update State
            setMessages(prev => ({ ...prev, [order.id]: msgs }));
            setConversations(prev => {
                // Remove duplicates just in case
                const filtered = prev.filter(c => c.id !== order.id);
                return [...filtered, {
                    id: order.id,
                    type: 'order',
                    referenceId: order.id,
                    title: order.title || `Order #${order.id}`,
                    subtitle: `Order #${order.id} • ${order.status.replace('_', ' ')}`,
                    lastMessage: msgs[msgs.length - 1],
                    unreadCount: unread
                }];
            });

            // Mark processed
            processedOrderIds.current.add(order.id);
        });
    }
  }, [orders]);

  const totalUnreadCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const getConversationMessages = (conversationId: string) => {
    return messages[conversationId] || [];
  };

  const markAsRead = (conversationId: string) => {
    setMessages(prev => {
        const thread = prev[conversationId] || [];
        if (!thread.some(m => !m.read)) return prev; 
        
        return {
            ...prev,
            [conversationId]: thread.map(m => ({ ...m, read: true }))
        };
    });

    setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
    );
  };

  const sendMessage = (conversationId: string, text: string, sender: 'user' | 'admin' = 'user') => {
    const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender,
        timestamp: new Date(),
        read: true // Read by sender implicitly
    };

    // 1. Update Messages List
    setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // 2. Update Conversations (User View)
    setConversations(prev => {
        const updated = prev.map(c => {
            if (c.id === conversationId) {
                // If Admin sends, increment unread count for User
                const newUnread = sender === 'admin' ? c.unreadCount + 1 : c.unreadCount;
                return { ...c, lastMessage: newMessage, unreadCount: newUnread };
            }
            return c;
        });
        return updated;
    });

    // 3. Update Orders (Admin View) & Reply Logic
    if (sender === 'user') {
        // If User sends, increment unreadMessages for Admin
        const order = orders.find(o => o.id === conversationId);
        if (order) {
            updateOrder({ ...order, unreadMessages: order.unreadMessages + 1 });
        }

        // Mock Reply logic (only if user sends message)
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 100).toString(),
                text: "Thanks for the message. Our team will review this shortly.",
                sender: 'admin',
                timestamp: new Date(),
                read: false
            };
            
            setMessages(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), reply]
            }));
            
            // Increment unread count for User when Admin replies
            setConversations(prev => prev.map(c => 
                c.id === conversationId 
                    ? { ...c, lastMessage: reply, unreadCount: c.unreadCount + 1 } 
                    : c
            ));
        }, 1500);
    }
  };

  return (
    <MessageContext.Provider value={{ conversations, messages, totalUnreadCount, sendMessage, markAsRead, getConversationMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};