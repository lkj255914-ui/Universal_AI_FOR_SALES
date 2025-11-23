'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ProcessedCompany } from '@/app/types';
import { Loader2, FileText, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

type ResultsTableProps = {
  companies: ProcessedCompany[];
  onViewReport: (company: ProcessedCompany) => void;
};

const StatusIndicator = ({ company }: { company: ProcessedCompany }) => {
  switch (company.status) {
    case 'queued':
      return (
        <Badge variant="secondary" className="gap-1.5 pl-1.5">
          <Clock className="h-3.5 w-3.5" />
          Queued
        </Badge>
      );
    case 'processing':
      return (
        <Badge className="gap-1.5 pl-1.5 bg-blue-500 hover:bg-blue-600">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Processing
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="gap-1.5 pl-1.5 text-green-600 border-green-600">
          <CheckCircle className="h-3.5 w-3.5" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="destructive" className="gap-1.5 pl-1.5">
                <XCircle className="h-3.5 w-3.5" />
                Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{company.error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

export function ResultsTable({ companies, onViewReport }: ResultsTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5" />
          Step 2: Review Your Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Company Name</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead className="w-[150px] text-center">Status</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.companyName}</TableCell>
                  <TableCell className="text-muted-foreground">{company.offer}</TableCell>
                  <TableCell className="text-center">
                    <StatusIndicator company={company} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReport(company)}
                      disabled={company.status !== 'completed'}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
