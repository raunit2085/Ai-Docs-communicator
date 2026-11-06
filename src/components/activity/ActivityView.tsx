'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  History, 
  Upload, 
  MessageSquare, 
  SplitSquareVertical, 
  Layers, 
  FolderKanban, 
  FileText, 
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

export function ActivityView() {
  const { activities } = useKnowledgeOS();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = activities.filter(a => filterType === 'all' || a.type === filterType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload size={14} className="text-accent" />;
      case 'chat': return <MessageSquare size={14} className="text-success" />;
      case 'comparison': return <SplitSquareVertical size={14} className="text-warning" />;
      case 'research': return <Layers size={14} className="text-accent" />;
      case 'collection': return <FolderKanban size={14} className="text-accent" />;
      default: return <FileText size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl mx-auto space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <History size={20} className="text-accent" />
            <span>Workspace Activity & Audit Trail</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable log of document ingestion, vector queries, research runs, and access events.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
        >
          <option value="all">All Activity Types</option>
          <option value="upload">Document Ingestion</option>
          <option value="chat">Grounded Queries</option>
          <option value="comparison">Comparisons</option>
          <option value="research">Deep Research</option>
          <option value="collection">Collections</option>
        </select>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-card border border-border rounded-xl shadow-subtle p-4 divide-y divide-border/50">
        {filtered.map(act => (
          <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-card-elevated border border-border flex-shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">{act.description}</p>
                <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">
                  {new Date(act.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{act.userName}</span>
                <span>•</span>
                <span className="capitalize">{act.type} Event</span>
                {act.targetName && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-accent truncate">{act.targetName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
