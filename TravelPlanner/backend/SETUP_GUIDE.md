# 🚀 Quick Setup Guide - Travel Planner Backend

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Configure Environment (1 minute)
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env and update:
# - DB_PASSWORD (your MySQL password)
# - JWT_SECRET (random secure string)
```

### Step 3: Initialize Database (1 minute)
```bash
# Make sure MySQL is running
npm run init-db
```

### Step 4: Start Server (1 minute)
```bash
npm run dev
```

### Step 5: Test API (1 minute)
```bash
# Open browser or Postman
# Test: http://localhost:5000
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (v14+)
- [ ] MySQL installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database initialized (`npm run init-db`)
- [ ] Server running (`npm run dev`)
- [ ] API responding (http://localhost:5000)

---

## 🧪 Quick Test

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### 3. Create Trip (use token from login)
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"destination\":\"Paris\",\"start_date\":\"2024-06-15\",\"end_date\":\"2024-06-22\",\"budget\":3500}"
```

---

## 🐛 Common Issues

### Issue: Database Connection Error
**Solution:**
- Check MySQL is running
- Verify credentials in `.env`
- Run `npm run init-db`

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in .env to 5001
PORT=5001
```

### Issue: Module Not Found
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📁 Project Structure

```
backend/
├── config/              # Database configuration
├── controllers/         # Business logic
├── middleware/          # Auth & validation
├── routes/              # API endpoints
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

---

## 🔗 Important URLs

- **API Base:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health
- **Documentation:** See README.md
- **API Examples:** See API_EXAMPLES.md

---

## 📞 Next Steps

1. ✅ Backend running
2. 🔄 Test all endpoints
3. 🌐 Connect frontend
4. 🚀 Deploy

---

**Setup Complete! 🎉**

Server is running at: http://localhost:5000

For detailed documentation, see:
- README.md - Complete guide
- API_EXAMPLES.md - API examples
