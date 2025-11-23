'use server';

/**
 * @fileOverview A flow to generate a comprehensive business report for a given company based on its website content, company information, and a specific offer.
 *
 * - generateCompanyReport - An async function that takes company information and an offer as input, then returns a detailed business report.
 * - GenerateCompanyReportInput - The input type for the generateCompanyReport function, defining the structure for company details and the offer.
 * - GenerateCompanyReportOutput - The output type for the generateCompanyReport function, which is the generated business report as a string.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanyReportInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  websiteURL: z.string().url().describe('The URL of the company website.'),
  offer: z.string().describe('The offer to be analyzed in the context of the company.'),
});
export type GenerateCompanyReportInput = z.infer<typeof GenerateCompanyReportInputSchema>;

const GenerateCompanyReportOutputSchema = z.string().describe('A detailed 15-section business report for the company.');
export type GenerateCompanyReportOutput = z.infer<typeof GenerateCompanyReportOutputSchema>;

export async function generateCompanyReport(input: GenerateCompanyReportInput): Promise<GenerateCompanyReportOutput> {
  return generateCompanyReportFlow(input);
}

const generateCompanyReportPrompt = ai.definePrompt({
  name: 'generateCompanyReportPrompt',
  input: {schema: GenerateCompanyReportInputSchema},
  // By removing the output schema here, we prevent the validation error and handle the response manually.
  prompt: `You are an AI-powered business analyst specializing in generating sales intelligence reports. Your task is to analyze a company and generate a detailed 15-section business report.

Use your knowledge and search the web if necessary to gather information about the company.

Company Name: {{{companyName}}}
Website URL: {{{websiteURL}}}
Offer: {{{offer}}}

Generate a 15-section business report that covers the following aspects:

1. Company Overview
2. What the Company Does
3. Market Position
4. Key Pain Points
5. Competitor Summary
6. Website UX & Design Analysis
7. Marketing / SEO Weaknesses
8. Content & Messaging Insights
9. Growth Opportunities
10. Product/Service Fit for the Offer
11. Sales Script / Pitch Points
12. ROI Justification
13. Potential Objections & Responses
14. Recommended Next Steps
15. Summary & Conversion Potential`,
});

const generateCompanyReportFlow = ai.defineFlow(
  {
    name: 'generateCompanyReportFlow',
    inputSchema: GenerateCompanyReportInputSchema,
    outputSchema: GenerateCompanyReportOutputSchema,
  },
  async input => {
    const response = await generateCompanyReportPrompt(input);
    // Add a fallback to prevent null response and ensure we always return a string.
    return response.text ?? 'Could not generate a report for this company.';
  }
);
