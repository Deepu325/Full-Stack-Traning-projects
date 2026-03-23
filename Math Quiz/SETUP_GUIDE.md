# 🚀 Math Puzzle Quiz - Complete Setup Guide

## Quick Start (5-10 minutes)

### 1. Download & Extract
```bash
# Clone or download the project
cd "Math Quiz"
```

### 2. Set up MySQL Database (2 minutes)
```bash
# Option A: Using Command Line
mysql -u root -p < database/schema.sql

# Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. File → Open SQL Script
3. Select database/schema.sql
4. Execute (Ctrl+Shift+Enter)
```

### 3. Set up Backend (2 minutes)
```bash
cd backend
npm install
npm start

# Expected Output:
# Server running on http://localhost:8080
# Connected to MySQL database
```

### 4. Open Frontend (1 minute)
```bash
# Option A: Open in Browser
- Navigate to: Math Quiz/frontend/index.html
- Double-click to open in default browser

# Option B: Use Local Server (Recommended)
cd frontend
npx http-server . -p 3000
# Then visit: http://localhost:3000
```

✅ **Application is ready!** Create an account and start taking quizzes.

---

## Detailed Setup Instructions

### **PART 1: Environment Setup**

#### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 14.0.0 or higher
- **MySQL**: Version 5.7 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Disk Space**: ~200MB minimum
- **RAM**: 2GB minimum

#### Download & Install Tools

**1. Install Node.js**
- Download: https://nodejs.org/
- Choose LTS (Long Term Support) version
- Run installer with default settings
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**2. Install MySQL**
- Download: https://www.mysql.com/downloads/
- Choose MySQL Community Server (Free)
- Follow installation wizard
- Note username (default: root) and password
- Verify installation:
  ```bash
  mysql --version
  ```

**3. (Optional) Install Code Editor**
- VS Code: https://code.visualstudio.com/
- Brackets: http://brackets.io/
- Sublime Text: https://www.sublimetext.com/

---

### **PART 2: Database Configuration**

#### Step 1: Open MySQL Command Line
```bash
# On Windows (Command Prompt):
mysql -u root -p

# On macOS/Linux (Terminal):
mysql -u root -p

# Enter your MySQL password when prompted
```

#### Step 2: Import Database Schema
```bash
# From MySQL command line:
source C:\path\to\Math Quiz\database\schema.sql;

# Or use this alternative:
system mysql -u root -p math_quiz < "C:\path\to\Math Quiz\database\schema.sql"
```

#### Step 3: Verify Database Creation
```bash
# Show all databases (verify math_quiz exists):
SHOW DATABASES;

# Use the new database:
USE math_quiz;

# Show all tables:
SHOW TABLES;

# Quick verification queries:
SELECT COUNT(*) FROM users;           -- Should show 0
SELECT COUNT(*) FROM questions;        -- Should show 75
SELECT COUNT(*) FROM categories;       -- Should show 4
```

#### Step 4: (Optional) Update MySQL Connection
If your MySQL credentials are different, update `backend/server.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',           // Your MySQL host
  user: 'root',                // Your MySQL username
  password: 'your_password',   // Your MySQL password
  database: 'math_quiz'        // Database name (leave as is)
});
```

---

### **PART 3: Backend Configuration**

#### Step 1: Navigate to Backend
```bash
cd "Math Quiz/backend"
```

#### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- **express** (4.18.2) - Web server framework
- **mysql2** (3.6.5) - MySQL database driver
- **bcrypt** (5.1.1) - Password encryption
- **cors** (2.8.5) - Cross-origin resource sharing
- **body-parser** (1.20.2) - Request body parsing

**Expected Output**:
```
added 50+ packages in 30 seconds
```

#### Step 3: Start Backend Server
```bash
npm start
```

**Expected Console Output**:
```
Server running on http://localhost:8080
Connected to MySQL database
```

✅ **Backend is running!** Do NOT close this terminal window.

---

### **PART 4: Frontend Setup**

#### Option A: Direct Browser Opening (Simplest)
```bash
# Open file explorer
# Navigate to: Math Quiz/frontend/
# Double-click: index.html
# Application opens in default browser
```

#### Option B: Using Local Server (Recommended)

**Using Node.js (http-server)**:
```bash
# Open new terminal/command prompt
cd "Math Quiz/frontend"
npx http-server . -p 3000

# Browser opens automatically or visit:
# http://localhost:3000
```

