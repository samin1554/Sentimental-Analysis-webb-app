// Mock data and utilities for sentiment analysis

export interface Feedback {
  id: string;
  userName: string;
  email: string;
  message: string;
  source: 'Web' | 'Mobile App' | 'Email' | 'Other';
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  timestamp: Date;
}

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    message: 'Absolutely love this product! The interface is intuitive and the features are exactly what I needed. Keep up the great work!',
    source: 'Web',
    sentiment: 'positive',
    score: 0.92,
    timestamp: new Date('2025-10-27T10:30:00'),
  },
  {
    id: '2',
    userName: 'Michael Chen',
    email: 'mchen@example.com',
    message: 'The app crashes frequently and customer support is unresponsive. Very disappointed with this experience.',
    source: 'Mobile App',
    sentiment: 'negative',
    score: 0.15,
    timestamp: new Date('2025-10-27T09:15:00'),
  },
  {
    id: '3',
    userName: 'Emma Williams',
    email: 'emma.w@example.com',
    message: 'Good product overall. Some features could be improved but it gets the job done.',
    source: 'Email',
    sentiment: 'neutral',
    score: 0.65,
    timestamp: new Date('2025-10-26T16:45:00'),
  },
  {
    id: '4',
    userName: 'David Rodriguez',
    email: 'david.r@example.com',
    message: 'Excellent customer service! My issue was resolved within hours. Highly recommend!',
    source: 'Web',
    sentiment: 'positive',
    score: 0.95,
    timestamp: new Date('2025-10-26T14:20:00'),
  },
  {
    id: '5',
    userName: 'Lisa Anderson',
    email: 'l.anderson@example.com',
    message: 'The pricing is too high for the limited features offered. Not worth the money.',
    source: 'Email',
    sentiment: 'negative',
    score: 0.22,
    timestamp: new Date('2025-10-26T11:30:00'),
  },
  {
    id: '6',
    userName: 'James Taylor',
    email: 'jtaylor@example.com',
    message: 'Amazing experience! The onboarding process was smooth and everything works perfectly.',
    source: 'Mobile App',
    sentiment: 'positive',
    score: 0.88,
    timestamp: new Date('2025-10-25T15:10:00'),
  },
  {
    id: '7',
    userName: 'Jennifer Lee',
    email: 'jlee@example.com',
    message: 'The interface is confusing and hard to navigate. Needs better UX design.',
    source: 'Web',
    sentiment: 'negative',
    score: 0.28,
    timestamp: new Date('2025-10-25T13:45:00'),
  },
  {
    id: '8',
    userName: 'Robert Brown',
    email: 'rbrown@example.com',
    message: 'It works as expected. Nothing special but does what it promises.',
    source: 'Other',
    sentiment: 'neutral',
    score: 0.58,
    timestamp: new Date('2025-10-25T10:00:00'),
  },
  {
    id: '9',
    userName: 'Maria Garcia',
    email: 'mgarcia@example.com',
    message: 'Fantastic features and great value for money! Will definitely continue using this.',
    source: 'Web',
    sentiment: 'positive',
    score: 0.91,
    timestamp: new Date('2025-10-24T17:30:00'),
  },
  {
    id: '10',
    userName: 'Thomas Wilson',
    email: 'twilson@example.com',
    message: 'Terrible experience. The app is buggy and slow. Would not recommend to anyone.',
    source: 'Mobile App',
    sentiment: 'negative',
    score: 0.12,
    timestamp: new Date('2025-10-24T14:15:00'),
  },
  {
    id: '11',
    userName: 'Patricia Martinez',
    email: 'pmartinez@example.com',
    message: 'Pretty good overall. A few minor issues but nothing major. Satisfied with the purchase.',
    source: 'Email',
    sentiment: 'neutral',
    score: 0.72,
    timestamp: new Date('2025-10-24T09:20:00'),
  },
  {
    id: '12',
    userName: 'Christopher Davis',
    email: 'cdavis@example.com',
    message: 'Outstanding support team and excellent product quality. Five stars!',
    source: 'Web',
    sentiment: 'positive',
    score: 0.96,
    timestamp: new Date('2025-10-23T16:00:00'),
  },
  {
    id: '13',
    userName: 'Amanda Miller',
    email: 'amiller@example.com',
    message: 'The latest update broke several features. Very frustrating to use now.',
    source: 'Mobile App',
    sentiment: 'negative',
    score: 0.18,
    timestamp: new Date('2025-10-23T12:30:00'),
  },
  {
    id: '14',
    userName: 'Daniel Moore',
    email: 'dmoore@example.com',
    message: 'Solid product with good reliability. Does what I need it to do.',
    source: 'Other',
    sentiment: 'neutral',
    score: 0.68,
    timestamp: new Date('2025-10-23T08:45:00'),
  },
  {
    id: '15',
    userName: 'Jessica Taylor',
    email: 'jtaylor2@example.com',
    message: 'Incredible value! The features far exceed my expectations. Absolutely thrilled!',
    source: 'Web',
    sentiment: 'positive',
    score: 0.94,
    timestamp: new Date('2025-10-22T15:20:00'),
  },
];

// Sentiment analysis function (mock)
export function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number; confidence: number } {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['love', 'excellent', 'great', 'amazing', 'fantastic', 'wonderful', 'perfect', 'best', 'outstanding', 'thrilled', 'happy', 'good'];
  const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'worst', 'poor', 'disappointing', 'frustrated', 'crash', 'buggy', 'slow', 'confusing'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  const totalWords = text.split(' ').length;
  const sentimentStrength = (positiveCount - negativeCount) / Math.max(totalWords * 0.1, 1);
  
  let sentiment: 'positive' | 'negative' | 'neutral';
  let score: number;
  let confidence: number;
  
  if (sentimentStrength > 0.3) {
    sentiment = 'positive';
    score = Math.min(0.7 + sentimentStrength * 0.15, 0.99);
    confidence = Math.min(0.6 + positiveCount * 0.1, 0.95);
  } else if (sentimentStrength < -0.3) {
    sentiment = 'negative';
    score = Math.max(0.3 + sentimentStrength * 0.15, 0.01);
    confidence = Math.min(0.6 + negativeCount * 0.1, 0.95);
  } else {
    sentiment = 'neutral';
    score = 0.5 + sentimentStrength * 0.1;
    confidence = Math.max(0.5 - Math.abs(sentimentStrength) * 0.2, 0.4);
  }
  
  return { sentiment, score, confidence };
}

// Generate trend data for the last 7 days
export function generateTrendData() {
  const days = ['Oct 21', 'Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27'];
  return days.map((day, index) => ({
    date: day,
    positive: Math.floor(Math.random() * 15) + 5,
    negative: Math.floor(Math.random() * 10) + 2,
    neutral: Math.floor(Math.random() * 8) + 3,
  }));
}

// Calculate analytics from feedback
export function calculateAnalytics(feedback: Feedback[]) {
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
