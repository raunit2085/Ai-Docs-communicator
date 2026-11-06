'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Document, 
  DocumentChunk, 
  Collection, 
  Conversation, 
  ChatMessage, 
  Citation, 
  SavedInsight, 
  ActivityItem, 
  Workspace, 
  AiModelConfig,
  FileType,
  DeepResearchReport,
  ComparisonResult
} from '@/types';
import { INITIAL_COLLECTIONS, INITIAL_DOCUMENTS } from './rag/sampleData';
import { chunkDocument } from './rag/chunker';
import { generateEmbedding } from './rag/embeddings';
import { generateGroundedAnswer, executeDeepResearch, compareDocuments, executeIntelligentTool } from './rag/generator';

interface KnowledgeOSContextType {
  // Navigation & View
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Workspaces
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  switchWorkspace: (workspaceId: string) => void;

  // Documents
  documents: Document[];
  allChunks: DocumentChunk[];
  uploadDocument: (fileData: { name: string; size: number; content: string; type: FileType; collectionId?: string }) => Promise<Document>;
  deleteDocument: (documentId: string) => void;
  renameDocument: (documentId: string, newTitle: string) => void;
  retryDocumentProcessing: (documentId: string) => void;
  selectedDocForDetail: Document | null;
  setSelectedDocForDetail: (doc: Document | null) => void;

  // Collections
  collections: Collection[];
  createCollection: (col: Omit<Collection, 'id' | 'createdAt' | 'documentsCount' | 'workspaceId'>) => void;
  deleteCollection: (collectionId: string) => void;

  // AI Chat & Citations
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  currentConversation: Conversation | null;
  createNewConversation: (title?: string, scope?: 'all' | 'selected' | 'collection', selectedDocIds?: string[]) => string;
  sendChatMessage: (content: string) => Promise<void>;
  clearConversation: (conversationId: string) => void;
  activeCitation: Citation | null;
  setActiveCitation: (citation: Citation | null) => void;
  isStreaming: boolean;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Upload Modal
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;

  // Deep Research
  activeResearchReport: DeepResearchReport | null;
  runResearch: (query: string) => Promise<DeepResearchReport>;
  isResearching: boolean;

  // Document Comparison
  comparisonDocs: string[];
  setComparisonDocs: React.Dispatch<React.SetStateAction<string[]>>;
  toggleDocForComparison: (docId: string) => void;
  activeComparison: ComparisonResult | null;
  runDocumentComparison: (docIds?: string[]) => void;

  // Intelligent Tools
  activeToolDoc: Document | null;
  setActiveToolDoc: (doc: Document | null) => void;
  runToolOnDoc: (toolId: string, doc: Document) => { title: string; output: string; citations: Citation[] };

  // Saved Insights
  savedInsights: SavedInsight[];
  addSavedInsight: (insight: Omit<SavedInsight, 'id' | 'createdAt' | 'workspaceId'>) => void;
  deleteSavedInsight: (id: string) => void;

  // Activity Logs
  activities: ActivityItem[];

  // Settings
  aiConfig: AiModelConfig;
  updateAiConfig: (config: Partial<AiModelConfig>) => void;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-default',
    name: 'Apex Strategic Enterprise',
    slug: 'apex-strategic',
    tier: 'Enterprise',
    documentsLimit: 500,
    storageLimitMB: 5120, // 5GB
    createdAt: '2025-01-10T00:00:00Z',
    members: [
      { id: 'usr-1', name: 'Dr. Sarah Sterling', email: 'sarah.sterling@apex-os.io', role: 'owner', joinedAt: '2025-01-10T00:00:00Z' },
      { id: 'usr-2', name: 'Marcus Chen', email: 'm.chen@apex-os.io', role: 'admin', joinedAt: '2025-02-14T00:00:00Z' },
      { id: 'usr-3', name: 'Elena Rostova', email: 'e.rostova@apex-os.io', role: 'editor', joinedAt: '2025-03-01T00:00:00Z' },
    ],
  },
  {
    id: 'ws-personal',
    name: 'Private Research Lab',
    slug: 'private-research',
    tier: 'Pro',
    documentsLimit: 100,
    storageLimitMB: 2048,
    createdAt: '2025-03-20T00:00:00Z',
    members: [
      { id: 'usr-1', name: 'Dr. Sarah Sterling', email: 'sarah.sterling@apex-os.io', role: 'owner', joinedAt: '2025-03-20T00:00:00Z' },
    ],
  },
];

