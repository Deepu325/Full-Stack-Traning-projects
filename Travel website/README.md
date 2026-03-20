# Travel Explorer Website

A beginner-friendly full-stack web application for exploring travel destinations and booking trips.

## Features

- **Home Page**: Welcome banner and introduction
- **Destinations Page**: Display travel destinations with images
- **Packages Page**: Show available travel packages with prices
- **Booking Page**: Form to submit booking details
- **Contact Page**: Form to send messages
- **Database Integration**: MySQL database for storing data
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Styling**: Responsive CSS with Flexbox/Grid

## Setup Instructions

1. **Install Dependencies**:
   ```
   npm install
   ```

2. **Setup MySQL Database**:
   - Create a MySQL database
   - Run the SQL script in `database/schema.sql` to create tables and insert sample data
   - Update database credentials in `server.js` if needed

3. **Add Images**:
   - Place destination images in `public/images/` folder
   - Images referenced: paris.jpg, tokyo.jpg, newyork.jpg, bali.jpg, london.jpg, sydney.jpg, placeholder.jpg

4. **Run the Application**:
   ```
   npm start
   ```

5. **Access the Website**:
   - Open your browser and go to `http://localhost:3000`

## Project Structure

```
travelweb/
├── public/
│   ├── index.html          # Home page
│   ├── destinations.html   # Destinations page
│   ├── packages.html       # Packages page
│   ├── booking.html        # Booking form
│   ├── contact.html        # Contact form
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript for validation
│   └── images/             # Image assets
├── database/
│   └── schema.sql          # Database schema and sample data
├── server.js               # Express server
└── package.json            # Node.js dependencies
```

## How It Works

1. **Frontend**: HTML pages provide the user interface, CSS for styling, JavaScript for form validation and dynamic content loading.

2. **Backend**: Express server serves static files and handles API requests for data retrieval and form submissions.

3. **Database**: MySQL stores destinations, packages, bookings, and contact messages.

4. **Data Flow**:
   - Pages load and fetch data from API endpoints
   - Forms submit data to server endpoints
   - Server processes data and stores in database
   - Success messages displayed to user

This project demonstrates basic full-stack development concepts including client-server architecture, database operations, and responsive web design.