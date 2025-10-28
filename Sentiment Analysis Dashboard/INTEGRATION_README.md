# Sentiment Analysis Dashboard - Backend Integration

This frontend is now integrated with your microservices backend. Here's what has been updated:

## Changes Made

### 1. API Integration Layer (`src/lib/api.ts`)
- Created API functions for all backend services
- Added proper error handling and connection checks
- Data transformation between backend and frontend formats

### 2. Updated Components
- **FeedbackForm**: Now submits to real backend services
- **AnalyticsDashboard**: Fetches real data from analytics service
- **FeedbackTable**: Displays real feedback data with refresh capability
- **RealtimeAnalyzer**: Uses actual AI service for sentiment analysis

### 3. Configuration (`src/lib/config.ts`)
- Configurable API endpoints via environment variables
- Default localhost URLs for development

## Backend Services Required

Make sure these services are running:

1. **Feedback Service** - `http://localhost:8080`
2. **Analytics Service** - `http://localhost:8081` 
3. **AI Service** - `http://localhost:5000`

## Data Flow

1. **Submit Feedback**: Frontend → Feedback Service → AI Service → Analytics Service
2. **View Analytics**: Frontend → Analytics Service
3. **Real-time Analysis**: Frontend → AI Service

## Environment Setup

1. Copy `.env.example` to `.env` if you need custom URLs
2. Update the URLs in `.env` if your services run on different ports

## Features Added

- Loading states for all API calls
- Error handling with user-friendly messages
- Refresh buttons for manual data updates
- Proper data transformation between backend/frontend formats
- Connection error detection

## Testing the Integration

1. Start all backend services
2. Run the frontend: `npm run dev`
3. Test each tab:
   - Submit feedback via the form
   - View analytics dashboard
   - Check feedback table
   - Try real-time analyzer

The frontend will show appropriate error messages if backend services are not available.