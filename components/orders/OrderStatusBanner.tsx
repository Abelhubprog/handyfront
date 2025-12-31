import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Order } from '../../types';

export const OrderStatusBanner = ({ order, onPayment }: { order: Order, onPayment: () => void }) => {
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
