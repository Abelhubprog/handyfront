import React, { useState } from 'react';
import { Plus, Search, FileText, Globe, MoreVertical, Edit3, Trash2, Eye } from 'lucide-react';
import { usePublishing, Article } from '../contexts/PublishingContext';
import { DomainSelector } from '../components/publishing/DomainSelector';
import { ArticleEditor } from '../components/publishing/ArticleEditor';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/system/StatusChip';
import { cn } from '../lib/utils';

export const AdminPublishingView = () => {
  const { currentDomain, getArticlesByDomain, deleteArticle } = usePublishing();
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const articles = getArticlesByDomain(currentDomain.id).filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (article: Article) => {
      setEditingArticle(article);
      setViewMode('editor');
  };

  const handleCreate = () => {
      setEditingArticle(undefined);
      setViewMode('editor');
  };

  const handleBack = () => {
      setEditingArticle(undefined);
      setViewMode('list');
  };

  if (viewMode === 'editor') {
      return <ArticleEditor article={editingArticle} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 bg-white border-b border-zinc-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Publishing</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage articles and pages for your domains.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <DomainSelector />
                    <Button onClick={handleCreate}>
                        <Plus size={18} className="mr-2" />
                        New Article
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-lg">
                    {['All', 'Draft', 'Published'].map(t => (
                        <button key={t} className="px-4 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white rounded-md transition-all">
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-zinc-500 w-[45%]">Article</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Author</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Date</th>
                            <th className="px-6 py-3 font-medium text-zinc-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                                            <FileText size={24} className="opacity-50" />
                                        </div>
                                        <p>No articles found for {currentDomain.name}.</p>
                                        <Button variant="ghost" size="sm" className="mt-2" onClick={handleCreate}>Create one now</Button>
                                    </div>
                                </td>
                            </tr>
                        ) : articles.map(article => (
                            <tr key={article.id} className="group hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-zinc-900 truncate max-w-sm">{article.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-zinc-400 font-mono">/{article.slug}</span>
                                            <a href={`https://${currentDomain.hostname}/article/${article.slug}`} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-blue-600 transition-colors">
                                                <Globe size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                        article.status === 'published' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                                        article.status === 'scheduled' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-zinc-100 text-zinc-600 border-zinc-200"
                                    )}>
                                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-600">
                                    {article.author}
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {article.publishedAt || '—'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(article)} className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => {}} className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors" title="Preview">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => deleteArticle(article.id)} className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};