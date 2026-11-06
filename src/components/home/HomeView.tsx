'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers, 
  FolderKanban, 
  SplitSquareVertical, 
  Clock, 
  Upload, 
  TrendingUp, 
  ShieldCheck, 
  HardDrive, 
  CheckCircle2, 
  Plus, 
  MessageSquare,
  FileCheck2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function HomeView() {
  const { 
    documents, 
    collections, 
    activities, 
    setActiveView, 
    setSelectedDocForDetail, 
    createNewConversation, 
    sendChatMessage, 
    setIsUploadOpen,
    setComparisonDocs,
    runDocumentComparison,
    allChunks
  } = useKnowledgeOS();

  const [searchQuery, setSearchQuery] = useState('');

  // Stats calculation
  const totalPages = documents.reduce((acc, d) => acc + (d.pagesCount || 1), 0);
  const totalSizeBytes = documents.reduce((acc, d) => acc + (d.fileSize || 0), 0);
  const totalMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);

  const suggestedPrompts = [
    { label: 'Summarise my latest documents', query: 'Summarise the key strategic themes and metrics across all my documents.' },
    { label: 'Find contradictions across documents', query: 'Identify any operational contradictions, cost discrepancies, or conflicting dates between documents.' },
    { label: 'Compare financial vs legal SLA terms', query: 'Compare the financial growth metrics and the contractual SLA guarantees.' },
    { label: 'Extract all important deadlines', query: 'Extract all upcoming deadlines, audit dates, and regulatory milestones.' },
    { label: 'Explain verifiable citation accuracy', query: 'Explain how verifiable citation grounding works and what benchmark accuracy was achieved.' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveView('chat');
    createNewConversation(searchQuery.slice(0, 35));
    sendChatMessage(searchQuery);
  };

  const handleRunSuggested = (promptQuery: string) => {
    setActiveView('chat');
    createNewConversation(promptQuery.slice(0, 35));
    sendChatMessage(promptQuery);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto space-y-8 animate-in fade-in-50">
      {/* 1. Welcome & Primary Command Centre Hero */}
      <section className="text-center max-w-3xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <Sparkles size={13} />
          <span>KnowledgeOS Intelligence Engine Active</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Good morning. What would you like to understand today?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your knowledge. Connected. Searchable. Verifiable.
        </p>

        {/* Big Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 relative max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-card rounded-2xl bg-card border border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all p-1.5">
            <div className="pl-3 pr-2 text-accent">
              <Sparkles size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Ask anything across your knowledge base..."
              className="flex-1 bg-transparent py-2.5 px-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-medium hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <span>Ask AI</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Suggested Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleRunSuggested(p.query)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-card-elevated hover:border-accent/30 text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 shadow-subtle"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Knowledge Statistics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-subtle hover:border-accent/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Documents</span>
            <FileText size={16} className="text-accent" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">{documents.length}</span>
            <span className="text-[11px] text-success font-medium">100% active</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground font-mono">{totalPages} indexed pages</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-subtle hover:border-accent/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Knowledge Chunks</span>
            <Layers size={16} className="text-accent" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">{allChunks.length || 32}</span>
            <span className="text-[11px] text-accent font-medium">128-dim embeddings</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground font-mono">Cosine + BM25 Hybrid</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-subtle hover:border-accent/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Collections</span>
            <FolderKanban size={16} className="text-accent" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">{collections.length}</span>
            <span className="text-[11px] text-muted-foreground">Taxonomies</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Structured knowledge domains</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-subtle hover:border-accent/30 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Storage Usage</span>
            <HardDrive size={16} className="text-accent" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">{totalMB} MB</span>
            <span className="text-[11px] text-muted-foreground">/ 5.0 GB</span>
          </div>
          <div className="mt-2 w-full bg-card-elevated rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent h-full rounded-full" style={{ width: '4%' }} />
          </div>
        </div>
      </section>

      {/* 3. Quick Actions Toolbar */}
      <section className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-medium text-xs shadow-sm hover:opacity-95 transition-all"
        >
          <Upload size={14} />
          <span>Upload Files</span>
        </button>

        <button
          onClick={() => setActiveView('research')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card-elevated text-foreground font-medium text-xs transition-colors shadow-subtle"
        >
          <Layers size={14} className="text-accent" />
          <span>Start AI Research</span>
        </button>

        <button
          onClick={() => {
            if (documents.length >= 2) {
              setComparisonDocs([documents[0].id, documents[1].id]);
              runDocumentComparison([documents[0].id, documents[1].id]);
            }
            setActiveView('compare');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card-elevated text-foreground font-medium text-xs transition-colors shadow-subtle"
        >
          <SplitSquareVertical size={14} className="text-accent" />
          <span>Compare Documents</span>
        </button>

        <button
          onClick={() => setActiveView('collections')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card-elevated text-foreground font-medium text-xs transition-colors shadow-subtle"
        >
          <FolderKanban size={14} className="text-accent" />
          <span>Manage Collections</span>
        </button>
      </section>

      {/* 4. Recent Documents & Recent Activity Split Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Recent Documents */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText size={16} className="text-accent" />
              <span>Recent Documents</span>
            </h2>
            <button
              onClick={() => setActiveView('library')}
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>View Library</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {documents.slice(0, 4).map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForDetail(doc)}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-accent/40 cursor-pointer transition-all shadow-subtle group flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-card-elevated border border-border flex items-center justify-center font-mono text-xs font-bold text-accent uppercase flex-shrink-0">
                    {doc.fileType}
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs font-medium text-foreground group-hover:text-accent transition-colors truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      <span>{doc.pagesCount} pages</span>
                      <span>•</span>
                      <span className="font-mono">{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                      <span>•</span>
                      <span className="truncate">{doc.collectionName || 'General'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success border border-success/20">
                    <CheckCircle2 size={10} />
                    <span>Indexed</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('chat');
                      createNewConversation(doc.title.slice(0, 30), 'selected', [doc.id]);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-card-elevated transition-colors"
                    title="Chat with document"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock size={16} className="text-accent" />
              <span>Recent Activity</span>
            </h2>
            <button
              onClick={() => setActiveView('activity')}
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>All Logs</span>
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-3 shadow-subtle space-y-3">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="text-xs pb-3 border-b border-border/50 last:border-none last:pb-0">
                <p className="font-medium text-foreground">{act.description}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span className="font-mono">{act.userName}</span>
                  <span>{new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
