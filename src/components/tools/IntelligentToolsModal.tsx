'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  X, 
  Wrench, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  FileText, 
  HelpCircle, 
  Calendar, 
  AlertTriangle, 
  CheckSquare, 
  GraduationCap, 
  ListOrdered,
  Layers,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Citation } from '@/types';

export function IntelligentToolsModal() {
  const { 
    activeToolDoc, 
    setActiveToolDoc, 
    runToolOnDoc, 
    addSavedInsight,
    setActiveCitation,
    createNewConversation,
    setActiveView
  } = useKnowledgeOS();

  const [activeToolId, setActiveToolId] = useState<string>('summarize');
  const [result, setResult] = useState<{ title: string; output: string; citations: Citation[] } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!activeToolDoc) return null;

  const toolsList = [
    { id: 'summarize', label: 'Executive Summary', icon: FileText, desc: 'Condensed executive briefing' },
    { id: 'explain_simply', label: 'Explain Simply', icon: HelpCircle, desc: 'Plain-language explanation' },
    { id: 'flashcards', label: 'Generate Flashcards', icon: GraduationCap, desc: 'Active recall study deck' },
    { id: 'quiz', label: 'Create Quiz', icon: ListOrdered, desc: 'Multiple-choice test' },
    { id: 'action_items', label: 'Action Items', icon: CheckSquare, desc: 'Deliverables with owners & due dates' },
    { id: 'dates_deadlines', label: 'Dates & Deadlines', icon: Calendar, desc: 'Timeline and milestone extraction' },
    { id: 'identify_risks', label: 'Identify Risks', icon: AlertTriangle, desc: 'Vulnerability and failure matrix' },
  ];

  const handleSelectTool = async (toolId: string) => {
    setActiveToolId(toolId);
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 450));
    const output = runToolOnDoc(toolId, activeToolDoc);
    setResult(output);
    setIsRunning(false);
  };

  // Run default tool if no result yet
  if (!result && !isRunning) {
    handleSelectTool(activeToolId);
  }

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveInsight = () => {
    if (!result) return;
    addSavedInsight({
      title: result.title,
      content: result.output.slice(0, 300) + '...',
      tags: ['Tool-Output', activeToolId],
      sourceDocId: activeToolDoc.id,
      sourceDocTitle: activeToolDoc.title,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div 
        className="w-full max-w-4xl max-h-[88vh] bg-card border border-border rounded-2xl shadow-modal overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-lg bg-accent/10 text-accent">
              <Wrench size={16} />
            </span>
            <div className="truncate">
              <h2 className="text-sm font-semibold text-foreground truncate">
                Intelligent Document Tools: {activeToolDoc.title}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Grounded transformations powered by verified document content.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveToolDoc(null)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-elevated"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Tools Selector List */}
          <div className="w-56 border-r border-border bg-sidebar p-3 space-y-1 overflow-y-auto flex-shrink-0">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground px-2 py-1 tracking-wider">
              Available Tools
            </div>
            {toolsList.map(t => {
              const Icon = t.icon;
              const isActive = activeToolId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTool(t.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center gap-2.5 ${
                    isActive 
                      ? 'bg-accent/15 text-accent font-semibold' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-card-elevated'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
                  <div className="truncate">
                    <p className="truncate font-medium">{t.label}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Result Display Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-border bg-card/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground truncate">
                {result?.title || 'Processing Transformation...'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!result}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-card-elevated border border-border text-xs text-foreground hover:bg-card"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleSaveInsight}
                  disabled={!result}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-card-elevated border border-border text-xs text-foreground hover:bg-card"
                >
                  <Bookmark size={12} className={saved ? 'text-accent fill-accent' : ''} />
                  <span>{saved ? 'Saved' : 'Save Insight'}</span>
                </button>
              </div>
            </div>

            {/* Content Output */}
            <div className="flex-1 overflow-y-auto p-6">
              {isRunning && (
                <div className="flex flex-col items-center justify-center h-48 space-y-3 text-xs text-muted-foreground">
                  <RefreshCw size={20} className="animate-spin text-accent" />
                  <span>Analyzing document structure and synthesizing tool output...</span>
                </div>
              )}

              {result && !isRunning && (
                <div className="space-y-6">
                  <div className="prose-custom whitespace-pre-wrap text-xs leading-relaxed">
                    {result.output}
                  </div>

                  {result.citations && result.citations.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <span className="text-xs font-semibold text-muted-foreground block mb-2">
                        Referenced Citations:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.citations.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => setActiveCitation(c)}
                            className="p-2 rounded-lg border border-border bg-card hover:border-accent/40 cursor-pointer text-xs"
                          >
                            <div className="font-mono text-accent text-[10px] font-bold">
                              [{c.index}] Page {c.pageNumber}
                            </div>
                            <p className="text-muted-foreground text-[10px] truncate italic mt-0.5">
                              "{c.excerpt}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
