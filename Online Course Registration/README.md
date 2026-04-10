# Online Course Registration System

This is a full-stack web application built with Java, HTML, CSS, and MySQL for managing online course registrations.

## Features

- **User Authentication**: Login for students and admins.
- **Course Catalog**: Browse available courses.
- **Registration**: Students can register for courses with capacity checks.
- **My Registrations**: View and cancel registrations.
- **Admin Dashboard**: (Basic) for managing users and courses.

## Technology Stack

- **Backend**: Java Servlets
- **Frontend**: HTML, CSS, JSP
- **Database**: MySQL
- **Build Tool**: Maven
- **Server**: Apache Tomcat

## Setup Instructions

1. **Prerequisites**:
   - Java 11 or higher
   - MySQL 8.0+
   - Apache Tomcat 9+
   - Maven

2. **Database Setup**:
   - Open MySQL and run the `database.sql` script to create the database and tables.
   - Update `DBUtil.java` with your MySQL username and password.

3. **Build the Project**:
   - Navigate to the project root.
   - Run `mvn clean package` to build the WAR file.

4. **Deploy to Tomcat**:
   - Copy the generated WAR file from `target/` to Tomcat's `webapps/` directory.
   - Start Tomcat.

5. **Access the Application**:
   - Open a browser and go to `http://localhost:8080/online-course-registration/login.html`
   - Login with sample credentials: username `student1`, password `password` (or `admin` for admin).

## Project Structure

- `src/main/java/`: Java source code (models, DAOs, servlets)
- `src/main/webapp/`: Web resources (HTML, CSS, JSP, web.xml)
- `pom.xml`: Maven configuration
- `database.sql`: Database schema and sample data

## Development Notes

- Passwords are hashed using BCrypt.
- Sessions are used for user management.
- Expand admin features as needed (e.g., add course management servlets).

## License

This project is for educational purposes.