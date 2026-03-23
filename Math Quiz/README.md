# 📚 Math Puzzle Quiz - Complete Web Application

## Project Title
**Math Puzzle Quiz - Interactive Learning Platform**

---

## Project Overview
A comprehensive, interactive web-based Mathematics Quiz application designed for students to test and improve their mathematical skills. The platform features multiple quiz categories with varying difficulty levels, real-time scoring, progress tracking, and a competitive leaderboard system. Built with modern web technologies and best practices, this application provides an engaging learning experience with responsive design.

### Key Highlights:
- **Full-Stack Application**: Complete frontend, backend, and database integration
- **Interactive Quizzes**: 75+ mathematical questions across 4 categories
- **User Authentication**: Secure registration and login system
- **Real-time Feedback**: Immediate answer validation with explanations
- **Performance Tracking**: User statistics and leaderboard rankings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI/UX**: Modern, intuitive interface with smooth animations

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Responsive design with gradients, animations, and flexbox/grid
- **JavaScript (ES6+)**: Vanilla JS for interactivity without dependencies
- **LocalStorage API**: Browser-based session management

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for routing and middleware
- **MySQL**: Relational database for data persistence
- **bcrypt**: Password hashing and encryption

### Additional Tools
- **REST API**: Standard HTTP methods for client-server communication
- **JSON**: Data interchange format
- **CORS**: Cross-origin resource sharing for frontend-backend communication

---

## Features of the System

### 1. **User Management**
- User registration with email validation
- Secure login with password hashing (bcrypt)
- Session management using localStorage
- User logout functionality
- Email uniqueness and username uniqueness validation

### 2. **Quiz System**
- **4 Quiz Categories**:
  - Arithmetic (Basic math operations)
  - Logical Reasoning (Problem-solving)
  - Number Patterns (Sequence identification)
  - Time Challenges (Speed-based problems)
  
- **3 Difficulty Levels**: Easy, Medium, Hard
- **75+ Questions**: Comprehensive question bank
- **Multiple Choice Format**: 4 options per question
- **Smart Question Loading**: Random question selection per quiz

### 3. **Interactive Features**
- **Question Timer**: Countdown timer for each question (20-55 seconds based on difficulty)
- **Progress Tracking**: Visual progress bar and question counter
- **Answer Selection**: Radio button selection with visual feedback
- **Navigation Controls**:
  - Previous button (navigate to previous questions)
  - Next button (move to next question)
  - Skip button (skip current question)
  
### 4. **Scoring & Results**
- **Instant Scoring**: 10 points per correct answer
- **Results Summary**:
  - Final score display
  - Number of correct answers
  - Accuracy percentage
  - Time spent on quiz
  
- **Answer Explanations**: Detailed explanations for each question

### 5. **Leaderboard System**
- **Top 50 Rankings**: Based on total score
- **User Statistics**:
  - Username
  - Total questions attempted
  - Correct answers count
  - Average score
  - Last quiz date
  
### 6. **User Statistics Dashboard**
- **Performance Metrics**:
  - Total questions answered
  - Correct answers count
  - Accuracy percentage
  - Total cumulative score
  - Average score per question
  - Total time spent
  
---

## System Architecture

### Architecture Pattern: **Three-Tier Architecture**

