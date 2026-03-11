# 🚀 Travel Planner - Deployment Guide

Complete guide to deploy your Travel Planner application to production.

---

## 📋 Deployment Options

### Option 1: Frontend on Netlify + Backend on Render (Recommended)
### Option 2: Full Stack on Render
### Option 3: Frontend on Vercel + Backend on Railway

---

## 🌐 Option 1: Netlify + Render (Recommended)

### Part A: Deploy Frontend to Netlify

#### Step 1: Prepare Frontend
```bash
# Create a new folder for frontend only
mkdir travel-planner-frontend
cd travel-planner-frontend

# Copy frontend files
copy index.html, login.html, register.html, dashboard.html, trips.html, trip-details.html
copy css/ folder
copy js/ folder
```

#### Step 2: Update API URLs
Create `js/config.js`:
```javascript
const API_URL = 'https://your-backend-url.onrender.com/api';
```

Update all fetch calls to use `API_URL`:
```javascript
// Before
fetch('http://localhost:5000/api/auth/login', ...)

// After
fetch(`${API_URL}/auth/login`, ...)
```

#### Step 3: Deploy to Netlify

**Method 1: Drag & Drop**
1. Go to https://app.netlify.com
2. Sign up / Login
3. Drag your frontend folder to Netlify
4. Done! Your site is live

**Method 2: Git Integration**
1. Push code to GitHub
2. Connect Netlify to your GitHub repo
3. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
4. Deploy

**Netlify Configuration** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Part B: Deploy Backend to Render

#### Step 1: Prepare Backend

Create `render.yaml`:
```yaml
services:
  - type: web
    name: travel-planner-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

#### Step 2: Setup MySQL Database

**Option A: Use Render PostgreSQL (Recommended)**
1. Create PostgreSQL database on Render
2. Update backend to use PostgreSQL instead of MySQL
3. Install `pg` package: `npm install pg`

**Option B: Use External MySQL (PlanetScale)**
1. Sign up at https://planetscale.com
2. Create database
3. Get connection string
4. Add to Render environment variables

#### Step 3: Deploy to Render

1. Go to https://render.com
2. Sign up / Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: travel-planner-api
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

6. Add Environment Variables:
```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=travel_planner_db
DB_PORT=3306
JWT_SECRET=your_secure_secret
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

7. Click "Create Web Service"

#### Step 4: Initialize Database

After deployment, run database initialization:
```bash
# SSH into Render instance or use Render Shell
npm run init-db
```

---

## 🔧 Option 2: Full Stack on Render

#### Step 1: Prepare Project Structure
```
travel-planner/
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   └── routes/
└── package.json (root)
```

#### Step 2: Create Root Package.json
```json
{
  "name": "travel-planner-fullstack",
  "version": "1.0.0",
  "scripts": {
    "install-backend": "cd backend && npm install",
    "install-frontend": "cd frontend && npm install",
    "build": "npm run install-backend && npm run install-frontend",
    "start": "cd backend && npm start"
  }
}
```

#### Step 3: Configure Backend to Serve Frontend
```javascript
// In server.js
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
```

#### Step 4: Deploy to Render
1. Push to GitHub
2. Create Web Service on Render
3. Configure build and start commands
4. Deploy

---

## 🌟 Option 3: Vercel + Railway

### Frontend on Vercel

#### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd travel-planner-frontend
vercel
```

#### Step 2: Configure Vercel
Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Backend on Railway

#### Step 1: Deploy to Railway
1. Go to https://railway.app
2. Sign up / Login
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your backend repository

#### Step 2: Add MySQL Database
1. Click "New" → "Database" → "MySQL"
2. Railway will provide connection details
3. Add to environment variables

#### Step 3: Configure Environment
Add all environment variables in Railway dashboard

---

## 🗄️ Database Options

### Option 1: PlanetScale (MySQL - Free Tier)
```
1. Sign up at planetscale.com
2. Create database
3. Get connection string
4. Use in production
```

### Option 2: Render PostgreSQL (Free Tier)
```
1. Create PostgreSQL database on Render
2. Update backend to use PostgreSQL
3. Install pg package
4. Update queries
```

### Option 3: Railway MySQL
```
1. Add MySQL plugin in Railway
2. Get connection details
3. Configure environment variables
```

---

## 🔐 Environment Variables Checklist

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=travel_planner_db
DB_PORT=3306
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

### Frontend Configuration
```javascript
// js/config.js
const API_URL = 'https://your-backend-url.onrender.com/api';
```

---

## 📝 Pre-Deployment Checklist

### Backend
- [ ] All dependencies in package.json
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] CORS configured for frontend URL
- [ ] JWT secret is secure
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured

### Frontend
- [ ] API URLs updated to production
- [ ] All pages tested
- [ ] Responsive design verified
- [ ] Forms validated
- [ ] Error messages displayed
- [ ] Loading states implemented
- [ ] Browser compatibility tested

### Database
- [ ] Tables created
- [ ] Indexes added
- [ ] Foreign keys configured
- [ ] Backup strategy planned

---

## 🧪 Testing Production

### Test Checklist
1. **Registration**
   - [ ] Can register new user
   - [ ] Email validation works
   - [ ] Password hashing works

2. **Login**
   - [ ] Can login with credentials
   - [ ] JWT token generated
   - [ ] Redirects to dashboard

3. **Trips**
   - [ ] Can create trip
   - [ ] Can view trips
   - [ ] Can update trip
   - [ ] Can delete trip

4. **Itinerary**
   - [ ] Can add activities
   - [ ] Can view itinerary
   - [ ] Can delete activities

5. **Expenses**
   - [ ] Can add expenses
   - [ ] Budget calculation works
   - [ ] Can delete expenses

---

## 🚀 Quick Deploy Commands

### Netlify (Frontend)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Render (Backend)
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Render will auto-deploy
```

---

## 🔄 CI/CD Setup

### GitHub Actions for Netlify
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📊 Monitoring & Analytics

### Add Google Analytics
```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Backend Logging
```javascript
// Use Winston or Morgan
const morgan = require('morgan');
app.use(morgan('combined'));
```

---

## 🐛 Common Deployment Issues

### Issue 1: CORS Error
**Solution:** Update CORS_ORIGIN in backend .env

### Issue 2: Database Connection Failed
**Solution:** Check database credentials and whitelist IP

### Issue 3: 404 on Refresh
**Solution:** Add redirect rules in netlify.toml

### Issue 4: API Not Responding
**Solution:** Check backend logs on Render dashboard

---

## 🎯 Post-Deployment

1. **Test all features**
2. **Monitor error logs**
3. **Set up database backups**
4. **Configure custom domain**
5. **Enable HTTPS**
6. **Add monitoring**
7. **Document API**

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app

---

## ✅ Deployment Complete!

Your Travel Planner is now live! 🎉

**Frontend:** https://your-site.netlify.app
**Backend:** https://your-api.onrender.com

---

**Happy Deploying! 🚀**
