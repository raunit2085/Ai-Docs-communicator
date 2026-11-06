'use client';

import React, { useState, useRef } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  FolderKanban,
  FileSpreadsheet,
  FileCode,
  FileCheck
} from 'lucide-react';
import { FileType } from '@/types';

export function UploadModal() {
  const { 
    isUploadOpen, 
    setIsUploadOpen, 
    collections, 
    uploadDocument 
  } = useKnowledgeOS();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>(collections[0]?.id || '');
  const [uploadQueue, setUploadQueue] = useState<Array<{
    file: File;
    status: 'pending' | 'uploading' | 'extracting' | 'chunking' | 'embedding' | 'indexed' | 'failed';
    progress: number;
    error?: string;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map(file => ({
      file,
      status: 'pending' as const,
      progress: 0,
    }));
    setUploadQueue(prev => [...prev, ...newItems]);
  };

  const startUploadAll = async () => {
    if (uploadQueue.length === 0 || isProcessing) return;
    setIsProcessing(true);

    for (let i = 0; i < uploadQueue.length; i++) {
      const item = uploadQueue[i];
      if (item.status === 'indexed') continue;

      // Update item to uploading
      updateQueueItem(i, { status: 'uploading', progress: 20 });

      // Read file content
      try {
        let content = '';
        const ext = item.file.name.split('.').pop()?.toLowerCase() || 'txt';
        const fileType = mapExtensionToFileType(ext);

        if (['txt', 'md', 'csv', 'json'].includes(fileType)) {
          content = await readFileAsText(item.file);
        } else {
          // For binary PDF/DOCX in demo, create structured realistic extracted text based on file name
          content = generateSampleExtractedContent(item.file.name, fileType);
        }

        updateQueueItem(i, { status: 'extracting', progress: 50 });
        await new Promise(r => setTimeout(r, 400));

        updateQueueItem(i, { status: 'chunking', progress: 75 });
        await new Promise(r => setTimeout(r, 400));

        updateQueueItem(i, { status: 'embedding', progress: 90 });
        
        await uploadDocument({
          name: item.file.name,
          size: item.file.size,
          content,
          type: fileType,
          collectionId: selectedCollection || undefined,
        });

        updateQueueItem(i, { status: 'indexed', progress: 100 });
      } catch (err: any) {
        updateQueueItem(i, { status: 'failed', error: err.message || 'Processing failed' });
      }
    }

    setIsProcessing(false);
  };

  const updateQueueItem = (index: number, updates: Partial<typeof uploadQueue[0]>) => {
    setUploadQueue(prev => prev.map((item, idx) => idx === index ? { ...item, ...updates } : item));
  };

  const removeQueueItem = (index: number) => {
    setUploadQueue(prev => prev.filter((_, idx) => idx !== index));
  };

  const mapExtensionToFileType = (ext: string): FileType => {
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'docx':
      case 'doc': return 'docx';
      case 'csv': return 'csv';
      case 'xlsx':
      case 'xls': return 'xlsx';
      case 'pptx':
      case 'ppt': return 'pptx';
      case 'md':
      case 'markdown': return 'md';
      default: return 'txt';
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const generateSampleExtractedContent = (fileName: string, type: FileType): string => {
    return `${fileName.toUpperCase()} — INGESTED KNOWLEDGE ASSET

Page 1: Document Overview & Executive Summary
This document was ingested into KnowledgeOS on ${new Date().toLocaleDateString()}. 
It establishes verified parameters, operational requirements, and technical benchmarks across corporate workflows.

Page 2: Key Operational Specifications & SLAs
- Document format verified: ${type.toUpperCase()}
- Uptime guarantee target: 99.9%
- Encryption standard: AES-256-GCM enforced across all chunks.

Page 3: Strategic Milestones & Deadlines
Target implementation timeline is set for Q4 fiscal completion. Full compliance audit will be conducted by enterprise reviewers.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-modal overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Upload size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Upload Knowledge Documents</h2>
              <p className="text-[11px] text-muted-foreground">Supported: PDF, DOCX, Markdown, Plain Text, CSV, XLSX, PPTX</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-elevated"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Collection Selector */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-card-elevated/40 border border-border">
            <div className="flex items-center gap-2 text-xs text-foreground font-medium">
              <FolderKanban size={15} className="text-accent" />
              <span>Assign to Collection:</span>
            </div>
            <select
              value={selectedCollection}
              onChange={e => setSelectedCollection(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
            >
              <option value="">No Collection (General Library)</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-accent bg-accent/5' 
                : 'border-border hover:border-accent/50 bg-card-elevated/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.md,.markdown,.csv,.xlsx,.pptx"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
              <Upload size={22} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Click to browse or drag and drop files here
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Documents are automatically parsed, chunked, and embedded into 128-dim vectors.
            </p>
          </div>

          {/* Queue List */}
          {uploadQueue.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-1">
                <span>Upload Queue ({uploadQueue.length})</span>
                {uploadQueue.every(i => i.status === 'indexed') && (
                  <span className="text-success text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> All files indexed successfully
                  </span>
                )}
              </div>

              {uploadQueue.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border bg-card flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={16} className="text-accent flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-foreground truncate">{item.file.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{(item.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.status === 'indexed' && (
                      <span className="text-success font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 size={13} /> Indexed
                      </span>
                    )}
                    {item.status !== 'indexed' && item.status !== 'pending' && (
                      <span className="text-accent font-medium flex items-center gap-1.5 text-[11px] animate-pulse">
                        <RefreshCw size={12} className="animate-spin" />
                        <span className="capitalize">{item.status}...</span>
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <button
                        onClick={() => removeQueueItem(idx)}
                        className="text-muted-foreground hover:text-error p-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-card-elevated/40 flex items-center justify-between">
          <button
            onClick={() => setIsUploadOpen(false)}
            className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {uploadQueue.some(i => i.status === 'indexed') ? 'Done' : 'Cancel'}
          </button>

          <button
            onClick={startUploadAll}
            disabled={uploadQueue.length === 0 || isProcessing || uploadQueue.every(i => i.status === 'indexed')}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Processing & Vectorizing...</span>
              </>
            ) : (
              <>
                <Upload size={13} />
                <span>Start Ingestion & Indexing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
