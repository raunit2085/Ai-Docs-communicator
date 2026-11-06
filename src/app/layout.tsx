import type { Metadata } from 'next';
import './globals.css';
import { KnowledgeOSProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'KnowledgeOS — Enterprise AI Knowledge & Document Intelligence Platform',
  description: 'Turn thousands of pages into answers, insights and decisions with verifiable citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <KnowledgeOSProvider>
          {children}
        </KnowledgeOSProvider>
      </body>
    </html>
  );
}
