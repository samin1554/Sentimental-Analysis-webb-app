Sentiment Analysis Platform
A comprehensive full-stack sentiment analysis application built with microservices architecture, featuring real-time AI-powered sentiment analysis and interactive analytics dashboard.

🚀 Overview
This platform allows users to submit feedback through a modern web interface, automatically processes it using AI sentiment analysis, and provides comprehensive analytics and insights through an interactive dashboard.

🏗️ Architecture
Microservices Backend
Feedback Service (Java Spring Boot) - Handles feedback collection and storage
AI Service (Python Flask) - Performs sentiment analysis using Hugging Face transformers
Analytics Service (Java Spring Boot) - Stores and serves processed analytics data
Frontend
React Dashboard (TypeScript + Vite) - Modern, responsive web interface with real-time data visualization
Databases
PostgreSQL - Stores raw feedback data
MongoDB - Stores processed analytics with sentiment scores
🔄 Data Flow
User submits feedback → Feedback Service (PostgreSQL)
AI processes feedback → Sentiment analysis using DistilBERT model
Enriched data stored → Analytics Service (MongoDB)
Dashboard displays → Real-time analytics and insights
✨ Features
📝 Feedback Submission
User-friendly form with validation
Multiple source tracking (Web, Mobile, Email, Other)
Real-time submission with loading states
Automatic AI processing pipeline
🤖 AI-Powered Analysis
Real-time Sentiment Analyzer - Instant analysis of any text
Hugging Face DistilBERT model for accurate sentiment detection
Confidence scoring with visual indicators
POSITIVE/NEGATIVE/NEUTRAL classification
📊 Analytics Dashboard
Summary Cards - Total feedback, sentiment percentages, average scores
Interactive Pie Chart - Sentiment distribution visualization
Trend Analysis - 7-day sentiment trends over time
Recent Feedback - Latest submissions with sentiment indicators
Advanced Filtering - By sentiment, source, and date range
Auto-refresh capability for real-time updates
📋 Feedback Management
Comprehensive Table View - Sortable, searchable feedback list
Pagination - Efficient handling of large datasets
Export Functionality - CSV export for external analysis
Expandable Messages - Full text viewing for long feedback
Color-coded Sentiment - Visual sentiment indicators
🛠️ Technology Stack
Backend Services
Java 17 with Spring Boot 3.5.7
Python 3.x with Flask 3.1.2
Hugging Face Transformers 4.57.1
PostgreSQL for relational data
MongoDB for document storage
Spring Data JPA and Spring Data MongoDB
Frontend
React 18 with TypeScript
Vite for fast development and building
Tailwind CSS for styling
Recharts for data visualization
Radix UI components for modern interface
Lucide React for icons
Development Tools
Maven for Java dependency management
pip/venv for Python environment management
npm for frontend package management
🚦 Getting Started
Prerequisites
Java 17+
Python 3.x
Node.js 16+
PostgreSQL
MongoDB
Backend Setup
Start Feedback Service (Port 8080)

cd feedBackService
mvn spring-boot:run
Start Analytics Service (Port 8081)

cd AnalyticsService
mvn spring-boot:run
Start AI Service (Port 4000)

cd feedback-ai-service
source venv/bin/activate
pip install -r requirements.txt
python app.py
Frontend Setup
cd "Sentiment Analysis Dashboard"
npm install
npm run dev
Access the application at http://localhost:3000

🎯 Usage
Submit Feedback
Navigate to "Submit Feedback" tab
Fill in user details and feedback message
Select source (Web/Mobile/Email/Other)
Submit for automatic AI processing
View Analytics
Dashboard Tab - Overview with charts and recent feedback
Feedback List Tab - Detailed table view with sorting/filtering
Analyzer Tab - Real-time sentiment analysis tool
Real-time Analysis
Go to "Analyzer" tab
Enter any text for instant sentiment analysis
View results with confidence scores and interpretations
🔧 Configuration
Environment Variables
VITE_FEEDBACK_SERVICE_URL=http://localhost:8080/api/feedback
VITE_ANALYTICS_SERVICE_URL=http://localhost:8081/api/analytics
VITE_AI_SERVICE_URL=http://localhost:4000
Database Configuration
PostgreSQL: jdbc:postgresql://localhost:5432/feedback_db
MongoDB: mongodb://localhost:27017/analyticsdb
🎨 Key Features Highlights
Real-time Processing - Instant feedback processing and analysis
Responsive Design - Works seamlessly on desktop and mobile
Error Handling - Comprehensive error handling with user-friendly messages
CORS Support - Proper cross-origin configuration for all services
Data Validation - Input validation and sanitization
Export Capabilities - CSV export for data analysis
Interactive Charts - Hover effects and responsive visualizations
Loading States - Visual feedback during API operations
