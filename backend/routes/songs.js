const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    let sql = `SELECT s.song_id, s.title, s.duration, s.file_path, a.title AS album, ar.name AS artist
               FROM Songs s
               LEFT JOIN Albums a ON s.album_id = a.album_id
               LEFT JOIN Artists ar ON a.artist_id = ar.artist_id`;
    let params = [];
    if (q) {
      sql += " WHERE s.title LIKE ? OR ar.name LIKE ? OR a.title LIKE ?";
      params = [`%${q}%`, `%${q}%`, `%${q}%`];
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Songs WHERE song_id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
