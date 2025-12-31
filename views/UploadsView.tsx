import React, { useState } from 'react';
import { Search, Upload, FolderOpen, Link as LinkIcon, Trash2, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useOrders } from '../contexts/OrderContext';
import { cn } from '../lib/utils';

interface VaultFile {
    id: string;
    name: string;
    size: string;
    type: string;
    date: string;
    orderId?: string;
}

export const UploadsView = () => {
    const { orders } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [fileToAttach, setFileToAttach] = useState<VaultFile | null>(null);
    
    // Initial mock data
    const [files, setFiles] = useState<VaultFile[]>([
        { id: '1', name: 'lecture_notes_w3.pdf', size: '2.4 MB', type: 'pdf', date: '2 days ago', orderId: orders[0]?.id },
        { id: '2', name: 'rubric_final.docx', size: '1.1 MB', type: 'docx', date: '3 days ago' },
        { id: '3', name: 'research_sources.zip', size: '15 MB', type: 'zip', date: '1 week ago', orderId: orders[1]?.id },
        { id: '4', name: 'draft_v1_comments.pdf', size: '3.5 MB', type: 'pdf', date: '1 day ago' },
        { id: '5', name: 'screenshot_error.png', size: '0.5 MB', type: 'png', date: 'Just now' },
    ]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newFile: VaultFile = {
                id: Date.now().toString(),
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                type: file.name.split('.').pop() || 'file',
                date: 'Just now'
            };
            setFiles([newFile, ...files]);
            setIsUploadOpen(false);
        }
    };

    const handleAttach = (orderId: string) => {
        if (fileToAttach) {
            setFiles(files.map(f => f.id === fileToAttach.id ? { ...f, orderId } : f));
            setFileToAttach(null);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this file?')) {
            setFiles(files.filter(f => f.id !== id));
        }
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const generalFiles = filteredFiles.filter(f => !f.orderId);
    const orderFiles = filteredFiles.filter(f => f.orderId);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen pb-24">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Files Vault</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage, upload, and attach files to your orders.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search files..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                        />
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)} className="shadow-lg shadow-zinc-900/10">
                        <Upload size={16} className="mr-2" />
                        Upload New
                    </Button>
                </div>
            </div>

            <div className="space-y-10">
                {/* Unattached Files Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-2">
                        <FolderOpen size={18} className="text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-900">General Storage</h3>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{generalFiles.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {generalFiles.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50">
                                <p className="text-sm">No general files found.</p>
                                <button onClick={() => setIsUploadOpen(true)} className="text-sm text-blue-600 font-medium hover:underline mt-1">Upload a file</button>
                            </div>
                        ) : generalFiles.map(file => (
                             <FileCard 
                                key={file.id} 
                                file={file} 
                                onAttach={() => setFileToAttach(file)} 
                                onDelete={() => handleDelete(file.id)} 
                             />
                        ))}
                    </div>
                </section>

                {/* Attached to Orders Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-2">
                        <LinkIcon size={18} className="text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-900">Attached to Orders</h3>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{orderFiles.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {orderFiles.length === 0 ? (
                             <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50">
                                <p className="text-sm">No attached files found.</p>
                            </div>
                        ) : orderFiles.map(file => (
                            <FileCard 
                                key={file.id} 
                                file={file} 
                                orderName={orders.find(o => o.id === file.orderId)?.title}
                                onAttach={() => setFileToAttach(file)} 
                                onDelete={() => handleDelete(file.id)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Upload Modal Overlay */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6 relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsUploadOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-zinc-900 mb-1">Upload to Vault</h2>
                        <p className="text-sm text-zinc-500 mb-6">Files will be added to General Storage initially.</p>
                        
                        <div className="relative group cursor-pointer">
                            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-10 flex flex-col items-center justify-center text-center group-hover:border-zinc-400 group-hover:bg-zinc-50 transition-all">
                                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400 group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 mb-1">Click to browse files</p>
                                <p className="text-xs text-zinc-500">PDF, DOCX, ZIP up to 50MB</p>
                            </div>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleFileUpload}
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="mr-2">Cancel</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Attach Modal Overlay */}
            {fileToAttach && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                     <Card className="w-full max-w-sm p-0 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                            <div>
                                <h2 className="font-semibold text-zinc-900 text-sm">Attach File</h2>
                                <p className="text-xs text-zinc-500 truncate max-w-[200px]">{fileToAttach.name}</p>
                            </div>
                            <button onClick={() => setFileToAttach(null)} className="text-zinc-400 hover:text-zinc-900"><X size={18} /></button>
                        </div>
                        <div className="p-2 overflow-y-auto">
                            <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Select Order</p>
                            {orders.map(order => (
                                <button 
                                    key={order.id}
                                    onClick={() => handleAttach(order.id)}
                                    className="w-full text-left px-3 py-3 hover:bg-zinc-100 rounded-lg flex items-center justify-between group transition-colors"
                                >
                                    <div className="min-w-0 pr-2">
                                        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 block truncate">{order.title}</span>
                                        <span className="text-xs text-zinc-500">{order.service}</span>
                                    </div>
                                    <span className="text-[10px] font-mono bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded flex-shrink-0">#{order.id.split('-')[1]}</span>
                                </button>
                            ))}
                        </div>
                     </Card>
                </div>
            )}
        </div>
    );
};

const FileCard = ({ file, orderName, onAttach, onDelete }: { file: VaultFile, orderName?: string, onAttach: () => void, onDelete: () => void }) => {
    const getIcon = (type: string) => {
        if (['jpg', 'png', 'jpeg'].includes(type)) return <ImageIcon size={20} />;
        if (['pdf', 'doc', 'docx'].includes(type)) return <FileText size={20} />;
        return <File size={20} />;
    };

    return (
        <Card className="p-4 group hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {getIcon(file.type)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50" onClick={onDelete}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
            
            <div className="mb-auto">
                <h4 className="font-medium text-sm text-zinc-900 truncate mb-1" title={file.name}>{file.name}</h4>
                <p className="text-xs text-zinc-500 font-medium">{file.size} • {file.date}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-50">
                {orderName ? (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1.5 rounded-md mb-3 truncate w-full" title={`Attached to: ${orderName}`}>
                        <LinkIcon size={12} className="shrink-0" />
                        <span className="truncate font-medium">{orderName}</span>
                    </div>
                ) : (
                    <div className="h-[34px] mb-3 flex items-center text-xs text-zinc-400 italic px-1">
                        Not attached
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs font-medium">
                        Download
                    </Button>
                    {!orderName && (
                        <Button variant="secondary" size="sm" className="h-8 px-2.5 text-zinc-500 hover:text-zinc-900" onClick={onAttach} title="Attach to Order">
                            <LinkIcon size={14} />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
