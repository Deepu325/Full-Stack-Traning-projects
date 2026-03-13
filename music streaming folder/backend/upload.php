<?php
require_once __DIR__ . '/db.php';

requireLogin();

// This endpoint accepts multipart/form-data for uploading an audio file.
// Expected fields: song_title, artist_name, album_name, duration (seconds), file (audio file)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Only POST allowed'], 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'File upload failed'], 400);
}

$songTitle = trim($_POST['song_title'] ?? '');
$artistName = trim($_POST['artist_name'] ?? '');
$albumName = trim($_POST['album_name'] ?? '');
$duration = intval($_POST['duration'] ?? 0);

if (!$songTitle || !$artistName || !$albumName) {
    jsonResponse(['error' => 'Missing metadata (title, artist, album)'], 400);
}

// Validate file type (basic)
$allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg'];
$fileType = mime_content_type($_FILES['file']['tmp_name']);
if (!in_array($fileType, $allowedTypes, true)) {
    jsonResponse(['error' => 'Unsupported audio type. Allowed: mp3, wav, ogg'], 400);
}

// Ensure target directory exists
$mediaDir = realpath(__DIR__ . '/../public/media');
if (!$mediaDir) {
    jsonResponse(['error' => 'Media directory not found'], 500);
}

$originalName = basename($_FILES['file']['name']);
$ext = pathinfo($originalName, PATHINFO_EXTENSION);
$targetName = sprintf('%s_%s.%s', time(), preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME)), $ext);
$targetPath = $mediaDir . DIRECTORY_SEPARATOR . $targetName;

if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    jsonResponse(['error' => 'Could not move uploaded file'], 500);
}

// Create or fetch artist
$stmt = $pdo->prepare('SELECT artist_id FROM artists WHERE artist_name = ?');
$stmt->execute([$artistName]);
$artist = $stmt->fetch();
if ($artist) {
    $artistId = $artist['artist_id'];
} else {
    $stmt = $pdo->prepare('INSERT INTO artists (artist_name) VALUES (?)');
    $stmt->execute([$artistName]);
    $artistId = $pdo->lastInsertId();
}

// Create or fetch album
$stmt = $pdo->prepare('SELECT album_id FROM albums WHERE album_name = ? AND artist_id = ?');
$stmt->execute([$albumName, $artistId]);
$album = $stmt->fetch();
if ($album) {
    $albumId = $album['album_id'];
} else {
    $stmt = $pdo->prepare('INSERT INTO albums (album_name, artist_id) VALUES (?, ?)');
    $stmt->execute([$albumName, $artistId]);
    $albumId = $pdo->lastInsertId();
}

$fileUrl = 'media/' . $targetName;

$stmt = $pdo->prepare('INSERT INTO songs (song_title, artist_id, album_id, duration, file_url) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$songTitle, $artistId, $albumId, $duration, $fileUrl]);

jsonResponse(['message' => 'Upload successful', 'file_url' => $fileUrl]);
