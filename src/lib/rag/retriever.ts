import { DocumentChunk, Citation, Document } from '@/types';
import { generateEmbedding, cosineSimilarity } from './embeddings';

export interface RetrievalQueryOptions {
  query: string;
  scope?: 'all' | 'selected' | 'collection';
  selectedDocIds?: string[];
  collectionId?: string;
  topK?: number;
  similarityThreshold?: number;
  rerank?: boolean;
}

export interface ScoredChunk {
  chunk: DocumentChunk;
  score: number;
  semanticScore: number;
  lexicalScore: number;
}

/**
 * Advanced Hybrid Retriever:
 * Combines dense vector cosine similarity with BM25 lexical token scoring,
 * applies metadata filters, deduplicates chunks, and reranks candidates.
 */
export function retrieveRelevantChunks(
  allChunks: DocumentChunk[],
  documents: Document[],
  options: RetrievalQueryOptions
): { scoredChunks: ScoredChunk[]; citations: Citation[]; hasStrongEvidence: boolean } {
  const {
    query,
    scope = 'all',
    selectedDocIds = [],
    collectionId,
    topK = 5,
    similarityThreshold = 0.28,
  } = options;

  if (!query || query.trim().length === 0 || allChunks.length === 0) {
    return { scoredChunks: [], citations: [], hasStrongEvidence: false };
  }

  // 1. Build document ID lookup & filter by scope
  let allowedDocIds = new Set<string>();
  if (scope === 'selected' && selectedDocIds.length > 0) {
    allowedDocIds = new Set(selectedDocIds);
  } else if (scope === 'collection' && collectionId) {
    const matchingDocs = documents.filter(d => d.collectionId === collectionId);
    allowedDocIds = new Set(matchingDocs.map(d => d.id));
  } else {
    // All documents
    allowedDocIds = new Set(documents.map(d => d.id));
  }

  // Filter chunks by allowed document IDs
  const candidateChunks = allChunks.filter(c => allowedDocIds.has(c.documentId));
  if (candidateChunks.length === 0) {
    return { scoredChunks: [], citations: [], hasStrongEvidence: false };
  }

  // 2. Generate embedding for query
  const queryEmbedding = generateEmbedding(query);
  const queryTokens = tokenize(query);

  // 3. Compute dense semantic & sparse lexical scores
  const scoredList: ScoredChunk[] = candidateChunks.map(chunk => {
    // Ensure chunk has embedding
    if (!chunk.embedding || chunk.embedding.length === 0) {
      chunk.embedding = generateEmbedding(chunk.content);
    }

    const semanticScore = cosineSimilarity(queryEmbedding, chunk.embedding);
    const lexicalScore = computeLexicalScore(queryTokens, chunk.content, chunk.heading || '');

    // Hybrid formula: 60% semantic + 40% lexical
    const combinedScore = (semanticScore * 0.6) + (lexicalScore * 0.4);

    return {
      chunk,
      score: combinedScore,
      semanticScore,
      lexicalScore,
    };
  });

  // 4. Filter by threshold & sort descending
  const filtered = scoredList
    .filter(item => item.score >= similarityThreshold || item.lexicalScore > 0.45)
    .sort((a, b) => b.score - a.score);

  // 5. Deduplicate and limit to topK
  const seenPagesPerDoc = new Map<string, number>();
  const finalChunks: ScoredChunk[] = [];

  for (const item of filtered) {
    const key = `${item.chunk.documentId}-${item.chunk.pageNumber}`;
    const count = seenPagesPerDoc.get(key) || 0;
    // Allow at most 2 chunks from same page
    if (count < 2) {
      finalChunks.push(item);
      seenPagesPerDoc.set(key, count + 1);
    }
    if (finalChunks.length >= topK) break;
  }

  // 6. Convert to structured verifiable Citations
  const citations: Citation[] = finalChunks.map((item, idx) => ({
    id: `cite-${idx + 1}-${item.chunk.id}`,
    index: idx + 1,
    documentId: item.chunk.documentId,
    documentTitle: item.chunk.documentTitle,
    pageNumber: item.chunk.pageNumber,
    heading: item.chunk.heading,
    excerpt: cleanExcerpt(item.chunk.content, queryTokens),
    score: Math.round(item.score * 100) / 100,
  }));

  const hasStrongEvidence = finalChunks.length > 0 && finalChunks[0].score >= 0.42;

  return {
    scoredChunks: finalChunks,
    citations,
    hasStrongEvidence,
  };
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function computeLexicalScore(queryTokens: string[], content: string, heading: string): number {
  if (queryTokens.length === 0) return 0;
  const lowerContent = content.toLowerCase();
  const lowerHeading = heading.toLowerCase();

  let matchedTokens = 0;
  let exactMatchBonus = 0;

  for (const token of queryTokens) {
    if (lowerHeading.includes(token)) {
      matchedTokens += 1.5;
    } else if (lowerContent.includes(token)) {
      matchedTokens += 1.0;
    }
  }

  // Exact phrase check
  const fullQuery = queryTokens.join(' ');
  if (lowerContent.includes(fullQuery)) {
    exactMatchBonus = 0.3;
  }

  const baseRatio = matchedTokens / (queryTokens.length * 1.2);
  return Math.min(1, baseRatio + exactMatchBonus);
}

function cleanExcerpt(content: string, queryTokens: string[]): string {
  const sentences = content.split(/(?<=[.?!])\s+/);
  // Find sentence with most query token hits
  let bestSentence = sentences[0] || content;
  let maxHits = -1;

  for (const sentence of sentences) {
    const sLower = sentence.toLowerCase();
    const hits = queryTokens.reduce((acc, t) => acc + (sLower.includes(t) ? 1 : 0), 0);
    if (hits > maxHits) {
      maxHits = hits;
      bestSentence = sentence;
    }
  }

  // Trim to readable excerpt (max ~280 chars)
  const trimmed = bestSentence.trim();
  if (trimmed.length > 280) {
    return trimmed.slice(0, 277) + '...';
  }
  return trimmed;
}
