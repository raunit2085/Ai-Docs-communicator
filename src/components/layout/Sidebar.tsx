'use client';

import React, { useState } from 'react';
import { useKnowledgeOS } from '@/lib/store';
import { 
  Home, 
  Library, 
  Sparkles, 
  FolderKanban, 
  SplitSquareVertical, 
  Bookmark, 
  Users2, 
  History, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Upload, 
  ChevronsUpDown,
  Check,
  Building,
  Shield,
  Layers
} from 'lucide-react';

export function Sidebar() {
  const { 
    activeView, 
    setActiveView, 
    documents, 
    collections, 
    workspaces, 
    currentWorkspace, 
    switchWorkspace,
    setIsUploadOpen,
    savedInsights
  } = useKnowledgeOS();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, count: null },
    { id: 'library', label: 'My Library', icon: Library, count: documents.length },
    { id: 'chat', label: 'AI Chat & RAG', icon: Sparkles, count: null },
    { id: 'research', label: 'AI Research', icon: Layers, badge: 'Pro' },
    { id: 'collections', label: 'Collections', icon: FolderKanban, count: collections.length },
    { id: 'compare', label: 'Compare Documents', icon: SplitSquareVertical, count: null },
    { id: 'insights', label: 'Saved Insights', icon: Bookmark, count: savedInsights.length },
    { id: 'shared', label: 'Shared With Me', icon: Users2, count: 2 },
    { id: 'activity', label: 'Activity Log', icon: History, count: null },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent text-white shadow-sm font-semibold text-sm">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                KnowledgeOS
                <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-card-elevated text-muted-foreground border border-border">
                  v2.4
                </span>
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white font-semibold text-sm">
            K
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Workspace Switcher Selector */}
      <div className="p-3 border-b border-border relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-border hover:bg-card-elevated text-left transition-colors ${
            isCollapsed ? 'justify-center p-2' : ''
          }`}
          title="Switch workspace"
        >
          <Building size={16} className="text-accent flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{currentWorkspace.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">{currentWorkspace.tier} Plan</p>
            </div>
          )}
          {!isCollapsed && <ChevronsUpDown size={14} className="text-muted-foreground" />}
        </button>

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && !isCollapsed && (
          <div className="absolute top-14 left-3 right-3 bg-card border border-border rounded-lg shadow-dropdown p-1.5 z-50">
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Workspaces
            </div>
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws.id);
                  setShowWorkspaceMenu(false);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-card-elevated text-xs transition-colors"
              >
                <span className="truncate text-foreground font-medium">{ws.name}</span>
                {ws.id === currentWorkspace.id && <Check size={14} className="text-accent" />}
              </button>
            ))}
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => {
                setShowWorkspaceMenu(false);
                setActiveView('settings');
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-card-elevated rounded-md"
            >
              <Plus size={14} />
              <span>Create New Workspace</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Action Button: Upload */}
      <div className="p-3">
        <button
          onClick={() => setIsUploadOpen(true)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent text-white font-medium text-xs shadow-sm hover:opacity-95 transition-opacity ${
            isCollapsed ? 'px-2' : ''
          }`}
          title="Upload documents"
        >
          <Upload size={14} />
          {!isCollapsed && <span>Upload Documents</span>}
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive 
                  ? 'bg-accent/10 text-accent font-semibold' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-elevated'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon size={16} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.count !== null && item.count !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-card-elevated text-muted-foreground">
                  {item.count}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-2 border-t border-border space-y-0.5">
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors ${
            activeView === 'settings' ? 'bg-card-elevated text-foreground' : ''
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="Settings & Models"
        >
          <Settings size={16} />
          {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
        </button>

        <a
          href="https://github.com/raunit2085/Ai-Docs-communicator"
          target="_blank"
          rel="noreferrer"
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Documentation"
        >
          <HelpCircle size={16} />
          {!isCollapsed && <span className="flex-1 text-left">Help & Docs</span>}
        </a>

        {/* User Card */}
        <div className={`pt-2 flex items-center gap-2.5 px-2 py-1.5 rounded-lg border border-border/50 bg-card-elevated/40 ${
          isCollapsed ? 'justify-center p-1' : ''
        }`}>
          <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center font-semibold text-xs flex-shrink-0">
            SS
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Dr. Sarah Sterling</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">Owner / Enterprise</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
