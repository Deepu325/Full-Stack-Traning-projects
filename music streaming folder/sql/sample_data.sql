-- Sample data for Music Streaming Website
USE music_streaming;

-- Users (passwords should be hashed; below are example hashes for password "password123")
INSERT INTO users (username, email, password_hash) VALUES
('alice', 'alice@example.com', '$2y$10$xjMm/xt5t2DVN/E/DF4rluVB8RzlzCZGdr5P6rKSY4l8Dtnz8mS0m'),
('bob', 'bob@example.com', '$2y$10$xjMm/xt5t2DVN/E/DF4rluVB8RzlzCZGdr5P6rKSY4l8Dtnz8mS0m');

-- Artists
INSERT INTO artists (artist_name, genre) VALUES
('The Sample Band', 'Indie Pop'),
('Cloud Beats', 'Electronic');

-- Albums
INSERT INTO albums (album_name, artist_id, release_year) VALUES
('First Light', 1, 2022),
('Midnight Drive', 2, 2023);

-- Songs (file_url is relative to web server root, update to match your audio files)
INSERT INTO songs (song_title, artist_id, album_id, duration, file_url) VALUES
('Morning Glow', 1, 1, 185, 'media/morning_glow.mp3'),
('Night Pulse', 2, 2, 210, 'media/night_pulse.mp3');

-- Playlists
INSERT INTO playlists (user_id, playlist_name) VALUES
(1, 'Favorites'),
(2, 'Chill Vibes');

-- Playlist songs
INSERT INTO playlist_songs (playlist_id, song_id) VALUES
(1, 1),
(1, 2),
(2, 2);
