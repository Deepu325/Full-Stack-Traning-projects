# 📡 Math Puzzle Quiz - REST API Documentation

## Base URL
```
http://localhost:8080/api
```

## Content-Type
All requests and responses use:
```
Content-Type: application/json
```

## Response Format
All responses follow a consistent format with either success or error data.

---

## 🔐 Authentication Endpoints

### 1. User Registration
**Endpoint**: `POST /api/auth/register`
**Description**: Register a new user account

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Request Parameters**:
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| username | string | Yes | 3-50 characters, unique |
| email | string | Yes | Valid email format, unique |
| password | string | Yes | Minimum 6 characters |

**Response (201 Created)**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "message": "User registered successfully"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Username or email already exists"
}
```

**Error Cases**:
| Status | Error | Cause |
|--------|-------|-------|
| 400 | All fields are required | Missing username, email, or password |
| 400 | Password must be at least 6 characters | Password too short |
| 400 | Username or email already exists | Duplicate username or email |
| 500 | Database error | Server-side database issue |
| 500 | Server error | Unexpected error during registration |

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**JavaScript Fetch Example**:
```javascript
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// Usage:
registerUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securePassword123'
});
```

---

### 2. User Login
**Endpoint**: `POST /api/auth/login`
**Description**: Authenticate user and return user credentials

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Request Parameters**:
| Field | Type | Required |
|-------|------|----------|
| username | string | Yes |
| password | string | Yes |

**Response (200 OK)**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "message": "Login successful"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Username and password are required"
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Invalid credentials"
}
```

**Error Cases**:
| Status | Error | Cause |
|--------|-------|-------|
| 400 | Username and password are required | Missing credentials |
| 401 | Invalid credentials | Wrong username or password |
| 500 | Database error | Server error |
| 500 | Server error during password verification | Cryptographic error |

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

**JavaScript Fetch Example**:
```javascript
const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

// Usage and Storage:
const user = await loginUser({
  username: 'john_doe',
  password: 'securePassword123'
});

// Store in localStorage:
localStorage.setItem('user', JSON.stringify(user));
```

---

## 🎯 Quiz Endpoints

### 1. Get All Categories
**Endpoint**: `GET /api/quiz/categories`
**Description**: Retrieve all available quiz categories

**Query Parameters**: None

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Arithmetic",
    "description": "Basic arithmetic operations including addition, subtraction, multiplication, and division"
  },
  {
    "id": 2,
    "name": "Logical Reasoning",
    "description": "Problems requiring logical thinking and reasoning abilities"
  },
  {
    "id": 3,
    "name": "Number Patterns",
    "description": "Identify and complete number sequences and patterns"
  },
  {
    "id": 4,
    "name": "Time Challenges",
    "description": "Quick math problems to be solved within time limits"
  }
]
```

**Response (500 Error)**:
```json
{
  "error": "Database error"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/quiz/categories
```

**JavaScript Fetch Example**:
```javascript
const getCategories = async () => {
  const response = await fetch('http://localhost:8080/api/quiz/categories');
  return await response.json();
};

// Usage:
const categories = await getCategories();
categories.forEach(cat => {
  console.log(`${cat.id}: ${cat.name}`);
});
```

---

### 2. Get Questions for Quiz
**Endpoint**: `GET /api/quiz/questions`
**Description**: Get random questions for a specific category and difficulty

**Query Parameters**:
| Parameter | Type | Required | Default | Values |
|-----------|------|----------|---------|--------|
| categoryId | integer | Yes | - | 1, 2, 3, 4 |
| difficulty | string | Yes | - | Easy, Medium, Hard |
| count | integer | No | 5 | 1-10 |

**Response (200 OK)**:
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
  {
    "id": 2,
    "category_id": 1,
    "question_text": "What is 50 - 17?",
    "options": "[\"33\", \"32\", \"35\", \"34\"]",
    "correct_answer": "33",
    "difficulty": "Easy",
    "explanation": "50 - 17 = 33",
    "time_limit": 30
  }
]
```

**Response (400 Bad Request)**:
```json
{
  "error": "categoryId and difficulty are required"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "No questions found"
}
```

**Parsing options from JSON string**:
```javascript
const question = questions[0];
const options = JSON.parse(question.options);
// options = ["36", "38", "40", "42"]
```

**cURL Examples**:
```bash
# Get 5 easy arithmetic questions:
curl -X GET "http://localhost:8080/api/quiz/questions?categoryId=1&difficulty=Easy&count=5"

# Get 3 hard logical reasoning questions:
curl -X GET "http://localhost:8080/api/quiz/questions?categoryId=2&difficulty=Hard&count=3"
```

**JavaScript Fetch Example**:
```javascript
const getQuestions = async (categoryId, difficulty, count = 5) => {
  const url = `http://localhost:8080/api/quiz/questions?categoryId=${categoryId}&difficulty=${difficulty}&count=${count}`;
  const response = await fetch(url);
  return await response.json();
};

