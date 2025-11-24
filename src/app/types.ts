export type Company = {
  companyName: string;
  websiteURL: string;
  offer: string;
};

export type ProcessStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type Report = Company & {
  id: string;
  rawReport?: string;
  formattedReport?: string;
  status: ProcessStatus;
  createdAt: string;
  error?: string;
  userId: string;
};


export type ProcessedCompany = Company & {
  id: string;
  status: ProcessStatus;
  report?: string;
  formattedReport?: string;
  error?: string;
  createdAt: string;
};
