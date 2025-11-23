export type Company = {
  companyName: string;
  websiteURL: string;
  offer: string;
};

export type ProcessStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type ProcessedCompany = Company & {
  id: number;
  status: ProcessStatus;
  report?: string;
  error?: string;
};
