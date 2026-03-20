-- Create database
CREATE DATABASE IF NOT EXISTS travel_explorer;
USE travel_explorer;

-- Destinations table
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255)
);

-- Packages table
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50)
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    package VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    message TEXT
);

-- Contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);

-- Insert sample destinations
INSERT INTO destinations (name, description, image) VALUES
('Paris, France', 'The City of Light, known for Eiffel Tower and romantic ambiance.', 'paris.jpg'),
('Tokyo, Japan', 'A bustling metropolis blending tradition and modernity.', 'tokyo.jpg'),
('New York, USA', 'The Big Apple with iconic landmarks and diverse culture.', 'newyork.jpg'),
('Bali, Indonesia', 'Tropical paradise with beautiful beaches and temples.', 'bali.jpg'),
('London, UK', 'Historic city with royal palaces and modern attractions.', 'london.jpg'),
('Sydney, Australia', 'Harbor city famous for Opera House and beaches.', 'sydney.jpg'),
('India', 'A land of diverse cultures, ancient history, and stunning landscapes.', 'india.jpg');

-- Insert sample packages
INSERT INTO packages (name, description, price, duration) VALUES
('European Adventure', 'Explore major European cities including Paris and London.', 2500.00, '10 days'),
('Asian Discovery', 'Journey through Tokyo and Bali with cultural experiences.', 1800.00, '8 days'),
('American Highlights', 'Visit New York and other US landmarks.', 2200.00, '7 days'),
('Beach Paradise', 'Relax in Bali and Sydney with beach activities.', 1600.00, '6 days'),
('City Explorer', 'Urban adventure in London and Tokyo.', 2000.00, '9 days'),
('World Tour', 'Comprehensive tour covering multiple continents.', 3500.00, '14 days');