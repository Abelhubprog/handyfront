import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { View } from '../types';

export const ArticleView = ({ setView }: { setView: (v: View) => void }) => (
    <div className="max-w-3xl mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => setView('home')} className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600">
            <ArrowRight className="rotate-180 mr-2" size={16} /> Back to Home
        </Button>
        <article className="prose prose-zinc prose-lg">
            <span className="text-blue-600 font-medium text-sm tracking-wider uppercase mb-4 block">Writing Tips</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-6">How to structure a PhD dissertation efficiently</h1>
            <div className="flex items-center gap-3 mb-10 text-zinc-500 text-sm">
                <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
                <span>By Dr. Sarah Jenkins</span>
                <span>•</span>
                <span>8 min read</span>
            </div>
            
            <p className="text-xl text-zinc-600 leading-relaxed mb-8 font-serif">
                The blank page is the enemy of the academic. When staring down the barrel of a 80,000 word requirement, structure isn't just helpful—it's a survival mechanism.
            </p>

            <div className="my-8 p-6 bg-zinc-50 border-l-4 border-zinc-900 rounded-r-xl">
                <p className="font-medium text-zinc-900 italic">"Research is formalized curiosity. It is poking and prying with a purpose."</p>
                <p className="mt-2 text-sm text-zinc-500">— Zora Neale Hurston</p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">1. The Macro Structure</h2>
            <p className="text-zinc-700 leading-7 mb-4">
                Most universities follow a rigid structure. Don't fight it. Innovation in structure is rarely rewarded in academic contexts; innovation in content is.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 marker:text-zinc-300">
                <li><strong>Introduction:</strong> The promise you make to the reader.</li>
                <li><strong>Literature Review:</strong> Proving you've done your homework.</li>
                <li><strong>Methodology:</strong> How you built the machine.</li>
                <li><strong>Results:</strong> What the machine produced.</li>
                <li><strong>Discussion:</strong> What it all means.</li>
            </ul>
        </article>
    </div>
);
