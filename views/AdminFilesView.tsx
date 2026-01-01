import React, { useState, useMemo } from 'react';
import { Search, FolderOpen, FileText, Download, User, Calendar, Filter, MoreVertical, Globe, Lock, Trash2, X, Link as LinkIcon, Eye, ShieldCheck, Image as ImageIcon, File, AlertCircle } from 'lucide-react';
import { useVault, VaultFile } from '../contexts/VaultContext';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

export const AdminFilesView = () => {
    const { files, updateFile, deleteFile } = useVault();
    const { orders } = useOrders();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'user' | 'admin' | 'unlinked'>('all');
    const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Derived State
    const filteredFiles = useMemo(() => {
        return files.filter(f => {
            const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
            let matchesFilter = true;
            
            if (filter === 'user') matchesFilter = f.uploadedBy === 'user';
            if (filter === 'admin') matchesFilter = f.uploadedBy === 'admin';
            if (filter === 'unlinked') matchesFilter = !f.orderId;

            return matchesSearch && matchesFilter;
        });
    }, [files, searchQuery, filter]);

    const stats = useMemo(() => ({
        total: files.length,
        size: files.length * 2.5, // Mock calculation
        orphaned: files.filter(f => !f.orderId).length
    }), [files]);

    // Helpers
    const getFileIcon = (type: string) => {
        if (['jpg', 'png', 'jpeg'].includes(type)) return <ImageIcon size={18} className="text-purple-600" />;
        if (['pdf'].includes(type)) return <FileText size={18} className="text-red-600" />;
        if (['doc', 'docx'].includes(type)) return <FileText size={18} className="text-blue-600" />;
        if (['zip', 'rar'].includes(type)) return <FolderOpen size={18} className="text-amber-600" />;
        return <File size={18} className="text-zinc-500" />;
    };

    const handleLinkOrder = (orderId: string) => {
        if (!selectedFile) return;
        updateFile(selectedFile.id, { orderId: orderId || undefined });
        setSelectedFile(prev => prev ? { ...prev, orderId: orderId || undefined } : null);
    };

    const handleDelete = () => {
        if (deleteConfirmId) {
            deleteFile(deleteConfirmId);
            if (selectedFile?.id === deleteConfirmId) setSelectedFile(null);
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="p-6 md:p-8 bg-white border-b border-zinc-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Global Vault</h1>
                            <p className="text-zinc-500 text-sm mt-1">Audit and manage {stats.total} files across the platform.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs font-medium text-zinc-500">
                                <span className="text-zinc-900 font-bold block text-sm">{stats.size.toFixed(1)} GB</span>
                                Used Storage
                            </div>
                             <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg text-xs font-medium text-amber-700">
                                <span className="text-amber-900 font-bold block text-sm">{stats.orphaned}</span>
                                Orphaned Files
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search globally for filenames..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            />
                        </div>
                        <div className="flex bg-zinc-100 p-1 rounded-lg overflow-x-auto">
                            {[
                                { id: 'all', label: 'All Files' },
                                { id: 'user', label: 'Client Uploads' },
                                { id: 'admin', label: 'Admin Uploads' },
                                { id: 'unlinked', label: 'Unlinked' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id as any)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap",
                                        filter === tab.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-zinc-500">File Name</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500">Context</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500">Owner</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500">Size</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500">Date</th>
                                    <th className="w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredFiles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                            No files found matching your filters.
                                        </td>
                                    </tr>
                                ) : filteredFiles.map(file => (
                                    <tr 
                                        key={file.id} 
                                        className={cn(
                                            "group hover:bg-zinc-50 transition-colors cursor-pointer",
                                            selectedFile?.id === file.id && "bg-blue-50/50"
                                        )}
                                        onClick={() => setSelectedFile(file)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <span className="font-medium text-zinc-900 truncate max-w-[200px]">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {file.orderId ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                                                    <LinkIcon size={10} />
                                                    {file.orderId}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                    Unlinked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 capitalize text-zinc-600">
                                            <div className="flex items-center gap-2">
                                                {file.uploadedBy === 'admin' ? 
                                                    <ShieldCheck size={14} className="text-zinc-900" /> : 
                                                    <Globe size={14} className="text-blue-500" />
                                                }
                                                <span className={cn("text-xs", file.uploadedBy === 'admin' ? "font-bold text-zinc-900" : "")}>
                                                    {file.uploadedBy}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{file.size}</td>
                                        <td className="px-6 py-4 text-zinc-500">{file.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Inspector Drawer */}
            {selectedFile && (
                <div className="w-96 bg-white border-l border-zinc-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right-10 duration-200 z-20">
                    <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <h3 className="font-bold text-zinc-900">File Inspector</h3>
                        <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-zinc-200 rounded-md text-zinc-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Preview Header */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100 shadow-inner">
                                {React.cloneElement(getFileIcon(selectedFile.type) as React.ReactElement<any>, { size: 40 })}
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900 text-center break-all px-4">{selectedFile.name}</h2>
                            <p className="text-sm text-zinc-500 mt-1 uppercase font-medium">{selectedFile.type} • {selectedFile.size}</p>
                        </div>

                        <div className="space-y-6">
                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Uploaded By</label>
                                    <div className="flex items-center gap-2">
                                        {selectedFile.uploadedBy === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                                        <span className="text-sm font-medium capitalize">{selectedFile.uploadedBy}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Upload Date</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span className="text-sm font-medium">{selectedFile.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Linking Section */}
                            <div className="border-t border-zinc-100 pt-6">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <LinkIcon size={14} /> Linked Context
                                </label>
                                
                                <div className="space-y-3">
                                    <select 
                                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 outline-none transition-shadow"
                                        value={selectedFile.orderId || ''}
                                        onChange={(e) => handleLinkOrder(e.target.value)}
                                    >
                                        <option value="">No Active Link (Orphaned)</option>
                                        <optgroup label="Active Orders">
                                            {orders.map(o => (
                                                <option key={o.id} value={o.id}>
                                                    #{o.id} - {o.title.substring(0, 30)}...
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    
                                    {selectedFile.orderId && (
                                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                                            <p className="font-medium mb-1">Linked to Order #{selectedFile.orderId}</p>
                                            <p className="opacity-80">This file is visible in the vault for this specific order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                             {/* Notes Section */}
                             <div className="border-t border-zinc-100 pt-6">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <FileText size={14} /> Admin Notes
                                </label>
                                <textarea 
                                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 outline-none min-h-[100px] resize-none"
                                    placeholder="Add internal notes about this file..."
                                    defaultValue={selectedFile.notes}
                                    onBlur={(e) => updateFile(selectedFile.id, { notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 bg-white" onClick={() => alert('Download')}>
                                <Download size={16} className="mr-2" /> Download
                            </Button>
                            <Button variant="outline" className="flex-1 bg-white" onClick={() => alert('Preview')}>
                                <Eye size={16} className="mr-2" /> Preview
                            </Button>
                        </div>
                        <Button 
                            variant="danger" 
                            className="w-full justify-center" 
                            onClick={() => setDeleteConfirmId(selectedFile.id)}
                        >
                            <Trash2 size={16} className="mr-2" /> Delete File Permanently
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm p-6 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900 mb-2">Delete File?</h2>
                            <p className="text-sm text-zinc-500 mb-6">
                                Are you sure you want to delete this file? This action cannot be undone and will remove it from any linked orders.
                            </p>
                            <div className="flex gap-3 w-full">
                                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