// Usage:
const questions = await getQuestions(1, 'Easy', 5);
questions.forEach((q, idx) => {
  const options = JSON.parse(q.options);
  console.log(`Q${idx + 1}: ${q.question_text}`);
  console.log(`Options: ${options.join(', ')}`);
});
```

---

### 3. Get Single Question
**Endpoint**: `GET /api/quiz/question/:id`
**Description**: Get details of a specific question

**URL Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| id | integer | Yes |

**Response (200 OK)**:
```json
{
  "id": 1,
  "category_id": 1,
  "question_text": "What is 15 + 23?",
  "options": "[\"36\", \"38\", \"40\", \"42\"]",
  "correct_answer": "38",
  "difficulty": "Easy",
  "explanation": "Simply add 15 + 23 = 38",
  "time_limit": 30
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Question not found"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/quiz/question/1
```

---

### 4. Validate Answer
**Endpoint**: `POST /api/quiz/validate-answer`
**Description**: Validate user's answer and return correctness status

**Request Body**:
```json
{
  "questionId": 1,
  "userAnswer": "38"
}
```

**Request Parameters**:
| Field | Type | Required |
|-------|------|----------|
| questionId | integer | Yes |
| userAnswer | string | Yes |

**Response (200 OK - Correct)**:
```json
{
  "isCorrect": true,
  "correctAnswer": "38",
  "explanation": "Simply add 15 + 23 = 38",
  "score": 10
}
```

**Response (200 OK - Incorrect)**:
```json
{
  "isCorrect": false,
  "correctAnswer": "38",
  "explanation": "Simply add 15 + 23 = 38",
  "score": 0
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "questionId and userAnswer are required"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Question not found"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/quiz/validate-answer \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": 1,
    "userAnswer": "38"
  }'
```

**JavaScript Fetch Example**:
```javascript
const validateAnswer = async (questionId, userAnswer) => {
  const response = await fetch('http://localhost:8080/api/quiz/validate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, userAnswer })
  });
  return await response.json();
};

// Usage:
const result = await validateAnswer(1, '38');
if (result.isCorrect) {
  console.log('✓ Correct! ' + result.score + ' points');
  quizScore += result.score;
} else {
  console.log('✗ Incorrect. Answer: ' + result.correctAnswer);
}
console.log('Explanation: ' + result.explanation);
```

---

## 📊 Scoring & Statistics Endpoints

### 1. Submit Score
**Endpoint**: `POST /api/scores`
**Description**: Record user's score for a question

**Request Body**:
```json
{
  "userId": 1,
  "questionId": 5,
  "score": 10,
  "timeTaken": 25
}
```

**Request Parameters**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| userId | integer | Yes | User ID from login |
| questionId | integer | Yes | Question ID |
| score | integer | Yes | 0 or 10 (points) |
| timeTaken | integer | Yes | Seconds taken |

**Response (201 Created)**:
```json
{
  "id": 145,
  "message": "Score recorded successfully"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "All fields are required"
}
```

**Response (500 Error)**:
```json
{
  "error": "Database error"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "questionId": 5,
    "score": 10,
    "timeTaken": 25
  }'
