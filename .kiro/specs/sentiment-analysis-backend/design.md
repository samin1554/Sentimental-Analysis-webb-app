# Design Document

## Overview

The Sentiment Analysis Microservices Backend is a distributed system consisting of three independent services that work together to collect, analyze, and store user feedback with sentiment insights. The architecture follows microservices principles with each service having its own database, technology stack, and responsibility domain.

## Architecture

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client/Web    │    │   Client/Web    │    │   Client/Web    │
│   Application   │    │   Application   │    │   Application   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ POST /api/feedback   │ GET /api/analytics   │ POST /analyze
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│ Feedback Service│    │Analytics Service│    │   AI Service    │
│   (Port 8080)   │    │   (Port 8081)   │    │   (Port 5000)   │
│   Spring Boot   │    │   Spring Boot   │    │     Flask       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │                      │              ┌───────┴───────┐
          │                      │              │ Hugging Face  │
          │                      │              │ Transformers  │
          │                      │              │ Sentiment     │
          │                      │              │ Model         │
          │                      │              └───────────────┘
┌─────────▼───────┐    ┌─────────▼───────┐
│   PostgreSQL    │    │    MongoDB      │
│  feedback_db    │    │  analyticsdb    │
│   (Port 5432)   │    │  (Port 27017)   │
└─────────────────┘    └─────────────────┘

Inter-Service Communication:
AI Service → Feedback Service: GET /api/feedback/{id}
AI Service → Analytics Service: POST /api/analytics
```

### Service Communication Flow

1. **Feedback Collection**: Client submits feedback to Feedback Service
2. **Processing Trigger**: AI Service receives processing request with feedback ID
3. **Data Retrieval**: AI Service fetches original feedback from Feedback Service
4. **Sentiment Analysis**: AI Service processes message using ML model
5. **Data Enrichment**: AI Service combines original data with sentiment results
6. **Analytics Storage**: AI Service sends enriched data to Analytics Service
7. **Response**: Processed data returned to client

## Components and Interfaces

### Feedback Service (Java Spring Boot)

**Technology Stack:**
- Java 17
- Spring Boot 3.5.7
- Spring Data JPA
- PostgreSQL Driver
- Lombok for boilerplate reduction

**Core Components:**

```java
// Data Model
@Entity
@Table(name = "feedback")
public class FeedBack {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userName;
    @Column(nullable = false)
    private String email;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    private String source;
    private LocalDateTime createdAt;
}

// Repository Layer
@Repository
public interface FeedBackRepository extends JpaRepository<FeedBack, Long> {}

// Service Layer
@Service
public class FeedBackService {
    public FeedBack saveFeedBack(FeedBack feedBack);
    public List<FeedBack> getAllFeedback();
    public Optional<FeedBack> getFeedbackById(Long id);
}

// Controller Layer
@RestController
@RequestMapping("api/feedback")
public class FeedbackController {
    @PostMapping ResponseEntity<FeedBack> submitFeedback(@RequestBody FeedBack feedBack);
    @GetMapping ResponseEntity<List<FeedBack>> getAllFeedback();
    @GetMapping("/{id}") ResponseEntity<FeedBack> getFeedbackById(@PathVariable Long id);
}
```

**API Endpoints:**
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Retrieve all feedback
- `GET /api/feedback/{id}` - Retrieve specific feedback by ID

### AI Service (Python Flask)

**Technology Stack:**
- Python 3.x
- Flask 3.1.2
- Hugging Face Transformers 4.57.1
- PyTorch 2.9.0
- Requests for HTTP communication

**Core Components:**

```python
# Flask Application Structure
app = Flask(__name__)

# ML Model Integration
from transformers import pipeline
sentiment_model = pipeline("sentiment-analysis")

# API Endpoints
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "AI Service is running!", "status": "OK"}), 200

@app.route('/analyze', methods=['POST'])
def analyze_text():
    # Direct sentiment analysis endpoint
    
@app.route('/process/<int:feedback_id>', methods=['POST'])
def process_feedback(feedback_id):
    # End-to-end feedback processing workflow
```

**Processing Workflow:**
1. Fetch feedback from Feedback Service via HTTP GET
2. Extract message content for analysis
3. Run sentiment analysis using Hugging Face model
4. Construct enriched feedback object
5. Send to Analytics Service via HTTP POST
6. Return processed data to client

### Analytics Service (Java Spring Boot)

**Technology Stack:**
- Java 17
- Spring Boot 3.5.7
- Spring Data MongoDB
- MongoDB Driver
- Lombok for boilerplate reduction

**Core Components:**

```java
// Data Model
@Document(collection = "analyzed_feedback")
public class AnalyzedFeedback {
    @Id
    private String id;
    private String userName;
    private String email;
    private String message;
    private String sentimentLabel;
    private double sentimentScore;
    private String source;
    private String createdAt;
}

