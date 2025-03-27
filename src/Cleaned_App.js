import React, { useState, useEffect } from 'react';

export default function MusicRankingApp() {
  const [albums, setAlbums] = useState([]);
  const [albumForm, setAlbumForm] = useState({
    name: '', short_name: '', artist: '', album_type: ''
  });
  const [songs, setSongs] = useState([{ name: '', rating: '', note: '' }]);
  const [editingAlbum, setEditingAlbum] = useState(null);

  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`${API_URL}/get_albums`);
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleAlbumChange = (e) => {
    setAlbumForm({ ...albumForm, [e.target.name]: e.target.value });
  };

  const handleSongChange = (index, field, value) => {
    const newSongs = [...songs];
    newSongs[index][field] = value;
    setSongs(newSongs);
  };

  const addSongField = () => {
    if (songs.length < 50) {
      setSongs([...songs, { name: '', rating: '', note: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAlbum
        ? `${API_URL}/update_album/${editingAlbum}`
        : `${API_URL}/add_album`;
      const method = editingAlbum ? 'PUT' : 'POST';

      const albumResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumForm),
      });
      const albumData = await albumResponse.json();

      if (!albumData.album_id) throw new Error('Album ID missing from response');

      await fetch(`${API_URL}/add_songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: albumData.album_id, songs }),
      });

      alert(editingAlbum ? 'Album updated successfully!' : 'Album added successfully!');
      setAlbumForm({ name: '', short_name: '', artist: '', album_type: '' });
      setSongs([{ name: '', rating: '', note: '' }]);
      setEditingAlbum(null);
      fetchAlbums();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (album) => {
    setAlbumForm({
      name: album.album,
      short_name: album.short_name || '',
      artist: album.artist,
      album_type: album.album_type,
    });
    setEditingAlbum(album.album_id);
  };

  return (
    <div>
      <h1>Music Album Ranking</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={albumForm.name} onChange={handleAlbumChange} placeholder="Album Name" required />
        <input name="short_name" value={albumForm.short_name} onChange={handleAlbumChange} placeholder="Short Name (Optional)" />
        <input name="artist" value={albumForm.artist} onChange={handleAlbumChange} placeholder="Artist" required />
        <input name="album_type" value={albumForm.album_type} onChange={handleAlbumChange} placeholder="Album Type (Album, EP, etc.)" required />
        <h2>Songs</h2>
        {songs.map((song, index) => (
          <div key={index}>
            <input name="name" value={song.name} onChange={(e) => handleSongChange(index, 'name', e.target.value)} placeholder="Song Name" required />
            <input type="number" name="rating" value={song.rating} onChange={(e) => handleSongChange(index, 'rating', e.target.value)} placeholder="Rating (0-10)" required />
            <textarea name="note" value={song.note} onChange={(e) => handleSongChange(index, 'note', e.target.value)} placeholder="Optional note..." />
          </div>
        ))}
        <button type="button" onClick={addSongField}>+ Add Song</button>
        <button type="submit">{editingAlbum ? 'Update Album' : 'Submit Album'}</button>
      </form>
      <h2>Ranked Albums</h2>
      {albums.map((album, index) => (
        <div key={index}>
          <p>{album.album} ({album.short_name || 'N/A'}) - {album.artist}</p>
          <p>Type: {album.album_type}</p>
          <p>Average Rating: {album.average_rating}/10</p>
          <p>Total Rating: {album.total_rating} from {album.song_count} songs</p>
          <button onClick={() => handleEdit(album)}>Edit</button>
        </div>
      ))}
    </div>
  );
}