```

**JavaScript Fetch Example**:
```javascript
const submitScore = async (userId, questionId, score, timeTaken) => {
  const response = await fetch('http://localhost:8080/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId, score, timeTaken })
  });
  return await response.json();
};

// Usage in quiz:
await submitScore(
  currentUser.id,
  question.id,
  result.score,
  30 - timeLeft  // Time taken
);
```

---

### 2. Get User Scores
**Endpoint**: `GET /api/scores/user/:userId`
**Description**: Get all quiz attempts for a specific user

**URL Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | integer | Yes |

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "question_id": 5,
    "score": 10,
    "time_taken": 25,
    "answered_at": "2024-03-22T10:30:00Z",
    "question_text": "What is 15 + 23?",
    "difficulty": "Easy",
    "category_name": "Arithmetic"
  },
  {
    "id": 2,
    "user_id": 1,
    "question_id": 6,
    "score": 0,
    "time_taken": 30,
    "answered_at": "2024-03-22T10:35:00Z",
    "question_text": "What is 50 - 17?",
    "difficulty": "Easy",
    "category_name": "Arithmetic"
  }
]
```

**Response (500 Error)**:
```json
{
  "error": "Database error"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/scores/user/1
```

**JavaScript Fetch Example**:
```javascript
const getUserScores = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/scores/user/${userId}`);
  return await response.json();
};

// Usage:
const scores = await getUserScores(1);
scores.forEach(s => {
  console.log(`Q: ${s.question_text}`);
  console.log(`Score: ${s.score}/10 - Time: ${s.time_taken}s`);
});
```

---

### 3. Get Leaderboard
**Endpoint**: `GET /api/scores/leaderboard`
**Description**: Get top 50 users ranked by total score

**Query Parameters**: None

**Response (200 OK)**:
```json
[
  {
    "id": 2,
    "username": "alice_smith",
    "questions_attempted": 60,
    "correct_answers": 55,
    "total_score": 550,
    "avg_score": 9.17,
    "last_quiz_date": "2024-03-22T15:45:00Z"
  },
  {
    "id": 1,
    "username": "john_doe",
    "questions_attempted": 50,
    "correct_answers": 45,
    "total_score": 450,
    "avg_score": 9.0,
    "last_quiz_date": "2024-03-22T10:30:00Z"
  },
  {
    "id": 3,
    "username": "bob_wilson",
    "questions_attempted": 40,
    "correct_answers": 35,
    "total_score": 350,
    "avg_score": 8.75,
    "last_quiz_date": "2024-03-21T14:20:00Z"
  }
]
```

**Response (500 Error)**:
```json
{
  "error": "Database error"
}
```

**Data Structure**:
| Field | Type | Description |
|-------|------|-------------|
| id | integer | User ID |
| username | string | User's username |
| questions_attempted | integer | Total questions answered |
| correct_answers | integer | Number of correct answers |
| total_score | integer | Sum of all quiz scores |
| avg_score | float | Average score per question |
| last_quiz_date | datetime | Last quiz attempt timestamp |

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/scores/leaderboard
```

**JavaScript Fetch Example**:
```javascript
const getLeaderboard = async () => {
  const response = await fetch('http://localhost:8080/api/scores/leaderboard');
  return await response.json();
};

// Usage:
const leaderboard = await getLeaderboard();
leaderboard.forEach((user, index) => {
  console.log(`${index + 1}. ${user.username} - ${user.total_score} points (${user.correct_answers}/${user.questions_attempted} correct)`);
});
```

---

### 4. Get User Statistics
**Endpoint**: `GET /api/scores/stats/:userId`
**Description**: Get detailed statistics for a specific user

**URL Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| userId | integer | Yes |

**Response (200 OK)**:
```json
{
  "total_questions": 50,
  "correct_answers": 45,
  "avg_score": 9.0,
  "total_score": 450,
  "total_time": 1250
}
```

**Response (500 Error)**:
```json
{
  "error": "Database error"
}
```

