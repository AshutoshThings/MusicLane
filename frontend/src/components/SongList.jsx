import { useState } from "react";

export default function SongList({ songs, onPlay, onSearch }) {
  const [q, setQ] = useState("");

  return (
    <section>
      <div style={{ marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs, artists, albums..."
        />
        <button onClick={() => onSearch(q)}>Search</button>
      </div>

      <ul style={{ padding: 0 }}>
        {songs.length === 0 ? (
          <li>No songs</li>
        ) : (
          songs.map((s) => (
            <li
              key={s.song_id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                listStyle: "none",
                padding: 8,
                border: "1px solid #eee",
                marginBottom: 8,
              }}
            >
              <div>
                <strong>{s.title}</strong>
                <br />
                <small>
                  {s.artist || "Unknown"} — {s.album || ""} ({s.duration || ""})
                </small>
              </div>
              <div>
                <button onClick={() => onPlay(s)}>Play</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
