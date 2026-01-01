import React from 'react';
import { cn } from '../../lib/utils';

export type StatusChipKind = 'order' | 'payment' | 'message';

const styles: Record<string, string> = {
    // Orders
    draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
    pending_payment: "bg-warning/10 text-amber-700 border-warning/20",
    in_progress: "bg-primary/10 text-primary border-primary/20",
    review: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-success/10 text-success border-success/20",
    completed: "bg-zinc-100 text-zinc-600 border-zinc-200",
    cancelled: "bg-zinc-50 text-zinc-400 border-zinc-200",
    
    // Payments
    paid: "bg-success/10 text-success border-success/20",
    unpaid: "bg-warning/10 text-warning border-warning/20",
    
    // Default
    default: "bg-surface2 text-muted border-border"
};

const labels: Record<string, string> = {
    draft: 'Draft',
    pending_payment: 'Action Required',
    in_progress: 'In Progress',
    review: 'Under Review',
    delivered: 'Delivered',
    completed: 'Completed',
};

export const StatusChip = ({ status, className }: { status: string, className?: string }) => {
    const styleClass = styles[status] || styles.default;
    const label = labels[status] || status.replace('_', ' ');

    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap", styleClass, className)}>
            {label}
        </span>
    );
};