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
        pay: "bg-amber-50 border-amber-100 text-amber-900",
        upload: "bg-blue-50 border-blue-100 text-blue-900",
        download: "bg-emerald-50 border-emerald-100 text-emerald-900",
        reply: "bg-zinc-50 border-zinc-100 text-zinc-900",
        none: "bg-zinc-50"
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
                className={cn("shrink-0 ml-4", type === 'pay' ? "bg-amber-500 text-white hover:bg-amber-600 border-transparent shadow-none" : "bg-white border-black/5 hover:bg-white/80 text-black")}
            >
                {ctaLabel}
            </Button>
        </div>
    );
};