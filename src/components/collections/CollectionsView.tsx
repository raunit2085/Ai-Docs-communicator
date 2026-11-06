'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  FolderKanban, 
  Plus, 
  FileText, 
  Sparkles, 
  Trash2, 
  Tag, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Server
} from 'lucide-react';

export function CollectionsView() {
  const { 
    collections, 
    documents, 
    createCollection, 
    deleteCollection, 
    setActiveView, 
    createNewConversation 
  } = useKnowledgeOS();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCollection({
      name,
      description,
      color: '#635BFF',
      icon: 'folder',
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
    });
    setName('');
    setDescription('');
    setTagInput('');
    setIsCreating(false);
  };

  const handleChatWithCollection = (colId: string, colName: string) => {
    setActiveView('chat');
    createNewConversation(`Collection: ${colName}`, 'collection');
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <FolderKanban size={20} className="text-accent" />
            <span>Knowledge Collections</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize documents into thematic knowledge silos for targeted retrieval and scoped research.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-95 shadow-sm"
        >
          <Plus size={14} />
          <span>New Collection</span>
        </button>
      </div>

      {/* Creation Modal / Card */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl border border-accent/30 bg-card shadow-card space-y-3">
          <h2 className="text-xs font-semibold text-foreground">Create New Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Collection Name (e.g. Q4 Audit Reports)"
              className="p-2 rounded-lg border border-border bg-card-elevated/40 text-xs text-foreground outline-none focus:border-accent"
              required
            />
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Tags comma separated (e.g. Finance, Audit, 2025)"
              className="p-2 rounded-lg border border-border bg-card-elevated/40 text-xs text-foreground outline-none focus:border-accent"
            />
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            placeholder="Collection description & research scope..."
            className="w-full p-2 rounded-lg border border-border bg-card-elevated/40 text-xs text-foreground outline-none focus:border-accent"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-95"
            >
              Save Collection
            </button>
          </div>
        </form>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map(col => {
          const colDocs = documents.filter(d => d.collectionId === col.id);
          return (
            <div
              key={col.id}
              className="p-5 rounded-2xl border border-border bg-card hover:border-accent/40 transition-all shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                      style={{ backgroundColor: col.color || '#635BFF' }}
                    >
                      <FolderKanban size={18} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{col.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-mono">{colDocs.length} documents indexed</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCollection(col.id)}
                    className="p-1 text-muted-foreground hover:text-error transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {col.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {col.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-card-elevated border border-border text-[10px] font-mono text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <button
                  onClick={() => handleChatWithCollection(col.id, col.name)}
                  className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <MessageSquare size={13} />
                  <span>Chat with Collection</span>
                </button>

                <button
                  onClick={() => setActiveView('library')}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <span>View Files</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