const DEFAULT_AI_CONFIG: AiModelConfig = {
  provider: 'built-in',
  modelName: 'KnowledgeOS Grounded Hybrid v2.4 (Glaive-70B)',
  temperature: 0.2,
  topK: 4,
  similarityThreshold: 0.28,
  rerankerEnabled: true,
  citationConfidenceThreshold: 0.85,
};

const KnowledgeOSContext = createContext<KnowledgeOSContextType | undefined>(undefined);

export function KnowledgeOSProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<string>('home');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws-default');

  // Documents and Chunks
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [allChunks, setAllChunks] = useState<DocumentChunk[]>([]);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<Document | null>(null);

  // Collections
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // Citation viewer
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Research
  const [activeResearchReport, setActiveResearchReport] = useState<DeepResearchReport | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  // Comparison
  const [comparisonDocs, setComparisonDocs] = useState<string[]>(['doc-apex-financial', 'doc-enterprise-msa']);
  const [activeComparison, setActiveComparison] = useState<ComparisonResult | null>(null);

  // Intelligent Tools
  const [activeToolDoc, setActiveToolDoc] = useState<Document | null>(null);

  // Insights
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([
    {
      id: 'ins-1',
      workspaceId: 'ws-default',
      title: 'Q3 2025 Financial Milestone',
      content: 'Apex Technologies delivered $142.8M in quarterly revenue (+18.4% YoY) with 71.2% gross margin expansion.',
      tags: ['Finance', 'Earnings', 'Q3'],
      sourceDocId: 'doc-apex-financial',
      sourceDocTitle: 'Apex Technologies Q3 2025 Performance & Strategic Outlook',
      pageNumber: 1,
      citationExcerpt: 'Apex Technologies achieved record consolidated revenue of $142.8 million in the third quarter of 2025, marking an 18.4% year-over-year increase.',
      createdAt: '2025-10-19T10:00:00Z',
    },
    {
      id: 'ins-2',
      workspaceId: 'ws-default',
      title: 'Attribution Benchmark Standard',
      content: 'Hybrid dense-sparse retrieval with reciprocal rank fusion yields 94.2% verifiable citation accuracy, reducing hallucinations by 78.4%.',
      tags: ['Research', 'RAG', 'Accuracy'],
      sourceDocId: 'doc-ai-alignment',
      sourceDocTitle: 'Verifiable Reasoning & Grounded Attribution in Large Language Models',
      pageNumber: 1,
      citationExcerpt: 'Across our 12,000 multi-document evaluation benchmark, our system achieved a 94.2% verifiable citation accuracy.',
      createdAt: '2025-10-15T15:30:00Z',
    },
  ]);

  // Activity Logs
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      workspaceId: 'ws-default',
      userId: 'usr-1',
      userName: 'Dr. Sarah Sterling',
      type: 'upload',
      description: 'Indexed Apex_Tech_Q3_2025_Financial_Report.pdf (12 pages, 14 semantic chunks)',
      targetName: 'Apex Technologies Q3 2025 Performance',
      timestamp: '2025-10-18T09:15:30Z',
    },
    {
      id: 'act-2',
      workspaceId: 'ws-default',
      userId: 'usr-1',
      userName: 'Dr. Sarah Sterling',
      type: 'comparison',
      description: 'Ran cross-document comparison: Financial Report vs Cloud Architecture Spec',
      targetName: 'Q4 2025 Strategic Alignment',
      timestamp: '2025-10-19T11:42:00Z',
    },
    {
      id: 'act-3',
      workspaceId: 'ws-default',
      userId: 'usr-2',
      userName: 'Marcus Chen',
      type: 'chat',
      description: 'Inquired about SLA liability caps and Delaware governing law jurisdiction',
      targetName: 'Master Services Agreement',
      timestamp: '2025-10-20T14:20:00Z',
    },
  ]);

  // AI Configuration
  const [aiConfig, setAiConfig] = useState<AiModelConfig>(DEFAULT_AI_CONFIG);

  // Initialize and index sample documents into chunks on first load
  useEffect(() => {
    const chunksList: DocumentChunk[] = [];
    for (const doc of INITIAL_DOCUMENTS) {
      if (doc.extractedText) {
        const docChunks = chunkDocument(doc.id, doc.title, doc.extractedText);
        for (const chk of docChunks) {
          chk.embedding = generateEmbedding(chk.content);
          chunksList.push(chk);
        }
        doc.chunks = docChunks;
      }
    }
    setAllChunks(chunksList);

    // Initial default conversation
    const initialConvId = 'conv-default-1';
    const initialConv: Conversation = {
      id: initialConvId,
      workspaceId: 'ws-default',
      title: 'Q3 Financials & Cloud SLA Audit',
      documentScope: 'all',
      selectedDocIds: [],
      messages: [
        {
          id: 'msg-welcome',
          conversationId: initialConvId,
          role: 'assistant',
          content: `Welcome to **KnowledgeOS**. I am your grounded research intelligence partner.

I have indexed your workspace documents with full vector embeddings, page boundary markers, and verifiable attribution graphs.

**What would you like to explore?**
- Ask about **revenue growth, margins, and OpEx** from the Q3 financial audit [1].
- Investigate **multi-region disaster recovery SLAs (RPO < 1min, RTO < 5min)** [2].
- Review **$5M limitation of liability and uptime commitments** in your enterprise contracts [3].
- Explore the **94.2% citation grounding benchmark** paper [4].

Every factual claim I present is directly backed by clickable inline citations linked to the original document pages.`,
          createdAt: new Date().toISOString(),
          citations: [
            { id: 'c1', index: 1, documentId: 'doc-apex-financial', documentTitle: 'Apex Technologies Q3 2025 Performance', pageNumber: 1, excerpt: 'Consolidated revenue of $142.8 million (+18.4% YoY) with 71.2% gross margin.', score: 0.98 },
            { id: 'c2', index: 2, documentId: 'doc-cloud-architecture', documentTitle: 'Enterprise Cloud Architecture Spec', pageNumber: 2, excerpt: 'RPO < 1 minute, RTO < 5 minutes via synchronous PostgreSQL WAL replication.', score: 0.96 },
            { id: 'c3', index: 3, documentId: 'doc-enterprise-msa', documentTitle: 'Master Services Agreement Enterprise Edition', pageNumber: 2, excerpt: 'Uptime Percentage of not less than 99.95% during each calendar month.', score: 0.95 },
            { id: 'c4', index: 4, documentId: 'doc-ai-alignment', documentTitle: 'Verifiable Reasoning & Grounded Attribution', pageNumber: 1, excerpt: '94.2% verifiable citation accuracy across 12,000 multi-document benchmark.', score: 0.97 },
          ],
          hasEvidence: true,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations([initialConv]);
    setActiveConversationId(initialConvId);
  }, []);

  // Theme synchronization with DOM
  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Apply initial theme on mount
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  // Current active workspace
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    logActivity('chat', `Switched active workspace to ${workspaces.find(w => w.id === workspaceId)?.name || workspaceId}`);
  };

  const logActivity = (type: ActivityItem['type'], description: string, targetName?: string) => {
    const newItem: ActivityItem = {
      id: `act-${Date.now()}`,
      workspaceId: currentWorkspaceId,
      userId: 'usr-1',
      userName: 'Dr. Sarah Sterling',
      type,
      description,
      targetName,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newItem, ...prev.slice(0, 49)]);
  };

  // Upload and process new document
  const uploadDocument = async (fileData: { name: string; size: number; content: string; type: FileType; collectionId?: string }): Promise<Document> => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: Document = {
      id: newDocId,
      workspaceId: currentWorkspaceId,
      title: fileData.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      fileName: fileData.name,
      fileType: fileData.type,
      fileSize: fileData.size,
      pagesCount: Math.max(1, Math.ceil(fileData.content.length / 2500)),
      status: 'uploading',
      processingProgress: 15,
      collectionId: fileData.collectionId,
      collectionName: collections.find(c => c.id === fileData.collectionId)?.name,
      tags: ['Uploaded', fileData.type.toUpperCase()],
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extractedText: fileData.content,
      summary: fileData.content.slice(0, 300) + '...',
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Stage 1: Uploading -> Extracting
    await new Promise(r => setTimeout(r, 600));
    setDocuments(prev => prev.map(d => d.id === newDocId ? { ...d, status: 'extracting', processingProgress: 45 } : d));

    // Stage 2: Extracting -> Chunking
    await new Promise(r => setTimeout(r, 700));
    const generatedChunks = chunkDocument(newDoc.id, newDoc.title, fileData.content);
    setDocuments(prev => prev.map(d => d.id === newDocId ? { ...d, status: 'chunking', processingProgress: 75, chunks: generatedChunks } : d));

    // Stage 3: Chunking -> Embedding
    await new Promise(r => setTimeout(r, 700));
    for (const chunk of generatedChunks) {
      chunk.embedding = generateEmbedding(chunk.content);
    }
    setAllChunks(prev => [...prev, ...generatedChunks]);

    // Stage 4: Indexed & Ready
    setDocuments(prev => prev.map(d => d.id === newDocId ? { 
      ...d, 
      status: 'indexed', 
      processingProgress: 100,
      suggestedQuestions: [
        `What are the core conclusions in ${d.title}?`,
        `Summarize the key metrics and dates documented here.`,
        `Identify any potential risks or dependencies.`,
      ],
      datesAndDeadlines: [
        { date: '2026-03-31', description: 'Scheduled document audit & review', page: 1 },
      ],
    } : d));

    logActivity('upload', `Indexed ${fileData.name} (${generatedChunks.length} semantic chunks)`, newDoc.title);

    return newDoc;
  };

  const deleteDocument = (documentId: string) => {
    const docToDelete = documents.find(d => d.id === documentId);
    setDocuments(prev => prev.filter(d => d.id !== documentId));
    setAllChunks(prev => prev.filter(c => c.documentId !== documentId));
    if (selectedDocForDetail?.id === documentId) {
      setSelectedDocForDetail(null);
    }
    logActivity('upload', `Deleted document and purged vector embeddings`, docToDelete?.title || documentId);
  };

  const renameDocument = (documentId: string, newTitle: string) => {
    setDocuments(prev => prev.map(d => d.id === documentId ? { ...d, title: newTitle, updatedAt: new Date().toISOString() } : d));
    setAllChunks(prev => prev.map(c => c.documentId === documentId ? { ...c, documentTitle: newTitle } : c));
  };

  const retryDocumentProcessing = async (documentId: string) => {
    setDocuments(prev => prev.map(d => d.id === documentId ? { ...d, status: 'extracting', processingProgress: 30, processingError: undefined } : d));
    await new Promise(r => setTimeout(r, 1000));
    const targetDoc = documents.find(d => d.id === documentId);
    if (targetDoc && targetDoc.extractedText) {
      const generatedChunks = chunkDocument(targetDoc.id, targetDoc.title, targetDoc.extractedText);
      for (const chk of generatedChunks) {
        chk.embedding = generateEmbedding(chk.content);
      }
      setAllChunks(prev => [...prev.filter(c => c.documentId !== documentId), ...generatedChunks]);
      setDocuments(prev => prev.map(d => d.id === documentId ? { ...d, status: 'indexed', processingProgress: 100, chunks: generatedChunks } : d));
    }
  };

  // Collections management
  const createCollection = (colData: Omit<Collection, 'id' | 'createdAt' | 'documentsCount' | 'workspaceId'>) => {
    const newCol: Collection = {
      ...colData,
      id: `col-${Date.now()}`,
      workspaceId: currentWorkspaceId,
      documentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCollections(prev => [...prev, newCol]);
    logActivity('collection', `Created knowledge collection: "${newCol.name}"`);
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  // Conversations
  const createNewConversation = (title?: string, scope: 'all' | 'selected' | 'collection' = 'all', selectedDocIds: string[] = []): string => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      workspaceId: currentWorkspaceId,
      title: title || 'New Research Inquiry',
      documentScope: scope,
      selectedDocIds,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const currentConversation = conversations.find(c => c.id === activeConversationId) || null;

  const clearConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  // Send message with streaming response & real RAG
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    let convId = activeConversationId;
    if (!convId || !conversations.find(c => c.id === convId)) {
      convId = createNewConversation(content.slice(0, 35) + '...');
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    // Add user message
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          title: c.messages.length === 0 ? content.slice(0, 40) : c.title,
          messages: [...c.messages, userMsg],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    setIsStreaming(true);

    // Run grounded retrieval and generation
    const activeConv = conversations.find(c => c.id === convId);
    const result = generateGroundedAnswer(content, allChunks, documents, {
      scope: activeConv?.documentScope || 'all',
      selectedDocIds: activeConv?.selectedDocIds || [],
      collectionId: activeConv?.collectionId,
    });

    // Simulate streaming delivery for smooth UX
    await new Promise(r => setTimeout(r, 600));

    const assistantMsg: ChatMessage = {
      id: `msg-resp-${Date.now()}`,
      conversationId: convId,
      role: 'assistant',
      content: result.content,
      citations: result.citations,
      hasEvidence: result.hasEvidence,
      unsupportedClaimsNote: result.unsupportedClaimsNote,
      createdAt: new Date().toISOString(),
    };

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: [...c.messages, assistantMsg],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    setIsStreaming(false);
    logActivity('chat', `Asked: "${content.slice(0, 50)}..."`, result.hasEvidence ? `${result.citations.length} citations verified` : 'Ungrounded notice');
  };

  // Deep Research
  const runResearch = async (query: string): Promise<DeepResearchReport> => {
    setIsResearching(true);
    await new Promise(r => setTimeout(r, 1200));
    const report = executeDeepResearch(query, allChunks, documents);
    setActiveResearchReport(report);
    setIsResearching(false);
    logActivity('research', `Completed deep research: "${query}"`, `${report.retrievedCitations.length} sources synthesized`);
    return report;
  };

  // Document Comparison
  const toggleDocForComparison = (docId: string) => {
    setComparisonDocs(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, docId];
    });
  };

  const runDocumentComparison = (docIds?: string[]) => {
    const targetIds = docIds || comparisonDocs;
    if (targetIds.length < 2) return;
    const result = compareDocuments(targetIds, documents, allChunks);
    setActiveComparison(result);
    logActivity('comparison', `Cross-analyzed ${targetIds.length} documents`, result.topic);
  };

  // Intelligent Tools
  const runToolOnDoc = (toolId: string, doc: Document) => {
    const result = executeIntelligentTool(toolId, doc, allChunks);
    logActivity('chat', `Executed intelligent tool "${result.title}"`, doc.title);
    return result;
  };

  // Saved Insights
  const addSavedInsight = (insightData: Omit<SavedInsight, 'id' | 'createdAt' | 'workspaceId'>) => {
    const newInsight: SavedInsight = {
      ...insightData,
      id: `ins-${Date.now()}`,
      workspaceId: currentWorkspaceId,
      createdAt: new Date().toISOString(),
    };
    setSavedInsights(prev => [newInsight, ...prev]);
    logActivity('export', `Saved insight: "${newInsight.title}"`);
  };

  const deleteSavedInsight = (id: string) => {
    setSavedInsights(prev => prev.filter(i => i.id !== id));
  };

  const updateAiConfig = (newConfig: Partial<AiModelConfig>) => {
    setAiConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <KnowledgeOSContext.Provider
      value={{
        activeView,
        setActiveView,
        theme,
        setTheme,
        toggleTheme,
        workspaces,
        currentWorkspace,
        switchWorkspace,
        documents,
        allChunks,
        uploadDocument,
        deleteDocument,
        renameDocument,
        retryDocumentProcessing,
        selectedDocForDetail,
        setSelectedDocForDetail,
        collections,
        createCollection,
        deleteCollection,
        conversations,
        activeConversationId,
        setActiveConversationId,
        currentConversation,
        createNewConversation,
        sendChatMessage,
        clearConversation,
        activeCitation,
        setActiveCitation,
        isStreaming,
        isSearchOpen,
        setIsSearchOpen,
        isUploadOpen,
        setIsUploadOpen,
        activeResearchReport,
        runResearch,
        isResearching,
        comparisonDocs,
        setComparisonDocs,
        toggleDocForComparison,
        activeComparison,
        runDocumentComparison,
        activeToolDoc,
        setActiveToolDoc,
        runToolOnDoc,
        savedInsights,
        addSavedInsight,
        deleteSavedInsight,
        activities,
        aiConfig,
        updateAiConfig,
      }}
    >
      {children}
    </KnowledgeOSContext.Provider>
  );
}

export function useKnowledgeOS() {
  const context = useContext(KnowledgeOSContext);
  if (!context) {
    throw new Error('useKnowledgeOS must be used within KnowledgeOSProvider');
  }
  return context;
}
