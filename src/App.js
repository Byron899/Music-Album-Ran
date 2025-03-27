
import React, { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("https://albumbackend-vr81.onrender.com/albums");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response not ok. Status: ${response.status} - ${response.statusText}. Response: ${errorText}`
          );
        }
        const data = await response.json();
        setAlbums(data.albums || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Music Album Ranking</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
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
