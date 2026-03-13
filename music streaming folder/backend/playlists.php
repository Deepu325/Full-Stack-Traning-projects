<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
requireLogin();
$userId = $_SESSION['user_id'];

action:
$action = $_GET['action'] ?? '';

// Actions for playlist songs (add/remove) are treated specially
if ($action === 'addSong' && $method === 'POST') {
    $data = getRequestBody();
    $playlistId = intval($data['playlist_id'] ?? 0);
    $songId = intval($data['song_id'] ?? 0);
    if (!$playlistId || !$songId) {
        jsonResponse(['error' => 'Missing playlist_id or song_id'], 400);
    }

    $stmt = $pdo->prepare('INSERT IGNORE INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)');
    $stmt->execute([$playlistId, $songId]);
    jsonResponse(['message' => 'Song added to playlist']);
}

if ($action === 'removeSong' && $method === 'DELETE') {
    $playlistId = intval($_GET['playlist_id'] ?? 0);
    $songId = intval($_GET['song_id'] ?? 0);
    if (!$playlistId || !$songId) {
        jsonResponse(['error' => 'Missing playlist_id or song_id'], 400);
    }
    $stmt = $pdo->prepare('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?');
    $stmt->execute([$playlistId, $songId]);
    jsonResponse(['message' => 'Song removed from playlist']);
}

if ($method === 'GET') {
    $playlistId = intval($_GET['playlist_id'] ?? 0);

    if ($playlistId) {
        // Return playlist metadata and songs
        $stmt = $pdo->prepare(
            'SELECT p.playlist_id, p.playlist_name, ps.playlist_song_id, s.song_id, s.song_title, s.duration, s.file_url, a.artist_name, al.album_name
             FROM playlists p
             LEFT JOIN playlist_songs ps ON ps.playlist_id = p.playlist_id
             LEFT JOIN songs s ON s.song_id = ps.song_id
             LEFT JOIN artists a ON a.artist_id = s.artist_id
             LEFT JOIN albums al ON al.album_id = s.album_id
             WHERE p.playlist_id = ? AND p.user_id = ?'
        );
        $stmt->execute([$playlistId, $userId]);
        $rows = $stmt->fetchAll();
        if (empty($rows)) {
            jsonResponse(['error' => 'Playlist not found'], 404);
        }
        $playlist = [
            'playlist_id' => $rows[0]['playlist_id'],
            'playlist_name' => $rows[0]['playlist_name'],
            'songs' => []
        ];
        foreach ($rows as $row) {
            if ($row['song_id']) {
                $playlist['songs'][] = [
                    'song_id' => $row['song_id'],
                    'song_title' => $row['song_title'],
                    'duration' => $row['duration'],
                    'file_url' => $row['file_url'],
                    'artist_name' => $row['artist_name'],
                    'album_name' => $row['album_name'],
                ];
            }
        }
        jsonResponse(['playlist' => $playlist]);
    }

    // List playlists for user
    $stmt = $pdo->prepare('SELECT playlist_id, playlist_name FROM playlists WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$userId]);
    $playlists = $stmt->fetchAll();
    jsonResponse(['playlists' => $playlists]);
}

if ($method === 'POST') {
    $data = getRequestBody();
    $name = trim($data['playlist_name'] ?? '');
    if (!$name) {
        jsonResponse(['error' => 'Missing playlist name'], 400);
    }
    $stmt = $pdo->prepare('INSERT INTO playlists (user_id, playlist_name) VALUES (?, ?)');
    $stmt->execute([$userId, $name]);
    $playlistId = $pdo->lastInsertId();
    jsonResponse(['message' => 'Playlist created', 'playlist_id' => $playlistId], 201);
}

if ($method === 'PUT') {
    $data = getRequestBody();
    $playlistId = intval($_GET['playlist_id'] ?? 0);
    $name = trim($data['playlist_name'] ?? '');
    if (!$playlistId || !$name) {
        jsonResponse(['error' => 'Missing playlist id or name'], 400);
    }
    $stmt = $pdo->prepare('UPDATE playlists SET playlist_name = ? WHERE playlist_id = ? AND user_id = ?');
    $stmt->execute([$name, $playlistId, $userId]);
    jsonResponse(['message' => 'Playlist renamed']);
}

if ($method === 'DELETE') {
    $playlistId = intval($_GET['playlist_id'] ?? 0);
    if (!$playlistId) {
        jsonResponse(['error' => 'Missing playlist id'], 400);
    }
    $stmt = $pdo->prepare('DELETE FROM playlists WHERE playlist_id = ? AND user_id = ?');
    $stmt->execute([$playlistId, $userId]);
    jsonResponse(['message' => 'Playlist deleted']);
}

jsonResponse(['error' => 'Unsupported method or action'], 405);
