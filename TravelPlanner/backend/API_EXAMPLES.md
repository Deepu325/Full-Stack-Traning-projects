# 📡 Travel Planner API - Complete Examples

Comprehensive API request and response examples for all endpoints.

---

## 🔐 Authentication

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Traveler",
  "email": "john@example.com",
  "password": "john123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Traveler",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDA2MDQ4MDB9.abc123xyz"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "john123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Traveler",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDA2MDQ4MDB9.abc123xyz"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Traveler",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 🗺️ Trip Management

### 1. Create Trip

**Endpoint:** `POST /api/trips`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "destination": "Paris, France",
  "start_date": "2024-06-15",
  "end_date": "2024-06-22",
  "budget": 3500.00,
  "travel_type": "leisure",
  "notes": "Summer vacation in the City of Light. Visit Eiffel Tower, Louvre Museum.",
  "status": "upcoming"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "destination": "Paris, France",
      "start_date": "2024-06-15",
      "end_date": "2024-06-22",
      "budget": "3500.00",
      "travel_type": "leisure",
      "notes": "Summer vacation in the City of Light. Visit Eiffel Tower, Louvre Museum.",
      "status": "upcoming",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 2. Get All Trips

**Endpoint:** `GET /api/trips`

**Headers:**
```
Authorization: Bearer <token>
```

**Optional Query Parameters:**
- `status=upcoming` - Filter by status
- `status=completed` - Filter by status
- `status=cancelled` - Filter by status

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "trips": [
      {
        "id": 1,
        "user_id": 1,
        "destination": "Paris, France",
        "start_date": "2024-06-15",
        "end_date": "2024-06-22",
        "budget": "3500.00",
        "travel_type": "leisure",
        "notes": "Summer vacation",
        "status": "upcoming",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 2,
        "user_id": 1,
        "destination": "Tokyo, Japan",
        "start_date": "2024-08-01",
        "end_date": "2024-08-15",
        "budget": "4500.00",
        "travel_type": "adventure",
        "notes": "Explore Japan",
        "status": "upcoming",
        "created_at": "2024-01-16T11:00:00.000Z",
        "updated_at": "2024-01-16T11:00:00.000Z"
      },
      {
        "id": 3,
        "user_id": 1,
        "destination": "New York, USA",
        "start_date": "2024-03-10",
        "end_date": "2024-03-17",
        "budget": "2800.00",
        "travel_type": "business",
        "notes": "Business trip",
        "status": "completed",
        "created_at": "2024-01-10T09:00:00.000Z",
        "updated_at": "2024-03-18T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Single Trip

**Endpoint:** `GET /api/trips/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "destination": "Paris, France",
      "start_date": "2024-06-15",
      "end_date": "2024-06-22",
      "budget": "3500.00",
      "travel_type": "leisure",
      "notes": "Summer vacation",
      "status": "upcoming",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "itinerary": [
      {
        "id": 1,
        "trip_id": 1,
        "day_number": 1,
        "activity": "Visit Eiffel Tower",
        "time": "10:00 AM",
        "location": "Champ de Mars, Paris",
        "created_at": "2024-01-15T11:00:00.000Z",
        "updated_at": "2024-01-15T11:00:00.000Z"
      }
    ],
    "expenses": [
      {
        "id": 1,
        "trip_id": 1,
        "expense_name": "Hotel Booking",
        "amount": "1200.00",
        "category": "accommodation",
        "date": "2024-06-15",
        "notes": "5 nights",
        "created_at": "2024-01-15T12:00:00.000Z",
        "updated_at": "2024-01-15T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Trip not found"
}
```

---

### 4. Update Trip

**Endpoint:** `PUT /api/trips/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "destination": "Tokyo, Japan",
  "start_date": "2024-08-01",
  "end_date": "2024-08-15",
  "budget": 4500.00,
  "travel_type": "adventure",
  "notes": "Updated: Explore ancient temples and modern technology",
  "status": "upcoming"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "destination": "Tokyo, Japan",
      "start_date": "2024-08-01",
      "end_date": "2024-08-15",
      "budget": "4500.00",
      "travel_type": "adventure",
      "notes": "Updated: Explore ancient temples and modern technology",
      "status": "upcoming",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-20T14:30:00.000Z"
    }
  }
}
```

---

### 5. Delete Trip

**Endpoint:** `DELETE /api/trips/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Trip not found or unauthorized"
}
```

---

### 6. Get Trip Statistics

**Endpoint:** `GET /api/trips/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 5,
      "upcoming": 3,
      "completed": 2,
      "totalBudget": "15000.00"
    }
  }
}
```

---

## 📅 Itinerary Management

### 1. Add Itinerary Item

**Endpoint:** `POST /api/trips/:tripId/itinerary`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "day_number": 1,
  "activity": "Visit Eiffel Tower and take photos",
  "time": "10:00 AM",
  "location": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Itinerary item added successfully",
  "data": {
    "itinerary": {
      "id": 1,
      "trip_id": 1,
      "day_number": 1,
      "activity": "Visit Eiffel Tower and take photos",
      "time": "10:00 AM",
      "location": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

### 2. Get Itinerary

**Endpoint:** `GET /api/trips/:tripId/itinerary`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "itinerary": [
      {
        "id": 1,
        "trip_id": 1,
        "day_number": 1,
        "activity": "Visit Eiffel Tower",
        "time": "10:00 AM",
        "location": "Champ de Mars, Paris",
        "created_at": "2024-01-15T11:00:00.000Z",
        "updated_at": "2024-01-15T11:00:00.000Z"
      },
      {
        "id": 2,
        "trip_id": 1,
        "day_number": 1,
        "activity": "Lunch at local cafe",
        "time": "1:00 PM",
        "location": "Le Marais, Paris",
        "created_at": "2024-01-15T11:05:00.000Z",
        "updated_at": "2024-01-15T11:05:00.000Z"
      },
      {
        "id": 3,
        "trip_id": 1,
        "day_number": 2,
        "activity": "Visit Louvre Museum",
        "time": "9:00 AM",
        "location": "Rue de Rivoli, Paris",
        "created_at": "2024-01-15T11:10:00.000Z",
        "updated_at": "2024-01-15T11:10:00.000Z"
      }
    ]
  }
}
```

---

### 3. Update Itinerary Item

**Endpoint:** `PUT /api/itinerary/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "day_number": 1,
  "activity": "Visit Eiffel Tower and Seine River Cruise",
  "time": "10:00 AM",
  "location": "Champ de Mars, Paris"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Itinerary item updated successfully",
  "data": {
    "itinerary": {
      "id": 1,
      "trip_id": 1,
      "day_number": 1,
      "activity": "Visit Eiffel Tower and Seine River Cruise",
      "time": "10:00 AM",
      "location": "Champ de Mars, Paris",
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-20T15:00:00.000Z"
    }
  }
}
```

---

### 4. Delete Itinerary Item

**Endpoint:** `DELETE /api/itinerary/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Itinerary item deleted successfully"
}
```

---

## 💰 Expense Management

### 1. Add Expense

**Endpoint:** `POST /api/trips/:tripId/expenses`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "expense_name": "Hotel Booking - Paris Marriott",
  "amount": 1200.00,
  "category": "accommodation",
  "date": "2024-06-15",
  "notes": "5 nights, breakfast included"
}
```

