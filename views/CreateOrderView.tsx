import React, { useState } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Order } from '../types';
import { useOrders } from '../contexts/OrderContext';

export const CreateOrderView = () => {
    const navigate = useNavigate();
    const { addOrder } = useOrders();
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
        addOrder(newOrder);
        navigate(`/app/orders/${newOrder.id}`);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate('/app')}>
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
