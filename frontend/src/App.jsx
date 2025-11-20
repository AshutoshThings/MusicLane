import { useState, useEffect } from "react";
import SongList from "./components/SongList";
import Player from "./components/Player";

const API = "http://localhost:5000/api";

function App() {
  const [songs, setSongs] = useState([]);
  const [now, setNow] = useState(null);

  async function loadSongs(q = "") {
    const url = q ? `${API}/songs?q=${encodeURIComponent(q)}` : `${API}/songs`;
    const res = await fetch(url);
    const data = await res.json();
    setSongs(data);
  }

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        padding: "0 16px",
        fontFamily: "Arial",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1>MyTune</h1>
      </header>

      <SongList
        songs={songs}
        onPlay={(s) => setNow(s)}
        onSearch={(q) => loadSongs(q)}
      />
      <Player song={now} />
    </div>
  );
}

export default App;
