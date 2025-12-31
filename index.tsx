import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Menu,
  X,
  UploadCloud,
  Download,
  MoreHorizontal,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  User,
  LogOut,
  Briefcase,
  Calendar,
  Calculator
} from 'lucide-react';

// --- Types & Mocks ---

type OrderStatus = 'draft' | 'pending_payment' | 'in_progress' | 'review' | 'delivered';
type View = 'home' | 'portal-dashboard' | 'create-order' | 'portal-order' | 'admin-inbox' | 'article';

interface Activity {
  id: string;
  type: 'status' | 'message' | 'upload' | 'payment';
  title: string;
  timestamp: string;
  description?: string;
}

interface Order {
  id: string;
  title: string;
  service: string;
  status: OrderStatus;
  dueDate: string;
  amount: number;
  unreadMessages: number;
  nextAction: 'pay' | 'upload' | 'review' | 'download' | 'none';
  activities: Activity[];
}

const INITIAL_ORDERS: Order[] = [
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

// --- Utility Components ---

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Badge = ({ status }: { status: OrderStatus }) => {
  const styles = {
    draft: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    review: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const labels = {
    draft: 'Draft',
    pending_payment: 'Action Required',
    in_progress: 'In Progress',
    review: 'Under Review',
    delivered: 'Delivered',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

const Button = ({ 
  children, variant = 'primary', className, size = 'md', isLoading, ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg', isLoading?: boolean }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
    ghost: "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

const Card = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

// --- Layout Components ---

const PublicLayout = ({ children, setView }: { children?: React.ReactNode, setView: (v: View) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">H</span>
            </div>
            <span className="font-semibold tracking-tight text-lg">HandyWriterz</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">Services</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">How it Works</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a>
            <a href="#" onClick={() => setView('article')} className="hover:text-zinc-900 transition-colors">Blog</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView('portal-dashboard')}>Log in</Button>
            <Button size="sm" onClick={() => setView('portal-dashboard')}>Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-zinc-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-100 p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-2">
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">Services</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">How it Works</a>
            <a href="#" className="text-sm font-medium p-2 hover:bg-zinc-50 rounded-lg">Pricing</a>
            <Button className="w-full justify-center" onClick={() => {
                setIsMobileMenuOpen(false);
                setView('portal-dashboard');
            }}>Log In</Button>
          </div>
        )}
      </header>
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

const PortalLayout = ({ children, setView, activeTab = 'dashboard' }: { children?: React.ReactNode, setView: (v: View) => void, activeTab?: string }) => (
  <div className="min-h-screen bg-zinc-50 flex">
    {/* Desktop Sidebar */}
    <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 bg-white fixed h-full z-30">
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 cursor-pointer" onClick={() => setView('home')}>
         <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-serif font-bold text-sm">H</span>
          </div>
        <span className="font-semibold text-zinc-900">HandyWriterz</span>
      </div>
      
      <div className="p-4 space-y-1">
        <Button 
          variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
          onClick={() => setView('portal-dashboard')}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Button>
        <Button 
          variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <FileText size={18} />
          My Orders
        </Button>
        <Button 
          variant={activeTab === 'messages' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <MessageSquare size={18} />
          Messages
          <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
        </Button>
        <Button 
          variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
          className="w-full justify-start gap-3"
        >
          <Settings size={18} />
          Settings
        </Button>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">Alex Student</p>
            <p className="text-xs text-zinc-500 truncate">alex@uni.edu</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400" onClick={() => setView('home')}>
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 md:ml-64 pb-20 md:pb-0">
      {children}
    </main>

    {/* Mobile Tab Bar */}
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 flex items-center justify-around h-16 z-50 px-2 pb-safe">
      <button 
        className={cn("flex flex-col items-center gap-1 p-2 rounded-lg", activeTab === 'dashboard' ? 'text-zinc-900' : 'text-zinc-400')}
        onClick={() => setView('portal-dashboard')}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <Search size={20} />
        <span className="text-[10px] font-medium">Explore</span>
      </button>
      <button 
        className="flex -mt-8 bg-zinc-900 text-white rounded-full p-4 shadow-lg shadow-zinc-900/20 active:scale-95 transition-transform"
        onClick={() => setView('create-order')}
      >
        <Plus size={24} />
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <MessageSquare size={20} />
        <span className="text-[10px] font-medium">Chat</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-400">
        <User size={20} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  </div>
);

const AdminLayout = ({ children, setView }: { children?: React.ReactNode, setView: (v: View) => void }) => (
  <div className="h-screen bg-zinc-50 flex overflow-hidden">
     {/* Compact Admin Sidebar */}
     <aside className="w-16 flex flex-col items-center border-r border-zinc-200 bg-zinc-900 py-4 gap-6 z-50">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center cursor-pointer" onClick={() => setView('home')}>
             <span className="text-zinc-900 font-serif font-bold text-lg">H</span>
        </div>
        <div className="w-8 h-1 bg-zinc-700 rounded-full" />
        <button className="p-3 bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/20" title="Inbox">
            <Briefcase size={20} />
        </button>
        <button className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors" title="Writers">
            <User size={20} />
        </button>
        <button className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors" title="Finance">
            <CreditCard size={20} />
        </button>
        <div className="mt-auto">
            <button className="p-3 text-zinc-500 hover:text-white transition-colors" onClick={() => setView('home')}>
                <LogOut size={20} />
            </button>
        </div>
    </aside>
    {children}
  </div>
);


// --- Shared Organisms ---

const OrderStatusBanner = ({ order, onPayment }: { order: Order, onPayment: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
        onPayment();
        setIsProcessing(false);
    }, 1500);
  };

  if (order.status === 'pending_payment') {
    return (
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10 animate-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-100 rounded-md text-amber-700">
                <CreditCard size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-amber-900">Payment Required</p>
                <p className="text-xs text-amber-700">Please settle the invoice to start your order.</p>
            </div>
        </div>
        <Button 
            size="sm" 
            className="bg-amber-600 hover:bg-amber-700 text-white border-transparent"
            onClick={handlePay}
            isLoading={isProcessing}
        >
            Pay ${order.amount}
        </Button>
      </div>
    );
  }
  if (order.status === 'delivered') {
    return (
      <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
             <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-700">
                <CheckCircle2 size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-emerald-900">Order Completed</p>
                <p className="text-xs text-emerald-700">Your files are ready for download.</p>
            </div>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
            <Download size={16} className="mr-2" />
            Download Files
        </Button>
      </div>
    );
  }
  return null;
};

const OrderWorkspace = ({ order, userType = 'user', onPayment }: { order: Order, userType?: 'user' | 'admin', onPayment: () => void }) => {
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


// --- Views ---

const HomePage = ({ setView }: { setView: (v: View) => void }) => (
  <div className="space-y-24 pb-24">
    {/* Hero */}
    <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium mb-8">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Accepting new orders for Fall 2023
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 font-serif max-w-4xl mx-auto leading-[1.1]">
        Academic excellence, <br/>
        <span className="text-zinc-400 italic">delivered securely.</span>
      </h1>
      <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        Connect with vetted academic writers for research, editing, and content creation. Premium quality, zero plagiarism, guaranteed privacy.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Button size="lg" className="w-full md:w-auto text-lg h-14 px-10" onClick={() => setView('create-order')}>Start an Order</Button>
        <Button variant="outline" size="lg" className="w-full md:w-auto text-lg h-14 px-10">View Samples</Button>
      </div>
    </section>

    {/* Features */}
    <section className="px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { icon: ShieldCheck, title: "Private & Secure", desc: "Bank-level encryption and strict NDA protection for all your data." },
                { icon: Zap, title: "Fast Turnaround", desc: "Get your drafts in as little as 24 hours for urgent deadlines." },
                { icon: User, title: "Vetted Experts", desc: "Only Top 1% of applicants make it to our writing team." }
            ].map((f, i) => (
                <div key={i} className="p-8 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-900 mb-6">
                        <f.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
            ))}
        </div>
    </section>
  </div>
);

const UserDashboard = ({ setView, setCurrentOrderId, orders }: { setView: (v: View) => void, setCurrentOrderId: (id: string) => void, orders: Order[] }) => (
  <div className="p-4 md:p-8 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Active Orders</h1>
        <Button onClick={() => setView('create-order')}>
            <Plus size={18} className="mr-2" />
            New Order
        </Button>
    </div>

    <div className="space-y-4">
        {orders.map(order => (
            <div 
                key={order.id} 
                className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer relative"
                onClick={() => {
                    setCurrentOrderId(order.id);
                    setView('portal-order');
                }}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-50 rounded-xl hidden md:block">
                            <FileText className="text-zinc-400" size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-zinc-400">#{order.id}</span>
                                <Badge status={order.status} />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{order.title}</h3>
                            <p className="text-sm text-zinc-500 mt-1">{order.service} • Due {order.dueDate}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 pl-14 md:pl-0">
                         {order.unreadMessages > 0 && (
                             <div className="flex items-center gap-1.5 text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full">
                                 <MessageSquare size={14} />
                                 {order.unreadMessages} New
                             </div>
                         )}
                         <div className="hidden md:block text-right">
                             <p className="text-sm font-medium text-zinc-900">${order.amount}</p>
                             <p className="text-xs text-zinc-500">Fixed Price</p>
                         </div>
                         <ChevronRight className="text-zinc-300 group-hover:text-zinc-600" />
                    </div>
                </div>
            </div>
        ))}
    </div>
  </div>
);

const CreateOrderView = ({ setView, onSubmit }: { setView: (v: View) => void, onSubmit: (order: Order) => void }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: 'Essay Writing',
        type: 'Undergraduate',
        deadline: '7 Days',
        pages: 5,
        topic: ''
    });

    const calculatePrice = () => {
        const base = 20; // per page
        return formData.pages * base;
    }

    const handleSubmit = () => {
        const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            title: formData.topic || 'Untitled Order',
            service: formData.service,
            status: 'pending_payment',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: calculatePrice(),
            unreadMessages: 0,
            nextAction: 'pay',
            activities: [
                { id: Date.now().toString(), type: 'status', title: 'Order Drafted', timestamp: 'Just now' }
            ]
        };
        onSubmit(newOrder);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => setView('portal-dashboard')}>
                <ArrowRight className="rotate-180 mr-2" size={16} /> Back to Dashboard
            </Button>
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Start New Order</h1>
                <p className="text-zinc-500">Fill in the details below to get an instant quote.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Type of Service</label>
                            <select 
                                className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none transition-shadow"
                                value={formData.service}
                                onChange={e => setFormData({...formData, service: e.target.value})}
                            >
                                <option>Essay Writing</option>
                                <option>Dissertation</option>
                                <option>Research Paper</option>
                                <option>Editing & Proofreading</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Academic Level</label>
                                <select className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg outline-none">
                                    <option>High School</option>
                                    <option>Undergraduate</option>
                                    <option>Master's</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Deadline</label>
                                <select className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg outline-none">
                                    <option>14 Days</option>
                                    <option>7 Days</option>
                                    <option>3 Days</option>
                                    <option>24 Hours</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Topic</label>
                            <input 
                                type="text" 
                                className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-zinc-900" 
                                placeholder="e.g. The impact of AI on modern economics"
                                value={formData.topic}
                                onChange={e => setFormData({...formData, topic: e.target.value})}
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Instructions</label>
                            <textarea 
                                className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 h-32 resize-none" 
                                placeholder="Any specific requirements, formatting style, or sources?"
                            />
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card className="p-6 sticky top-6">
                        <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                            <Calculator size={18} />
                            Summary
                        </h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Service</span>
                                <span className="font-medium">{formData.service}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Level</span>
                                <span className="font-medium">Undergraduate</span>
                            </div>
                             <div className="flex justify-between text-sm pt-3 border-t border-zinc-100">
                                <span className="font-semibold text-zinc-900">Total Price</span>
                                <span className="font-bold text-2xl text-zinc-900">${calculatePrice()}</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleSubmit}>Create Order</Button>
                        <p className="text-xs text-zinc-400 text-center mt-3">Secure payment handled by Stripe</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminInbox = ({ setView, currentOrderId, setCurrentOrderId, orders, onUpdateOrder }: { setView: (v: View) => void, currentOrderId: string | null, setCurrentOrderId: (id: string) => void, orders: Order[], onUpdateOrder: (o: Order) => void }) => {
  const [filter, setFilter] = useState<'all' | 'attention' | 'active'>('all');
  
  const filteredOrders = orders.filter(o => {
      if (filter === 'attention') return o.status === 'review' || o.status === 'pending_payment';
      if (filter === 'active') return o.status === 'in_progress';
      return true;
  });

  const activeOrder = orders.find(o => o.id === currentOrderId) || orders[0];
  
  return (
    <div className="flex flex-1 overflow-hidden">
        {/* Left List */}
        <div className="w-full md:w-[400px] border-r border-zinc-200 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-zinc-900">Inbox</h2>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"><Search size={16} /></button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-500"><Settings size={16} /></button>
                    </div>
                </div>
                {/* Status Filters */}
                <div className="flex p-1 bg-zinc-100 rounded-lg">
                    {['all', 'attention', 'active'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                                filter === f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                            )}
                        >
                            {f === 'attention' ? 'Needs Action' : f}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 text-sm">No orders found</div>
                ) : (
                    filteredOrders.map(order => (
                        <div 
                            key={order.id}
                            onClick={() => setCurrentOrderId(order.id)}
                            className={cn(
                                "p-4 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors",
                                activeOrder?.id === order.id ? 'bg-zinc-50 border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs text-zinc-400">#{order.id}</span>
                                <span className="text-xs text-zinc-500">{order.activities[0].timestamp}</span>
                            </div>
                            <h4 className="font-medium text-sm text-zinc-900 mb-1 truncate">{order.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                                <Badge status={order.status} />
                                {order.unreadMessages > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        
        {/* Right Details */}
        <div className="hidden md:block flex-1 h-full overflow-hidden">
            {activeOrder ? (
                <OrderWorkspace 
                    order={activeOrder} 
                    userType="admin" 
                    onPayment={() => {}} // Admin doesn't pay
                />
            ) : (
                <div className="h-full flex items-center justify-center text-zinc-400">Select an order</div>
            )}
        </div>
    </div>
  );
};

const ArticleView = ({ setView }: { setView: (v: View) => void }) => (
    <div className="max-w-3xl mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => setView('home')} className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600">
            <ArrowRight className="rotate-180 mr-2" size={16} /> Back to Home
        </Button>
        <article className="prose prose-zinc prose-lg">
            <span className="text-blue-600 font-medium text-sm tracking-wider uppercase mb-4 block">Writing Tips</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-6">How to structure a PhD dissertation efficiently</h1>
            <div className="flex items-center gap-3 mb-10 text-zinc-500 text-sm">
                <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
                <span>By Dr. Sarah Jenkins</span>
                <span>•</span>
                <span>8 min read</span>
            </div>
            
            <p className="text-xl text-zinc-600 leading-relaxed mb-8 font-serif">
                The blank page is the enemy of the academic. When staring down the barrel of a 80,000 word requirement, structure isn't just helpful—it's a survival mechanism.
            </p>

            <div className="my-8 p-6 bg-zinc-50 border-l-4 border-zinc-900 rounded-r-xl">
                <p className="font-medium text-zinc-900 italic">"Research is formalized curiosity. It is poking and prying with a purpose."</p>
                <p className="mt-2 text-sm text-zinc-500">— Zora Neale Hurston</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">1. The Macro Structure</h2>
            <p className="text-zinc-700 leading-7 mb-4">
                Most universities follow a rigid structure. Don't fight it. Innovation in structure is rarely rewarded in academic contexts; innovation in content is.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 marker:text-zinc-300">
                <li><strong>Introduction:</strong> The promise you make to the reader.</li>
                <li><strong>Literature Review:</strong> Proving you've done your homework.</li>
                <li><strong>Methodology:</strong> How you built the machine.</li>
                <li><strong>Results:</strong> What the machine produced.</li>
                <li><strong>Discussion:</strong> What it all means.</li>
            </ul>
        </article>
    </div>
);

// --- Main App & Router ---

const App = () => {
  const [view, setView] = useState<View>('home');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Helper to toggle admin view easily for demo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'm') {
            setView(v => v === 'admin-inbox' ? 'home' : 'admin-inbox');
        }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCreateOrder = (newOrder: Order) => {
      setOrders([newOrder, ...orders]);
      setCurrentOrderId(newOrder.id);
      setView('portal-order');
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
      setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handlePayment = (orderId: string) => {
      const order = orders.find(o => o.id === orderId);
      if (order) {
          const updatedOrder: Order = {
              ...order,
              status: 'in_progress',
              nextAction: 'none',
              activities: [
                  { 
                      id: Date.now().toString(), 
                      type: 'payment', 
                      title: 'Payment Successful', 
                      timestamp: 'Just now',
                      description: 'Processed securely via Stripe'
                  },
                  ...order.activities
              ]
          };
          handleUpdateOrder(updatedOrder);
      }
  };

  const getActiveOrder = () => orders.find(o => o.id === currentOrderId) || orders[0];

  const renderView = () => {
    switch (view) {
      case 'home':
        return <PublicLayout setView={setView}><HomePage setView={setView} /></PublicLayout>;
      case 'portal-dashboard':
        return <PortalLayout setView={setView}><UserDashboard setView={setView} setCurrentOrderId={setCurrentOrderId} orders={orders} /></PortalLayout>;
      case 'create-order':
        return <PortalLayout setView={setView} activeTab="dashboard"><CreateOrderView setView={setView} onSubmit={handleCreateOrder} /></PortalLayout>;
      case 'portal-order':
        const activeOrder = getActiveOrder();
        return (
            <PortalLayout setView={setView} activeTab="orders">
                <OrderWorkspace 
                    order={activeOrder} 
                    onPayment={() => handlePayment(activeOrder.id)} 
                />
            </PortalLayout>
        );
      case 'admin-inbox':
        return (
            <AdminLayout setView={setView}>
                <AdminInbox 
                    setView={setView} 
                    currentOrderId={currentOrderId} 
                    setCurrentOrderId={setCurrentOrderId} 
                    orders={orders}
                    onUpdateOrder={handleUpdateOrder}
                />
            </AdminLayout>
        );
      case 'article':
        return <PublicLayout setView={setView}><ArticleView setView={setView} /></PublicLayout>;
      default:
        return <PublicLayout setView={setView}><HomePage setView={setView} /></PublicLayout>;
    }
  };

  return (
    <>
        {renderView()}
        {/* Dev Switcher */}
        <div className="fixed bottom-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur text-white text-xs p-2 rounded-lg flex gap-2">
                <button onClick={() => setView('home')} className="hover:text-blue-300">Public</button>
                <span>|</span>
                <button onClick={() => setView('portal-dashboard')} className="hover:text-blue-300">User</button>
                <span>|</span>
                <button onClick={() => setView('admin-inbox')} className="hover:text-blue-300">Admin</button>
            </div>
        </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

export default App;
