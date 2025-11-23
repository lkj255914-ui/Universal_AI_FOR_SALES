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
import {
  Building,
  Briefcase,
  Target,
  HeartPulse,
  Users,
  Palette,
  Search,
  MessageSquare,
  TrendingUp,
  Package,
  ScrollText,
  DollarSign,
  ShieldQuestion,
  StepForward,
  CheckCircle,
  Icon,
} from 'lucide-react';

type ReportViewDialogProps = {
  company: ProcessedCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const sectionIcons: Record<string, Icon> = {
  'Company Overview': Building,
  'What the Company Does': Briefcase,
  'Market Position': Target,
  'Key Pain Points': HeartPulse,
  'Competitor Summary': Users,
  'Website UX & Design Analysis': Palette,
  'Marketing / SEO Weaknesses': Search,
  'Content & Messaging Insights': MessageSquare,
  'Growth Opportunities': TrendingUp,
  'Product/Service Fit for the Offer': Package,
  'Sales Script / Pitch Points': ScrollText,
  'ROI Justification': DollarSign,
  'Potential Objections & Responses': ShieldQuestion,
  'Recommended Next Steps': StepForward,
  'Summary & Conversion Potential': CheckCircle,
};

const FormattedReport = ({ report }: { report: string }) => {
  const sections = report.split('## ').filter(section => section.trim() !== '');

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.trim()) return null;
        
        const firstNewlineIndex = section.indexOf('\n');
        const title = (firstNewlineIndex !== -1 ? section.substring(0, firstNewlineIndex) : section).replace(/###/g, '').trim();
        let content = firstNewlineIndex !== -1 ? section.substring(firstNewlineIndex + 1) : '';

        // Clean up content: remove bolding from labels that are now implicit
        content = content.replace(/\*\*(.*?):\*\*/g, '$1:');

        const IconComponent = sectionIcons[title] || Building;

        return (
          <React.Fragment key={index}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-lg">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              </div>
              <div
                className="prose prose-sm prose-p:text-muted-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                    .replace(/- (.*?)(<br \/>|$)/g, '<li class="ml-4 list-disc">$1</li>'),
                }}
              />
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
            {company?.formattedReport ? (
              <FormattedReport report={company.formattedReport} />
            ) : company?.report ? (
               <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.report}</p>
            ) : (
              <p className="text-muted-foreground">No report to display.</p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
