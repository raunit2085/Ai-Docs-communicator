'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  FileText, 
  Upload, 
  Search, 
  Grid, 
  List, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  MessageSquare, 
  MoreVertical, 
  Layers, 
  Wrench, 
  FolderKanban,
  CheckSquare,
  Square
} from 'lucide-react';
import { FileType, ProcessingStatus } from '@/types';

export function DocumentLibrary() {
  const { 
    documents, 
    collections, 
    deleteDocument, 
    retryDocumentProcessing, 
    setSelectedDocForDetail, 
    setIsUploadOpen,
    setActiveView,
    createNewConversation,
    setActiveToolDoc,
    toggleDocForComparison,
    comparisonDocs
  } = useKnowledgeOS();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);

  // Filtering & Sorting
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = !searchFilter || 
      doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCol = selectedCollection === 'all' || doc.collectionId === selectedCollection;
    const matchesType = selectedType === 'all' || doc.fileType === selectedType;
    return matchesSearch && matchesCol && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'size') return b.fileSize - a.fileSize;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const toggleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedDocIds.length} documents?`)) {
      selectedDocIds.forEach(id => deleteDocument(id));
      setSelectedDocIds([]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl mx-auto space-y-6 animate-in fade-in-50">
      {/* Header & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FileText size={20} className="text-accent" />
            <span>Document Library</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, index, inspect, and organize your enterprise knowledge assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedDocIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-error/10 text-error border border-error/20 hover:bg-error/20 text-xs font-medium transition-colors"
            >
              <Trash2 size={13} />
              <span>Delete ({selectedDocIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium text-xs shadow-sm hover:opacity-95 transition-all"
          >
            <Upload size={14} />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-subtle">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search documents by title, tags, or content..."
            className="w-full bg-card-elevated/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
        </div>

        {/* Collection Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="bg-card-elevated/50 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          >
            <option value="all">All Collections</option>
            {collections.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>

          {/* File Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-card-elevated/50 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="docx">Word (.docx)</option>
            <option value="md">Markdown (.md)</option>
            <option value="txt">Plain Text (.txt)</option>
            <option value="csv">CSV Data (.csv)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-card-elevated/50 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-card-elevated/40 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground'}`}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'list' ? 'bg-card text-foreground shadow-subtle' : 'text-muted-foreground'}`}
              title="List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Select All Row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <button 
          onClick={toggleSelectAll} 
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          {selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
            <CheckSquare size={14} className="text-accent" />
          ) : (
            <Square size={14} />
          )}
          <span>Select All ({filteredDocs.length} files)</span>
        </button>
        <span>Showing {filteredDocs.length} documents</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => {
            const isSelected = selectedDocIds.includes(doc.id);
            const isComparing = comparisonDocs.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForDetail(doc)}
                className={`group relative p-4 rounded-xl border bg-card hover:border-accent/40 cursor-pointer transition-all shadow-subtle flex flex-col justify-between ${
                  isSelected ? 'border-accent ring-1 ring-accent' : 'border-border'
                }`}
              >
                <div>
                  {/* Top Bar with file badge, checkbox & quick tools */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectDoc(doc.id);
                        }}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {isSelected ? <CheckSquare size={14} className="text-accent" /> : <Square size={14} />}
                      </button>
                      <span className="w-8 h-8 rounded-lg bg-card-elevated border border-border flex items-center justify-center font-mono text-[10px] font-bold text-accent uppercase">
                        {doc.fileType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Comparison Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDocForComparison(doc.id);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                          isComparing 
                            ? 'bg-accent/15 border-accent text-accent' 
                            : 'border-border text-muted-foreground hover:text-foreground'
                        }`}
                        title="Add to Document Comparison"
                      >
                        {isComparing ? 'Comparing' : '+ Compare'}
                      </button>

                      {/* Intelligent Tool Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveToolDoc(doc);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-accent hover:bg-card-elevated transition-colors"
                        title="Run Intelligent AI Tools"
                      >
                        <Wrench size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Collection */}
                  <h3 className="font-semibold text-xs text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-relaxed">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <FolderKanban size={12} className="text-accent" />
                    <span>{doc.collectionName || 'General Library'}</span>
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-card-elevated border border-border text-[10px] font-mono text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Metadata & Status */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2 font-mono">
                    <span>{doc.pagesCount} pgs</span>
                    <span>•</span>
                    <span>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doc.status === 'indexed' && (
                      <span className="inline-flex items-center gap-1 text-success text-[10px] font-medium">
                        <CheckCircle2 size={11} />
                        Indexed
                      </span>
                    )}
                    {doc.status !== 'indexed' && (
                      <span className="inline-flex items-center gap-1 text-accent text-[10px] font-medium animate-pulse">
                        <RefreshCw size={11} className="animate-spin" />
                        {doc.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-card-elevated/70 border-b border-border text-muted-foreground">
              <tr>
                <th className="p-3 w-8">
                  <button onClick={toggleSelectAll}>
                    {selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0 ? (
                      <CheckSquare size={14} className="text-accent" />
                    ) : (
                      <Square size={14} />
                    )}
                  </button>
                </th>
                <th className="p-3 font-semibold">Document Title</th>
                <th className="p-3 font-semibold">Collection</th>
                <th className="p-3 font-semibold">Pages / Size</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDocs.map(doc => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <tr 
                    key={doc.id}
                    onClick={() => setSelectedDocForDetail(doc)}
                    className="hover:bg-card-elevated/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleSelectDoc(doc.id)}>
                        {isSelected ? <CheckSquare size={14} className="text-accent" /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded bg-card-elevated border border-border flex items-center justify-center font-mono text-[9px] uppercase font-bold text-accent">
                          {doc.fileType}
                        </span>
                        <span className="truncate max-w-sm">{doc.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{doc.collectionName || 'General'}</td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {doc.pagesCount} pgs • {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-success text-[11px] font-medium">
                        <CheckCircle2 size={12} />
                        Indexed
                      </span>
                    </td>
                    <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveView('chat');
                            createNewConversation(doc.title.slice(0, 30), 'selected', [doc.id]);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-accent"
                          title="Chat with document"
                        >
                          <MessageSquare size={14} />
                        </button>
                        <button
                          onClick={() => setActiveToolDoc(doc)}
                          className="p-1 rounded text-muted-foreground hover:text-accent"
                          title="Intelligent Tools"
                        >
                          <Wrench size={14} />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1 rounded text-muted-foreground hover:text-error"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
