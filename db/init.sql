CREATE DATABASE IF NOT EXISTS mytune;
USE mytune;

-- --- RESET SCHEMA ---
DROP TABLE IF EXISTS UserLikes;
DROP TABLE IF EXISTS PlaylistSongs;
DROP TABLE IF EXISTS Playlists;
DROP TABLE IF EXISTS Songs;
DROP TABLE IF EXISTS Albums;
DROP TABLE IF EXISTS Artists;
DROP TABLE IF EXISTS Users;

-- --- 1. USERS ---
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- 2. ARTISTS ---
CREATE TABLE Artists (
  artist_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- --- 3. ALBUMS ---
CREATE TABLE Albums (
  album_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id INT,
  FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE SET NULL
);

-- --- 4. SONGS ---
CREATE TABLE Songs (
  song_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(20),
  album_id INT,
  file_path VARCHAR(500),
  FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE SET NULL
);

-- --- 5. PLAYLISTS ---
CREATE TABLE Playlists (
  playlist_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- --- 6. PLAYLIST SONGS ---
CREATE TABLE PlaylistSongs (
  playlist_id INT,
  song_id INT,
  PRIMARY KEY (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);

-- --- 7. USER LIKES (NEW) ---
CREATE TABLE UserLikes (
  user_id INT,
  song_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, song_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);

-- --- SEED DATA ---
INSERT INTO Artists (name) VALUES ('Public Domain Artist'), ('Sample Band'), ('Lo-Fi Gods');
INSERT INTO Albums (title, artist_id) VALUES ('PD Album 1', 1), ('Sample Album', 2), ('Chill Vibes', 3);

INSERT INTO Songs (title, duration, album_id, file_path) VALUES
('Midnight Echoes','3:45',1,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
('Cyberpunk City','2:30',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
('Deep Focus','4:12',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'),
('Study Rain','2:15',3,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'),
('Coffee Shop','3:10',3,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'),
('Synthwave Run','3:20',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'),
('Piano Dreams','2:50',3,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'),
('Bass Drop','1:45',1,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

INSERT INTO Playlists (name, user_id) VALUES ('Recommended For You', NULL);
INSERT INTO Playlists (name, user_id) VALUES ('Lo-Fi Study', NULL);
INSERT INTO Playlists (name, user_id) VALUES ('All World Songs', NULL);

INSERT INTO PlaylistSongs (playlist_id, song_id) VALUES (1, 1), (1, 2), (1, 3), (2, 4), (2, 5), (2, 7);
INSERT INTO PlaylistSongs (playlist_id, song_id) SELECT 3, song_id FROM Songs;