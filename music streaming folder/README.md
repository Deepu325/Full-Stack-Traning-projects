# Mini Music Streaming Website

A mini full-stack music streaming web app built with **HTML/CSS/JavaScript** (frontend) and **PHP + MySQL** (backend).

## Features

- User registration & login (session-based)
- Music library (songs with artist/album metadata)
- Audio player with play controls
- Playlist creation and management
- Search songs by title, artist, or album

## File Structure

- `public/` – Frontend files (HTML/CSS/JS)
- `backend/` – PHP API endpoints
- `sql/` – SQL schema and sample data
- `public/media/` – Folder for audio files (MP3)

## Setup Instructions (Windows)

### 1) Install prerequisites

- Install [XAMPP](https://www.apachefriends.org/index.html) or similar (Apache + PHP + MySQL)
- Start Apache and MySQL

### 2) Place project in web root

Copy the project folder into your server's document root (e.g. `C:\xampp\htdocs\music-streaming`).

### 3) Create the database

1. Open phpMyAdmin (usually http://localhost/phpmyadmin)
2. Run `sql/schema.sql` to create tables.
3. Run `sql/sample_data.sql` to insert sample data.

### 4) Add audio files

Place `.mp3` files in `public/media/` and update `sql/sample_data.sql` `file_url` paths if needed.

### 5) Run the app

Open in browser: `http://localhost/music-streaming/public/index.html`

---

## Default accounts (sample data)

- Username: `alice` / Password: `password123`
- Username: `bob` / Password: `password123`

---

## Notes

- You can customize database credentials in `backend/db.php`.
- The frontend communicates with the backend using fetch APIs (session cookies enabled).

