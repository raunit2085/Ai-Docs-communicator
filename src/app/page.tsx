'use client';

import React from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { HomeView } from '@/components/home/HomeView';
import { DocumentLibrary } from '@/components/library/DocumentLibrary';
import { DocumentDetailModal } from '@/components/library/DocumentDetailModal';
import { UploadModal } from '@/components/library/UploadModal';
import { AiChatView } from '@/components/chat/AiChatView';
import { DeepResearchView } from '@/components/research/DeepResearchView';
import { CompareView } from '@/components/compare/CompareView';
import { IntelligentToolsModal } from '@/components/tools/IntelligentToolsModal';
import { CollectionsView } from '@/components/collections/CollectionsView';
import { SavedInsightsView } from '@/components/insights/SavedInsightsView';
import { ActivityView } from '@/components/activity/ActivityView';
import { SettingsView } from '@/components/settings/SettingsView';
import { Users2, ExternalLink } from 'lucide-react';

export default function App() {
  const { activeView, setActiveView } = useKnowledgeOS();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* 1. Left Persistent Sidebar */}
      <Sidebar />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Dynamic View Router */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {activeView === 'home' && <HomeView />}
          {activeView === 'library' && <DocumentLibrary />}
          {activeView === 'chat' && <AiChatView />}
          {activeView === 'research' && <DeepResearchView />}
          {activeView === 'compare' && <CompareView />}
          {activeView === 'collections' && <CollectionsView />}
          {activeView === 'insights' && <SavedInsightsView />}
          {activeView === 'activity' && <ActivityView />}
          {activeView === 'settings' && <SettingsView />}

          {/* Shared With Me View Placeholder */}
          {activeView === 'shared' && (
            <div className="flex-1 p-8 max-w-4xl mx-auto space-y-6">
              <div className="pb-3 border-b border-border">
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users2 size={20} className="text-accent" />
                  <span>Shared With Me</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  External documents, research dossiers, and collections shared by partner organizations.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'PwC Global Security & Audit Clearance Memo 2025',
                    sender: 'compliance@pwc-audit.partner',
                    role: 'Viewer (Read-only)',
                    date: 'Yesterday at 4:15 PM',
                    type: 'PDF',
                  },
                  {
                    title: 'Cross-Border GDPR Sovereign Transfer Certification',
                    sender: 'legal-eu@frankfurt-datacenter.de',
                    role: 'Editor',
                    date: '3 days ago',
                    type: 'DOCX',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between text-xs shadow-subtle">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-card-elevated border border-border font-mono text-[10px] font-bold text-accent uppercase flex items-center justify-center">
                        {item.type}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground text-[11px]">
                          Shared by <span className="font-mono">{item.sender}</span> • {item.date}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-card-elevated border border-border text-[11px] font-medium text-foreground">
                      {item.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals & Command Overlays */}
      <CommandPalette />
      <UploadModal />
      <DocumentDetailModal />
      <IntelligentToolsModal />
    </div>
  );
}
