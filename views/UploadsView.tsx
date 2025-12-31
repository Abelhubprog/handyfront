import React, { useState, useRef, useMemo } from 'react';
import { Search, Upload, FolderOpen, Link as LinkIcon, Trash2, X, FileText, Image as ImageIcon, File, MoreHorizontal, Download, Send, Eye, User, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useOrders } from '../contexts/OrderContext';
import { useVault, VaultFile } from '../contexts/VaultContext';
import { useMessages } from '../contexts/MessageContext';
import { cn } from '../lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const UploadsView = () => {
    const { files, addFile, deleteFile, updateFile } = useVault();
    const { orders } = useOrders();
    const { sendMessage, conversations } = useMessages();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Check for 'order' query param to filter view
    const orderIdParam = searchParams.get('order');

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'user' | 'admin'>('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
    const [selectedOrderForUpload, setSelectedOrderForUpload] = useState<string>(orderIdParam || '');
    
    // Action States
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Filtering Logic ---
    
    const counts = useMemo(() => {
        const baseFiles = orderIdParam ? files.filter(f => f.orderId === orderIdParam) : files;
        return {
            all: baseFiles.length,
            user: baseFiles.filter(f => f.uploadedBy === 'user').length,
            admin: baseFiles.filter(f => f.uploadedBy === 'admin').length
        };
    }, [files, orderIdParam]);

    const filteredFiles = useMemo(() => {
        return files.filter(f => {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query || f.name.toLowerCase().includes(query);
            const matchesFilter = filter === 'all' || f.uploadedBy === filter;
            const matchesOrderParam = orderIdParam ? f.orderId === orderIdParam : true;
            return matchesSearch && matchesFilter && matchesOrderParam;
        });
    }, [files, searchQuery, filter, orderIdParam]);

    // --- Actions ---

    const processFile = (file: File) => {
        const newFile: VaultFile = {
            id: Date.now().toString(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.name.split('.').pop()?.toLowerCase() || 'file',
            date: new Date().toISOString().split('T')[0],
            uploadedBy: 'user',
            orderId: selectedOrderForUpload || undefined
        };
        addFile(newFile);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
            setIsUploadOpen(false);
            if (!orderIdParam) setSelectedOrderForUpload('');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
            setIsUploadOpen(false);
            if (!orderIdParam) setSelectedOrderForUpload('');
        }
    };

    // Refined Actions Handlers
    const handleDownload = (e: React.MouseEvent, file: VaultFile) => {
        e.stopPropagation();
        setActiveMenuId(null);
        alert(`Starting download for ${file.name}...`);
    };

    const handlePreview = (e: React.MouseEvent, file: VaultFile) => {
        e.stopPropagation();
        setActiveMenuId(null);
        alert(`Opening preview for ${file.name}...`);
    };

    const initiateDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActiveMenuId(null);
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (deleteConfirmId) {
            deleteFile(deleteConfirmId);
            if (selectedFile?.id === deleteConfirmId) setSelectedFile(null);
            setDeleteConfirmId(null);
        }
    };

    const handleSendToAdmin = () => {
        if (!selectedFile) return;

        let targetConvoId = 'support'; 
        if (selectedFile.orderId) {
             const orderConvo = conversations.find(c => c.referenceId === selectedFile.orderId);
             if (orderConvo) targetConvoId = orderConvo.id;
        }

        const messageText = `I've uploaded a new file to the vault: ${selectedFile.name}`;
        sendMessage(targetConvoId, messageText);
        navigate(`/app/messages?c=${targetConvoId}`);
    };

    const handleAttachToOrder = (orderId: string) => {
        if (!selectedFile) return;
        const finalOrderId = orderId || undefined;
        updateFile(selectedFile.id, { orderId: finalOrderId });
        setSelectedFile(prev => prev ? { ...prev, orderId: finalOrderId } : null);
    };

    const clearOrderFilter = () => {
        setSearchParams({});
        setSelectedOrderForUpload('');
    };

    const getFileIcon = (type: string) => {
        if (['jpg', 'png', 'jpeg'].includes(type)) return <ImageIcon size={18} className="text-purple-600" />;
        if (['pdf'].includes(type)) return <FileText size={18} className="text-red-600" />;
        if (['doc', 'docx'].includes(type)) return <FileText size={18} className="text-blue-600" />;
        if (['zip', 'rar'].includes(type)) return <FolderOpen size={18} className="text-amber-600" />;
        return <File size={18} className="text-zinc-500" />;
    };

    const activeOrderTitle = orderIdParam ? orders.find(o => o.id === orderIdParam)?.title : null;

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-zinc-50 overflow-hidden relative">
            
            {/* Action Menu Backdrop */}
            {activeMenuId && (
                <div className="fixed inset-0 z-0 cursor-default" onClick={() => setActiveMenuId(null)} />
            )}

            {/* Main Content: File Table */}
            <div className="flex-1 flex flex-col min-w-0">
                 <div className="p-6 md:p-8 border-b border-zinc-200 bg-white">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Vault</h1>
                            <p className="text-zinc-500 text-sm mt-1">Secure storage for all your documents and deliverables.</p>
                        </div>
                        <Button onClick={() => setIsUploadOpen(true)} className="shadow-lg shadow-zinc-900/10">
                            <Upload size={16} className="mr-2" />
                            Upload Files
                        </Button>
                    </div>

                    {orderIdParam && (
                        <div className="mb-4 bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                                <LinkIcon size={16} />
                                <span className="font-medium">Filtering by Order: {activeOrderTitle || orderIdParam}</span>
                            </div>
                            <button onClick={clearOrderFilter} className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                                Clear Filter
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search by filename..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div className="flex p-1 bg-zinc-100 rounded-lg shrink-0 overflow-x-auto">
                            {(['all', 'user', 'admin'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap flex items-center gap-2",
                                        filter === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                                    )}
                                >
                                    {t === 'user' ? 'My Uploads' : t === 'admin' ? 'From Admin' : 'All Files'}
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-full text-[10px]",
                                        filter === t ? "bg-zinc-100 text-zinc-900" : "bg-zinc-200 text-zinc-500"
                                    )}>
                                        {counts[t]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm pb-24 md:pb-0 min-h-[400px]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-zinc-500">Name</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500 hidden xl:table-cell">Type</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500 hidden md:table-cell">Linked Order</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500 hidden lg:table-cell">Uploaded By</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500 hidden sm:table-cell">Date</th>
                                    <th className="px-6 py-3 font-medium text-zinc-500 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredFiles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                            {searchQuery ? (
                                                <span>No files found matching "{searchQuery}".</span>
                                            ) : (
                                                <span>No files found in this category.</span>
                                            )}
                                        </td>
                                    </tr>
                                ) : filteredFiles.map(file => {
                                    const linkedOrder = file.orderId ? orders.find(o => o.id === file.orderId) : undefined;
                                    return (
                                        <tr 
                                            key={file.id} 
                                            className={cn(
                                                "group hover:bg-zinc-50 transition-colors cursor-pointer",
                                                selectedFile?.id === file.id ? "bg-blue-50/50" : ""
                                            )}
                                            onClick={() => setSelectedFile(file)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                                                        {getFileIcon(file.type)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-zinc-900 truncate max-w-[200px] block">{file.name}</span>
                                                        <span className="text-xs text-zinc-500 md:hidden">{file.size}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden xl:table-cell">
                                                <span className="text-xs font-mono uppercase text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                                                    {file.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                {linkedOrder ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        <LinkIcon size={10} />
                                                        {linkedOrder.title}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                                                        Unlinked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                     {file.uploadedBy === 'admin' ? (
                                                         <ShieldCheck size={14} className="text-zinc-900" />
                                                     ) : (
                                                         <User size={14} className="text-zinc-400" />
                                                     )}
                                                     <span className={cn("text-xs capitalize", file.uploadedBy === 'admin' ? "font-medium text-zinc-900" : "text-zinc-600")}>
                                                         {file.uploadedBy}
                                                     </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 hidden sm:table-cell">{file.date}</td>
                                            <td className="px-6 py-4 text-right relative">
                                                <div className="relative z-10 inline-block">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className={cn(
                                                            "h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900 relative",
                                                            activeMenuId === file.id && "bg-zinc-100 text-zinc-900"
                                                        )}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === file.id ? null : file.id);
                                                        }}
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                    
                                                    {activeMenuId === file.id && (
                                                        <div className="absolute right-full top-0 mr-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
                                                            <button 
                                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                                                                onClick={(e) => handlePreview(e, file)}
                                                            >
                                                                <Eye size={14} /> Preview
                                                            </button>
                                                            <button 
                                                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                                                                onClick={(e) => handleDownload(e, file)}
                                                            >
                                                                <Download size={14} /> Download
                                                            </button>
                                                            <div className="h-px bg-zinc-100 my-1" />
                                                            <button 
                                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                                onClick={(e) => initiateDelete(e, file.id)}
                                                            >
                                                                <Trash2 size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>

            {/* File Details Drawer */}
            {selectedFile && (
                <div className="w-full md:w-[350px] bg-white border-l border-zinc-200 h-full flex flex-col shadow-xl absolute md:relative z-20 md:z-auto animate-in slide-in-from-right-10 duration-200">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                        <h3 className="font-semibold text-zinc-900">File Details</h3>
                        <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-500">
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-100">
                                {getFileIcon(selectedFile.type)}
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900 text-center break-all">{selectedFile.name}</h2>
                            <p className="text-sm text-zinc-500 mt-1 uppercase">{selectedFile.type} • {selectedFile.size}</p>
                            <div className="flex items-center gap-1.5 mt-2 bg-zinc-100 px-2.5 py-1 rounded-full">
                                {selectedFile.uploadedBy === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                                <span className="text-xs font-medium text-zinc-700 capitalize">Uploaded by {selectedFile.uploadedBy}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Linked Context</label>
                                {selectedFile.orderId && orders.find(o => o.id === selectedFile.orderId) ? (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg group">
                                        <div className="p-2 bg-white rounded-md border border-zinc-200">
                                            <LinkIcon size={14} className="text-zinc-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-900 truncate">
                                                {orders.find(o => o.id === selectedFile.orderId)?.title}
                                            </p>
                                            <p className="text-xs text-zinc-500">Order #{selectedFile.orderId}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAttachToOrder('');
                                            }}
                                            className="p-1.5 bg-white border border-zinc-200 rounded-md text-zinc-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                                            title="Unlink from Order"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-zinc-500 italic">Not linked to any order.</p>
                                        <select 
                                            className="w-full text-sm p-2 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-1 focus:ring-zinc-300"
                                            onChange={(e) => handleAttachToOrder(e.target.value)}
                                            value=""
                                        >
                                            <option value="" disabled>Link to an order...</option>
                                            {orders.map(o => (
                                                <option key={o.id} value={o.id}>Order #{o.id} - {o.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {selectedFile.notes && (
                                <div>
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Notes</label>
                                    <div className="p-3 bg-amber-50 text-amber-900 text-sm rounded-lg border border-amber-100">
                                        {selectedFile.notes}
                                    </div>
                                </div>
                            )}
                            
                             <div>
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">Actions</label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" onClick={(e) => handlePreview(e, selectedFile)}>
                                        <Eye size={16} className="mr-2 text-zinc-500" /> Preview
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" onClick={(e) => handleDownload(e, selectedFile)}>
                                        <Download size={16} className="mr-2 text-zinc-500" /> Download
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                                        onClick={handleSendToAdmin}
                                    >
                                        <Send size={16} className="mr-2" /> Send to Admin
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-zinc-100">
                         <Button 
                            variant="danger" 
                            className="w-full justify-center"
                            onClick={(e) => initiateDelete(e, selectedFile.id)}
                         >
                            <Trash2 size={16} className="mr-2" /> Delete File
                        </Button>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsUploadOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-zinc-900 mb-1">Upload to Vault</h2>
                        <p className="text-sm text-zinc-500 mb-6">Select files to securely upload to your vault.</p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Link to Order (Optional)</label>
                            <select 
                                className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
                                value={selectedOrderForUpload}
                                onChange={(e) => setSelectedOrderForUpload(e.target.value)}
                            >
                                <option value="">General Storage (No Order)</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>{o.title} (#{o.id})</option>
                                ))}
                            </select>
                        </div>

                        <div 
                            className={cn(
                                "relative group cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all",
                                isDragging ? "border-zinc-900 bg-zinc-50 scale-[1.02]" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3 text-zinc-400 group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <p className="text-sm font-medium text-zinc-900 mb-1">
                                {isDragging ? "Drop files here" : "Click to select or drag file"}
                            </p>
                            <p className="text-xs text-zinc-500">PDF, DOCX, ZIP up to 50MB</p>
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                onChange={handleFileUpload}
                            />
                        </div>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm p-6 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-zinc-900 mb-2">Delete File?</h2>
                            <p className="text-sm text-zinc-500 mb-6">
                                Are you sure you want to delete this file? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                                <Button variant="danger" className="flex-1" onClick={confirmDelete}>Delete</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};