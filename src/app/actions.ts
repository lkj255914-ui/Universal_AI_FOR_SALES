'use server';

import { generateCompanyReport } from '@/ai/flows/generate-company-report';
import type { Company } from '@/app/types';

function extractTextFromHTML(html: string): string {
  // A simple regex-based HTML to text converter.
  // It's not perfect but works for many sites.
  return (
    html
      // Remove script and style elements
      .replace(/<script[^>]*>.*<\/script>/gis, '')
      .replace(/<style[^>]*>.*<\/style>/gis, '')
      // Remove head element
      .replace(/<head[^>]*>.*<\/head>/gis, '')
      // Remove all remaining HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Replace multiple whitespace characters with a single space
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export async function processCompany(company: Company) {
  try {
    const response = await fetch(company.websiteURL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // Add a timeout for the fetch request
      signal: AbortSignal.timeout(15000), // 15 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website. Status: ${response.status}`);
    }

    const htmlContent = await response.text();
    const textContent = extractTextFromHTML(htmlContent);

    if (!textContent || textContent.length < 100) {
      throw new Error(
        'Could not extract sufficient text content. The site may be a Single Page App or content is loaded dynamically.'
      );
    }

    // Limit content size to avoid exceeding AI model token limits
    const maxContentLength = 200000;
    const truncatedContent =
      textContent.length > maxContentLength
        ? textContent.substring(0, maxContentLength)
        : textContent;

    const report = await generateCompanyReport({
      ...company,
      websiteTextContent: truncatedContent,
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
