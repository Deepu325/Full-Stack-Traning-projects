# Social Media Dashboard - Setup Instructions

## Project Structure
```
social-media-dashboard/
├── server.js              # Main server file
├── package.json           # Dependencies
├── login.html             # Login page
├── register.html          # Registration page
├── dashboard.html         # Main dashboard
├── style.css              # All styles
├── auth.js                # Authentication logic
├── dashboard.js           # Dashboard functionality
└── README.md              # Project documentation
```

## Installation Steps

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Install the LTS version

2. **Install Dependencies**
   ```bash
   npm install express sqlite3 bcryptjs jsonwebtoken cors body-parser
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```

4. **Access the Application**
   - Open browser and go to: http://localhost:3000
   - Use demo credentials:
     - Email: admin@example.com
     - Password: admin123

## Features Included

### Authentication System
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Session management

### Dashboard Features
- Overview with statistics cards
- Social media account management
- Post creation and management
- Analytics with Chart.js visualizations
- Profile settings
- Responsive design

### Database Schema
- **users**: User accounts and profiles
- **social_accounts**: Connected social media accounts
- **posts**: Created posts with engagement metrics
- **activity_logs**: User activity tracking

### API Endpoints
- POST /api/login - User authentication
- POST /api/register - User registration
- GET /api/dashboard/stats - Dashboard statistics
- GET /api/accounts - Get user's social accounts
- POST /api/accounts - Add new social account
- DELETE /api/accounts/:id - Delete social account
- GET /api/posts - Get user's posts
- POST /api/posts - Create new post
- DELETE /api/posts/:id - Delete post
- GET /api/analytics/engagement - Engagement analytics
- GET /api/analytics/growth - Growth analytics

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js
- **Security**: bcryptjs for password hashing

## Default Data
The application comes with sample data:
- 1 admin user
- 3 social media accounts (Instagram, Facebook, Twitter)
- 3 sample posts with engagement metrics

## Customization
- Modify styles in `style.css`
- Add new features in `dashboard.js`
- Extend API endpoints in `server.js`
- Update database schema as needed

## Troubleshooting
- Ensure Node.js is installed
- Check that port 3000 is available
- Verify all dependencies are installed
- Check browser console for JavaScript errors