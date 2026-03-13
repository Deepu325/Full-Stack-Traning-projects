<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = trim($_GET['q'] ?? '');
    $limit = intval($_GET['limit'] ?? 50);

    $sql = "SELECT s.song_id, s.song_title, s.duration, s.file_url, a.artist_name, al.album_name
            FROM songs s
            JOIN artists a ON a.artist_id = s.artist_id
            LEFT JOIN albums al ON al.album_id = s.album_id";

    $params = [];
    if ($search !== '') {
        $sql .= " WHERE s.song_title LIKE ? OR a.artist_name LIKE ? OR al.album_name LIKE ?";
        $term = "%$search%";
        $params = [$term, $term, $term];
    }

    $sql .= " ORDER BY s.song_title ASC LIMIT ?";
    $params[] = $limit;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $songs = $stmt->fetchAll();

    jsonResponse(['songs' => $songs]);
}

if ($method === 'POST') {
    requireLogin();
    $data = getRequestBody();

    $songTitle = trim($data['song_title'] ?? '');
    $artistId = intval($data['artist_id'] ?? 0);
    $albumId = isset($data['album_id']) ? intval($data['album_id']) : null;
    $duration = intval($data['duration'] ?? 0);
    $fileUrl = trim($data['file_url'] ?? '');

    if (!$songTitle || !$artistId || !$fileUrl) {
        jsonResponse(['error' => 'Missing required fields'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO songs (song_title, artist_id, album_id, duration, file_url) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$songTitle, $artistId, $albumId, $duration, $fileUrl]);
    $songId = $pdo->lastInsertId();

    jsonResponse(['message' => 'Song added', 'song_id' => $songId], 201);
}

if ($method === 'PUT') {
    requireLogin();
    $data = getRequestBody();
    $songId = intval($_GET['id'] ?? 0);
    if (!$songId) {
        jsonResponse(['error' => 'Missing song id'], 400);
    }

    $fields = [];
    $params = [];
    foreach (['song_title', 'artist_id', 'album_id', 'duration', 'file_url'] as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $params[] = $data[$field];
        }
    }

    if (empty($fields)) {
        jsonResponse(['error' => 'Nothing to update'], 400);
    }

    $params[] = $songId;
    $sql = 'UPDATE songs SET ' . implode(', ', $fields) . ' WHERE song_id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['message' => 'Song updated']);
}

if ($method === 'DELETE') {
    requireLogin();
    $songId = intval($_GET['id'] ?? 0);
    if (!$songId) {
        jsonResponse(['error' => 'Missing song id'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM songs WHERE song_id = ?');
    $stmt->execute([$songId]);

    jsonResponse(['message' => 'Song deleted']);
}

jsonResponse(['error' => 'Unsupported method'], 405);
