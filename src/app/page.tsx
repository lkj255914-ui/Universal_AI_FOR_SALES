'use client';

import { useState } from 'react';
import type { ProcessedCompany, Company } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { processCompany } from '@/app/actions';
import { Logo } from '@/components/logo';
import { FileUploadCard } from '@/components/pages/home/file-upload-card';
import { ResultsTable } from '@/components/pages/home/results-table';
import { ReportViewDialog } from '@/components/pages/home/report-view-dialog';

export default function Home() {
  const [companies, setCompanies] = useState<ProcessedCompany[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ProcessedCompany | null>(null);
  const { toast } = useToast();

  const handleFileParsed = (parsedCompanies: Company[]) => {
    const processedCompanies: ProcessedCompany[] = parsedCompanies.map((company, index) => ({
      ...company,
      id: index,
      status: 'queued',
    }));
    setCompanies(processedCompanies);
    toast({
      title: 'File parsed successfully',
      description: `${processedCompanies.length} companies loaded and ready for processing.`,
    });
  };

  const handleProcessCompanies = async () => {
    if (companies.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No companies to process',
        description: 'Please upload a CSV file with company data first.',
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: 'Processing started...',
      description: `Generating reports for ${companies.length} companies. This may take a few minutes.`,
    });

    const processingPromises = companies.map(async (company) => {
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? { ...c, status: 'processing' } : c))
      );

      try {
        const result = await processCompany({
          companyName: company.companyName,
          websiteURL: company.websiteURL,
          offer: company.offer,
        });

        if (result.success) {
          setCompanies((prev) =>
            prev.map((c) =>
              c.id === company.id ? { ...c, status: 'completed', report: result.report } : c
            )
          );
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === company.id
              ? { ...c, status: 'failed', error: (error as Error).message }
              : c
          )
        );
      }
    });

    await Promise.all(processingPromises);
    setIsProcessing(false);
    toast({
      title: 'Processing complete!',
      description: 'All company reports have been generated.',
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-block">
          <Logo />
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a list of companies to automatically generate personalized sales intelligence
          reports.
        </p>
      </header>

      <div className="max-w-4xl mx-auto grid gap-8">
        <FileUploadCard
          onFileParsed={handleFileParsed}
          onProcess={handleProcessCompanies}
          isProcessing={isProcessing}
          hasCompanies={companies.length > 0}
        />

        {companies.length > 0 && (
          <ResultsTable companies={companies} onViewReport={setSelectedCompany} />
        )}
      </div>

      <ReportViewDialog
        company={selectedCompany}
        open={!!selectedCompany}
        onOpenChange={(isOpen) => !isOpen && setSelectedCompany(null)}
      />
    </main>
  );
}