```
┌─────────────────────────────────────────────────┐
│          PRESENTATION LAYER (Frontend)          │
│  HTML5 | CSS3 | JavaScript | Responsive UI    │
│                                                 │
│  - Login/Register Pages                         │
│  - Dashboard                                    │
│  - Quiz Interface                               │
│  - Results & Statistics                         │
│  - Leaderboard                                  │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST API
┌────────────────▼────────────────────────────────┐
│      BUSINESS LOGIC LAYER (Backend)             │
│  Node.js | Express.js | Route Handlers         │
│                                                 │
│  - Authentication Routes (/api/auth)           │
│  - Quiz Routes (/api/quiz)                     │
│  - Scoring Routes (/api/scores)                │
│  - Middleware (CORS, Body Parser)              │
└────────────────┬────────────────────────────────┘
                 │ MySQL Protocol
┌────────────────▼────────────────────────────────┐
│      DATA STORAGE LAYER (Database)              │
│  MySQL | Relational Database                  │
│                                                 │
│  - Users Table                                 │
│  - Categories Table                            │
│  - Questions Table                             │
│  - Scores Table                                │
│  - Views (Analytics)                           │
└─────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Registration/Login Request
    ↓
Express Router → Authentication Controller
    ↓
Password Hashing (bcrypt) → Database Query
    ↓
User Data Stored/Retrieved
    ↓
JSON Response → Front-end (localStorage)
    ↓
Dashboard Display
```

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│   USERS      │         │  CATEGORIES  │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ username ✓   │         │ name ✓       │
│ password     │         │ description  │
│ email ✓      │         │ created_at   │
│ created_at   │         └──────────────┘
└──────────────┘                △
       △                        │
       │                        │ (category_id FK)
       │                        │
       │                   ┌──────────────┐
       │                   │  QUESTIONS   │
       │                   ├──────────────┤
       │                   │ id (PK)      │
       │                   │ category_id  │
       │                   │ question_txt │
       │                   │ options (JSON)
       │                   │ correct_ans  │
       │                   │ difficulty   │
       │                   │ explanation  │
       │                   │ time_limit   │
       │                   └──────────────┘
       │                        △
       │ (user_id FK)          │ (question_id FK)
       │                        │
       └────────────┬───────────┘
                    │
           ┌────────▼──────────┐
           │     SCORES        │
           ├───────────────────┤
           │ id (PK)           │
           │ user_id (FK)      │
           │ question_id (FK)  │
           │ score             │
           │ time_taken        │
           │ answered_at       │
           └───────────────────┘
```

### Database Tables Documentation

#### **USERS TABLE**
```sql
- id: Auto-incremented primary key
- username: Unique username (50 chars)
- password: Hashed password (bcrypt)
- email: Unique email address
- created_at: Account creation timestamp
- Indexes: username, email for faster queries
```

#### **CATEGORIES TABLE**
```sql
- id: Auto-increment primary key
- name: Category name (Arithmetic, Logical Reasoning, etc.)
- description: Category description
- created_at: Creation timestamp
- Indexes: name for faster lookups
```

#### **QUESTIONS TABLE**
```sql
- id: Auto-increment primary key
- category_id: Foreign key to categories
- question_text: Full question text
- options: JSON array of 4 multiple choice options
- correct_answer: The correct option
- difficulty: ENUM (Easy, Medium, Hard)
- explanation: Explanation for the correct answer
- time_limit: Seconds allocated (20-55 based on difficulty)
- created_at: Question creation timestamp
- Indexes: category_id, difficulty for filtering
```

#### **SCORES TABLE**
```sql
- id: Auto-increment primary key
- user_id: Foreign key to users
- question_id: Foreign key to questions
- score: Points earned (0 or 10)
- time_taken: Seconds taken to answer
- answered_at: Timestamp of attempt
- Indexes: user_id, question_id, answered_at for analytics
```

#### **Database Views**

**user_performance**: Aggregated user statistics
**category_performance**: Performance metrics per category
**leaderboard**: Top users ranked by score

---

## Folder Structure

```
Math Quiz/
│
├── README.md                          # Project documentation
│
├── frontend/                          # Frontend files
│   ├── index.html                     # Main HTML page
│   ├── css/
│   │   └── style.css                  # Complete styling (professional & responsive)
│   └── js/
│       └── app.js                     # All frontend JavaScript logic
│
├── backend/                           # Backend files
│   ├── server.js                      # Express server setup
│   ├── package.json                   # Node.js dependencies
│   ├── pom.xml                        # Project metadata (can be removed)
│   └── routes/
│       ├── auth.js                    # Authentication endpoints
│       ├── quiz.js                    # Quiz endpoints
│       └── scores.js                  # Scoring & leaderboard endpoints
│
└── database/
    └── schema.sql                     # Complete MySQL database schema
                                       # with sample data & views
