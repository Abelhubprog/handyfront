
import { Order, User } from './types';

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alex Student', email: 'alex@uni.edu', role: 'user' },
    { id: 'a1', name: 'Admin Sarah', email: 'sarah@handywriterz.com', role: 'admin' },
    { id: 'w1', name: 'Writer Mike', email: 'mike@handywriterz.com', role: 'writer' },
    { id: 's1', name: 'Support Jay', email: 'jay@handywriterz.com', role: 'support' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2491',
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
