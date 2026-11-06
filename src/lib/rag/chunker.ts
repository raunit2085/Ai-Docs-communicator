import { DocumentChunk } from '@/types';

export interface ChunkingOptions {
  maxChunkSize?: number; // target max tokens (approx 200-400 words)
  chunkOverlap?: number;
}

/**
 * Document-aware chunker that respects page boundaries, markdown headers,
 * lists and paragraphs while preserving hierarchical metadata.
 */
export function chunkDocument(
  documentId: string,
  documentTitle: string,
  fullText: string,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const { maxChunkSize = 350 } = options;
  const chunks: DocumentChunk[] = [];
  
  if (!fullText || fullText.trim().length === 0) {
    return chunks;
  }

  // Detect pages if marked by "Page X:" or "## Page X:" or form feeds
  const pageRegex = /(?:(?:^|\n)(?:#{1,3}\s*)?Page\s+(\d+)[:\s\-]+)/im;
  const hasPageMarkers = pageRegex.test(fullText);

  let rawPages: Array<{ pageNumber: number; text: string }> = [];

  if (hasPageMarkers) {
    const lines = fullText.split('\n');
    let currentPage = 1;
    let currentBuffer: string[] = [];

    for (const line of lines) {
      const match = line.match(/(?:^|\n)(?:#{1,3}\s*)?Page\s+(\d+)[:\s\-]+/i);
      if (match) {
        if (currentBuffer.length > 0) {
          rawPages.push({ pageNumber: currentPage, text: currentBuffer.join('\n').trim() });
          currentBuffer = [];
        }
        currentPage = parseInt(match[1], 10) || currentPage + 1;
      }
      currentBuffer.push(line);
    }
    if (currentBuffer.length > 0) {
      rawPages.push({ pageNumber: currentPage, text: currentBuffer.join('\n').trim() });
    }
  } else {
    // If no explicit page markers, divide content logically by sections or ~600 words per page
    const paragraphs = fullText.split(/\n\s*\n/);
    let currentPage = 1;
    let wordCountInPage = 0;
    let currentBuffer: string[] = [];

    for (const p of paragraphs) {
      const words = p.split(/\s+/).length;
      if (wordCountInPage + words > 500 && currentBuffer.length > 0) {
        rawPages.push({ pageNumber: currentPage, text: currentBuffer.join('\n\n') });
        currentBuffer = [];
        currentPage++;
        wordCountInPage = 0;
      }
      currentBuffer.push(p);
      wordCountInPage += words;
    }
    if (currentBuffer.length > 0) {
      rawPages.push({ pageNumber: currentPage, text: currentBuffer.join('\n\n') });
    }
  }

  let globalChunkIndex = 0;

  for (const page of rawPages) {
    const pageLines = page.text.split('\n');
    let currentHeading = `Page ${page.pageNumber}`;
    let paragraphBuffer: string[] = [];

    for (const line of pageLines) {
      const trimmed = line.trim();
      // Check for headings
      if (trimmed.startsWith('#') || /^[A-Z0-9\s\-_]{3,40}:/.test(trimmed)) {
        if (paragraphBuffer.length > 0) {
          const content = paragraphBuffer.join('\n').trim();
          if (content.length > 20) {
            chunks.push(createChunk({
              id: `${documentId}-chk-${globalChunkIndex}`,
              documentId,
              documentTitle,
              chunkIndex: globalChunkIndex++,
              pageNumber: page.pageNumber,
              heading: currentHeading,
              content,
            }));
          }
          paragraphBuffer = [];
        }
        currentHeading = trimmed.replace(/^#+\s*/, '').replace(/:$/, '').trim();
      } else if (trimmed.length > 0) {
        paragraphBuffer.push(trimmed);
      } else if (paragraphBuffer.length > 0) {
        // Empty line -> paragraph break
        const content = paragraphBuffer.join('\n').trim();
        const estTokens = Math.ceil(content.length / 4);
        if (estTokens >= maxChunkSize) {
          chunks.push(createChunk({
            id: `${documentId}-chk-${globalChunkIndex}`,
            documentId,
            documentTitle,
            chunkIndex: globalChunkIndex++,
            pageNumber: page.pageNumber,
            heading: currentHeading,
            content,
          }));
          paragraphBuffer = [];
        }
      }
    }

    if (paragraphBuffer.length > 0) {
      const content = paragraphBuffer.join('\n').trim();
      if (content.length > 20) {
        chunks.push(createChunk({
          id: `${documentId}-chk-${globalChunkIndex}`,
          documentId,
          documentTitle,
          chunkIndex: globalChunkIndex++,
          pageNumber: page.pageNumber,
          heading: currentHeading,
          content,
        }));
      }
    }
  }

  // Fallback: if no chunks created, split fullText into standard chunks
  if (chunks.length === 0 && fullText.trim().length > 0) {
    chunks.push(createChunk({
      id: `${documentId}-chk-0`,
      documentId,
      documentTitle,
      chunkIndex: 0,
      pageNumber: 1,
      heading: 'General Content',
      content: fullText.trim(),
    }));
  }

  return chunks;
}

function createChunk(data: {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  pageNumber: number;
  heading: string;
  content: string;
}): DocumentChunk {
  const tokenCount = Math.max(1, Math.ceil(data.content.length / 4));
  return {
    ...data,
    tokenCount,
  };
}
