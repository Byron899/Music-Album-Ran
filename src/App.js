import React, { useEffect, useState } from 'react';

const API_URL = 'https://albumbackend-vr81.onrender.com';

function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/albums`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response not ok');
        return response.json();
      })
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading albums...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Top Albums</h1>
      <ul>
        {albums.map((album, index) => (
          <li key={index}>
            <strong>{album.title}</strong> by {album.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