```

---

## Complete API Documentation

### Authentication Endpoints

#### **POST /api/auth/register**
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Response** (201):
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "message": "User registered successfully"
  }
  ```

#### **POST /api/auth/login**
- **Description**: Authenticate user and return credentials
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "securepass123"
  }
  ```
- **Response** (200):
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "message": "Login successful"
  }
  ```

### Quiz Endpoints

#### **GET /api/quiz/categories**
- **Description**: Get all quiz categories
- **Response** (200):
  ```json
  [
    {
      "id": 1,
      "name": "Arithmetic",
      "description": "Basic arithmetic operations..."
    },
    ...
  ]
  ```

#### **GET /api/quiz/questions**
- **Description**: Get random questions for a quiz
- **Query Parameters**:
  - `categoryId` (required): Category ID
  - `difficulty` (required): Easy/Medium/Hard
  - `count` (optional, default=5): Number of questions
- **Response** (200):
  ```json
  [
    {
      "id": 1,
      "category_id": 1,
      "question_text": "What is 15 + 23?",
      "options": "[\"36\", \"38\", \"40\", \"42\"]",
      "correct_answer": "38",
      "difficulty": "Easy",
      "explanation": "Simply add 15 + 23 = 38",
      "time_limit": 30
    },
    ...
  ]
  ```

#### **POST /api/quiz/validate-answer**
- **Description**: Validate user's answer
- **Request Body**:
  ```json
  {
    "questionId": 1,
    "userAnswer": "38"
  }
  ```
- **Response** (200):
  ```json
  {
    "isCorrect": true,
    "correctAnswer": "38",
    "explanation": "Simply add 15 + 23 = 38",
    "score": 10
  }
  ```

### Scoring Endpoints

#### **POST /api/scores**
- **Description**: Submit score for a question
- **Request Body**:
  ```json
  {
    "userId": 1,
    "questionId": 1,
    "score": 10,
    "timeTaken": 25
  }
  ```
- **Response** (201):
  ```json
  {
    "id": 1,
    "message": "Score recorded successfully"
  }
  ```

#### **GET /api/scores/leaderboard**
- **Description**: Get top 50 users
- **Response** (200):
  ```json
  [
    {
      "id": 1,
      "username": "john_doe",
      "questions_attempted": 50,
      "correct_answers": 45,
      "total_score": 450,
      "avg_score": 9.0,
      "last_quiz_date": "2024-03-22T10:30:00Z"
    },
    ...
  ]
  ```

#### **GET /api/scores/stats/:userId**
- **Description**: Get user statistics
- **Response** (200):
  ```json
  {
    "total_questions": 50,
    "correct_answers": 45,
    "avg_score": 9.0,
    "total_score": 450,
    "total_time": 1200
  }
  ```

---

## Instructions to Run the Project

### Step 1: Prerequisites
Ensure you have installed:
- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org)
- **MySQL Server** (v5.7 or higher) - Download from [mysql.com](https://www.mysql.com/downloads/)
- **Git** (optional, for version control)

### Step 2: Database Setup

1. **Open MySQL Command Line or MySQL Workbench**
   ```bash
   mysql -u root -p
   ```

2. **Import the database schema**
   ```bash
   source /path/to/Math%20Quiz/database/schema.sql
   ```

3. **Verify database creation**
   ```sql
   USE math_quiz;
   SELECT * FROM users;
   SELECT COUNT(*) FROM questions;
   ```

### Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd "Math Quiz/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install:
   - `express` - Web framework
   - `mysql2` - MySQL driver
   - `bcrypt` - Password hashing
   - `cors` - Cross-origin support
   - `body-parser` - JSON parsing

3. **Update database connection** (if needed)
   
   Edit `server.js` and update if your credentials differ:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',        // Change if different
     password: '',        // Change if you set a password
     database: 'math_quiz'
   });
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   Expected output:
   ```
   Server running on http://localhost:8080
   Connected to MySQL database
   ```

