import React from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-dashed border-zinc-200 rounded-xl", className)}>
            {icon && <div className="mb-4 text-zinc-300 bg-zinc-50 p-4 rounded-full">{icon}</div>}
            <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-6 leading-relaxed">{description}</p>}
            {action && (
                <Button onClick={action.onClick} className="shadow-lg shadow-zinc-900/10">
                    {action.label}
                </Button>
            )}
        </div>
    );
};