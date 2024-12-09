import type { Message } from 'ai';

// Article Types
export type Article = {
  title: string;
  authors: string[];
  published: string;
  abstract: string;
  url: string;
  source: string;
};

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Search Types
export interface ExtendedMessage extends Message {
  metadata?: {
    articles?: Article[];
    keywords?: string[];
  };
} 