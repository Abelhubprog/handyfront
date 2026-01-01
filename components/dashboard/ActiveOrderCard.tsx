import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, ChevronRight, Clock, LayoutDashboard } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusChip } from '../system/StatusChip';
import { NextActionBanner, NextActionType } from '../system/NextActionBanner';
import { Order } from '../../types';

interface ActiveOrderCardProps {
    order: Order;
}

export const ActiveOrderCard = ({ order }: ActiveOrderCardProps) => {
    const navigate = useNavigate();

    const nextAction = useMemo(() => {
        let type: NextActionType = 'none';
        let title = '';
        let desc = '';
        let cta = '';
        let path = `/app/orders/${order.id}`;

        if (order.status === 'pending_payment') {
            type = 'pay';
            title = 'Payment Required';
            desc = 'Secure your writer by completing the payment.';
            cta = 'Pay Now';
        } else if (order.status === 'review') {
            type = 'upload';
            title = 'Files Needed';
            desc = 'Please upload the assignment brief to continue.';
            cta = 'Upload Files';
            path = `/app/uploads?order=${order.id}`;
        } else if (order.unreadMessages > 0) {
            type = 'reply';
            title = 'New Message';
            desc = 'Support has replied to your inquiry.';
            cta = 'View Message';
            path = `/app/messages?c=${order.id}`;
        } else if (order.status === 'delivered') {
             type = 'download';
             title = 'Order Delivered';
             desc = 'Your files are ready for download.';
             cta = 'Download';
        }

        if (type === 'none') return null;
        return { type, title, desc, cta, path };
    }, [order]);

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <LayoutDashboard size={20} className="text-zinc-400" />
                    Active Order
                </h2>
                <button onClick={() => navigate('/app/orders')} className="text-sm text-blue-600 hover:underline">
                    View all
                </button>
            </div>

            <Card className="p-0 overflow-hidden border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate(`/app/orders/${order.id}`)}>
                <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">#{order.id}</span>
                                <StatusChip status={order.status} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{order.title}</h3>
                            <p className="text-sm text-zinc-500 mt-1">{order.service} • Due {order.dueDate}</p>
                        </div>
                    </div>

                    {nextAction ? (
                        <NextActionBanner 
                            type={nextAction.type}
                            title={nextAction.title}
                            description={nextAction.desc}
                            ctaLabel={nextAction.cta}
                            onCta={() => navigate(nextAction.path)}
                            className="mb-4"
                        />
                    ) : (
                        <div className="p-4 bg-zinc-50 rounded-xl mb-4 flex items-center gap-3 text-zinc-500 text-sm border border-zinc-100">
                            <Clock size={16} />
                            <span>Order is in progress. We'll notify you of updates.</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900" onClick={(e) => { e.stopPropagation(); navigate(`/app/messages?c=${order.id}`); }}>
                            <MessageSquare size={16} className="mr-2" />
                            Message
                        </Button>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900" onClick={(e) => { e.stopPropagation(); navigate(`/app/uploads?order=${order.id}`); }}>
                            <Upload size={16} className="mr-2" />
                            Files
                        </Button>
                        <div className="flex-1"></div>
                        <ChevronRight size={18} className="text-zinc-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                </div>
            </Card>
        </section>
    );
};