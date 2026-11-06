'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Share2,
  Tag
} from 'lucide-react';

export function SavedInsightsView() {
  const { savedInsights, deleteSavedInsight, setSelectedDocForDetail, documents } = useKnowledgeOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedInsights.filter(ins =>
    !searchTerm ||
    ins.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ins.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ins.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Bookmark size={20} className="text-accent" />
            <span>Saved Insights & Knowledge Cards</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated evidence excerpts, takeaways, and synthesized findings pinned from research conversations.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search insights & tags..."
            className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Grid of Saved Insights */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
          <Bookmark size={28} className="text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground">No saved insights found</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Pin responses from AI Chat or Deep Research to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ins => (
            <div
              key={ins.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-subtle flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{ins.title}</h3>
                  <button
                    onClick={() => deleteSavedInsight(ins.id)}
                    className="p-1 text-muted-foreground hover:text-error transition-colors"
                    title="Remove insight"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <p className="text-xs text-foreground/90 mt-2 leading-relaxed">
                  {ins.content}
                </p>

                {/* Source Citation Excerpt if present */}
                {ins.citationExcerpt && (
                  <div className="mt-3 p-2.5 rounded-lg border border-accent/20 bg-accent/5 text-[11px] text-muted-foreground italic border-l-2 border-l-accent">
                    "{ins.citationExcerpt}"
                  </div>
                )}

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {ins.tags.map((tag, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-card-elevated border border-border text-[10px] font-mono text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                {ins.sourceDocTitle ? (
                  <button
                    onClick={() => {
                      const doc = documents.find(d => d.id === ins.sourceDocId);
                      if (doc) setSelectedDocForDetail(doc);
                    }}
                    className="font-mono text-accent hover:underline flex items-center gap-1 truncate max-w-[200px]"
                  >
                    <span>{ins.sourceDocTitle}</span>
                    {ins.pageNumber && <span>(p.{ins.pageNumber})</span>}
                  </button>
                ) : (
                  <span>General Insight</span>
                )}

                <button
                  onClick={() => handleCopy(ins.id, `${ins.title}\n\n${ins.content}`)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {copiedId === ins.id ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  <span>{copiedId === ins.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
