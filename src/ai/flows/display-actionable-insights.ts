'use server';

/**
 * @fileOverview A flow that extracts key actionable insights from a sales intelligence report.
 *
 * - displayActionableInsights - A function that extracts actionable insights from a report.
 * - DisplayActionableInsightsInput - The input type for the displayActionableInsights function.
 * - DisplayActionableInsightsOutput - The return type for the displayActionableInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisplayActionableInsightsInputSchema = z.object({
  reportContent: z
    .string()
    .describe("The full content of the AI-generated sales intelligence report."),
});
export type DisplayActionableInsightsInput = z.infer<typeof DisplayActionableInsightsInputSchema>;

const DisplayActionableInsightsOutputSchema = z.object({
  actionableInsightsSummary: z
    .string()
    .describe("A concise summary of the key actionable insights extracted from the report, formatted for easy understanding."),
});
export type DisplayActionableInsightsOutput = z.infer<typeof DisplayActionableInsightsOutputSchema>;

export async function displayActionableInsights(
  input: DisplayActionableInsightsInput
): Promise<DisplayActionableInsightsOutput> {
  return displayActionableInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'displayActionableInsightsPrompt',
  input: {schema: DisplayActionableInsightsInputSchema},
  output: {schema: DisplayActionableInsightsOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing sales intelligence reports and extracting the most critical actionable insights.

  Given the following sales intelligence report, identify the key actionable insights from each section and provide a concise summary that a sales representative can use to quickly understand how to move forward with the potential customer.

  Report Content: {{{reportContent}}}
  \n
  Focus on insights that suggest specific actions or strategies the sales rep can take.
  Format the summary for easy readability and quick comprehension.
  `,
});

const displayActionableInsightsFlow = ai.defineFlow(
  {
    name: 'displayActionableInsightsFlow',
    inputSchema: DisplayActionableInsightsInputSchema,
    outputSchema: DisplayActionableInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