**Using Python** (if Python is installed):
```bash
cd "Math Quiz/frontend"

# Python 3:
python -m http.server 3000

# Python 2:
python -m SimpleHTTPServer 3000
```

---

### **PART 5: First Test**

#### Create Test Account
1. **Go to Registration**
   - Click "Register here" link

2. **Fill Registration Form**
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123456`
   - Click "Register"

3. **Login with Test Account**
   - Username: `testuser`
   - Password: `test123456`
   - Click "Login"

4. **Take a Quiz**
   - Select Category: "Arithmetic"
   - Select Difficulty: "Easy"
   - Answer 5 questions
   - Review results

✅ **Success!** The application is fully functional.

---

## Project Structure Overview

```
Math Quiz/
│
├── 📄 README.md                    # Complete documentation
├── 📄 SETUP_GUIDE.md              # This file
│
├── 📁 frontend/                   # Frontend application
│   ├── index.html                 # Main HTML file (75 KB)
│   ├── 📁 css/
│   │   └── style.css              # Complete styling (30+ KB)
│   └── 📁 js/
│       └── app.js                 # All JavaScript logic (50+ KB)
│
├── 📁 backend/                    # Backend server
│   ├── server.js                  # Express server setup
│   ├── package.json               # Dependencies list
│   ├── package-lock.json          # Locked versions
│   └── 📁 routes/
│       ├── auth.js                # User authentication
│       ├── quiz.js                # Quiz questions
│       └── scores.js              # Scoring system
│
└── 📁 database/
    └── schema.sql                 # MySQL database (40+ KB)
```

### File Sizes
- **Total Project**: ~200 MB (with node_modules)
- **Source Code Only**: ~200 KB
- **Database**: ~500 KB (with sample questions)

---

## Port Configuration

### Default Ports
```
Backend Server:  http://localhost:8080
Frontend Server: http://localhost:3000
MySQL Database:  localhost:3306
```

### Change Backend Port (if 8080 is occupied)
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 8080;  // Change 8080 to desired port
```

---

## Environment Variables (Advanced)

Create `backend/.env` file for configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=math_quiz
PORT=8080
NODE_ENV=development
```

Then update `backend/server.js`:
```javascript
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const PORT = process.env.PORT;
```

Install dotenv:
```bash
npm install dotenv
```

---

## Troubleshooting Guide

### **Problem: "Cannot GET /localhost:3000"**
**Solution**:
- Ensure frontend server is running
- Check if port 3000 is correct
- Clear browser cache (Ctrl+Shift+Delete)

### **Problem: "connect ECONNREFUSED"**
**Solution**:
- MySQL is not running
- Start MySQL service:
  ```bash
  # Windows:
  net start MySQL80  # or MySQL57
  
  # macOS:
  mysql.server start
  
  # Linux:
  sudo systemctl start mysql
  ```

### **Problem: "Database connection failed"**
**Solution**:
- Wrong MySQL credentials in `server.js`
- Database `math_quiz` doesn't exist
- Try importing schema again:
  ```bash
  mysql -u root -p < database/schema.sql
  ```

### **Problem: "Address already in use"**
**Solution**:
- Another application using the port
- Kill process on port 8080:
  ```bash
  # macOS/Linux:
  sudo lsof -ti:8080 | xargs kill -9
  
  # Windows:
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```

### **Problem: "npm command not found"**
**Solution**:
- Node.js not installed properly
- Restart terminal/command prompt
- Reinstall Node.js

### **Problem: "Module not found: express"**
**Solution**:
```bash
cd backend
npm install
npm start
```

### **Problem: "CORS error in browser console"**
**Solution**:
- Backend server not running
- Wrong API URL in frontend
- Check that backend is at `http://localhost:8080`

### **Problem: "Login always fails"**
**Solution**:
- Check MySQL is running
- Verify database schema imported successfully
- Try creating new account
- Check browser console for error details

---

## Performance Tips

### Optimize Backend
```bash
# Add caching headers
# Implement database connection pooling
# Use query optimization

# In routes, add caching:
app.get('/api/quiz/categories', (req, res) => {
    res.set('Cache-Control', 'public, max-age=3600');
    // ... rest of code
});
```

### Optimize Frontend
- Use ServiceWorker for offline support
- Minify CSS and JavaScript files
- Lazy load images
- Enable browser caching