### Step 4: Frontend Setup

1. **Open the frontend in a browser**
   - Navigate to: `Math Quiz/frontend/`
   - Open `index.html` directly in your browser
   - OR serve using a local server (recommended):
   
   ```bash
   # Using Python:
   python -m http.server 3000
   
   # Using Node.js (with http-server):
   npx http-server . -p 3000
   ```

2. **Access the application**
   - Open browser and go to: `http://localhost:3000`

### Step 5: Test the Application

1. **Create a test account**
   - Click "Register here"
   - Fill in username, email, and password
   - Click Register

2. **Login**
   - Use the credentials you just created
   - Click Login

3. **Take a quiz**
   - Select a category and difficulty
   - Answer questions
   - View results and statistics

4. **Check leaderboard**
   - Click "View Leaderboard" to see rankings

---

## Project Structure Explanation

### Frontend Architecture

#### **HTML Structure (index.html)**
- **Page-based routing**: 7 different pages (login, register, dashboard, quiz, results, leaderboard, stats)
- **Semantic HTML5**: Proper use of header, nav, canvas, form elements
- **Accessibility**: Labels for inputs, ARIA attributes where needed

#### **CSS Architecture (style.css)**
- **CSS Variables**: Customizable color scheme and spacing
- **Responsive Grid/Flexbox**: Mobile-first responsive design
- **Component-based styling**: Modular CSS for reusability
- **Animations**: Smooth transitions and keyframe animations
- **Professional color scheme**: Gradient backgrounds, proper contrast

#### **JavaScript Architecture (app.js)**
```javascript
// Global State
- currentUser: User session data
- currentQuiz: Array of questions
- selectedAnswers: User's selections tracking
- quizScore: Running score calculation

// Core Functions
- Authentication: handleLogin(), handleRegister()
- Quiz Management: startQuiz(), showQuestion(), nextQuestion()
- Scoring: submitScore(), endQuiz()
- Analytics: loadLeaderboard(), loadUserStats()
- UI: showPage(), showAlert(), updateProgress()

// Features
- LocalStorage for session persistence
- Real-time form validation
- Error handling with user-friendly messages
- Responsive event listeners
```

### Backend Architecture

#### **Server Setup (server.js)**
- Express middleware configuration
- CORS and body-parser setup
- MySQL connection management
- Route imports and registration
- Global database object accessibility

#### **Authentication Routes (auth.js)**
```javascript
Routes:
- POST /register → User registration
- POST /login → User authentication

Features:
- Input validation
- Password hashing with bcrypt
- Duplicate email/username checking
- Error responses with status codes
```

#### **Quiz Routes (quiz.js)**
```javascript
Routes:
- GET /categories → List all categories
- GET /questions → Get random questions
- GET /question/:id → Get specific question
- POST /validate-answer → Check answer correctness

Features:
- Query parameter filtering
- Random question selection
- Answer validation logic
- Score calculation
```

#### **Scoring Routes (scores.js)**
```javascript
Routes:
- POST / → Record user score
- GET /user/:userId → Get user's attempts
- GET /leaderboard → Top 50 users
- GET /stats/:userId → User statistics

Features:
- Score aggregation
- Ranking calculation
- Statistical analysis
- Performance metrics
```

### Database Design Rationale

**Normalization**: Database follows 3rd Normal Form (3NF)
- Eliminates data redundancy
- Maintains referential integrity
- Ensures scalability

