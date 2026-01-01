import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { AlertCircle, CheckCircle2, Upload, CreditCard, MessageSquare, Download } from 'lucide-react';

export type NextActionType = "pay" | "upload" | "download" | "reply" | "none";

interface NextActionBannerProps {
    type: NextActionType;
    title: string;
    description: string;
    ctaLabel: string;
    onCta: () => void;
    className?: string;
}

const icons = {
    pay: CreditCard,
    upload: Upload,
    download: Download,
    reply: MessageSquare,
    none: AlertCircle
};

export const NextActionBanner = ({ type, title, description, ctaLabel, onCta, className }: NextActionBannerProps) => {
    const Icon = icons[type];
    
    // Tone mapping
    const tones = {
        pay: "bg-warning/10 border-warning/20 text-warning-900",
        upload: "bg-info/10 border-info/20 text-info-900",
        download: "bg-success/10 border-success/20 text-success-900",
        reply: "bg-surface2 border-border text-text",
        none: "bg-surface2"
    };
    
    return (
        <div className={cn("flex items-center justify-between p-4 rounded-xl border", tones[type], className)}>
            <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg bg-white/50 backdrop-blur-sm shrink-0")}>
                    <Icon size={18} className="opacity-80" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-0.5 opacity-90">{title}</h4>
                    <p className="text-xs opacity-70 leading-relaxed max-w-md">{description}</p>
                </div>
            </div>
            <Button 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); onCta(); }}
                className={cn("shrink-0 ml-4", type === 'pay' ? "bg-warning text-white hover:bg-yellow-600" : "")}
            >
                {ctaLabel}
            </Button>
        </div>
    );
};