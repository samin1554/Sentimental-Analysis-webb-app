# Requirements Document

## Introduction

A comprehensive microservices-based sentiment analysis system that collects user feedback, performs AI-powered sentiment analysis, and stores enriched analytics data. The system consists of three interconnected services: a Feedback Collection Service, an AI Processing Service, and an Analytics Storage Service.

## Glossary

- **Feedback_Service**: Java Spring Boot microservice that collects and stores raw user feedback in PostgreSQL
- **AI_Service**: Python Flask microservice that performs sentiment analysis using Hugging Face transformers
- **Analytics_Service**: Java Spring Boot microservice that stores processed feedback with sentiment data in MongoDB
- **Sentiment_Analysis**: AI processing that determines emotional tone (positive/negative) and confidence score of text
- **Microservices_Architecture**: Distributed system design with independent, loosely-coupled services
- **REST_API**: HTTP-based communication protocol between services and external clients

## Requirements

### Requirement 1

**User Story:** As a system user, I want to submit feedback through a REST API, so that my input can be collected and processed for sentiment analysis.

#### Acceptance Criteria

1. WHEN a user submits feedback via POST request, THE Feedback_Service SHALL store the feedback with user details in PostgreSQL database
2. THE Feedback_Service SHALL accept feedback containing userName, email, message, and optional source field
3. THE Feedback_Service SHALL generate unique identifier and timestamp for each feedback entry
4. THE Feedback_Service SHALL return the saved feedback object with HTTP 201 status upon successful creation
5. THE Feedback_Service SHALL validate that email and message fields are not null before saving

### Requirement 2

**User Story:** As a system administrator, I want to retrieve all feedback entries, so that I can monitor user submissions and system activity.

#### Acceptance Criteria

1. WHEN a GET request is made to feedback endpoint, THE Feedback_Service SHALL return all stored feedback entries
2. THE Feedback_Service SHALL provide individual feedback retrieval by unique identifier
3. THE Feedback_Service SHALL return HTTP 404 status when requested feedback identifier does not exist
4. THE Feedback_Service SHALL return feedback data in JSON format with all original fields

### Requirement 3

**User Story:** As an AI processing system, I want to analyze text sentiment, so that emotional context can be extracted from user feedback.

#### Acceptance Criteria

1. WHEN text is submitted to analysis endpoint, THE AI_Service SHALL process the text using Hugging Face sentiment model
2. THE AI_Service SHALL return sentiment label (POSITIVE/NEGATIVE) and confidence score between 0 and 1
3. THE AI_Service SHALL accept JSON payload containing text field for analysis
4. THE AI_Service SHALL return HTTP 400 status when text field is missing from request
5. THE AI_Service SHALL provide health check endpoint returning service status

### Requirement 4

**User Story:** As an analytics system, I want to process feedback automatically, so that sentiment-enriched data can be stored for reporting and insights.

#### Acceptance Criteria

1. WHEN feedback processing is triggered with feedback ID, THE AI_Service SHALL fetch original feedback from Feedback_Service
2. THE AI_Service SHALL perform sentiment analysis on the feedback message content
3. THE AI_Service SHALL send enriched feedback data to Analytics_Service via REST API
4. THE AI_Service SHALL include original feedback fields plus sentiment_label and sentiment_score in processed data
5. THE AI_Service SHALL handle service communication failures gracefully and log errors

### Requirement 5

**User Story:** As a data analyst, I want to store and retrieve sentiment-analyzed feedback, so that I can generate reports and insights on user sentiment trends.

#### Acceptance Criteria

1. WHEN enriched feedback is received, THE Analytics_Service SHALL store the data in MongoDB collection
2. THE Analytics_Service SHALL accept feedback data containing user details, message, sentiment analysis results, and metadata
3. THE Analytics_Service SHALL provide endpoint to retrieve all analyzed feedback entries
4. THE Analytics_Service SHALL generate unique document identifier for each stored analytics record
5. THE Analytics_Service SHALL enable cross-origin requests for web application integration

### Requirement 6

**User Story:** As a system architect, I want services to run on different ports, so that multiple microservices can operate independently on the same machine.

#### Acceptance Criteria

1. THE Feedback_Service SHALL operate on port 8080 with PostgreSQL database connection
2. THE Analytics_Service SHALL operate on port 8081 with MongoDB database connection  
3. THE AI_Service SHALL operate on port 5000 as Flask application
4. THE system SHALL support concurrent operation of all three services
5. THE services SHALL communicate via HTTP requests using localhost and specified ports

### Requirement 7

**User Story:** As a developer, I want proper data persistence, so that feedback and analytics data are reliably stored and retrievable.

#### Acceptance Criteria

1. THE Feedback_Service SHALL use PostgreSQL database with JPA/Hibernate for data persistence
2. THE Analytics_Service SHALL use MongoDB with Spring Data MongoDB for document storage
3. THE system SHALL maintain data consistency between original feedback and analyzed feedback
4. THE databases SHALL support automatic schema updates and query logging for development
5. THE system SHALL handle database connection failures and provide appropriate error responses