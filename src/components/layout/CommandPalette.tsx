'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Search, 
  X, 
  FileText, 
  Layers, 
  Bookmark, 
  Sparkles, 
  ArrowRight, 
  CornerDownLeft, 
  FileCheck,
  FolderKanban
} from 'lucide-react';
import { retrieveRelevantChunks } from '@/lib/rag/retriever';

export function CommandPalette() {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    documents, 
    allChunks, 
    collections, 
    savedInsights, 
    setSelectedDocForDetail, 
    setActiveView,
    createNewConversation,
    sendChatMessage
  } = useKnowledgeOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey listener for Cmd/Ctrl + K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Search logic across entities
  const lowerQuery = query.toLowerCase().trim();

  // 1. Matching Documents
  const matchingDocs = documents.filter(doc => 
    !lowerQuery || 
    doc.title.toLowerCase().includes(lowerQuery) || 
    doc.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    doc.collectionName?.toLowerCase().includes(lowerQuery)
  ).slice(0, 4);

  // 2. Hybrid semantic/lexical chunk search if query is non-empty
  const chunkResults = lowerQuery.length > 2 
    ? retrieveRelevantChunks(allChunks, documents, { query: lowerQuery, topK: 4, similarityThreshold: 0.22 }).citations
    : [];

  // 3. Matching Collections
  const matchingCollections = collections.filter(c =>
    !lowerQuery || c.name.toLowerCase().includes(lowerQuery) || c.description.toLowerCase().includes(lowerQuery)
  ).slice(0, 2);

  // 4. Matching Insights
  const matchingInsights = savedInsights.filter(i =>
    !lowerQuery || i.title.toLowerCase().includes(lowerQuery) || i.content.toLowerCase().includes(lowerQuery)
  ).slice(0, 2);

  const handleAskAiAboutQuery = () => {
    setIsSearchOpen(false);
    setActiveView('chat');
    createNewConversation(query.slice(0, 35));
    sendChatMessage(query);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-modal overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-card">
          <Search size={18} className="text-accent mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documents, sections, citations, or natural queries..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card-elevated border border-border text-muted-foreground ml-2">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Ask AI prompt if query typed */}
          {query.trim().length > 2 && (
            <div 
              onClick={handleAskAiAboutQuery}
              className="flex items-center justify-between p-2.5 rounded-lg bg-accent/10 border border-accent/20 cursor-pointer hover:bg-accent/15 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-accent" />
                <span className="text-xs font-medium text-foreground">
                  Ask AI about: <strong className="text-accent">"{query}"</strong>
                </span>
              </div>
              <span className="text-[10px] text-accent flex items-center gap-1 font-medium">
                Grounded Search <ArrowRight size={12} />
              </span>
            </div>
          )}

          {/* Extracted Semantic Passages */}
          {chunkResults.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck size={12} className="text-accent" /> Grounded Evidence Passages
              </div>
              <div className="space-y-1 mt-1">
                {chunkResults.map((cite) => (
                  <div
                    key={cite.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      const doc = documents.find(d => d.id === cite.documentId);
                      if (doc) setSelectedDocForDetail(doc);
                    }}
                    className="p-2.5 rounded-lg hover:bg-card-elevated border border-transparent hover:border-border cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                        {cite.documentTitle}
                        <span className="text-[10px] font-mono text-muted-foreground">pg {cite.pageNumber}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/10 text-accent">
                        {Math.round(cite.score * 100)}% match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{cite.excerpt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Matches */}
          {matchingDocs.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} className="text-accent" /> Documents ({matchingDocs.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedDocForDetail(doc);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-card-elevated border border-transparent hover:border-border cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center font-mono text-[10px] uppercase font-bold flex-shrink-0">
                        {doc.fileType}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium text-foreground truncate">{doc.title}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.pagesCount} pages • {doc.collectionName || 'General Library'}</p>
                      </div>
                    </div>
                    <CornerDownLeft size={14} className="text-muted-foreground opacity-60" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collections */}
          {matchingCollections.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban size={12} className="text-accent" /> Collections
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {matchingCollections.map(col => (
                  <div
                    key={col.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveView('collections');
                    }}
                    className="p-2 rounded-lg border border-border bg-card-elevated/40 hover:border-accent/40 cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-medium text-foreground">{col.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{col.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Insights */}
          {matchingInsights.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark size={12} className="text-accent" /> Saved Insights
              </div>
              <div className="space-y-1 mt-1">
                {matchingInsights.map(ins => (
                  <div
                    key={ins.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveView('insights');
                    }}
                    className="p-2 rounded-lg hover:bg-card-elevated cursor-pointer border border-transparent hover:border-border text-xs"
                  >
                    <p className="font-medium text-foreground">{ins.title}</p>
                    <p className="text-muted-foreground text-[11px] line-clamp-1">{ins.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border bg-card-elevated/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">↵</kbd> Select</span>
            <span><kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">ESC</kbd> Close</span>
          </div>
          <span className="font-mono text-[10px]">KnowledgeOS Hybrid Retrieval</span>
        </div>
      </div>
    </div>
  );
}
