import React, { useState } from 'react';
import { Search, CreditCard, Download, ExternalLink, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

interface Transaction {
    id: string;
    orderId: string;
    client: string;
    amount: number;
    status: 'succeeded' | 'pending' | 'failed';
    date: string;
    method: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx_93812', orderId: 'ORD-2491', client: 'Alex Student', amount: 450.00, status: 'succeeded', date: '2023-10-24 14:22', method: 'Visa •••• 4242' },
    { id: 'tx_93813', orderId: 'ORD-2492', client: 'Alex Student', amount: 120.00, status: 'pending', date: '2023-10-25 09:10', method: 'Apple Pay' },
    { id: 'tx_93814', orderId: 'ORD-2493', client: 'Emma Watson', amount: 85.00, status: 'succeeded', date: '2023-10-22 18:45', method: 'Mastercard •••• 1111' },
    { id: 'tx_93815', orderId: 'ORD-2494', client: 'Alex Student', amount: 200.00, status: 'succeeded', date: '2023-10-20 11:30', method: 'Visa •••• 4242' },
];

export const AdminPaymentsView = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
            <header className="p-6 md:p-8 bg-white border-b border-zinc-200">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Finance & Payments</h1>
                        <p className="text-zinc-500 text-sm mt-1">Monitor revenue, payouts, and transaction health.</p>
                    </div>
                    <Button variant="outline">
                        <Download size={16} className="mr-2" /> Export CSV
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Total Revenue', value: '$24,520.00', change: '+12%', icon: ArrowUpRight, color: 'emerald' },
                        { label: 'Pending Payouts', value: '$3,120.00', change: '-5%', icon: ArrowDownLeft, color: 'amber' },
                        { label: 'Platform Profit', value: '$12,260.00', change: '+8%', icon: CreditCard, color: 'blue' },
                    ].map((stat, i) => (
                        <div key={i} className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                                <stat.icon size={16} className={`text-${stat.color}-500`} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900">{stat.value}</span>
                                <span className={`text-xs font-medium text-${stat.color}-600 bg-${stat.color}-50 px-1.5 py-0.5 rounded`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search transactions, clients..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-zinc-500">Transaction ID</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Client</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Order</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Method</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                                <th className="px-6 py-3 font-medium text-zinc-500">Date</th>
                                <th className="px-6 py-3 font-medium text-zinc-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {MOCK_TRANSACTIONS.map(tx => (
                                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{tx.id}</td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">{tx.client}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            {tx.orderId} <ExternalLink size={10} />
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">{tx.method}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize",
                                            tx.status === 'succeeded' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            tx.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                        )}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">{tx.date}</td>
                                    <td className="px-6 py-4 text-right font-bold text-zinc-900">${tx.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};