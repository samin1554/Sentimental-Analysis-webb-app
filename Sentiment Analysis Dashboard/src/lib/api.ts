// API integration for sentiment analysis backend services
import { API_CONFIG } from './config';

const { FEEDBACK_SERVICE_URL, ANALYTICS_SERVICE_URL, AI_SERVICE_URL } = API_CONFIG;

export interface BackendFeedback {
  id: number;
  userName: string;
  email: string;
  message: string;
  source: string;
  createdAt: string | null;
}

export interface AnalyzedFeedback {
  id: string;
  userName: string;
  email: string;
  message: string;
  sentimentLabel: string;
  sentimentScore: number;
  source: string;
  createdAt: string;
}

export interface FrontendFeedback {
  id: string;
  userName: string;
  email: string;
  message: string;
  source: 'Web' | 'Mobile App' | 'Email' | 'Other';
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  timestamp: Date;
}

export interface SentimentAnalysis {
  sentiment_label: string;
  sentiment_score: number;
}

// Submit feedback to backend
export async function submitFeedback(feedbackData: {
  userName: string;
  email: string;
  message: string;
  source: string;
}): Promise<BackendFeedback> {
  try {
    const response = await fetch(FEEDBACK_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit feedback (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to feedback service. Please check if the backend is running.');
    }
    throw error;
  }
}

// Process feedback through AI service
export async function processFeedback(feedbackId: number): Promise<any> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/process-feedback/${feedbackId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to process feedback (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to AI service. Please check if the backend is running.');
    }
    throw error;
  }
}

// Get all analyzed feedback from analytics service
export async function getAnalyzedFeedback(): Promise<AnalyzedFeedback[]> {
  try {
    const response = await fetch(ANALYTICS_SERVICE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch analytics (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Analytics API response:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to analytics service. Please check if the backend is running.');
    }
    throw error;
  }
}

// Direct sentiment analysis
export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to analyze sentiment (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to AI service. Please check if the backend is running.');
    }
    throw error;
  }
}

// Transform backend data to frontend format
export function transformToFrontendFormat(analyzedFeedback: AnalyzedFeedback[]): FrontendFeedback[] {
  return analyzedFeedback.map(item => ({
    id: item.id,
    userName: item.userName || 'Anonymous',
    email: item.email,
    message: item.message,
    source: (item.source || 'Other') as 'Web' | 'Mobile App' | 'Email' | 'Other',
    sentiment: item.sentimentLabel.toLowerCase() as 'positive' | 'negative' | 'neutral',
    score: item.sentimentScore,
    timestamp: new Date(item.createdAt),
  }));
}

// Calculate analytics from frontend feedback data
export function calculateAnalytics(feedback: FrontendFeedback[]) {
  const total = feedback.length;
  const positive = feedback.filter(f => f.sentiment === 'positive').length;
  const negative = feedback.filter(f => f.sentiment === 'negative').length;
  const neutral = feedback.filter(f => f.sentiment === 'neutral').length;
  
  const avgScore = feedback.reduce((sum, f) => sum + f.score, 0) / total;
  
  return {
    total,
    positive,
    negative,
    neutral,
    positivePercent: (positive / total) * 100,
    negativePercent: (negative / total) * 100,
    neutralPercent: (neutral / total) * 100,
    avgScore: avgScore * 100,
  };
}