**Categories:** `accommodation`, `food`, `transport`, `activities`, `shopping`, `other`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "expense": {
      "id": 1,
      "trip_id": 1,
      "expense_name": "Hotel Booking - Paris Marriott",
      "amount": "1200.00",
      "category": "accommodation",
      "date": "2024-06-15",
      "notes": "5 nights, breakfast included",
      "created_at": "2024-01-15T12:00:00.000Z",
      "updated_at": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

---

### 2. Get Expenses

**Endpoint:** `GET /api/trips/:tripId/expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 4,
  "totalAmount": "2850.00",
  "data": {
    "expenses": [
      {
        "id": 1,
        "trip_id": 1,
        "expense_name": "Hotel Booking",
        "amount": "1200.00",
        "category": "accommodation",
        "date": "2024-06-15",
        "notes": "5 nights",
        "created_at": "2024-01-15T12:00:00.000Z",
        "updated_at": "2024-01-15T12:00:00.000Z"
      },
      {
        "id": 2,
        "trip_id": 1,
        "expense_name": "Flight Tickets",
        "amount": "800.00",
        "category": "transport",
        "date": "2024-06-15",
        "notes": "Round trip",
        "created_at": "2024-01-15T12:05:00.000Z",
        "updated_at": "2024-01-15T12:05:00.000Z"
      },
      {
        "id": 3,
        "trip_id": 1,
        "expense_name": "Eiffel Tower Tickets",
        "amount": "150.00",
        "category": "activities",
        "date": "2024-06-16",
        "notes": "2 tickets",
        "created_at": "2024-01-15T12:10:00.000Z",
        "updated_at": "2024-01-15T12:10:00.000Z"
      },
      {
        "id": 4,
        "trip_id": 1,
        "expense_name": "Restaurants",
        "amount": "700.00",
        "category": "food",
        "date": "2024-06-20",
        "notes": "Various meals",
        "created_at": "2024-01-15T12:15:00.000Z",
        "updated_at": "2024-01-15T12:15:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Expense Summary

**Endpoint:** `GET /api/trips/:tripId/expenses/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "budget": "3500.00",
    "totalExpenses": "2850.00",
    "remaining": "650.00",
    "byCategory": [
      {
        "category": "accommodation",
        "total": "1200.00",
        "count": 1
      },
      {
        "category": "transport",
        "total": "800.00",
        "count": 1
      },
      {
        "category": "food",
        "total": "700.00",
        "count": 1
      },
      {
        "category": "activities",
        "total": "150.00",
        "count": 1
      }
    ]
  }
}
```

---

### 4. Update Expense

**Endpoint:** `PUT /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "expense_name": "Hotel Booking - Updated",
  "amount": 1300.00,
  "category": "accommodation",
  "date": "2024-06-15",
  "notes": "5 nights, breakfast and dinner included"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "expense": {
      "id": 1,
      "trip_id": 1,
      "expense_name": "Hotel Booking - Updated",
      "amount": "1300.00",
      "category": "accommodation",
      "date": "2024-06-15",
      "notes": "5 nights, breakfast and dinner included",
      "created_at": "2024-01-15T12:00:00.000Z",
      "updated_at": "2024-01-20T16:00:00.000Z"
    }
  }
}
```

---

### 5. Delete Expense

**Endpoint:** `DELETE /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details here"
}
```

---

## 📝 Notes

- All authenticated endpoints require `Authorization: Bearer <token>` header
- Dates should be in `YYYY-MM-DD` format
- Amounts are stored as DECIMAL(10, 2)
- All timestamps are in ISO 8601 format
- Token expires after 7 days (configurable)

---

**API Examples Complete! 🎉**

Use these examples to test all endpoints with Postman, cURL, or your frontend application.
