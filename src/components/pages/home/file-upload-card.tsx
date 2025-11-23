'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Company } from '@/app/types';
import { Loader2, Upload, FileCog } from 'lucide-react';

type FileUploadCardProps = {
  onFileParsed: (companies: Company[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasCompanies: boolean;
};

export function FileUploadCard({ onFileParsed, onProcess, isProcessing, hasCompanies }: FileUploadCardProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a CSV file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split('\n');
        const header = rows[0].trim().split(',');
        // Simple validation for expected headers
        if (header[0] !== 'Company_Name' || header[1] !== 'Website_URL' || header[2] !== 'Offer') {
             throw new Error('Invalid CSV headers. Expected: Company_Name,Website_URL,Offer');
        }

        const parsedCompanies = rows
          .slice(1)
          .map((row) => {
            const values = row.split(',');
            if (values.length >= 3) {
              const [companyName, websiteURL, ...offerParts] = values;
              const offer = offerParts.join(','); // Re-join if offer contains commas
              if (companyName && websiteURL && offer) {
                return { 
                  companyName: companyName.trim(), 
                  websiteURL: websiteURL.trim(), 
                  offer: offer.trim().replace(/^"|"$/g, '') // remove quotes
                };
              }
            }
            return null;
          })
          .filter((c): c is Company => c !== null && c.websiteURL.startsWith('http'));

        if(parsedCompanies.length === 0){
            throw new Error("No valid companies found in the file.");
        }
        onFileParsed(parsedCompanies);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'CSV Parsing Error',
          description: error instanceof Error ? error.message : 'Could not read the file.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Upload className="h-5 w-5" />
          Step 1: Upload Your Data
        </CardTitle>
        <CardDescription>
          Upload a CSV file with columns: Company_Name, Website_URL, Offer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file:text-primary file:font-semibold"
        />
      </CardContent>
      <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Ready to generate insights?</p>
        <Button onClick={onProcess} disabled={isProcessing || !hasCompanies}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileCog className="mr-2 h-4 w-4" />
              Generate Reports
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
