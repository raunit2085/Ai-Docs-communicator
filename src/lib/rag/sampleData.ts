import { Document, Collection } from '@/types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-finance',
    workspaceId: 'ws-default',
    name: 'Financial Reports & Strategy',
    description: 'Quarterly earnings, 10-K filings, budget allocations, and audited financial statements.',
    color: '#16865C',
    icon: 'trending-up',
    tags: ['Finance', 'Q3', 'SEC', 'Audit'],
    documentsCount: 1,
    createdAt: '2025-09-15T08:00:00Z',
  },
  {
    id: 'col-research',
    workspaceId: 'ws-default',
    name: 'AI & Scientific Research',
    description: 'Peer-reviewed research papers on LLM verification, retrieval architectures, and safety alignment.',
    color: '#635BFF',
    icon: 'cpu',
    tags: ['AI/ML', 'RAG', 'Safety', 'Alignment'],
    documentsCount: 1,
    createdAt: '2025-08-10T10:30:00Z',
  },
  {
    id: 'col-legal',
    workspaceId: 'ws-default',
    name: 'Legal & Compliance',
    description: 'Master service agreements, vendor privacy terms, NDAs, and international compliance policies.',
    color: '#D99530',
    icon: 'shield-check',
    tags: ['Legal', 'SLA', 'Contracts', 'Compliance'],
    documentsCount: 1,
    createdAt: '2025-07-20T14:15:00Z',
  },
  {
    id: 'col-engineering',
    workspaceId: 'ws-default',
    name: 'Cloud Architecture & Infrastructure',
    description: 'System design specs, disaster recovery protocols, database topologies, and SOC2 security frameworks.',
    color: '#3B82F6',
    icon: 'server',
    tags: ['Architecture', 'Cloud', 'PostgreSQL', 'Security'],
    documentsCount: 1,
    createdAt: '2025-10-01T11:00:00Z',
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-apex-financial',
    workspaceId: 'ws-default',
    title: 'Apex Technologies Q3 2025 Performance & Strategic Outlook',
    fileName: 'Apex_Tech_Q3_2025_Financial_Report.pdf',
    fileType: 'pdf',
    fileSize: 3482100, // ~3.4MB
    pagesCount: 12,
    status: 'indexed',
    processingProgress: 100,
    collectionId: 'col-finance',
    collectionName: 'Financial Reports & Strategy',
    tags: ['Q3-2025', 'Revenue', 'Operating-Expenses', 'Cloud-Transition'],
    uploadedAt: '2025-10-18T09:12:00Z',
    updatedAt: '2025-10-18T09:15:30Z',
    author: 'Office of the CFO, Apex Technologies Inc.',
    summary: 'Apex Technologies reported strong Q3 2025 consolidated revenue of $142.8M, representing an 18.4% YoY expansion driven by enterprise AI SaaS subscriptions. Gross margin expanded to 71.2%, while operating expenses increased by 14.2% due to accelerated R&D cloud infrastructure investments. The cloud migration is slated for completion by December 15, 2025.',
    suggestedQuestions: [
      'What was the revenue growth and gross margin in Q3 2025?',
      'How much did operating expenses increase and what drove the rise?',
      'When is the enterprise cloud migration scheduled to conclude?',
      'What are the primary risk factors identified for Q4 2025?',
    ],
    keyEntities: ['Apex Technologies Inc.', 'Enterprise AI Suite', 'CFO Sarah Sterling', 'AWS GovCloud', 'PwC Audit'],
    datesAndDeadlines: [
      { date: '2025-09-30', description: 'Close of Q3 fiscal accounting period', page: 2 },
      { date: '2025-11-20', description: 'Filing of SEC Form 10-Q report', page: 8 },
      { date: '2025-12-15', description: 'Target completion for multi-region cloud migration', page: 11 },
    ],
    extractedText: `APEX TECHNOLOGIES INC. — THIRD QUARTER 2025 FINANCIAL PERFORMANCE & AUDIT REVIEW

Page 1: Executive Overview & Highlights
Apex Technologies achieved record consolidated revenue of $142.8 million in the third quarter of 2025, marking an 18.4% year-over-year increase compared to $120.6 million in Q3 2024. Subscription ARR (Annual Recurring Revenue) reached $512.4 million, reflecting 22.8% YoY growth. 
Gross margin reached 71.2%, expanding 280 basis points over the prior year period, primarily resulting from architectural optimizations in our vector compute tier and renegotiated hosting agreements.
Operating cash flow stood at $38.6 million, an increase of 24.1% year-over-year.

Page 2: Revenue Breakdown by Division
- Enterprise Document AI Suite: $84.2M (59.0% of total revenue, +26.4% YoY)
- Cloud Workflow Automation: $38.5M (27.0% of total revenue, +11.2% YoY)
- Professional Advisory & Implementation: $20.1M (14.0% of total revenue, +4.1% YoY)
International market revenue accounted for 32.5% of total Q3 revenue, driven by aggressive expansion across Germany, Japan, and the United Kingdom.

Page 3: Operating Expenses & R&D Allocations
Total operating expenses for Q3 2025 were $68.4 million, an increase of 14.2% from $59.9 million in Q3 2024. 
- Research and Development (R&D): $34.5 million (50.4% of total OpEx, representing 24.2% of total revenue). This reflects aggressive capital allocation towards proprietary grounded reasoning systems, multi-modal ingestion, and sovereign cloud infrastructure.
- Sales & Marketing (S&M): $22.1 million (32.3% of total OpEx).
- General & Administrative (G&A): $11.8 million (17.3% of total OpEx).

Page 4: Capital Expenditures & Balance Sheet Strength
The company maintains cash, cash equivalents, and marketable securities of $412.0 million as of September 30, 2025, with zero outstanding long-term debt.
Capital expenditures in Q3 were $14.2 million, largely allocated towards enterprise-grade NVIDIA H100 GPU clusters and proprietary low-latency vector indexing clusters.

Page 8: Regulatory Disclosures & SEC Milestones
Apex Technologies will officially file its comprehensive Form 10-Q with the Securities and Exchange Commission on November 20, 2025. Unqualified audit review was completed by PricewaterhouseCoopers LLP on October 12, 2025.

Page 11: Enterprise Cloud Transition & Operational Guidance
The strategic migration of our core document intelligence platform from hybrid colocation to fully managed multi-region AWS and Azure GovCloud instances is on schedule. Complete decommissioning of legacy on-premises servers is set for December 15, 2025. This transition is projected to yield an annualized OpEx savings of $14.8 million starting in FY 2026.

Page 12: Forward-Looking Guidance & Risk Disclosures
For Q4 2025, revenue is projected between $149.0 million and $152.0 million. Key risk factors include foreign exchange volatility, lengthening enterprise procurement cycles in EMEA, and potential GPU compute allocation bottlenecks.`,
  },
  {
    id: 'doc-ai-alignment',
    workspaceId: 'ws-default',
    title: 'Verifiable Reasoning & Grounded Attribution in Large Language Models',
    fileName: 'Verifiable_Reasoning_and_Grounded_Attribution_2025.pdf',
    fileType: 'pdf',
    fileSize: 2150000,
    pagesCount: 8,
    status: 'indexed',
    processingProgress: 100,
    collectionId: 'col-research',
    collectionName: 'AI & Scientific Research',
    tags: ['Research-Paper', 'Hallucination-Reduction', 'Citations', 'Multi-Hop-RAG'],
    uploadedAt: '2025-10-10T14:40:00Z',
    updatedAt: '2025-10-10T14:45:10Z',
    author: 'Dr. Elena Rostova & AI Research Consortium',
    summary: 'A benchmark study evaluating multi-hop retrieval and citation grounding across 12,000 domain-specific documents. Demonstrates that hybrid dense-sparse retrieval coupled with reciprocal rank fusion achieves a 94.2% verifiable citation accuracy, reducing hallucination rates by 78.4% compared to standard vanilla RAG.',
    suggestedQuestions: [
      'What citation accuracy was achieved in the multi-hop benchmark?',
      'How much did hybrid retrieval reduce hallucination rates?',
      'What are the latency trade-offs observed with reranking models?',
      'How does the paper propose handling missing or ungrounded evidence?',
    ],
    keyEntities: ['KnowledgeOS Lab', 'Dr. Elena Rostova', 'Stanford AI Institute', 'Reciprocal Rank Fusion (RRF)', 'Benchmark Suite V4'],
    datesAndDeadlines: [
      { date: '2025-11-01', description: 'Public open-source benchmark dataset release', page: 3 },
      { date: '2025-12-05', description: 'Oral presentation at NeurIPS Conference', page: 7 },
    ],
    extractedText: `VERIFIABLE REASONING & GROUNDED ATTRIBUTION IN LARGE LANGUAGE MODELS
Published in AI Research Proceedings, Vol 42.

Page 1: Abstract & Core Thesis
Modern generative models often suffer from ungrounded hallucinations when answering domain-specific inquiries. We present a dual-stage citation alignment framework that enforces verifiable attribution at the token generation layer. Across our 12,000 multi-document evaluation benchmark, our system achieved a 94.2% verifiable citation accuracy, while lowering total hallucination rates by 78.4% compared to standard vanilla RAG pipelines.

Page 2: Hybrid Retrieval & Reciprocal Rank Fusion (RRF)
Vector-only semantic search frequently misses exact alphanumeric tokens, regulatory section references, and precise financial numbers. We combine dense neural embeddings (1536-dimensional cosine space) with sparse BM25 lexical ranking using Reciprocal Rank Fusion (RRF):
Score(d) = sum_{m in M} 1 / (60 + Rank_m(d))
This hybrid mechanism demonstrates a 23.8% relative improvement in Mean Reciprocal Rank (MRR@10) over dense embeddings alone.

Page 4: Evidence Grounding & Verification Algorithm
When the model produces a factual proposition, the generation engine executes a sentence-level attribution pass. The token sequence is checked against retrieved chunk spans. If the cosine similarity between the claim and the retrieved passage falls below the calibrated 0.38 similarity floor, the system explicitly flags the statement as "Unverified General Knowledge" or refrains from making an ungrounded claim.

Page 5: Latency & Reranking Benchmarks
Adding cross-encoder reranking introduces an average inference latency penalty of 48ms per query. However, it increases top-3 retrieval precision from 81.2% to 95.6%. In enterprise workflows where auditability is paramount, this latency cost is entirely justified.

Page 7: Contradiction Detection across Multiple Sources
When evaluating conflicting claims across multiple documents, our multi-hop graph builder isolates temporal discrepancies (e.g., an outdated 2023 policy vs an updated 2025 policy) and surfaces both viewpoints with respective citations, preventing synthetic consensus bias.`,
  },
  {
    id: 'doc-cloud-architecture',
    workspaceId: 'ws-default',
    title: 'Enterprise Cloud Architecture & Data Residency Specification v4.2',
    fileName: 'Enterprise_Cloud_Architecture_Spec_v4.2.md',
    fileType: 'md',
    fileSize: 840000,
    pagesCount: 6,
    status: 'indexed',
    processingProgress: 100,
    collectionId: 'col-engineering',
    collectionName: 'Cloud Architecture & Infrastructure',
    tags: ['Architecture', 'SOC2', 'Data-Residency', 'Disaster-Recovery'],
    uploadedAt: '2025-10-05T16:20:00Z',
    updatedAt: '2025-10-05T16:22:00Z',
    author: 'Principal Infrastructure Architecture Group',
    summary: 'Comprehensive technical specification for KnowledgeOS cloud deployments. Mandates multi-region PostgreSQL with pgvector active-standby replication, AES-256-GCM data encryption at rest, TLS 1.3 in transit, and stringent disaster recovery objectives: RPO < 1 minute and RTO < 5 minutes. Full SOC2 Type II compliance guarantees.',
    suggestedQuestions: [
      'What are the target RPO and RTO for disaster recovery?',
      'What encryption standards are enforced for at-rest and in-transit data?',
      'How is tenant isolation maintained in PostgreSQL with pgvector?',
      'What are the compliance certifications supported by the platform?',
    ],
    keyEntities: ['PostgreSQL pgvector', 'AES-256-GCM', 'TLS 1.3', 'AWS us-east-1 / eu-central-1', 'SOC2 Type II'],
    datesAndDeadlines: [
      { date: '2025-11-15', description: 'Annual SOC2 Type II audit renewal window', page: 4 },
      { date: '2026-01-10', description: 'Mandatory zero-trust key rotation deadline', page: 5 },
    ],
    extractedText: `# ENTERPRISE CLOUD ARCHITECTURE & DATA RESIDENCY SPECIFICATION (v4.2)
Published by Enterprise Architecture Team

## Page 1: Infrastructure Overview & Tenancy Model
KnowledgeOS utilizes a cell-based multi-tenant architecture with strict logical isolation enforced at the PostgreSQL database layer via Row Level Security (RLS). Every query is guaranteed to include the authenticated workspace_id in the execution context, preventing cross-tenant leakage.

## Page 2: High Availability & Disaster Recovery Protocol
- Recovery Point Objective (RPO): < 1 minute (achieved via synchronous PostgreSQL WAL replication).
- Recovery Time Objective (RTO): < 5 minutes (automated DNS health checks and secondary cluster failover via AWS Route 53).
- Primary Region: us-east-1 (N. Virginia)
- Secondary Standby: us-west-2 (Oregon)
- EU Data Residency Cell: eu-central-1 (Frankfurt) with strict GDPR data sovereignty ensuring no EU user data leaves the Frankfurt boundary.

## Page 3: Storage & Vector Search Pipeline
Embeddings are indexed using PostgreSQL pgvector with Hierarchical Navigable Small World (HNSW) indexing structures:
- Distance metric: Cosine distance (vector_cosine_ops).
- Vector dimension: 1536 dimensions.
- Target search latency: < 12ms for Top-50 candidate retrieval across 10 million vectors.
- Document binaries and original files are persisted in encrypted S3 buckets with Object Lock enabled for immutability during legal hold.

## Page 4: Security, Encryption & Compliance Audits
- Data at Rest: Encrypted using AES-256-GCM with customer-managed keys (AWS KMS / CloudHSM).
- Data in Transit: TLS 1.3 enforced across all ingress and internal service-to-service communication.
- Certifications: SOC2 Type II audited, ISO 27001 certified, and HIPAA BAA compliant for healthcare workloads. Next annual audit window opens November 15, 2025.`,
  },
  {
    id: 'doc-enterprise-msa',
    workspaceId: 'ws-default',
    title: 'Master Services Agreement & Enterprise SLA Standard Terms',
    fileName: 'Master_Services_Agreement_Enterprise_v3.docx',
    fileType: 'docx',
    fileSize: 1420000,
    pagesCount: 10,
    status: 'indexed',
    processingProgress: 100,
    collectionId: 'col-legal',
    collectionName: 'Legal & Compliance',
    tags: ['Contracts', 'SLA', 'Indemnification', 'Termination'],
    uploadedAt: '2025-09-28T11:00:00Z',
    updatedAt: '2025-09-28T11:05:00Z',
    author: 'Legal Counsel, Apex Partners LLP',
    summary: 'Standard enterprise Master Services Agreement detailing guaranteed 99.95% monthly uptime SLA, tiered service credits for downtime, $5,000,000 mutual indemnification liability cap, 60-day written notice for convenience termination, and Delaware governing law jurisdiction.',
    suggestedQuestions: [
      'What is the guaranteed service uptime SLA and what are the credit remedies?',
      'What is the limitation of liability and indemnification cap?',
      'How many days written notice is required for termination?',
      'Which state laws govern the interpretation of this agreement?',
    ],
    keyEntities: ['Apex Technologies Inc.', 'Client Enterprise', 'Delaware Court of Chancery', 'American Arbitration Association'],
    datesAndDeadlines: [
      { date: '2025-12-31', description: 'End of initial standard contract term', page: 2 },
      { date: '2025-11-01', description: 'Effective date for updated SLA indemnification schedule', page: 6 },
    ],
    extractedText: `MASTER SERVICES AGREEMENT (ENTERPRISE EDITION v3)
Apex Technologies Inc. & Subscribed Enterprise Entity

Page 1: Engagement Scope & Effective Term
This Master Services Agreement ("Agreement") governs the provisioning of the KnowledgeOS intelligent document intelligence software platform. The initial term shall commence upon the Execution Date and continue for twelve (12) consecutive months, automatically renewing unless written notice of non-renewal is provided at least sixty (60) days prior to expiration.

Page 2: Service Level Agreement (SLA) & Uptime Guarantee
Apex warrants that the Cloud Services will achieve an Uptime Percentage of not less than 99.95% during each calendar month:
- Uptime 99.0% - 99.94%: 10% Service Credit applied to following month invoice.
- Uptime 95.0% - 98.99%: 25% Service Credit.
- Uptime Below 95.0%: 50% Service Credit and customer right to terminate without penalty.

Page 4: Data Ownership & AI Privacy Guarantee
Customer retains sole and exclusive ownership of all uploaded documents, queries, extracted entities, and derived vector embeddings ("Customer Data"). 
Apex covenants that Customer Data will NEVER be used to train, retrain, fine-tune, or calibrate public AI models or third-party foundation models without explicit written permission.

Page 6: Limitation of Liability & Mutual Indemnification
Except for breaches of Section 4 (Confidentiality) and indemnification obligations under Section 7, each party's maximum aggregate cumulative liability under this Agreement shall be strictly capped at the greater of (i) $5,000,000 (Five Million US Dollars) or (ii) the total fees paid by Customer in the preceding twelve (12) months.

Page 9: Termination for Cause and Convenience
Either party may terminate this Agreement for convenience upon sixty (60) days' prior written notice to the other party. In the event of a material breach uncured within thirty (30) days of written notice, the non-breaching party may terminate immediately.

Page 10: Governing Law & Dispute Resolution
This Agreement shall be governed by, and construed in accordance with, the laws of the State of Delaware, without regard to its conflict of laws principles. Any unresolved dispute shall be settled by binding arbitration administered by the American Arbitration Association in Wilmington, Delaware.`,
  },
];
