
import { Order, User } from './types';

export const MOCK_USERS: User[] = [
    { 
        id: 'u1', 
        name: 'Alex Student', 
        email: 'alex@uni.edu', 
        role: 'user', 
        status: 'active',
        joinedAt: '2023-09-01',
        lastActive: '2 mins ago',
        stats: { totalOrders: 5, totalSpent: 1250, totalEarned: 0, rating: 5.0 }
    },
    { 
        id: 'a1', 
        name: 'Sarah Jenkins', 
        email: 'sarah@handywriterz.com', 
        role: 'admin', 
        status: 'active',
        joinedAt: '2023-01-15',
        lastActive: 'Just now',
        stats: { totalOrders: 0, totalSpent: 0, totalEarned: 0, rating: 0 }
    },
    { 
        id: 'w1', 
        name: 'Dr. Michael Chen', 
        email: 'mike@handywriterz.com', 
        role: 'writer', 
        status: 'active',
        joinedAt: '2023-03-10',
        lastActive: '1 hour ago',
        stats: { totalOrders: 42, totalSpent: 0, totalEarned: 15400, rating: 4.9 }
    },
    { 
        id: 's1', 
        name: 'Jay Support', 
        email: 'jay@handywriterz.com', 
        role: 'support', 
        status: 'active',
        joinedAt: '2023-05-20',
        lastActive: '5 mins ago',
        stats: { totalOrders: 0, totalSpent: 0, totalEarned: 0, rating: 0 }
    },
    { 
        id: 'u2', 
        name: 'Emma Watson', 
        email: 'emma.w@college.edu', 
        role: 'user', 
        status: 'pending',
        joinedAt: '2023-10-25',
        lastActive: '2 days ago',
        stats: { totalOrders: 1, totalSpent: 120, totalEarned: 0, rating: 0 }
    },
    { 
        id: 'w2', 
        name: 'Prof. David Miller', 
        email: 'david.m@handywriterz.com', 
        role: 'writer', 
        status: 'suspended',
        joinedAt: '2023-04-01',
        lastActive: '1 week ago',
        stats: { totalOrders: 15, totalSpent: 0, totalEarned: 4500, rating: 3.8 }
    },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2491',
    userId: 'u1',
    writerId: 'w1',
    title: 'Economics Thesis: Market Dynamics',
    service: 'Dissertation',
    status: 'in_progress',
    dueDate: '2023-11-15',
    amount: 450,
    unreadMessages: 2,
    nextAction: 'none',
    activities: [
      { id: '1', type: 'status', title: 'Writer Assigned', timestamp: '2h ago', description: 'Expert writer Sarah J. has started working.' },
      { id: '2', type: 'payment', title: 'Payment Confirmed', timestamp: '1d ago', description: '$450.00 processed via Stripe' },
      { id: '3', type: 'status', title: 'Order Created', timestamp: '1d ago' },
    ]
  },
  {
    id: 'ORD-2492',
    userId: 'u1',
    title: 'History Essay: Industrial Revolution',
    service: 'Essay Writing',
    status: 'pending_payment',
    dueDate: '2023-11-10',
    amount: 120,
    unreadMessages: 0,
    nextAction: 'pay',
    activities: [
      { id: '4', type: 'status', title: 'Order Created', timestamp: '30m ago' },
    ]
  },
  {
    id: 'ORD-2493',
    userId: 'u2',
    writerId: 'w1',
    title: 'CS Lab Report: Data Structures',
    service: 'Lab Report',
    status: 'delivered',
    dueDate: '2023-10-28',
    amount: 85,
    unreadMessages: 0,
    nextAction: 'download',
    activities: [
      { id: '5', type: 'upload', title: 'Final Delivery', timestamp: '2d ago', description: 'Final_Report_v2.pdf uploaded by Admin' },
      { id: '6', type: 'status', title: 'Completed', timestamp: '2d ago' },
    ]
  },
  {
    id: 'ORD-2494',
    userId: 'u1',
    title: 'Literature Review: Modernism',
    service: 'Research Paper',
    status: 'review',
    dueDate: '2023-11-20',
    amount: 200,
    unreadMessages: 1,
    nextAction: 'review',
    activities: [
        { id: '7', type: 'status', title: 'Draft Submitted', timestamp: '1h ago', description: 'Please review the initial outline.'}
    ]
  }
];