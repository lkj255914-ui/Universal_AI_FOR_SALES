
'use server';

/**
 * @fileOverview A flow to format a raw sales intelligence report into a clean, structured Markdown format.
 *
 * - formatReport - An async function that takes raw report content and returns a formatted Markdown string.
 * - FormatReportInput - The input type for the formatReport function.
 * - FormatReportOutput - The output type for the formatReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatReportInputSchema = z.object({
  reportContent: z
    .string()
    .describe("The raw, unformatted AI-generated sales intelligence report text."),
});
export type FormatReportInput = z.infer<typeof FormatReportInputSchema>;

const FormatReportOutputSchema = z.string().describe('The professionally formatted sales intelligence report in Markdown.');
export type FormatReportOutput = z.infer<typeof FormatReportOutputSchema>;

export async function formatReport(input: FormatReportInput): Promise<FormatReportOutput> {
  return formatReportFlow(input);
}

const formatReportPrompt = ai.definePrompt({
  name: 'formatReportPrompt',
  input: {schema: FormatReportInputSchema},
  // By removing the output schema here, we prevent the validation error and handle the response manually.
  prompt: `You are an expert AI editor and formatter. Take the given raw AI-generated sales report text and restructure, clean, and format it into a professional, well-organized, Markdown-styled report.

Instructions:
- Keep all information from the input text intact.
- Correct grammar, alignment, and spacing.
- Add Markdown headings (##) for each of the 15 section titles.
- Use bullet points for lists.
- Ensure consistent heading hierarchy, line spacing, and a clean visual flow.
- Do not summarize or rewrite content — only format and organize.
- Preserve all meaning and data exactly as provided.

## RAW REPORT:
{{{reportContent}}}
`,
});

const formatReportFlow = ai.defineFlow(
  {
    name: 'formatReportFlow',
    inputSchema: FormatReportInputSchema,
    outputSchema: FormatReportOutputSchema,
  },
  async input => {
    const response = await formatReportPrompt(input);
    // Add a fallback to prevent null response and ensure we always return a string.
    return response.text ?? 'Could not format the report.';
  }
);
