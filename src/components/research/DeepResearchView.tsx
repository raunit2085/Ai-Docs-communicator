'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Bookmark, 
  FileCheck2, 
  AlertTriangle, 
  HelpCircle,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

export function DeepResearchView() {
  const { 
    runResearch, 
    activeResearchReport, 
    isResearching, 
    documents, 
    addSavedInsight,
    setActiveCitation
  } = useKnowledgeOS();

  const [researchQuery, setResearchQuery] = useState(
    'Analyse operating expenses, cloud migration milestones, and contractual SLAs across all uploaded enterprise reports.'
  );
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const sampleQueries = [
    'Analyse operating expenses, cloud migration milestones, and contractual SLAs across all uploaded enterprise reports.',
    'Evaluate disaster recovery RPO/RTO standards versus our enterprise uptime SLA agreements.',
    'Assess citation grounding benchmarks and multi-hop retrieval accuracy for regulated industries.',
  ];

  const handleStartResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!researchQuery.trim() || isResearching) return;
    await runResearch(researchQuery);
  };

  const handleCopyReport = () => {
    if (!activeResearchReport) return;
    const text = `# ${activeResearchReport.query}\n\n## Executive Summary\n${activeResearchReport.executiveSummary}\n\n` +
      activeResearchReport.detailedFindings.map(f => `### ${f.sectionTitle}\n${f.body}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveReport = () => {
    if (!activeResearchReport) return;
    addSavedInsight({
      title: `Research Dossier: ${activeResearchReport.query.slice(0, 40)}...`,
      content: activeResearchReport.executiveSummary,
      tags: ['DeepResearch', 'Synthesis', 'Multi-Doc'],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-accent/10 text-accent">
            <Layers size={18} />
          </span>
          <h1 className="text-xl font-semibold text-foreground">AI Deep Research Engine</h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
            Multi-Document Synthesis
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Perform multi-hop document analysis, cross-source contradiction detection, and generate evidence-backed research dossiers.
        </p>
      </div>

      {/* Query Formulation Input Card */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-card space-y-4">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
          Define Research Objective
        </h2>

        <form onSubmit={handleStartResearch} className="space-y-3">
          <div className="relative">
            <textarea
              value={researchQuery}
              onChange={e => setResearchQuery(e.target.value)}
              rows={3}
              placeholder="State a complex question requiring cross-examination of multiple documents..."
              className="w-full rounded-xl border border-border bg-card-elevated/40 p-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-muted-foreground">Suggested Inquiries:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setResearchQuery(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-card-elevated text-muted-foreground hover:text-foreground transition-colors truncate max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-muted-foreground font-mono">
              Examining all {documents.length} workspace documents
            </span>

            <button
              type="submit"
              disabled={isResearching || !researchQuery.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-medium shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
            >
              {isResearching ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Synthesizing Multi-Doc Dossier...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Execute Deep Research</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Progress Stages Indicator */}
      {isResearching && (
        <div className="p-6 rounded-2xl border border-accent/30 bg-accent/5 space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-accent flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              <span>Multi-Stage Autonomous Investigation in Progress</span>
            </h3>
            <span className="text-[10px] font-mono text-accent">Active Pipeline</span>
          </div>

          <div className="space-y-3">
            {[
              '1. Identifying relevant document clusters and scope filters',
              '2. Retrieving high-confidence passages & quantitative data points',
              '3. Cross-document comparison & temporal alignment check',
              '4. Reconciling discrepancies & verifying source attribution',
            ].map((stg, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-foreground/80">
                <span className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span>{stg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Output Dossier */}
      {activeResearchReport && !isResearching && (
        <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-6">
          {/* Header Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-wider">
                Synthesized Research Dossier
              </span>
              <h2 className="text-base font-semibold text-foreground mt-0.5">
                {activeResearchReport.query}
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Generated {new Date(activeResearchReport.createdAt).toLocaleString()} • {activeResearchReport.retrievedCitations.length} Grounded Citations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card-elevated hover:bg-card text-xs font-medium text-foreground transition-colors"
              >
                {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSaveReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card-elevated hover:bg-card text-xs font-medium text-foreground transition-colors"
              >
                <Bookmark size={13} className={saved ? 'text-accent fill-accent' : ''} />
                <span>{saved ? 'Saved' : 'Save Dossier'}</span>
              </button>
            </div>
          </div>

          {/* Research Stage Progress Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {activeResearchReport.stages.map((stg) => (
              <div key={stg.id} className="p-2.5 rounded-lg border border-border bg-card-elevated/40 text-xs">
                <div className="flex items-center gap-1.5 text-success font-medium text-[11px]">
                  <CheckCircle2 size={12} />
                  <span>Stage Verified</span>
                </div>
                <p className="text-foreground font-medium text-[11px] mt-1 line-clamp-1">{stg.label}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5 truncate">{stg.detail}</p>
              </div>
            ))}
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 space-y-2">
            <h3 className="text-xs font-semibold text-accent uppercase tracking-wider">
              Executive Synthesis
            </h3>
            <p className="text-xs text-foreground/90 leading-relaxed">
              {activeResearchReport.executiveSummary}
            </p>
          </div>

          {/* Detailed Findings */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
              Corroborated Document Findings
            </h3>

            {activeResearchReport.detailedFindings.map((finding, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <h4 className="text-xs font-semibold text-foreground">{finding.sectionTitle}</h4>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {finding.body}
                </p>
              </div>
            ))}
          </div>

          {/* Cross-Document Disagreements & Agreements */}
          <div className="p-4 rounded-xl border border-border bg-card-elevated/30 space-y-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-warning" />
              <span>Cross-Source Disagreements & Dependencies</span>
            </h3>
            <div className="space-y-1.5">
              {activeResearchReport.sourceAgreementsAndDisagreements.map((item, idx) => (
                <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
              Strategic Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeResearchReport.keyRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-card text-xs">
                  <span className="font-mono text-accent font-bold text-[11px]">REC-0{idx + 1}</span>
                  <p className="mt-1 text-foreground/90">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Source Citations Bar */}
          <div className="pt-4 border-t border-border">
            <span className="text-xs font-semibold text-foreground block mb-2">
              Retrieved Evidentiary Citations ({activeResearchReport.retrievedCitations.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {activeResearchReport.retrievedCitations.map(cite => (
                <div
                  key={cite.id}
                  onClick={() => setActiveCitation(cite)}
                  className="p-2.5 rounded-lg border border-border bg-card-elevated/40 hover:border-accent/40 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-accent">
                    <span className="font-bold">[{cite.index}] Page {cite.pageNumber}</span>
                    <span>{Math.round(cite.score * 100)}% match</span>
                  </div>
                  <p className="font-medium text-foreground text-[11px] truncate mt-0.5">{cite.documentTitle}</p>
                  <p className="text-muted-foreground text-[10px] line-clamp-1 italic mt-0.5">"{cite.excerpt}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