### Optimize Database
- Add proper indexes (already done in schema.sql)
- Archive old scores regularly
- Use views for complex queries (already done)
- Consider database replication for larger deployments

---

## Deployment Options

### **Option 1: Heroku (Free Tier - 512MB)**
```bash
# Install Heroku CLI
# Log in:
heroku login

# Create app:
heroku create your-app-name

# Add MySQL:
heroku addons:create cleardb:ignite

# Deploy:
git push heroku main
```

### **Option 2: AWS (Amazon Web Services)**
- EC2 instance for backend
- RDS for MySQL database
- S3 for static frontend files
- CloudFront for CDN

### **Option 3: DigitalOcean**
- App Platform for backend
- Managed MySQL database
- App Platform for static site

### **Option 4: Local Network**
```bash
# Share on local network:
# Change localhost to your IP:
# 192.168.x.x:8080

# Get your IP:
# Windows: ipconfig
# macOS/Linux: ifconfig
```

---

## Development Workflow

### Branch Strategy (if using Git)
```bash
# Create feature branch:
git checkout -b feature/new-feature

# Make changes and test locally
npm start  # backend
npm test   # if tests exist

# Commit:
git add .
git commit -m "Add new feature"

# Merge to main:
git checkout main
git merge feature/new-feature
```

### Code Style Guidelines
```javascript
// Use consistent formatting:
- 4-space indentation
- camelCase for variables
- PascalCase for classes
- snake_case for database columns
- Comments for complex logic
- JSDoc for function documentation

// Example:
/**
 * Validates user login credentials
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object if valid
 */
async function validateLogin(username, password) {
    // Implementation
}
```

---

## Backup & Recovery

### Backup Database
```bash
# Export database:
mysqldump -u root -p math_quiz > backup.sql

# Import backup:
mysql -u root -p math_quiz < backup.sql
```

### Backup Source Code
```bash
# Create zip archive:
# Windows: Right-click folder → Send to → Compressed folder
# macOS/Linux: tar -czf math_quiz_backup.tar.gz "Math Quiz/"
```

---

## Maintenance Tasks

### Weekly Maintenance
- Monitor database performance
- Check error logs: `backend/logs/`
- Update npm packages: `npm update`

### Monthly Maintenance
- Backup database: `mysqldump`
- Archive old scores (optional)
- Review user feedback
- Update question bank

### Quarterly Maintenance
- Security audit
- Performance review
- Feature planning
- Database optimization

---

## Common Commands Cheat Sheet

```bash
# Start backend:
cd backend && npm start

# Start frontend server:
cd frontend && npx http-server . -p 3000

# Connect to MySQL:
mysql -u root -p

# Import database:
mysql -u root -p math_quiz < database/schema.sql

# Check if port is in use:
# Windows: netstat -ano | findstr :8080
# Mac/Linux: lsof -i :8080

# Kill process:
# Mac/Linux: sudo kill -9 <PID>
# Windows: taskkill /PID <PID> /F

# Update npm packages:
npm update

# View npm logs:
npm logs
```

---

## FAQ

**Q: Can I run this on Windows?**  
A: Yes! Windows, macOS, and Linux are all supported.

**Q: Do I need a domain name?**  
A: No, localhost works fine for development.

**Q: Can I modify the questions?**  
A: Yes! Edit the `INSERT INTO questions` statements in `schema.sql`.

**Q: How many users can this handle?**  
A: Basic setup handles ~100 concurrent users. For more, use load balancing.

**Q: Can I add more categories?**  
A: Yes! Insert into categories table and update frontend.

**Q: Is this production-ready?**  
A: No, add authentication tokens (JWT), HTTPS, and rate limiting for production.

---

## Next Steps

After successful setup:

1. ✅ Explore the application
2. ✅ Create test accounts and take quizzes
3. ✅ Check leaderboard functionality
4. ✅ Review the code in `backend/routes/` and `frontend/js/`
5. ✅ Customize questions in `database/schema.sql`
6. ✅ Modify styling in `frontend/css/style.css`
7. ✅ Deploy to production (check deployment options above)

---

## Support & Resources

- **Node.js Documentation**: https://nodejs.org/en/docs/
- **Express.js Documentation**: https://expressjs.com/
- **MySQL Documentation**: https://dev.mysql.com/
- **MDN Web Docs**: https://developer.mozilla.org/

---

**Setup completed! Happy coding! 🎉**
