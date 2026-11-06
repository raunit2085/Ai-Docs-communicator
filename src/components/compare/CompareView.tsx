'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  SplitSquareVertical, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Plus, 
  Trash2,
  RefreshCw
} from 'lucide-react';

export function CompareView() {
  const { 
    documents, 
    comparisonDocs, 
    toggleDocForComparison, 
    activeComparison, 
    runDocumentComparison,
    setActiveCitation
  } = useKnowledgeOS();

  const [copied, setCopied] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const handleRunCompare = async () => {
    if (comparisonDocs.length < 2) return;
    setIsComparing(true);
    await new Promise(r => setTimeout(r, 600));
    runDocumentComparison(comparisonDocs);
    setIsComparing(false);
  };

  const handleCopyComparison = () => {
    if (!activeComparison) return;
    const text = `# ${activeComparison.topic}\n\n${activeComparison.executiveSummary}\n\n` +
      activeComparison.metricsTable.map(m => `### ${m.dimension}\n` + Object.entries(m.values).map(([k, v]) => `- **${k}**: ${v}`).join('\n')).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <SplitSquareVertical size={20} className="text-accent" />
            <span>Document Comparison & Contradiction Engine</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select 2 or more documents to contrast operational metrics, legal commitments, and timelines with verified citations.
          </p>
        </div>

        {activeComparison && (
          <button
            onClick={handleCopyComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-card-elevated text-xs font-medium text-foreground transition-colors self-start sm:self-auto"
          >
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Export Comparison'}</span>
          </button>
        )}
      </div>

      {/* Document Selection Grid */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Selected for Comparison ({comparisonDocs.length}/4 required min. 2):
          </span>
          <button
            onClick={handleRunCompare}
            disabled={comparisonDocs.length < 2 || isComparing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-medium shadow-sm hover:opacity-95 disabled:opacity-40 transition-opacity"
          >
            {isComparing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Contrasting Documents...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Run Cross-Comparison</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {documents.map(doc => {
            const isSelected = comparisonDocs.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleDocForComparison(doc.id)}
                className={`p-3 rounded-lg border cursor-pointer text-xs transition-all ${
                  isSelected 
                    ? 'border-accent bg-accent/10 ring-1 ring-accent' 
                    : 'border-border bg-card-elevated/40 hover:border-accent/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                  <span className="uppercase font-bold text-accent">{doc.fileType}</span>
                  <span>{isSelected ? '✓ Selected' : '+ Add'}</span>
                </div>
                <p className="font-semibold text-foreground truncate">{doc.title}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{doc.pagesCount} pages</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Results */}
      {activeComparison && (
        <div className="space-y-6">
          {/* Executive Contrast Summary */}
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-xs text-foreground leading-relaxed">
            <h3 className="font-semibold text-accent uppercase tracking-wider text-[11px] mb-1">
              Comparative Analysis Summary
            </h3>
            <p>{activeComparison.executiveSummary}</p>
          </div>

          {/* Side-by-side Structured Comparison Matrix */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-3.5 border-b border-border bg-card-elevated/40 font-semibold text-xs text-foreground flex items-center justify-between">
              <span>Structured Side-by-Side Comparison Matrix</span>
              <span className="text-[10px] font-mono text-muted-foreground">Every claim is grounded with citation</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-card-elevated/70 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-3 font-semibold min-w-[160px]">Dimension</th>
                    {activeComparison.documentTitles.map((title, idx) => (
                      <th key={idx} className="p-3 font-semibold min-w-[200px]">
                        {title}
                      </th>
                    ))}
                    <th className="p-3 font-semibold w-24">Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {activeComparison.metricsTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-card-elevated/30 transition-colors">
                      <td className="p-3 font-medium text-foreground bg-card-elevated/10">
                        {row.dimension}
                      </td>
                      {activeComparison.documentTitles.map((title, dIdx) => (
                        <td key={dIdx} className="p-3 text-foreground/90">
                          {row.values[title] || row.values[Object.keys(row.values)[dIdx]] || 'N/A'}
                        </td>
                      ))}
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                          row.consensusOrConflict === 'aligned' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                        }`}>
                          {row.consensusOrConflict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contradiction & Discrepancy Detector */}
          <div className="p-5 rounded-xl border border-warning/30 bg-warning/5 space-y-3">
            <h3 className="text-xs font-semibold text-warning flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>Contradiction & Conflict Detection Engine</span>
            </h3>

            {activeComparison.contradictions.map((ct, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-warning/20 bg-card text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-warning uppercase font-mono tracking-wider">
                    Severity: {ct.severity.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">Temporal / Cost Discrepancy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded bg-card-elevated/50 border border-border">
                    <p className="font-mono text-accent text-[10px] mb-1">{ct.claimA.docTitle} (Page {ct.claimA.page}):</p>
                    <p className="text-muted-foreground italic">"{ct.claimA.text}"</p>
                  </div>
                  <div className="p-2.5 rounded bg-card-elevated/50 border border-border">
                    <p className="font-mono text-accent text-[10px] mb-1">{ct.claimB.docTitle} (Page {ct.claimB.page}):</p>
                    <p className="text-muted-foreground italic">"{ct.claimB.text}"</p>
                  </div>
                </div>

                <p className="text-foreground/90 text-xs mt-2 pt-2 border-t border-border/50">
                  <strong>AI Analysis:</strong> {ct.analysis}
                </p>
              </div>
            ))}
          </div>

          {/* Key Differences & Shared Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
              <h4 className="font-semibold text-foreground">Key Document Differences</h4>
              {activeComparison.keyDifferences.map((kd, idx) => (
                <div key={idx} className="pb-2 border-b border-border/40 last:border-none">
                  <p className="font-medium text-accent">{kd.point}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{kd.explanation}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
              <h4 className="font-semibold text-foreground">Common Strategic Foundations</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeComparison.sharedThemes.map((th, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-card-elevated border border-border text-[11px] text-foreground font-medium">
                    ✓ {th}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
