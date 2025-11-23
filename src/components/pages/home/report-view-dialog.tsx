'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { ProcessedCompany } from '@/app/types';
import React from 'react';

type ReportViewDialogProps = {
  company: ProcessedCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FormattedReport = ({ report }: { report: string }) => {
  // Split the report into sections. Assumes sections start with "Number. Title"
  const sections = report.split(/\n(?=\d{1,2}\.\s)/);

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.trim()) return null;
        const firstNewlineIndex = section.indexOf('\n');
        const title = firstNewlineIndex !== -1 ? section.substring(0, firstNewlineIndex) : section;
        const content = firstNewlineIndex !== -1 ? section.substring(firstNewlineIndex + 1) : '';

        return (
          <React.Fragment key={index}>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
            </div>
            {index < sections.length - 1 && <Separator />}
          </React.Fragment>
        );
      })}
    </div>
  );
};


export function ReportViewDialog({ company, open, onOpenChange }: ReportViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Sales Intelligence Report for {company?.companyName}
          </DialogTitle>
          <DialogDescription>
            <strong>Offer:</strong> {company?.offer}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex-grow min-h-0">
          <ScrollArea className="h-full pr-6">
            {company?.report ? (
              <FormattedReport report={company.report} />
            ) : (
              <p className="text-muted-foreground">No report to display.</p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
