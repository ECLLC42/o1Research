import type { Article } from '@/lib/types';

interface StoredData {
  question: string;
  keywords: string[];
  articles: Article[];
  timestamp: string;
}

// In-memory store for development
const researchStore = new Map<string, StoredData>();

export async function uploadResearchData(questionId: string, data: StoredData) {
  try {
    researchStore.set(questionId, data);
    console.log(`Stored research data for ID: ${questionId}`); // Debug log
  } catch (error) {
    console.error('Error storing research data:', error);
    throw error;
  }
}

export async function getResearchData(questionId: string): Promise<StoredData | null> {
  try {
    const data = researchStore.get(questionId);
    if (!data) {
      console.log(`No data found for ID: ${questionId}`); // Debug log
      return null;  // Return null instead of throwing
    }
    return data;
  } catch (error) {
    console.error('Error retrieving research data:', error);
    return null;  // Return null on error
  }
}

export const FOLDERS = {
  HISTORY: 'history',
  CITATIONS: 'citations',
  RESEARCH: 'research'
} as const;