// Repository Layer
@Repository
public interface AnalyzedFeedbackRepository extends MongoRepository<AnalyzedFeedback, String> {}

// Service Layer
@Service
public class AnalyzedFeedBackService {
    public ResponseEntity<AnalyzedFeedback> saveFeedback(AnalyzedFeedback feedback);
    public ResponseEntity<List<AnalyzedFeedback>> getAllFeedback();
}

// Controller Layer
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyzedFeedBackController {
    @PostMapping ResponseEntity<AnalyzedFeedback> saveFeedback(@RequestBody AnalyzedFeedback feedback);
    @GetMapping ResponseEntity<List<AnalyzedFeedback>> getAllFeedback();
}
```

**API Endpoints:**
- `POST /api/analytics` - Store analyzed feedback
- `GET /api/analytics` - Retrieve all analyzed feedback

## Data Models

### Feedback Entity (PostgreSQL)
```sql
CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(255),
    created_at TIMESTAMP
);
```

### Analyzed Feedback Document (MongoDB)
```json
{
    "_id": "ObjectId",
    "userName": "string",
    "email": "string", 
    "message": "string",
    "sentimentLabel": "POSITIVE|NEGATIVE",
    "sentimentScore": "number (0-1)",
    "source": "string",
    "createdAt": "ISO datetime string"
}
```

### Data Flow Transformation
```
Raw Feedback → AI Processing → Enriched Analytics Data

{                    {                      {
  "id": 1,            "text": "message",     "userName": "user",
  "userName": "user", "sentiment_label":     "email": "email",
  "email": "email",   "POSITIVE",           "message": "message", 
  "message": "text",  "sentiment_score":    "sentimentLabel": "POSITIVE",
  "source": "web",    0.95                  "sentimentScore": 0.95,
  "createdAt": "..."  }                     "source": "web",
}                                          "createdAt": "..."
                                          }
```

## Error Handling

### Service-Level Error Handling

**Feedback Service:**
- Database connection failures → HTTP 500 with error message
- Invalid request data → HTTP 400 with validation details
- Resource not found → HTTP 404 with clear message
- JPA constraint violations → HTTP 400 with field-specific errors

**AI Service:**
- Missing text field → HTTP 400 "Please provide 'text' in JSON body"
- Feedback service unavailable → HTTP 404 "Feedback not found"
- Analytics service failures → Logged error, continue processing
- Model loading failures → HTTP 500 with service unavailable message

**Analytics Service:**
- MongoDB connection issues → HTTP 500 with database error
- Invalid document structure → HTTP 400 with validation details
- Duplicate document handling → Upsert or return existing document

### Inter-Service Communication Resilience

```python
# Example error handling in AI Service
try:
    requests.post(analytics_url, json=enriched_data)
except requests.exceptions.RequestException as e:
    print(f"Failed to send to analytics service: {e}")
    # Continue processing, don't fail the entire request
```

### Database Configuration Resilience

**PostgreSQL Configuration:**
```properties
spring.jpa.hibernate.ddl-auto=update  # Auto-schema updates
spring.jpa.show-sql=true              # Query logging
spring.datasource.url=jdbc:postgresql://localhost:5432/feedback_db
```

**MongoDB Configuration:**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/analyticsdb
```

## Testing Strategy

### Unit Testing Approach

**Java Services Testing:**
- Spring Boot Test framework for integration testing
- JUnit 5 for unit testing service logic
- Mockito for mocking repository dependencies
- TestContainers for database integration tests
- MockMvc for controller endpoint testing

**Python Service Testing:**
- pytest for unit and integration testing
- unittest.mock for mocking external HTTP calls
- Flask test client for endpoint testing
- Mock Hugging Face model responses for consistent testing

### Integration Testing Strategy

**Service Communication Testing:**
1. Test Feedback Service CRUD operations
2. Test AI Service model integration and HTTP communication
3. Test Analytics Service MongoDB operations
4. Test end-to-end workflow: feedback submission → processing → analytics storage

**Database Testing:**
- PostgreSQL: Test JPA entity mappings and constraints
- MongoDB: Test document serialization and queries
- Test data consistency across service boundaries

### Performance Testing Considerations

**Load Testing Targets:**
- Feedback submission throughput
- Sentiment analysis processing time
- Database query performance under load
- Inter-service communication latency

**Monitoring Points:**
- Service response times
- Database connection pool utilization
- Memory usage during ML model inference
- Error rates across service boundaries

## Frontend Integration Prompt

### Comprehensive Frontend Generation Prompt for Figma AI

**System Overview for Frontend Design:**

Create a modern, responsive web application frontend that interfaces with a sentiment analysis microservices backend. The application should provide an intuitive user experience for submitting feedback and viewing sentiment analytics.

**Backend API Integration Requirements:**

The frontend must integrate with three microservices:

