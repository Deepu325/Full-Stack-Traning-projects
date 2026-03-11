# 🚀 Travel Planner Backend API

Complete backend API for the Travel Planner application built with Node.js, Express, and MySQL.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## ✨ Features

### Authentication
- ✅ User registration with password hashing
- ✅ User login with JWT authentication
- ✅ Protected routes with JWT middleware
- ✅ Get current user information

### Trip Management
- ✅ Create new trips
- ✅ Get all trips for user
- ✅ Get single trip with details
- ✅ Update trip information
- ✅ Delete trips
- ✅ Get trip statistics

### Itinerary Management
- ✅ Add itinerary items to trips
- ✅ Get all itinerary items
- ✅ Update itinerary items
- ✅ Delete itinerary items

### Expense Tracking
- ✅ Add expenses to trips
- ✅ Get all expenses for trip
- ✅ Get expense summary by category
- ✅ Update expenses
- ✅ Delete expenses

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment Variables:** dotenv
- **CORS:** cors

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

---

## 🔧 Installation

### Step 1: Navigate to Backend Directory

```bash
cd travel-planner/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- body-parser
- express-validator
- nodemon (dev dependency)

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

Make sure your MySQL server is running.

**Windows:**
```bash
# Start MySQL service
net start MySQL80
```

**Mac/Linux:**
```bash
# Start MySQL service
sudo service mysql start
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` file and update with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_planner_db
DB_PORT=3306
JWT_SECRET=your_secure_random_string
```

### Step 3: Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will:
- Create the database
- Create all required tables (users, trips, itinerary, expenses)
- Set up foreign key relationships
- Create indexes for better performance

**Expected Output:**
```
🚀 Starting Database Initialization...
✅ Connected to MySQL Server
✅ Database 'travel_planner_db' created/verified
📊 Creating Tables...
✅ Users table created
✅ Trips table created
✅ Itinerary table created
✅ Expenses table created
🎉 Database initialization completed successfully!
```

---

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file to configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=travel_planner_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://127.0.0.1:5500
```

**Important:**
- Change `JWT_SECRET` to a secure random string in production
- Update `DB_PASSWORD` with your MySQL password
- Update `CORS_ORIGIN` to match your frontend URL

---

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

**Expected Output:**
```
✅ MySQL Database Connected Successfully

🚀 ========================================
✅ Server running on port 5000
📍 API URL: http://localhost:5000
🌍 Environment: development
🚀 ========================================

📝 Available Endpoints:
   POST   /api/auth/register
   POST   /api/auth/login
   GET    /api/auth/me
   GET    /api/trips
   POST   /api/trips
   ...

✅ Server ready to accept requests!
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Trip Endpoints

#### Create Trip
```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": "Paris, France",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "budget": 3500,
  "travel_type": "leisure",
  "notes": "Summer vacation",
  "status": "upcoming"
}
```

#### Get All Trips
```http
GET /api/trips
Authorization: Bearer <token>

# Optional query parameters:
GET /api/trips?status=upcoming
```

#### Get Single Trip
```http
GET /api/trips/:id
Authorization: Bearer <token>
```

#### Update Trip
```http
PUT /api/trips/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": "Tokyo, Japan",
  "start_date": "2024-08-01",
  "end_date": "2024-08-15",
  "budget": 4500,
  "travel_type": "adventure",
  "notes": "Updated notes",
  "status": "upcoming"
}
```

#### Delete Trip
```http
DELETE /api/trips/:id
Authorization: Bearer <token>
```

#### Get Trip Statistics
```http
GET /api/trips/stats
Authorization: Bearer <token>
```

### Itinerary Endpoints

#### Add Itinerary Item
```http
POST /api/trips/:tripId/itinerary
Authorization: Bearer <token>
Content-Type: application/json

{
  "day_number": 1,
  "activity": "Visit Eiffel Tower",
  "time": "10:00 AM",
  "location": "Champ de Mars, Paris"
}
```

#### Get Itinerary
```http
GET /api/trips/:tripId/itinerary
Authorization: Bearer <token>
```

#### Update Itinerary Item
```http
PUT /api/itinerary/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "day_number": 1,
  "activity": "Visit Louvre Museum",
  "time": "2:00 PM",
  "location": "Rue de Rivoli, Paris"
}
```

#### Delete Itinerary Item
```http
DELETE /api/itinerary/:id
Authorization: Bearer <token>
```

### Expense Endpoints

#### Add Expense
```http
POST /api/trips/:tripId/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "expense_name": "Hotel Booking",
  "amount": 1200,
  "category": "accommodation",
  "date": "2024-06-15",
  "notes": "5 nights at Hotel Paris"
}
```

#### Get Expenses
```http
GET /api/trips/:tripId/expenses
Authorization: Bearer <token>
```

#### Get Expense Summary
```http
GET /api/trips/:tripId/expenses/summary
Authorization: Bearer <token>
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "expense_name": "Hotel Booking Updated",
  "amount": 1300,
  "category": "accommodation",
  "date": "2024-06-15",
  "notes": "Updated notes"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

---

## 🧪 Testing

### Using Postman

1. Import the API collection (see `API_EXAMPLES.md`)
2. Set environment variable `token` after login
3. Test all endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create Trip:**
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"destination":"Paris","start_date":"2024-06-15","end_date":"2024-06-22","budget":3500}'
```

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection
│   └── initDatabase.js      # Database initialization script
│
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── tripController.js    # Trip CRUD operations
│   ├── itineraryController.js  # Itinerary operations
│   └── expenseController.js    # Expense operations
│
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Request validation
│
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── tripRoutes.js        # Trip endpoints
│   ├── itineraryRoutes.js   # Itinerary endpoints
│   └── expenseRoutes.js     # Expense endpoints
│
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration

---

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
- Check MySQL credentials in `.env`
- Ensure MySQL server is running
- Verify user has proper permissions

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### JWT Token Invalid

**Error:** `Invalid or expired token`

**Solution:**
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`
- Token may have expired (default 7 days)

---

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Trips Table
```sql
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 0.00,
    travel_type VARCHAR(50) DEFAULT 'leisure',
    notes TEXT,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Itinerary Table
```sql
CREATE TABLE itinerary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day_number INT NOT NULL,
    activity TEXT NOT NULL,
    time VARCHAR(20),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    expense_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
```

---

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Initialize database
4. ✅ Start server
5. ✅ Test API endpoints
6. 🔄 Connect frontend to backend
7. 🌐 Deploy to production

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check server logs
- Verify database connection

---

## 📄 License

MIT License - Educational Use

---

**Backend API Ready! 🎉**

Server running at: `http://localhost:5000`

API Documentation: See `API_EXAMPLES.md`
