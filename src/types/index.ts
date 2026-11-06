export type ProcessingStatus = 
  | 'uploading' 
  | 'extracting' 
  | 'chunking' 
  | 'embedding' 
  | 'indexed' 
  | 'failed';

export type FileType = 'pdf' | 'docx' | 'txt' | 'md' | 'csv' | 'xlsx' | 'pptx';

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  members: WorkspaceMember[];
  tier: 'Starter' | 'Pro' | 'Enterprise';
  documentsLimit: number;
  storageLimitMB: number;
  createdAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  pageNumber: number;
  heading?: string;
  content: string;
  tokenCount: number;
  embedding?: number[];
  relevanceScore?: number;
}

export interface Document {
  id: string;
  workspaceId: string;
  title: string;
  fileName: string;
  fileType: FileType;
  fileSize: number; // bytes
  pagesCount: number;
  status: ProcessingStatus;
  processingProgress?: number; // 0 to 100
  processingError?: string;
  collectionId?: string;
  collectionName?: string;
  tags: string[];
  uploadedAt: string;
  updatedAt: string;
  author?: string;
  summary?: string;
  suggestedQuestions?: string[];
  keyEntities?: string[];
  datesAndDeadlines?: Array<{ date: string; description: string; page: number }>;
  extractedText?: string;
  chunks?: DocumentChunk[];
}

export interface Collection {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  tags: string[];
  documentsCount: number;
  createdAt: string;
}

export interface Citation {
  id: string;
  index: number;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  excerpt: string;
  score: number;
  heading?: string;
  characterOffset?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  hasEvidence?: boolean;
  unsupportedClaimsNote?: string;
  createdAt: string;
  feedback?: 'like' | 'dislike';
  savedInsightId?: string;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  title: string;
  documentScope: 'all' | 'selected' | 'collection';
  selectedDocIds: string[];
  collectionId?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedInsight {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  tags: string[];
  sourceDocId?: string;
  sourceDocTitle?: string;
  pageNumber?: number;
  citationExcerpt?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  type: 'upload' | 'chat' | 'comparison' | 'research' | 'collection' | 'export';
  description: string;
  targetName?: string;
  timestamp: string;
}

export interface ComparisonResult {
  id: string;
  documentIds: string[];
  documentTitles: string[];
  topic: string;
  createdAt: string;
  executiveSummary: string;
  metricsTable: Array<{
    dimension: string;
    values: { [docTitle: string]: string };
    citations: Citation[];
    consensusOrConflict: 'aligned' | 'conflict' | 'unique';
  }>;
  keyDifferences: Array<{
    point: string;
    explanation: string;
    citations: Citation[];
  }>;
  contradictions: Array<{
    claimA: { text: string; docTitle: string; page: number };
    claimB: { text: string; docTitle: string; page: number };
    severity: 'high' | 'medium' | 'low';
    analysis: string;
  }>;
  sharedThemes: string[];
}

export interface ResearchStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  detail?: string;
}

export interface DeepResearchReport {
  id: string;
  query: string;
  status: 'running' | 'completed' | 'failed';
  stages: ResearchStage[];
  executiveSummary: string;
  detailedFindings: Array<{
    sectionTitle: string;
    body: string;
    citations: Citation[];
  }>;
  sourceAgreementsAndDisagreements: string[];
  keyRecommendations: string[];
  retrievedCitations: Citation[];
  createdAt: string;
}

export interface AiModelConfig {
  provider: 'built-in' | 'openai' | 'anthropic' | 'gemini';
  modelName: string;
  apiKey?: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  rerankerEnabled: boolean;
  citationConfidenceThreshold: number;
}
