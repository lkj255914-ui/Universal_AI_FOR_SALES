import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-3 group">
      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
        <BrainCircuit className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">SalesAI Insights</h1>
    </Link>
  );
}
