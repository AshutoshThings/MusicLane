require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");
const playlistsRouter = require("./routes/playlists");

const app = express();

app.use(cors());
app.use(express.json());

//Mounting Routes
app.use("/api/auth", authRouter);
app.use("/api/playlists", playlistsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
