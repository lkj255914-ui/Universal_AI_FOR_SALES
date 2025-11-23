import { BrainCircuit } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <BrainCircuit className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground tracking-tight">SalesAI Insights</h1>
    </div>
  );
}
