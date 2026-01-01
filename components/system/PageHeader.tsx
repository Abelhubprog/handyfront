import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8", className)}>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">{title}</h1>
                {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
};