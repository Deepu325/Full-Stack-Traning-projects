// Client-side logic for the mini music streaming web app
const apiBase = '../backend';

const state = {
  user: null,
  playlists: [],
  currentPlaylist: null,
  songs: [],
};

const elements = {
  nav: {
    library: document.getElementById('btnLibrary'),
    playlists: document.getElementById('btnPlaylists'),
    account: document.getElementById('btnAccount'),
  },
  panels: {
    library: document.getElementById('sectionLibrary'),
    playlists: document.getElementById('sectionPlaylists'),
    account: document.getElementById('sectionAccount'),
  },
  userInfo: document.getElementById('userInfo'),
  search: document.getElementById('searchInput'),
  btnSearch: document.getElementById('btnSearch'),
  songList: document.getElementById('songList'),
  uploadPanel: document.getElementById('uploadPanel'),
  uploadTitle: document.getElementById('uploadTitle'),
  uploadArtist: document.getElementById('uploadArtist'),
  uploadAlbum: document.getElementById('uploadAlbum'),
  uploadFile: document.getElementById('uploadFile'),
  btnUpload: document.getElementById('btnUploadSong'),
  playlistNameInput: document.getElementById('playlistName'),
  playlistList: document.getElementById('playlistList'),
  playlistDetail: document.getElementById('playlistDetail'),
  playlistTitle: document.getElementById('playlistTitle'),
  playlistSongs: document.getElementById('playlistSongs'),

  auth: {
    login: {
      username: document.getElementById('loginUsername'),
      password: document.getElementById('loginPassword'),
      button: document.getElementById('btnLogin'),
    },
    register: {
      username: document.getElementById('registerUsername'),
      email: document.getElementById('registerEmail'),
      password: document.getElementById('registerPassword'),
      button: document.getElementById('btnRegister'),
    },
    logout: document.getElementById('btnLogout'),
  },
  accountInfo: document.getElementById('accountInfo'),
  authForms: document.getElementById('authForms'),
  accountUser: document.getElementById('accountUser'),

  audio: document.getElementById('audioPlayer'),
  nowPlayingTitle: document.getElementById('nowPlayingTitle'),
  nowPlayingArtist: document.getElementById('nowPlayingArtist'),
};

const templates = {
  song: document.getElementById('songRowTemplate'),
  playlist: document.getElementById('playlistRowTemplate'),
  playlistSong: document.getElementById('playlistSongRowTemplate'),
};

function setActivePanel(panelKey) {
  Object.entries(elements.panels).forEach(([key, panel]) => {
    panel.classList.toggle('hidden', key !== panelKey);
    elements.nav[key].classList.toggle('active', key === panelKey);
  });
}

function showMessage(message, type = 'info') {
  // Basic alert fallback; can be improved to use toast
  if (type === 'error') {
    window.alert('Error: ' + message);
  } else {
    window.alert(message);
  }
}

function api(path, options = {}) {
  const url = `${apiBase}/${path}`;
  const defaults = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const opts = Object.assign({}, defaults, options);
  return fetch(url, opts).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.error || res.statusText;
      throw new Error(msg);
    }
    return data;
  });
}

