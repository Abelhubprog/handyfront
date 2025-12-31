
export type OrderStatus = 'draft' | 'pending_payment' | 'in_progress' | 'review' | 'delivered';
export type View = 'home' | 'portal-dashboard' | 'create-order' | 'portal-order' | 'admin-inbox' | 'article';
export type UserRole = 'user' | 'admin' | 'writer' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Activity {
  id: string;
  type: 'status' | 'message' | 'upload' | 'payment';
  title: string;
  timestamp: string;
  description?: string;
}

export interface Order {
  id: string;
  title: string;
  service: string;
  status: OrderStatus;
  dueDate: string;
  amount: number;
  unreadMessages: number;
  nextAction: 'pay' | 'upload' | 'review' | 'download' | 'none';
  activities: Activity[];
  adminNotes?: string;
}