**Calculations**:
```javascript
const stats = await getUserStats(1);

// Calculate accuracy percentage:
const accuracy = (stats.correct_answers / stats.total_questions) * 100;
// Result: 90%

// Convert total time to minutes:
const minutes = Math.floor(stats.total_time / 60);
const seconds = stats.total_time % 60;
// Result: 20 minutes 50 seconds
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/scores/stats/1
```

**JavaScript Fetch Example**:
```javascript
const getUserStats = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/scores/stats/${userId}`);
  return await response.json();
};

// Usage and display:
const stats = await getUserStats(1);
console.log(`
  Questions Answered: ${stats.total_questions}
  Correct Answers: ${stats.correct_answers}
  Accuracy: ${((stats.correct_answers / stats.total_questions) * 100).toFixed(1)}%
  Total Score: ${stats.total_score}
  Average Score: ${stats.avg_score.toFixed(2)}/10
  Total Time: ${Math.floor(stats.total_time / 60)}m ${stats.total_time % 60}s
`);
```

---

## 🔍 API Status Endpoint

### Health Check
**Endpoint**: `GET /api/health`
**Description**: Check if the server is running

**Response (200 OK)**:
```json
{
  "status": "Server is running"
}
```

**cURL Example**:
```bash
curl -X GET http://localhost:8080/api/health
```

---

## 🚨 Error Handling

### HTTP Status Codes
| Code | Meaning | Common Cause |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created (POST) |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Database or server issue |

### Global Error Format
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Messages
| Error | Cause | Solution |
|-------|-------|----------|
| "All fields are required" | Missing request parameter | Check request body |
| "Invalid credentials" | Wrong username/password | Verify login info |
| "Username already exists" | Duplicate username | Choose different username |
| "Database error" | Server-side issue | Check MySQL connection |
| "Cannot GET /path" | Wrong URL or method | Verify endpoint URL |
| "CORS error" | Backend not running | Start backend server |

---

## 📋 Complete Integration Example

```javascript
// Complete user journey example

class QuizApp {
  constructor() {
    this.user = null;
    this.currentQuiz = [];
    this.apiBase = 'http://localhost:8080/api';
  }

  // 1. Register and login
  async authenticate(username, email, password) {
    // Register
    const registerRes = await fetch(`${this.apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!registerRes.ok) {
      // Try login if registration fails (user might exist)
      const loginRes = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      this.user = await loginRes.json();
    } else {
      this.user = await registerRes.json();
    }

    localStorage.setItem('user', JSON.stringify(this.user));
    return this.user;
  }

  // 2. Load quiz
  async loadQuiz(categoryId, difficulty) {
    const response = await fetch(
      `${this.apiBase}/quiz/questions?categoryId=${categoryId}&difficulty=${difficulty}&count=5`
    );
    this.currentQuiz = await response.json();
    return this.currentQuiz;
  }

  // 3. Answer question and submit
  async answerQuestion(questionId, userAnswer) {
    // Validate answer
    const validation = await fetch(`${this.apiBase}/quiz/validate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer })
    });
    const result = await validation.json();

    // Submit score
    await fetch(`${this.apiBase}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.user.id,
        questionId,
        score: result.score,
        timeTaken: 25
      })
    });

    return result;
  }

  // 4. Get leaderboard
  async getLeaderboard() {
    const response = await fetch(`${this.apiBase}/scores/leaderboard`);
    return await response.json();
  }

  // 5. Get user stats
  async getUserStats() {
    const response = await fetch(`${this.apiBase}/scores/stats/${this.user.id}`);
    return await response.json();
  }
}

// Usage:
const app = new QuizApp();
await app.authenticate('john_doe', 'john@example.com', 'password123');
const quiz = await app.loadQuiz(1, 'Easy');
const result = await app.answerQuestion(quiz[0].id, '38');
const leaderboard = await app.getLeaderboard();
const stats = await app.getUserStats();
```

---

## Rate Limiting (Production Recommendation)

For production, implement rate limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

---

**API Documentation Complete!** 🎉

For any issues or questions, refer to the main README.md or SETUP_GUIDE.md.
