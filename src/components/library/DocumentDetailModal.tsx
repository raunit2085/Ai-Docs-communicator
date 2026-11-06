'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  X, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Tag, 
  Layers, 
  ExternalLink, 
  Wrench, 
  CheckCircle2, 
  BookOpen, 
  Copy, 
  Check,
  FolderKanban,
  User,
  Shield,
  Download
} from 'lucide-react';

export function DocumentDetailModal() {
  const { 
    selectedDocForDetail, 
    setSelectedDocForDetail, 
    setActiveView, 
    createNewConversation, 
    sendChatMessage,
    setActiveToolDoc,
    allChunks
  } = useKnowledgeOS();

  const [activeTab, setActiveTab] = useState<'overview' | 'extracted' | 'metadata' | 'chunks'>('overview');
  const [copied, setCopied] = useState(false);

  if (!selectedDocForDetail) return null;

  const doc = selectedDocForDetail;
  const docChunks = allChunks.filter(c => c.documentId === doc.id);

  const handleCopyText = () => {
    if (doc.extractedText) {
      navigator.clipboard.writeText(doc.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartChatWithDoc = (question?: string) => {
    setSelectedDocForDetail(null);
    setActiveView('chat');
    const convId = createNewConversation(doc.title.slice(0, 30), 'selected', [doc.id]);
    if (question) {
      sendChatMessage(question);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div 
        className="w-full max-w-4xl max-h-[88vh] bg-card border border-border rounded-2xl shadow-modal overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-card-elevated border border-border flex items-center justify-center font-mono text-xs font-bold text-accent uppercase flex-shrink-0">
              {doc.fileType}
            </span>
            <div className="truncate">
              <h2 className="text-sm font-semibold text-foreground truncate">{doc.title}</h2>
              <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span>{doc.pagesCount} pages</span>
                <span>•</span>
                <span className="font-mono">{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                <span>•</span>
                <span>{doc.collectionName || 'General Library'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartChatWithDoc()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-95 shadow-sm"
            >
              <MessageSquare size={13} />
              <span>Chat with Document</span>
            </button>
            <button
              onClick={() => setSelectedDocForDetail(null)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-elevated"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 border-b border-border bg-card-elevated/40 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview & AI Summary
          </button>
          <button
            onClick={() => setActiveTab('extracted')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'extracted' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Extracted Text ({doc.pagesCount} pages)
          </button>
          <button
            onClick={() => setActiveTab('chunks')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'chunks' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Semantic Chunks ({docChunks.length})
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'metadata' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Metadata & Audit
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* AI Summary Box */}
              <div className="p-4 rounded-xl border border-border bg-card-elevated/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles size={14} className="text-accent" />
                    <span>Executive AI Summary</span>
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">Indexed with Grounded RAG</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {doc.summary || 'Summary generated upon document ingestion.'}
                </p>
              </div>

              {/* 1-Click Intelligent Tools Bar */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Wrench size={13} className="text-accent" />
                  <span>Intelligent 1-Click Document Actions</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'summarize', label: 'Summarise Doc' },
                    { id: 'explain_simply', label: 'Explain Simply' },
                    { id: 'flashcards', label: 'Generate Flashcards' },
                    { id: 'quiz', label: 'Create Quiz' },
                    { id: 'action_items', label: 'Action Items' },
                    { id: 'dates_deadlines', label: 'Important Dates' },
                    { id: 'identify_risks', label: 'Identify Risks' },
                    { id: 'custom_chat', label: 'Deep Chat' },
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedDocForDetail(null);
                        setActiveToolDoc(doc);
                      }}
                      className="p-2 rounded-lg border border-border bg-card hover:bg-card-elevated hover:border-accent/40 text-left text-xs font-medium text-foreground transition-all shadow-subtle flex items-center justify-between"
                    >
                      <span className="truncate">{tool.label}</span>
                      <Sparkles size={12} className="text-accent opacity-70" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Questions */}
              {doc.suggestedQuestions && doc.suggestedQuestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-accent" />
                    <span>Suggested Questions Grounded in this Document</span>
                  </h4>
                  <div className="space-y-1.5">
                    {doc.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStartChatWithDoc(q)}
                        className="w-full text-left p-2.5 rounded-lg border border-border bg-card hover:border-accent/40 text-xs text-foreground/80 hover:text-accent transition-all flex items-center justify-between group shadow-subtle"
                      >
                        <span className="truncate">"{q}"</span>
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Dates & Deadlines */}
              {doc.datesAndDeadlines && doc.datesAndDeadlines.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Calendar size={13} className="text-accent" />
                    <span>Timeline & Critical Dates</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {doc.datesAndDeadlines.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-border bg-card text-xs">
                        <div className="flex items-center justify-between font-mono font-medium text-accent text-[11px] mb-1">
                          <span>{item.date}</span>
                          <span className="text-muted-foreground">Page {item.page}</span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXTRACTED TEXT */}
          {activeTab === 'extracted' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Full Extracted Text Buffer</span>
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-card-elevated border border-border text-xs text-foreground hover:bg-card"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl border border-border bg-card-elevated/40 text-xs font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
                {doc.extractedText || 'No text extracted.'}
              </pre>
            </div>
          )}

          {/* TAB 3: SEMANTIC CHUNKS */}
          {activeTab === 'chunks' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Document-aware chunks partitioned with preserved page numbers and 128-dimensional vector embeddings:
              </p>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {docChunks.map((chunk, idx) => (
                  <div key={chunk.id} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-accent">
                      <span className="font-semibold">Chunk #{idx + 1} — {chunk.heading || 'Section'}</span>
                      <span className="text-muted-foreground">Page {chunk.pageNumber} • {chunk.tokenCount} tokens</span>
                    </div>
                    <p className="text-muted-foreground italic">"{chunk.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: METADATA */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">Original File Name</span>
                  <span className="font-mono text-foreground font-medium">{doc.fileName}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">Author / Origin</span>
                  <span className="text-foreground font-medium">{doc.author || 'Apex Organization'}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">File Format</span>
                  <span className="font-mono text-foreground font-medium uppercase">{doc.fileType}</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">Processing Status</span>
                  <span className="text-success font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified & Indexed
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">Total Pages</span>
                  <span className="font-mono text-foreground font-medium">{doc.pagesCount} pages</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-muted-foreground block text-[11px]">Uploaded Timestamp</span>
                  <span className="font-mono text-foreground">{new Date(doc.uploadedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
