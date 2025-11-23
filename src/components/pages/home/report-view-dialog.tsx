'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { ProcessedCompany } from '@/app/types';
import React, from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const FormattedReportSection = ({ section }: { section: string }) => {
  if (!section.trim()) return null;

  const firstNewlineIndex = section.indexOf('\n');
  const title = (firstNewlineIndex !== -1 ? section.substring(0, firstNewlineIndex) : section).replace(/###/g, '').trim();
  let content = firstNewlineIndex !== -1 ? section.substring(firstNewlineIndex + 1) : '';

  // Clean up content and convert to basic HTML
  content = content
    .trim()
    .replace(/\*\*(.*?):\*\*/g, '<strong>$1:</strong>') // Bold labels
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Any other bolding
    .split('\n') // Split by new lines to process paragraphs and lists
    .map(line => {
      line = line.trim();
      if (line.startsWith('- ')) {
        // It's a list item
        return `<li>${line.substring(2)}</li>`;
      }
      if (line) {
        // It's a paragraph
        return `<p>${line}</p>`;
      }
      return '';
    })
    .join('');

  // Wrap list items in <ul>
  content = content.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>').replace(/<\/li><ul>/g, '</li><li>');
  content = content.replace(/<\/ul>(\s*?)<ul>/g, '');


  const IconComponent = sectionIcons[title] || Building;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-lg">
          <IconComponent className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <div
        className="prose prose-sm dark:prose-invert max-w-none 
                   prose-p:text-muted-foreground prose-p:mb-2 
                   prose-ul:list-disc prose-ul:ml-5 prose-ul:space-y-1 prose-li:text-muted-foreground
                   prose-strong:text-foreground"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </div>
  );
};

export function ReportViewDialog({ company, open, onOpenChange }: ReportViewDialogProps) {
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const sections = company?.formattedReport?.split('## ').filter(section => section.trim() !== '') || [];

  React.useEffect(() => {
    if (open) {
      setCurrentPage(0);
    }
  }, [open]);


  const handleNext = () => {
    if (currentPage < sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            {sections.length > 0 ? (
              <FormattedReportSection section={sections[currentPage]} />
            ) : company?.report ? (
               <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.report}</p>
            ) : (
              <p className="text-muted-foreground">No report to display.</p>
            )}
          </ScrollArea>
        </div>
        <DialogFooter className='pt-4 border-t'>
            <div className="flex justify-between items-center w-full">
                <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <p className="text-sm font-medium text-muted-foreground">
                    Section {currentPage + 1} of {sections.length}
                </p>
                <Button variant="outline" onClick={handleNext} disabled={currentPage === sections.length - 1}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
