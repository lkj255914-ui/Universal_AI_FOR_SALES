'use server';

import { generateCompanyReport } from '@/ai/flows/generate-company-report';
import { formatReport } from '@/ai/flows/format-report';
import type { Company } from '@/app/types';

export async function processCompany(company: Company) {
  try {
    const rawReport = await generateCompanyReport({
      companyName: company.companyName,
      websiteURL: company.websiteURL,
      offer: company.offer,
    });

    if (!rawReport) {
      throw new Error('AI failed to generate a report.');
    }

    const formattedReport = await formatReport({ reportContent: rawReport });

    if (!formattedReport) {
      throw new Error('AI failed to format the report.');
    }

    return { success: true, report: rawReport, formattedReport };
  } catch (error) {
    console.error(`Error processing ${company.companyName}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during processing.';
    return { success: false, error: errorMessage };
  }
}
