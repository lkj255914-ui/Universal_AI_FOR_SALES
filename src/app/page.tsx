'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProcessedCompany, Company } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { processCompany } from '@/app/actions';
import { Logo } from '@/components/logo';
import { FileUploadCard } from '@/components/pages/home/file-upload-card';
import { ResultsTable } from '@/components/pages/home/results-table';
import { ReportViewDialog } from '@/components/pages/home/report-view-dialog';
import { useFirebase, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [companies, setCompanies] = useState<ProcessedCompany[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ProcessedCompany | null>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { auth } = useFirebase();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else if (!user.emailVerified) {
        toast({
          variant: 'destructive',
          title: 'Email not verified',
          description: 'Please verify your email to access the dashboard.',
        });
        signOut(auth);
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router, auth, toast]);

  const handleFileParsed = (parsedCompanies: Company[]) => {
    const processedCompanies: ProcessedCompany[] = parsedCompanies.map((company, index) => ({
      ...company,
      id: `${Date.now()}-${index}`, // Use a more robust unique ID
      status: 'queued',
      createdAt: new Date().toISOString(),
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
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to process companies.',
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
        const result = await processCompany(user.uid, company);

        if (result.success && result.reportId) {
          setCompanies((prev) =>
            prev.map((c) =>
              c.id === company.id ? { ...c, id: result.reportId!, status: 'completed' } : c
            )
          );
        } else {
          throw new Error(result.error || 'An unknown error occurred.');
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
      description: 'All company reports have been generated. View them on your dashboard.',
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-out failed',
        description: 'An error occurred while signing out. Please try again.',
      });
    }
  };

  if (isUserLoading || !user || !user.emailVerified) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                  <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <p className="font-semibold">{user.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border-b"></div>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Sales Intelligence</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a list of companies to automatically generate personalized sales intelligence reports.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid gap-8">
          <FileUploadCard
            onFileParsed={handleFileParsed}
            onProcess={handleProcessCompanies}
            isProcessing={isProcessing}
            hasCompanies={companies.length > 0}
          />

          {companies.length > 0 && (
            <ResultsTable companies={companies} onViewReport={setSelectedCompany} title="Processing Queue" />
          )}
        </div>

        <ReportViewDialog
          company={selectedCompany}
          open={!!selectedCompany}
          onOpenChange={(isOpen) => !isOpen && setSelectedCompany(null)}
        />
      </main>
    </div>
  );
}
