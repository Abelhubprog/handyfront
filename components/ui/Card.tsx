import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden", className)} {...props}>
    {children}
  </div>
);