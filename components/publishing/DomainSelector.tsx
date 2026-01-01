import React, { useState } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { usePublishing, Domain } from '../../contexts/PublishingContext';
import { cn } from '../../lib/utils';

export const DomainSelector = () => {
  const { domains, currentDomain, setDomain } = usePublishing();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors w-full md:min-w-[240px]"
      >
        <div className="w-6 h-6 bg-zinc-900 text-white rounded flex items-center justify-center text-xs font-serif font-bold">
            {currentDomain.icon}
        </div>
        <div className="flex-1 text-left">
            <p className="text-sm font-medium text-zinc-900 leading-none">{currentDomain.name}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{currentDomain.hostname}</p>
        </div>
        <ChevronDown size={16} className="text-zinc-400" />
      </button>

      {isOpen && (
        <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-40 p-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Select Domain</div>
                {domains.map(domain => (
                    <button
                        key={domain.id}
                        onClick={() => {
                            setDomain(domain.id);
                            setIsOpen(false);
                        }}
                        className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors",
                            currentDomain.id === domain.id ? "bg-zinc-50" : "hover:bg-zinc-50"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center text-sm font-serif font-bold",
                            currentDomain.id === domain.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                        )}>
                            {domain.icon}
                        </div>
                        <div className="flex-1">
                            <p className={cn("text-sm font-medium", currentDomain.id === domain.id ? "text-zinc-900" : "text-zinc-700")}>
                                {domain.name}
                            </p>
                            <p className="text-xs text-zinc-500">{domain.hostname}</p>
                        </div>
                        {currentDomain.id === domain.id && <Check size={16} className="text-zinc-900" />}
                    </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <button className="flex items-center gap-2 w-full p-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Globe size={14} />
                    Manage Domains
                </button>
            </div>
        </>
      )}
    </div>
  );
};