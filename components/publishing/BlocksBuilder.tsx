import React from 'react';
import { Image, Quote, Type, MousePointerClick, X, GripVertical, Plus } from 'lucide-react';
import { Block } from '../../contexts/PublishingContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface BlocksBuilderProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export const BlocksBuilder = ({ blocks, onChange }: BlocksBuilderProps) => {
  
  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'quote' ? { text: '', author: '' } : type === 'cta' ? { label: 'Start Order', url: '/app/new' } : ''
    };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="group relative border border-zinc-200 rounded-xl bg-white p-4 hover:border-zinc-300 transition-colors">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300 cursor-move opacity-0 group-hover:opacity-100">
                <GripVertical size={16} />
            </div>
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => removeBlock(block.id)} className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded">
                    <X size={16} />
                </button>
            </div>
            
            <div className="pl-6 pr-8">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {block.type === 'richText' && <><Type size={14} /> Rich Text</>}
                    {block.type === 'image' && <><Image size={14} /> Image</>}
                    {block.type === 'quote' && <><Quote size={14} /> Quote</>}
                    {block.type === 'cta' && <><MousePointerClick size={14} /> CTA Button</>}
                </div>

                {/* Block Inputs */}
                {block.type === 'richText' && (
                    <textarea 
                        className="w-full min-h-[120px] resize-y p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Type your content here..."
                    />
                )}

                {block.type === 'image' && (
                    <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center bg-zinc-50">
                        <div className="flex flex-col items-center justify-center">
                            <Image size={24} className="text-zinc-300 mb-2" />
                            <p className="text-sm text-zinc-500">Click to upload or drag image</p>
                        </div>
                    </div>
                )}

                {block.type === 'quote' && (
                    <div className="space-y-3">
                        <textarea 
                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-lg font-serif italic focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            value={block.content.text}
                            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                            placeholder="Quote text..."
                        />
                        <input 
                            type="text" 
                            className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm"
                            value={block.content.author}
                            onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
                            placeholder="— Author Name"
                        />
                    </div>
                )}

                {block.type === 'cta' && (
                    <div className="flex gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Button Label</label>
                            <input 
                                type="text" 
                                className="w-full p-2 bg-white border border-zinc-200 rounded text-sm"
                                value={block.content.label}
                                onChange={(e) => updateBlock(block.id, { ...block.content, label: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Target URL</label>
                            <input 
                                type="text" 
                                className="w-full p-2 bg-white border border-zinc-200 rounded text-sm"
                                value={block.content.url}
                                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Block Menu */}
      <div className="py-6 border-t border-zinc-100">
          <p className="text-center text-xs text-zinc-400 font-medium mb-4 uppercase tracking-wider">Insert Block</p>
          <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => addBlock('richText')}>
                  <Type size={16} className="mr-2 text-zinc-500" /> Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock('image')}>
                  <Image size={16} className="mr-2 text-zinc-500" /> Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock('quote')}>
                  <Quote size={16} className="mr-2 text-zinc-500" /> Quote
              </Button>
              <Button variant="outline" size="sm" onClick={() => addBlock('cta')}>
                  <MousePointerClick size={16} className="mr-2 text-zinc-500" /> CTA
              </Button>
          </div>
      </div>
    </div>
  );
};