**Indexing Strategy**:
- Primary keys for uniqueness
- Foreign keys for relationships
- Functional indexes on frequently queried columns (username, category_id)

**Views**:
- Simplify complex queries
- Improve query performance
- Centralize business logic

---

## Explanation of Important Code Sections

### 1. **User Authentication with Bcrypt**
```javascript
// Backend: Password hashing on registration
const hashedPassword = await bcrypt.hash(password, 10);
// 10 = salt rounds for security

// Login: Comparing passwords
const isValid = await bcrypt.compare(password, user.password);
```
**Why**: Passwords are never stored in plain text. Bcrypt uses salting and hashing to prevent breaches.

### 2. **REST API Communication**
```javascript
// Frontend: Fetching data from backend
const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});
const data = await response.json();
```
**Why**: Clean separation between frontend and backend. Frontend only sends/receives data.

### 3. **Timer Implementation**
```javascript
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            nextQuestion();
        }
    }, 1000);
}
```
**Why**: setInterval repeats code every 1000ms. Auto-advances when time expires.

### 4. **Database Query with Prepared Statements**
```javascript
// Backend: Prevents SQL injection
const query = 'SELECT * FROM users WHERE username = ?';
global.db.query(query, [username], (err, results) => {
    // ...
});
```
**Why**: Placeholders (?) prevent SQL injection attacks. Parameterized queries are more secure.

### 5. **Local Storage for Session Management**
```javascript
// Frontend: Persist user session
localStorage.setItem('user', JSON.stringify(currentUser));
// Retrieve on page reload
const savedUser = localStorage.getItem('user');
```
**Why**: Browser maintains session without server cookies. User stays logged in after refresh.

### 6. **Responsive Design with CSS Grid**
```css
.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}
```
**Why**: auto-fit creates responsive columns. Automatically adjusts to screen size.

---

## Installation Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install` in the backend directory

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:3306"
**Solution**: 
1. Verify MySQL is running
2. Check credentials in `server.js`
3. Ensure database `math_quiz` exists

