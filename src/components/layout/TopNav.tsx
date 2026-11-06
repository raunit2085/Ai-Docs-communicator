'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  HardDrive, 
  CheckCircle2, 
  ExternalLink, 
  Command, 
  Sparkles,
  Database,
  Layers
} from 'lucide-react';

export function TopNav() {
  const { 
    theme, 
    toggleTheme, 
    setIsSearchOpen, 
    setIsUploadOpen, 
    documents, 
    currentWorkspace,
    activities
  } = useKnowledgeOS();

  const [showNotifications, setShowNotifications] = useState(false);

  // Compute live storage metrics
  const totalSizeBytes = documents.reduce((acc, d) => acc + (d.fileSize || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const totalPages = documents.reduce((acc, d) => acc + (d.pagesCount || 1), 0);
  const indexedCount = documents.filter(d => d.status === 'indexed').length;
  const coveragePercent = documents.length > 0 ? Math.round((indexedCount / documents.length) * 100) : 100;

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Global Search Pill */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border bg-card-elevated/50 text-muted-foreground hover:text-foreground hover:border-accent/40 text-xs transition-all shadow-subtle group"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="group-hover:text-accent transition-colors" />
            <span>Search documents, citations, or natural queries...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-card border border-border text-muted-foreground">
            <Command size={10} /> K
          </kbd>
        </button>
      </div>

      {/* Right: Operational Status & Controls */}
      <div className="flex items-center gap-3">
        {/* Knowledge Coverage Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-card-elevated/70 border border-border text-xs">
          <CheckCircle2 size={13} className="text-success" />
          <span className="text-muted-foreground text-[11px]">Indexed:</span>
          <span className="font-mono font-medium text-foreground text-[11px]">{coveragePercent}% ({totalPages} pgs)</span>
        </div>

        {/* Storage Usage Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-card-elevated/70 border border-border text-xs">
          <HardDrive size={13} className="text-accent" />
          <span className="text-muted-foreground text-[11px]">Storage:</span>
          <span className="font-mono font-medium text-foreground text-[11px]">
            {totalSizeMB} MB / {currentWorkspace.storageLimitMB / 1024} GB
          </span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors relative"
            title="System Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-dropdown p-3 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <span className="text-xs font-semibold text-foreground">Recent Activity & Alerts</span>
                <span className="text-[10px] text-accent font-medium">Clear</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activities.slice(0, 4).map(act => (
                  <div key={act.id} className="text-xs p-2 rounded-lg bg-card-elevated/50 border border-border/40">
                    <p className="font-medium text-foreground text-[11px] truncate">{act.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.targetName || 'System'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Workspace Pill */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border">
          <div className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent/10 text-accent border border-accent/20">
            {currentWorkspace.tier}
          </div>
        </div>
      </div>
    </header>
  );
}
