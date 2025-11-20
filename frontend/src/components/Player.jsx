import { useEffect, useRef } from "react";

export default function Player({ song }) {
  const audioRef = useRef();

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.src = song.file_path;
      audioRef.current.play().catch(() => {});
    }
  }, [song]);

  return (
    <section
      style={{ marginTop: 20, borderTop: "1px solid #ddd", paddingTop: 12 }}
    >
      <h2>Player</h2>
      <div>{song ? `Now playing: ${song.title}` : "No song selected"}</div>
      <audio ref={audioRef} controls style={{ width: "100%", marginTop: 8 }} />
    </section>
  );
}
