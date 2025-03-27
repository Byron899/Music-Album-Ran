
import React, { useEffect, useState } from 'react';

function App() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://albumbackend-vr81.onrender.com/albums') // Update this if your endpoint differs
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response not ok');
        }
        return res.json();
      })
      .then(data => {
        setAlbums(data.albums || data); // adjust if your backend uses another structure
      })
      .catch(err => {
        setError('Error: ' + err.message);
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Music Album Ranking</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && albums.length === 0 && <p>Loading...</p>}
      <ul>
        {albums.map((album, index) => (
          <li key={index}>
            <strong>{album.name}</strong> by {album.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
