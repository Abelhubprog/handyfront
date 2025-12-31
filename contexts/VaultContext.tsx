import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useOrders } from './OrderContext';

export interface VaultFile {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  uploadedBy: 'user' | 'admin';
  orderId?: string; // Linked order
  notes?: string;
}

interface VaultContextType {
  files: VaultFile[];
  addFile: (file: VaultFile) => void;
  deleteFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<VaultFile>) => void;
  getFilesByOrder: (orderId: string) => VaultFile[];
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const { orders } = useOrders();
  const processedOrderIds = useRef<Set<string>>(new Set());
  const isInitialized = useRef(false);

  // Initial Mock Data
  const [files, setFiles] = useState<VaultFile[]>([
    { 
        id: '1', 
        name: 'lecture_notes_w3.pdf', 
        size: '2.4 MB', 
        type: 'pdf', 
        date: '2023-10-24', 
        uploadedBy: 'user', 
        orderId: 'ORD-2491',
        notes: 'Chapter 3 is most important.'
    },
    { 
        id: '2', 
        name: 'rubric_final.docx', 
        size: '1.1 MB', 
        type: 'docx', 
        date: '2023-10-22', 
        uploadedBy: 'user' 
    },
    { 
        id: '3', 
        name: 'research_sources.zip', 
        size: '15 MB', 
        type: 'zip', 
        date: '2023-10-20', 
        uploadedBy: 'user', 
        orderId: 'ORD-2491' 
    },
    { 
        id: '4', 
        name: 'draft_v1_comments.pdf', 
        size: '3.5 MB', 
        type: 'pdf', 
        date: '2023-10-26', 
        uploadedBy: 'admin',
        orderId: 'ORD-2494',
        notes: 'Please review the comments on page 5.'
    },
  ]);

  // Sync: Automatically create initial vault structure for new orders
  useEffect(() => {
    // Initialize processed IDs on first mount to avoid processing existing mock data
    if (!isInitialized.current) {
        orders.forEach(o => processedOrderIds.current.add(o.id));
        isInitialized.current = true;
        return;
    }

    // Detect New Orders
    const newOrders = orders.filter(o => !processedOrderIds.current.has(o.id));

    if (newOrders.length > 0) {
        const newFilesToAdd: VaultFile[] = [];

        newOrders.forEach(order => {
            // Create a default "Requirements" file for the new order
            const newFile: VaultFile = {
                id: `auto-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: `Requirements - ${order.title.substring(0, 15)}...txt`,
                size: '0.1 KB',
                type: 'txt',
                date: new Date().toISOString().split('T')[0],
                uploadedBy: 'user',
                orderId: order.id,
                notes: 'Automatically generated from order details.'
            };

            newFilesToAdd.push(newFile);
            processedOrderIds.current.add(order.id);
        });

        if (newFilesToAdd.length > 0) {
            setFiles(prev => [...newFilesToAdd, ...prev]);
        }
    }
  }, [orders]);

  const addFile = (file: VaultFile) => {
    setFiles(prev => [file, ...prev]);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<VaultFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const getFilesByOrder = (orderId: string) => {
    return files.filter(f => f.orderId === orderId);
  };

  return (
    <VaultContext.Provider value={{ files, addFile, deleteFile, updateFile, getFilesByOrder }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};