async function fetchUserStatus() {
  try {
    const result = await api('auth.php?action=status', { method: 'GET' });
    if (result.authenticated) {
      state.user = result.user;
      elements.userInfo.textContent = `Signed in as ${state.user.username}`;
      elements.accountUser.textContent = state.user.username;
      elements.accountInfo.classList.remove('hidden');
      elements.authForms.classList.add('hidden');
    } else {
      state.user = null;
      elements.userInfo.textContent = 'Not signed in';
      elements.accountInfo.classList.add('hidden');
      elements.authForms.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Failed to get auth status', error);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const visible = Boolean(state.user);
  elements.uploadPanel.classList.toggle('hidden', !visible);
}

async function loadSongs(query = '') {
  try {
    const q = query.trim();
    const url = q ? `songs.php?q=${encodeURIComponent(q)}` : 'songs.php';
    const data = await api(url, { method: 'GET' });
    state.songs = data.songs || [];
    renderSongList();
  } catch (error) {
    console.error('Failed to load songs', error);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function renderSongList() {
  elements.songList.innerHTML = '';

  if (!state.songs.length) {
    elements.songList.textContent = 'No songs found. Add some in the database or search for another term.';
    return;
  }

  state.songs.forEach((song) => {
    const item = templates.song.content.cloneNode(true);
    item.querySelector('.song-title').textContent = song.song_title;
    item.querySelector('.song-details').textContent = `${song.artist_name} · ${song.album_name || 'Single'} · ${formatTime(song.duration || 0)}`;

    const playBtn = item.querySelector('.btn-play');
    playBtn.addEventListener('click', () => playSong(song));

    const addBtn = item.querySelector('.btn-add');
    addBtn.addEventListener('click', () => openAddToPlaylistDialog(song));

    elements.songList.appendChild(item);
  });
}

function playSong(song) {
  elements.audio.src = song.file_url;
  elements.nowPlayingTitle.textContent = song.song_title;
  elements.nowPlayingArtist.textContent = song.artist_name;
  elements.audio.play().catch(() => {});
}

async function openAddToPlaylistDialog(song) {
  if (!state.user) {
    showMessage('Please log in first to add songs to a playlist.', 'error');
    setActivePanel('account');
    return;
  }

  const playlists = await api('playlists.php', { method: 'GET' });
  const list = playlists.playlists || [];
  const choice = window.prompt(
    `Pick a playlist by number:\n${list
      .map((p, i) => `${i + 1}. ${p.playlist_name}`)
      .join('\n')}`
  );
  const index = Number(choice) - 1;
  if (!Number.isFinite(index) || index < 0 || index >= list.length) {
    return;
  }
  const playlistId = list[index].playlist_id;

  await api('playlists.php?action=addSong', {
    method: 'POST',
    body: JSON.stringify({ playlist_id: playlistId, song_id: song.song_id }),
  });
  showMessage("Song added to playlist");
}

async function createPlaylist() {
  if (!state.user) {
    showMessage('Please log in to create playlists.', 'error');
    setActivePanel('account');
    return;
  }

  const name = elements.playlistNameInput.value.trim();
  if (!name) {
    showMessage('Playlist name is required.', 'error');
    return;
  }

  await api('playlists.php', {
    method: 'POST',
    body: JSON.stringify({ playlist_name: name }),
  });

  elements.playlistNameInput.value = '';
  loadPlaylists();
}

async function uploadSong() {
  if (!state.user) {
    showMessage('Please log in to upload songs.', 'error');
    setActivePanel('account');
    return;
  }

  const title = elements.uploadTitle.value.trim();
  const artist = elements.uploadArtist.value.trim();
  const album = elements.uploadAlbum.value.trim();
  const file = elements.uploadFile.files[0];

  if (!title || !artist || !album || !file) {
    showMessage('Fill all fields and choose an audio file.', 'error');
    return;
  }

  const form = new FormData();
  form.append('song_title', title);
  form.append('artist_name', artist);
  form.append('album_name', album);
  form.append('duration', 0);
  form.append('file', file);

  const res = await fetch(`${apiBase}/upload.php`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    showMessage(data?.error || 'Upload failed', 'error');
    return;
  }

  showMessage('Song uploaded successfully');
  elements.uploadTitle.value = '';
  elements.uploadArtist.value = '';
  elements.uploadAlbum.value = '';
  elements.uploadFile.value = '';
  loadSongs();
}

async function loadPlaylists() {
  if (!state.user) return;

  const data = await api('playlists.php', { method: 'GET' });
  state.playlists = data.playlists || [];
  renderPlaylistList();
}

function renderPlaylistList() {
  elements.playlistList.innerHTML = '';
  if (!state.playlists.length) {
    elements.playlistList.textContent = 'No playlists yet. Create one above to get started.';
    return;
  }

  state.playlists.forEach((pl) => {
    const item = templates.playlist.content.cloneNode(true);
    item.querySelector('.playlist-name').textContent = pl.playlist_name;
    const viewBtn = item.querySelector('.btn-view');
    viewBtn.addEventListener('click', () => showPlaylistDetail(pl));
    elements.playlistList.appendChild(item);
  });
}

async function showPlaylistDetail(playlist) {
  state.currentPlaylist = playlist;
  elements.playlistTitle.textContent = playlist.playlist_name;
  elements.playlistDetail.classList.remove('hidden');
  elements.playlistList.classList.add('hidden');
  elements.playlistSongs.innerHTML = '';

  const data = await api(`playlists.php?playlist_id=${playlist.playlist_id}`, { method: 'GET' });
  const songs = data.playlist?.songs || [];
  if (!songs.length) {
    elements.playlistSongs.textContent = 'No songs in this playlist (yet). Use the library to add more.';
    return;
  }

  songs.forEach((song) => {
    const item = templates.playlistSong.content.cloneNode(true);
    item.querySelector('.song-title').textContent = song.song_title;
    item.querySelector('.song-details').textContent = `${song.artist_name} · ${song.album_name || 'Single'} · ${formatTime(song.duration || 0)}`;

    item.querySelector('.btn-play').addEventListener('click', () => playSong(song));
    item.querySelector('.btn-remove').addEventListener('click', async () => {
      await api(`playlists.php?action=removeSong&playlist_id=${playlist.playlist_id}&song_id=${song.song_id}`, {
        method: 'DELETE',
      });
      showPlaylistDetail(playlist);
    });

    elements.playlistSongs.appendChild(item);
  });
}

function hidePlaylistDetail() {
  elements.playlistDetail.classList.add('hidden');
  elements.playlistList.classList.remove('hidden');
}

async function login() {
  const username = elements.auth.login.username.value.trim();
  const password = elements.auth.login.password.value;

  if (!username || !password) {
    showMessage('Enter your username and password.', 'error');
    return;
  }

  await api('auth.php?action=login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  await fetchUserStatus();
  await loadPlaylists();
  setActivePanel('library');
  loadSongs();
}

async function register() {
  const username = elements.auth.register.username.value.trim();
  const email = elements.auth.register.email.value.trim();
  const password = elements.auth.register.password.value;

  if (!username || !email || !password) {
    showMessage('Fill out all registration fields.', 'error');
    return;
  }

  await api('auth.php?action=register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

  await fetchUserStatus();
  await loadPlaylists();
  setActivePanel('library');
  loadSongs();
}

async function logout() {
  await api('auth.php?action=logout', { method: 'POST' });
  state.user = null;
  await fetchUserStatus();
  setActivePanel('account');
}

function wireEvents() {
  elements.nav.library.addEventListener('click', () => setActivePanel('library'));
  elements.nav.playlists.addEventListener('click', () => setActivePanel('playlists'));
  elements.nav.account.addEventListener('click', () => setActivePanel('account'));

  elements.auth.login.button.addEventListener('click', login);
  elements.auth.register.button.addEventListener('click', register);
  elements.auth.logout.addEventListener('click', logout);
  elements.btnUpload?.addEventListener('click', uploadSong);

  elements.btnSearch?.addEventListener('click', () => loadSongs(elements.search.value));
  elements.search?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      loadSongs(elements.search.value);
    }
  });

  document.getElementById('btnCreatePlaylist').addEventListener('click', createPlaylist);
  document.getElementById('btnBackToPlaylists').addEventListener('click', hidePlaylistDetail);
  document.getElementById('btnDeletePlaylist').addEventListener('click', async () => {
    if (!state.currentPlaylist) return;
    const confirmed = window.confirm('Delete this playlist?');
    if (!confirmed) return;
    await api(`playlists.php?playlist_id=${state.currentPlaylist.playlist_id}`, { method: 'DELETE' });
    state.currentPlaylist = null;
    hidePlaylistDetail();
    loadPlaylists();
  });
}

async function init() {
  wireEvents();
  await fetchUserStatus();
  await loadSongs();
  if (state.user) {
    await loadPlaylists();
  }
}

init().catch((err) => console.error(err));
