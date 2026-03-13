-- SQL schema for Music Streaming Website
-- Run in MySQL (e.g., using phpMyAdmin or mysql CLI)

CREATE DATABASE IF NOT EXISTS music_streaming CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE music_streaming;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  artist_id INT AUTO_INCREMENT PRIMARY KEY,
  artist_name VARCHAR(150) NOT NULL,
  genre VARCHAR(80),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  album_id INT AUTO_INCREMENT PRIMARY KEY,
  album_name VARCHAR(150) NOT NULL,
  artist_id INT NOT NULL,
  release_year YEAR,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
  song_id INT AUTO_INCREMENT PRIMARY KEY,
  song_title VARCHAR(200) NOT NULL,
  artist_id INT NOT NULL,
  album_id INT,
  duration INT, -- seconds
  file_url VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
  FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  playlist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  playlist_name VARCHAR(150) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Playlist_Songs join table
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_song_id INT AUTO_INCREMENT PRIMARY KEY,
  playlist_id INT NOT NULL,
  song_id INT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY playlist_song_unique (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
) ENGINE=InnoDB;
