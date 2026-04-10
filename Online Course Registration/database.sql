CREATE DATABASE online_course_db;
USE online_course_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('student', 'admin') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    instructor VARCHAR(100),
    prerequisites TEXT,
    max_capacity INT NOT NULL,
    current_enrollment INT DEFAULT 0,
    schedule VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Sample data (passwords are hashed using BCrypt)
INSERT INTO users (username, password, email, role, first_name, last_name) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'admin', 'Admin', 'User'),
('student1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student1@example.com', 'student', 'John', 'Doe');

INSERT INTO courses (course_name, description, category, instructor, prerequisites, max_capacity, schedule) VALUES
('Introduction to Java', 'Learn basics of Java programming', 'Programming', 'Dr. Smith', 'None', 50, 'Mon-Wed 10AM-12PM'),
('Web Development', 'HTML, CSS, JS basics', 'Web', 'Prof. Johnson', 'None', 30, 'Tue-Thu 2PM-4PM'),
('Data Structures & Algorithms', 'Master arrays, trees, graphs and sorting algorithms', 'Programming', 'Dr. Patel', 'Introduction to Java', 40, 'Mon-Wed 2PM-4PM'),
('Database Management', 'SQL, normalization, and database design', 'Database', 'Prof. Lee', 'None', 35, 'Tue-Thu 10AM-12PM'),
('Python for Beginners', 'Introduction to Python programming language', 'Programming', 'Dr. Brown', 'None', 50, 'Mon-Fri 9AM-10AM'),
('Machine Learning Basics', 'Supervised and unsupervised learning fundamentals', 'AI/ML', 'Prof. Garcia', 'Python for Beginners', 25, 'Wed-Fri 2PM-4PM'),
('UI/UX Design', 'Design principles, wireframing and prototyping', 'Design', 'Dr. Wilson', 'None', 20, 'Tue-Thu 4PM-6PM'),
('Cloud Computing with AWS', 'Introduction to AWS services and cloud architecture', 'Cloud', 'Prof. Martinez', 'None', 30, 'Mon-Wed 4PM-6PM');