### Issue: "Address already in use :::8080"
**Solution**: 
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8080   # Windows (find PID and taskkill)
```

### Issue: CORS errors in browser console
**Solution**: Ensure backend server is running on port 8080

---

## Future Enhancements & Improvements

### Feature Enhancements
1. **User Profiles**
   - Profile pictures/avatars
   - Bio and interests
   - Friend connections
   - Private messaging

2. **Advanced Quiz Features**
   - Timed exams (full test mode)
   - Practice mode (unlimited attempts)
   - Custom quiz creation by users
   - Review previous attempts

3. **Learning Analytics**
   - Progress tracking graphs
   - Strength/weakness analysis
   - Topic-wise performance
   - Personalized recommendations

4. **Gamification**
   - Achievement badges
   - Points and levels system
   - Daily challenges
   - Streak counter

### Technical Improvements
1. **Performance Optimization**
   - Implement caching (Redis)
   - Database query optimization
   - Lazy loading for questions
   - Image compression

2. **Security Enhancements**
   - JWT authentication tokens
   - Rate limiting on API endpoints
   - HTTPS/SSL encryption
   - Two-factor authentication
   - Input sanitization

3. **Scalability**
   - Load balancing with Nginx
   - Database sharding
   - CDN for static assets
   - Microservices architecture

4. **Mobile Application**
   - Native iOS app (Swift)
   - Native Android app (Kotlin)
   - Offline quiz mode
   - Push notifications

5. **Admin Panel**
   - Question management dashboard
   - User moderation tools
   - Analytics and reports
   - Content filtering system

6. **Testing**
   - Unit tests with Jest
   - Integration tests
   - End-to-end tests with Cypress
   - Performance testing

---

## Code Quality Standards

This project follows:
- **Clean Code Principles**: Clear naming, single responsibility
- **DRY (Don't Repeat Yourself)**: Reusable functions and components
- **SOLID Principles**: Modular and maintainable code
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Security Best Practices**: Password hashing, parameterized queries, CORS

---

## License & Credits

**Project Type**: Educational Project  
**Difficulty Level**: Beginner to Intermediate  
**Suitable For**: College projects, Portfolio, Learning purposes

**Technologies Used**: Node.js, Express, MySQL, JavaScript, HTML5, CSS3

---

## Contact & Support

For questions or improvements:
- Review code comments for understanding
- Check API documentation above
- Test with provided sample data
- Refer to troubleshooting section

---

## Version History

- **v1.0** (2024-03-22): Complete application with all core features
  - User authentication system
  - 75+ questions across 4 categories
  - Real-time quiz interface
  - Leaderboard and statistics
  - Responsive design
- explanation (TEXT)
- time_limit (INT, DEFAULT 30 seconds)

#### scores
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT, FOREIGN KEY to users.id)
- question_id (INT, FOREIGN KEY to questions.id)
- score (INT, NOT NULL)
- time_taken (INT, seconds)
- answered_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

#### leaderboard (VIEW)
- username
- total_score (SUM of scores)
- questions_answered (COUNT of scores)

## Frontend Pages and Components

### Pages
1. **Login Page**: Username/password form, link to registration
2. **Registration Page**: Username, email, password form
3. **Dashboard**: Welcome message, category selection buttons, leaderboard link
4. **Quiz Page**: Question display, multiple choice options, timer, next button
5. **Results Page**: Final score display, back to dashboard button
6. **Leaderboard Page**: Top scores list

### Components
- Form inputs for login/registration
- Category selection buttons
- Question display with options
- Timer display
- Score display
- Leaderboard list

## Backend Logic and APIs

### Routes
- **Auth Routes** (/api/auth):
  - POST /register: Register new user
  - POST /login: Authenticate user
- **Quiz Routes** (/api/quiz):
  - GET /questions: Get random questions by category and difficulty
- **Score Routes** (/api/scores):
  - POST /: Submit score for a question
  - GET /user/{userId}: Get user's scores

### Database Connection
- Uses mysql2 for MySQL connection
- Password hashing with bcrypt

## Example Math Puzzle Questions

### Arithmetic Puzzles
1. **Easy**: What is 15 + 27?
   - Options: 42, 43, 41, 40
   - Correct: 42
   - Explanation: Basic addition

2. **Medium**: Solve: 8 × 9 - 5
   - Options: 67, 72, 69, 71
   - Correct: 67
   - Explanation: Multiplication before subtraction

### Logical Reasoning Puzzles
1. **Medium**: If all bloops are razzes and some razzes are fizzles, are all bloops fizzles?
   - Options: Yes, No, Cannot determine
   - Correct: Cannot determine
   - Explanation: The statements don't confirm all bloops are fizzles

### Number Pattern Puzzles
1. **Easy**: What is the next number: 2, 4, 8, 16, ...?
   - Options: 24, 32, 18, 20
   - Correct: 32
   - Explanation: Each number doubles

### Time-based Challenge Puzzles
1. **Hard**: Calculate 144 ÷ 12 × 3
   - Options: 36, 48, 24, 12
   - Correct: 36
   - Explanation: Division and multiplication from left to right

## User Flow Diagram

```
Start
  ↓
Login/Register
  ↓
Dashboard (Select Category & Difficulty)
  ↓
Quiz Session
  ↓
Display Question + Timer
  ↓
User Selects Answer
  ↓
Immediate Feedback + Score Update
  ↓
Next Question or End Quiz
  ↓
Results Page
  ↓
Back to Dashboard or View Leaderboard
  ↓
End
```

Key Flow Points:
- Authentication required before accessing quiz features
- Questions presented one at a time with countdown timer
- Answers checked immediately, scores updated
- Quiz ends after all questions or time expires
- Results show total score and performance summary
- Leaderboard accessible from dashboard