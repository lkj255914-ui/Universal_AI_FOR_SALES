'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Report as ReportType } from '@/app/types';
import { ReportViewDialog } from '@/components/pages/home/report-view-dialog';
import { ResultsTable } from '@/components/pages/home/results-table';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const reportsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/reports`);
  }, [firestore, user]);

  const { data: reports, isLoading: areReportsLoading } = useCollection<ReportType>(reportsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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
  
  if (isUserLoading || areReportsLoading || !user) {
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
                 <Link href="/">New Report</Link>
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Reports</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are all the sales intelligence reports you've generated.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <ResultsTable
            companies={reports || []}
            onViewReport={setSelectedReport}
            title="Generated Reports"
          />
        </div>
      </main>

      <ReportViewDialog
        company={selectedReport}
        open={!!selectedReport}
        onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}
      />
    </div>
  );
}
