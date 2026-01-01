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
        <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-dashed border-border rounded-xl", className)}>
            {icon && <div className="mb-4 text-muted opacity-50">{icon}</div>}
            <h3 className="text-lg font-medium text-text mb-1">{title}</h3>
            {description && <p className="text-sm text-muted max-w-xs mx-auto mb-6">{description}</p>}
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
};