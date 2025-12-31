import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);