1. **Feedback Service (http://localhost:8080)**
   - POST /api/feedback - Submit new feedback
   - GET /api/feedback - Retrieve all feedback  
   - GET /api/feedback/{id} - Get specific feedback

2. **Analytics Service (http://localhost:8081)**
   - GET /api/analytics - Retrieve sentiment-analyzed feedback
   - POST /api/analytics - Store analyzed feedback (internal use)

3. **AI Service (http://localhost:5000)**
   - POST /analyze - Direct text sentiment analysis
   - POST /process/{feedback_id} - Process existing feedback
   - GET /test - Health check

**Required UI Components and Pages:**

**1. Feedback Submission Form**
- Clean, modern form with fields:
  - User Name (text input, optional)
  - Email (email input, required, validation)
  - Message (textarea, required, placeholder: "Share your feedback...")
  - Source (dropdown: Web, Mobile App, Email, Other)
- Submit button with loading state
- Success/error message display
- Form validation with real-time feedback
- Character counter for message field
- Responsive design for mobile/desktop

**2. Analytics Dashboard**
- Header with title "Sentiment Analytics Dashboard"
- Summary cards showing:
  - Total feedback count
  - Positive sentiment percentage
  - Negative sentiment percentage
  - Average sentiment score
- Data visualization components:
  - Sentiment distribution pie chart
  - Sentiment trends over time (line chart)
  - Recent feedback list with sentiment indicators
- Filter options:
  - Date range picker
  - Sentiment type filter (All, Positive, Negative)
  - Source filter dropdown
- Responsive grid layout

**3. Feedback List/Table View**
- Sortable table with columns:
  - User Name
  - Email
  - Message (truncated with expand option)
  - Sentiment (badge with color coding)
  - Score (progress bar or numeric display)
  - Source
  - Date/Time
- Pagination controls
- Search functionality
- Export to CSV button
- Sentiment color coding: Green (positive), Red (negative)

**4. Real-time Sentiment Analyzer**
- Text input area for instant analysis
- "Analyze Sentiment" button
- Results display showing:
  - Sentiment label with icon
  - Confidence score with visual indicator
  - Color-coded background based on sentiment
- Clear/reset functionality

**Design System Specifications:**

**Color Palette:**
- Primary: #3B82F6 (Blue)
- Success/Positive: #10B981 (Green)
- Warning/Negative: #EF4444 (Red)
- Neutral: #6B7280 (Gray)
- Background: #F9FAFB (Light Gray)
- Text: #111827 (Dark Gray)

**Typography:**
- Headings: Inter or Roboto, Bold
- Body text: Inter or Roboto, Regular
- Font sizes: 12px, 14px, 16px, 18px, 24px, 32px

**Component Styling:**
- Rounded corners: 8px border radius
- Shadows: Subtle drop shadows for cards
- Buttons: Solid primary color with hover states
- Form inputs: Border with focus states
- Cards: White background with subtle border

**Responsive Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

**Interactive Features:**

**Form Interactions:**
- Real-time validation with error messages
- Loading spinners during API calls
- Success animations after submission
- Auto-clear form after successful submission

**Dashboard Interactions:**
- Hover effects on chart elements
- Clickable chart segments for filtering
- Smooth transitions between views
- Loading states for data fetching

**Data Visualization Requirements:**
- Use Chart.js, D3.js, or similar library
- Interactive charts with tooltips
- Responsive chart sizing
- Color-coded sentiment data
- Animation on data load

**API Integration Patterns:**

**HTTP Request Examples:**
```javascript
// Submit Feedback
POST http://localhost:8080/api/feedback
Content-Type: application/json
{
  "userName": "John Doe",
  "email": "john@example.com", 
  "message": "Great service!",
  "source": "web"
}

// Get Analytics Data
GET http://localhost:8081/api/analytics
Response: Array of analyzed feedback objects

// Analyze Text
POST http://localhost:5000/analyze
Content-Type: application/json
{
  "text": "I love this product!"
}
```

**Error Handling UI:**
- Toast notifications for API errors
- Inline form validation messages
- Fallback UI for failed data loads
- Retry buttons for failed requests
- Network status indicators

**Accessibility Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators on interactive elements

**Performance Considerations:**
- Lazy loading for large datasets
- Debounced search inputs
- Optimized API calls with caching
- Progressive loading for charts
- Mobile-first responsive design

**Technology Stack Recommendations:**
- React.js or Vue.js for component framework
- Axios or Fetch API for HTTP requests
- Chart.js or Recharts for data visualization
- Tailwind CSS or Material-UI for styling
- React Router or Vue Router for navigation

**User Experience Flow:**
1. Landing page with navigation to feedback form and dashboard
2. Feedback submission with immediate confirmation
3. Dashboard access with real-time data updates
4. Detailed feedback analysis with filtering options
5. Responsive design across all device types

This frontend should provide a complete user interface for the sentiment analysis microservices backend, enabling users to submit feedback and administrators to view comprehensive sentiment analytics through an intuitive, modern web application.