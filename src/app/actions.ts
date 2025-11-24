'use server';

import { generateCompanyReport } from '@/ai/flows/generate-company-report';
import { formatReport } from '@/ai/flows/format-report';
import type { Company } from '@/app/types';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { serviceAccount } from '@/firebase/service-account';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export async function processCompany(userId: string, company: Company) {
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

    const reportData = {
      ...company,
      rawReport,
      formattedReport,
      status: 'completed',
      createdAt: new Date().toISOString(),
      userId: userId,
    };

    const docRef = await db.collection('users').doc(userId).collection('reports').add(reportData);

    return { success: true, reportId: docRef.id };
  } catch (error) {
    console.error(`Error processing ${company.companyName}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during processing.';
    
    // Optionally save a failed report record
    try {
      const failedReportData = {
        ...company,
        status: 'failed',
        error: errorMessage,
        createdAt: new Date().toISOString(),
        userId: userId,
      };
      await db.collection('users').doc(userId).collection('reports').add(failedReportData);
    } catch (dbError) {
      console.error('Failed to save error report to Firestore:', dbError);
    }

    return { success: false, error: errorMessage };
  }
}
