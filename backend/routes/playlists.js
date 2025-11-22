const express = require("express");
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/playlists/stats
//public endpoint for Landing Page statistics
router.get("/stats", async (req, res) => {
  try {
    const [tracks] = await pool.query("SELECT COUNT(*) as count FROM Songs");
    const [playlists] = await pool.query(
      "SELECT COUNT(*) as count FROM Playlists"
    );
    const [users] = await pool.query("SELECT COUNT(*) as count FROM Users");

    res.json({
      tracks: tracks[0].count,
      playlists: playlists[0].count,
      users: users[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /api/playlists/dashboard
//fetches data for the main home screen
router.get("/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    //User's Private Playlists
    const [myPlaylists] = await pool.query(
      "SELECT * FROM Playlists WHERE user_id = ?",
      [userId]
    );

    //Liked Songs Count (For the "Liked Songs" card)
    const [likedCount] = await pool.query(
      "SELECT COUNT(*) as count FROM UserLikes WHERE user_id = ?",
      [userId]
    );

    //Recommended Playlists (Global/System playlists)
    const [recommended] = await pool.query(
      "SELECT * FROM Playlists WHERE user_id IS NULL LIMIT 10"
    );

    //Trending Songs (Random selection for discovery)
    const [trending] = await pool.query(
      "SELECT * FROM Songs ORDER BY RAND() LIMIT 6"
    );

    res.json({
      myPlaylists,
      likedSongsCount: likedCount[0].count,
      recommended,
      trending,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /api/playlists/likes
// Fetch all songs liked by the user
router.get("/likes", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    //Joining Songs with UserLikes to get the actual song details
    const [songs] = await pool.query(
      `SELECT s.* FROM Songs s
       JOIN UserLikes ul ON s.song_id = ul.song_id
       WHERE ul.user_id = ?
       ORDER BY ul.created_at DESC`,
      [userId]
    );
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /api/playlists/like/:songId
// Toggle Like status for a song
router.post("/like/:songId", auth, async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.userId;

    //Checking if already liked
    const [exists] = await pool.query(
      "SELECT * FROM UserLikes WHERE user_id = ? AND song_id = ?",
      [userId, songId]
    );

    if (exists.length > 0) {
      //If exists, UNLIKE it
      await pool.query(
        "DELETE FROM UserLikes WHERE user_id = ? AND song_id = ?",
        [userId, songId]
      );
      res.json({ liked: false });
    } else {
      //If not exists, LIKE it
      await pool.query(
        "INSERT IGNORE INTO UserLikes (user_id, song_id) VALUES (?, ?)",
        [userId, songId]
      );
      res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /api/playlists/:id/songs
// Fetch all songs inside a specific playlist
router.get("/:id/songs", auth, async (req, res) => {
  try {
    const playlistId = req.params.id;
    const [songs] = await pool.query(
      `SELECT s.* FROM Songs s
       JOIN PlaylistSongs ps ON s.song_id = ps.song_id
       WHERE ps.playlist_id = ?`,
      [playlistId]
    );
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /api/playlists/:id/songs
// Add a song to a private playlist
router.post("/:id/songs", auth, async (req, res) => {
  const playlistId = req.params.id;
  const { songId } = req.body;

  if (!songId) return res.status(400).json({ msg: "Song ID required" });

  try {
    //Verify the user OWNS this playlist
    const [playlist] = await pool.query(
      "SELECT * FROM Playlists WHERE playlist_id = ? AND user_id = ?",
      [playlistId, req.user.userId]
    );

    if (playlist.length === 0) {
      return res
        .status(403)
        .json({ msg: "Not authorized to modify this playlist" });
    }

    //Add the song
    await pool.query(
      "INSERT IGNORE INTO PlaylistSongs (playlist_id, song_id) VALUES (?, ?)",
      [playlistId, songId]
    );

    res.json({ msg: "Song added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /api/playlists/create
// Create a new empty playlist
router.post("/create", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Name is required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO Playlists (name, user_id) VALUES (?, ?)",
      [name, req.user.userId]
    );
    res.json({
      playlist_id: result.insertId,
      name,
      user_id: req.user.userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
