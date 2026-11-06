'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  FolderKanban, 
  FileText, 
  ChevronRight, 
  Layers, 
  X, 
  FileCheck2,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Citation, ChatMessage } from '@/types';

export function AiChatView() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    currentConversation, 
    createNewConversation, 
    sendChatMessage, 
    clearConversation,
    documents, 
    collections, 
    activeCitation, 
    setActiveCitation,
    isStreaming,
    addSavedInsight,
    setSelectedDocForDetail
  } = useKnowledgeOS();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'selected' | 'collection'>('all');
  const [scopeDocIds, setScopeDocIds] = useState<string[]>([]);
  const [scopeColId, setScopeColId] = useState<string>('');
  const [isScopeMenuOpen, setIsScopeMenuOpen] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [savedMsgId, setSavedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg);
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSaveAsInsight = (msg: ChatMessage) => {
    const firstCitation = msg.citations?.[0];
    addSavedInsight({
      title: currentConversation?.title || 'Synthesized Document Insight',
      content: msg.content.replace(/###\s+/g, '').slice(0, 300) + '...',
      tags: ['AI-Insight', firstCitation?.documentTitle ? 'Cited' : 'Summary'],
      sourceDocId: firstCitation?.documentId,
      sourceDocTitle: firstCitation?.documentTitle,
      pageNumber: firstCitation?.pageNumber,
      citationExcerpt: firstCitation?.excerpt,
    });
    setSavedMsgId(msg.id);
    setTimeout(() => setSavedMsgId(null), 2000);
  };

  // Render clickable citation badges like [1], [2] inside text
  const renderMessageContent = (content: string, citations?: Citation[]) => {
    if (!citations || citations.length === 0) {
      return <div className="prose-custom whitespace-pre-wrap">{content}</div>;
    }

    // Split content by citation markers [1], [2], etc.
    const parts = content.split(/(\[\d+\])/g);

    return (
      <div className="prose-custom whitespace-pre-wrap">
        {parts.map((part, idx) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const citeIndex = parseInt(match[1], 10);
            const foundCitation = citations.find(c => c.index === citeIndex);
            return (
              <button
                key={idx}
                onClick={() => {
                  if (foundCitation) {
                    setActiveCitation(foundCitation);
                  }
                }}
                className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded text-[11px] font-mono font-bold bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white transition-all cursor-pointer"
                title={foundCitation ? `Citation [${citeIndex}]: ${foundCitation.documentTitle} (Page ${foundCitation.pageNumber})` : 'Citation'}
              >
                [{citeIndex}]
              </button>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* 1. Left Conversation History Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar hidden md:flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Conversations</span>
          <button
            onClick={() => createNewConversation()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 shadow-sm"
          >
            <Plus size={13} />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-accent/10 text-accent font-semibold' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-elevated'
                }`}
              >
                <div className="truncate flex-1 pr-2">
                  <p className="truncate text-foreground font-medium">{conv.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {conv.messages.length} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-error transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Conversation Center Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Chat Scope Header */}
        <div className="px-6 py-2.5 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Search Scope:</span>
            
            <div className="relative">
              <button
                onClick={() => setIsScopeMenuOpen(!isScopeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card-elevated border border-border text-xs text-foreground font-medium hover:border-accent/40 transition-colors"
              >
                <FileCheck2 size={13} className="text-accent" />
                <span className="capitalize">{currentConversation?.documentScope || 'All Documents'}</span>
                <ChevronRight size={12} className="rotate-90 text-muted-foreground" />
              </button>

              {isScopeMenuOpen && (
                <div className="absolute top-8 left-0 w-64 bg-card border border-border rounded-xl shadow-dropdown p-2 z-40 text-xs">
                  <div className="font-semibold text-muted-foreground text-[10px] uppercase px-2 py-1">
                    Select Scope
                  </div>
                  <button
                    onClick={() => {
                      setSelectedScope('all');
                      setIsScopeMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-card-elevated transition-colors"
                  >
                    All Workspace Documents ({documents.length} files)
                  </button>
                  <div className="my-1 border-t border-border" />
                  <div className="font-semibold text-muted-foreground text-[10px] uppercase px-2 py-1">
                    Collections
                  </div>
                  {collections.map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        setSelectedScope('collection');
                        setScopeColId(col.id);
                        setIsScopeMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-card-elevated transition-colors flex items-center justify-between"
                    >
                      <span>{col.name}</span>
                      <span className="text-[10px] text-muted-foreground">{col.documentsCount} docs</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              Hybrid Dense + BM25 Grounding Active
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {currentConversation?.messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-4xl mx-auto ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm mt-1">
                    K
                  </div>
                )}

                <div 
                  className={`relative p-5 rounded-2xl max-w-2xl text-xs shadow-subtle ${
                    isUser 
                      ? 'bg-accent text-white rounded-br-none' 
                      : 'bg-card border border-border text-foreground rounded-bl-none'
                  }`}
                >
                  {/* Content with parsed citations */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                  ) : (
                    renderMessageContent(msg.content, msg.citations)
                  )}

                  {/* Grounded Evidence Citations Pill Bar (For Assistant) */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                        <span className="font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-success" />
                          <span>{msg.citations.length} Grounded Source Passages</span>
                        </span>
                        <span className="text-[10px] font-mono">Click badge to verify</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setActiveCitation(c)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card-elevated/60 hover:border-accent/50 text-[11px] text-foreground transition-all group"
                          >
                            <span className="font-mono font-bold text-accent">[{c.index}]</span>
                            <span className="truncate max-w-[140px] font-medium">{c.documentTitle}</span>
                            <span className="text-muted-foreground font-mono">p.{c.pageNumber}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar for Assistant Message */}
                  {!isUser && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-foreground flex items-center gap-1 p-1 rounded"
                          title="Copy response"
                        >
                          {copiedMsgId === msg.id ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveAsInsight(msg)}
                          className="hover:text-foreground flex items-center gap-1 p-1 rounded"
                          title="Save as Insight"
                        >
                          <Bookmark size={12} className={savedMsgId === msg.id ? 'text-accent fill-accent' : ''} />
                          <span>{savedMsgId === msg.id ? 'Saved' : 'Save Insight'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:text-foreground" title="Helpful answer">
                          <ThumbsUp size={12} />
                        </button>
                        <button className="p-1 hover:text-foreground" title="Needs improvement">
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-card-elevated border border-border flex items-center justify-center font-medium text-xs flex-shrink-0 mt-1">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Streaming Indicator */}
          {isStreaming && (
            <div className="flex gap-3 max-w-4xl mx-auto justify-start">
              <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm animate-pulse">
                K
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border rounded-bl-none text-xs text-muted-foreground flex items-center gap-2 shadow-subtle">
                <RefreshCw size={14} className="animate-spin text-accent" />
                <span>Searching vector indices, evaluating similarity floor, and synthesizing citations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer Box */}
        <div className="p-4 border-t border-border bg-card/70 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <div className="relative flex items-end rounded-2xl border border-border bg-card shadow-card focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all p-2">
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={2}
                placeholder="Ask a question across your documents... (Shift+Enter for newline)"
                className="w-full resize-none bg-transparent p-2 text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isStreaming}
                className="p-2.5 rounded-xl bg-accent text-white hover:opacity-95 disabled:opacity-40 transition-opacity flex-shrink-0 shadow-sm"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              KnowledgeOS synthesizes answers strictly grounded in verified document passages with verifiable citations.
            </p>
          </form>
        </div>
      </div>

      {/* 3. Right Context & Citation Inspector Drawer */}
      {activeCitation && (
        <div className="w-80 border-l border-border bg-card flex flex-col flex-shrink-0 animate-in slide-in-from-right-10 duration-200">
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-card-elevated/40">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-accent/10 text-accent font-mono font-bold text-xs flex items-center justify-center">
                [{activeCitation.index}]
              </span>
              <span className="text-xs font-semibold text-foreground">Citation Inspector</span>
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Document Pill */}
            <div className="p-3 rounded-xl border border-border bg-card-elevated/30 space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Source Document
              </span>
              <h4 className="text-xs font-semibold text-foreground">
                {activeCitation.documentTitle}
              </h4>
              <div className="flex items-center justify-between text-[11px] font-mono text-accent pt-1">
                <span>Page {activeCitation.pageNumber}</span>
                <span>{Math.round(activeCitation.score * 100)}% Match</span>
              </div>
            </div>

            {/* Exact Excerpt with Highlight */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Verified Excerpt
              </span>
              <div className="p-3.5 rounded-xl border border-accent/30 bg-accent/5 text-xs text-foreground leading-relaxed italic border-l-4 border-l-accent">
                "{activeCitation.excerpt}"
              </div>
            </div>

            {/* Verification Metadata */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Confidence Tier</span>
                <span className="text-success font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> High (Verified)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Chunk Location</span>
                <span className="font-mono text-foreground">{activeCitation.heading || `Page ${activeCitation.pageNumber}`}</span>
              </div>
            </div>

            {/* Quick Action */}
            <button
              onClick={() => {
                const doc = documents.find(d => d.id === activeCitation.documentId);
                if (doc) setSelectedDocForDetail(doc);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-card-elevated border border-border text-xs font-medium text-foreground hover:border-accent/40 transition-colors shadow-subtle"
            >
              <ExternalLink size={13} />
              <span>Inspect Full Source Document</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
