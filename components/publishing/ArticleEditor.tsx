import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Globe, Calendar, Eye, MoreHorizontal } from 'lucide-react';
import { Article, Block, usePublishing } from '../../contexts/PublishingContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BlocksBuilder } from './BlocksBuilder';
import { cn } from '../../lib/utils';

interface ArticleEditorProps {
  article?: Article;
  onBack: () => void;
}

export const ArticleEditor = ({ article: initialArticle, onBack }: ArticleEditorProps) => {
  const { currentDomain, saveArticle } = usePublishing();
  
  // Initialize state (create new if no article passed)
  const [article, setArticle] = useState<Article>(initialArticle || {
    id: Date.now().toString(),
    domainId: currentDomain.id,
    title: '',
    slug: '',
    status: 'draft',
    author: 'Admin', // In real app, fetch from auth
    seo: { title: '', description: '' },
    blocks: []
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        saveArticle(article);
        setIsSaving(false);
    }, 800);
  };

  const updateBlocks = (blocks: Block[]) => {
    setArticle(prev => ({ ...prev, blocks }));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50">
      {/* Editor Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-zinc-200" />
            <div className="flex items-center gap-2 px-2 py-1 bg-zinc-100 rounded text-xs font-medium text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                {currentDomain.hostname}
            </div>
            <span className="text-zinc-300">/</span>
            <span className="text-sm font-medium text-zinc-500">{article.status === 'draft' ? 'Draft' : 'Published'}</span>
        </div>

        <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 mr-2">{isSaving ? 'Saving...' : 'Saved'}</span>
            <Button variant="ghost" size="sm">
                <Eye size={16} className="mr-2" /> Preview
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
                <Save size={16} className="mr-2" /> Save
            </Button>
            <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full">
                <MoreHorizontal size={20} />
            </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden flex">
          
          {/* Center Canvas */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="max-w-3xl mx-auto space-y-8">
                  {/* Title & Slug */}
                  <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Article Title" 
                        className="w-full text-4xl font-bold font-serif text-zinc-900 placeholder:text-zinc-300 border-none bg-transparent focus:ring-0 px-0"
                        value={article.title}
                        onChange={(e) => setArticle({...article, title: e.target.value})}
                      />
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Globe size={14} />
                          <span>https://{currentDomain.hostname}/article/</span>
                          <input 
                            type="text" 
                            placeholder="url-slug" 
                            className="bg-transparent border-b border-transparent hover:border-zinc-200 focus:border-zinc-900 focus:outline-none text-zinc-600"
                            value={article.slug}
                            onChange={(e) => setArticle({...article, slug: e.target.value})}
                          />
                      </div>
                  </div>

                  {/* Cover Image Placeholder */}
                  <div className="aspect-video bg-zinc-100 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                          <div className="w-6 h-6 bg-zinc-200 rounded" /> 
                      </div>
                      <span className="text-sm font-medium">Add Cover Image</span>
                  </div>

                  {/* Blocks Editor */}
                  <BlocksBuilder blocks={article.blocks} onChange={updateBlocks} />
              </div>
          </div>

          {/* Right Sidebar: Settings */}
          <div className="w-80 bg-white border-l border-zinc-200 overflow-y-auto hidden xl:block p-6 space-y-8">
              
              {/* Publish Panel */}
              <section className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Publishing</h3>
                  <Card className="p-4 space-y-4 bg-zinc-50/50">
                      <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-zinc-700">Status</label>
                          <select 
                            className="text-sm bg-white border border-zinc-200 rounded px-2 py-1"
                            value={article.status}
                            onChange={(e) => setArticle({...article, status: e.target.value as any})}
                          >
                              <option value="draft">Draft</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="published">Published</option>
                          </select>
                      </div>
                      <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                              <Calendar size={14} /> Date
                          </label>
                          <input 
                            type="date" 
                            className="text-sm bg-white border border-zinc-200 rounded px-2 py-1 w-32"
                            value={article.publishedAt || ''}
                            onChange={(e) => setArticle({...article, publishedAt: e.target.value})}
                          />
                      </div>
                      <Button className="w-full">
                          {article.status === 'published' ? 'Update' : 'Publish Now'}
                      </Button>
                  </Card>
              </section>

              {/* SEO Panel */}
              <section className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">SEO Settings</h3>
                  <div className="space-y-3">
                      <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Meta Title</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-white border border-zinc-200 rounded text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
                            value={article.seo.title}
                            onChange={(e) => setArticle({...article, seo: {...article.seo, title: e.target.value}})}
                            placeholder={article.title || "Page Title"}
                          />
                          <p className="text-[10px] text-zinc-400 mt-1 text-right">{article.seo.title.length}/60</p>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Meta Description</label>
                          <textarea 
                            className="w-full p-2 bg-white border border-zinc-200 rounded text-sm focus:ring-2 focus:ring-zinc-900 outline-none h-24 resize-none"
                            value={article.seo.description}
                            onChange={(e) => setArticle({...article, seo: {...article.seo, description: e.target.value}})}
                            placeholder="Summarize the article..."
                          />
                          <p className="text-[10px] text-zinc-400 mt-1 text-right">{article.seo.description.length}/160</p>
                      </div>
                  </div>
                  
                  {/* SERP Preview */}
                  <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                      <p className="text-xs font-medium text-zinc-400 mb-2">Google Preview</p>
                      <div className="font-sans">
                          <p className="text-xs text-zinc-500 truncate">{currentDomain.hostname} › article › {article.slug || 'slug'}</p>
                          <p className="text-sm text-[#1a0dab] truncate font-medium hover:underline cursor-pointer">{article.seo.title || article.title || 'Page Title'}</p>
                          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                              {article.seo.description || "This is how your article description will appear in search results. Make it catchy and relevant."}
                          </p>
                      </div>
                  </div>
              </section>

          </div>
      </div>
    </div>
  );
};