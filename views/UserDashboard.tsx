import React from 'react';
import { Plus, FileText, MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useOrders } from '../contexts/OrderContext';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Active Orders</h1>
          <Button onClick={() => navigate('/app/new')}>
              <Plus size={18} className="mr-2" />
              New Order
          </Button>
      </div>

      <div className="space-y-4">
          {orders.map(order => (
              <div 
                  key={order.id} 
                  className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer relative"
                  onClick={() => navigate(`/app/orders/${order.id}`)}
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
};
