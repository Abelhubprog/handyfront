import React from 'react';
import { cn } from '../../lib/utils';
import { OrderStatus } from '../../types';

export const Badge = ({ status }: { status: OrderStatus }) => {
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
