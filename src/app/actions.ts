'use server';

import { generateCompanyReport } from '@/ai/flows/generate-company-report';
import type { Company } from '@/app/types';

export async function processCompany(company: Company) {
  try {
    const report = await generateCompanyReport({
      companyName: company.companyName,
      websiteURL: company.websiteURL,
      offer: company.offer,
    });

    if (!report) {
      throw new Error('AI failed to generate a report.');
    }

    return { success: true, report };
  } catch (error) {
    console.error(`Error processing ${company.companyName}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during processing.';
    return { success: false, error: errorMessage };
  }
}
