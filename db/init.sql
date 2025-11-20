CREATE DATABASE IF NOT EXISTS mytune;
USE mytune;

DROP TABLE IF EXISTS PlaylistSongs;
DROP TABLE IF EXISTS Playlists;
DROP TABLE IF EXISTS Songs;
DROP TABLE IF EXISTS Albums;
DROP TABLE IF EXISTS Artists;

CREATE TABLE Artists (
  artist_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE Albums (
  album_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id INT,
  FOREIGN KEY (artist_id) REFERENCES Artists(artist_id) ON DELETE SET NULL
);

CREATE TABLE Songs (
  song_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(20),
  album_id INT,
  file_path VARCHAR(500),
  FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE SET NULL
);

CREATE TABLE Playlists (
  playlist_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE PlaylistSongs (
  playlist_id INT,
  song_id INT,
  PRIMARY KEY (playlist_id, song_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES Songs(song_id) ON DELETE CASCADE
);

-- seed sample public/demo audio URLs
INSERT INTO Artists (name) VALUES ('Public Domain Artist'), ('Sample Band');

INSERT INTO Albums (title, artist_id) VALUES ('PD Album 1', 1), ('Sample Album', 2);

INSERT INTO Songs (title, duration, album_id, file_path) VALUES
('Test Tone 1','00:30',1,'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav'),
('Test Tone 2','00:20',1,'https://archive.org/download/testmp3testfile/mpthreetest.mp3'),
('Sample Song A','03:00',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
('Sample Song B','02:45',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
('Sample Song C','03:10',2,'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3');

INSERT INTO Playlists (name) VALUES ('Favorites');
INSERT INTO PlaylistSongs (playlist_id, song_id) VALUES (1,1),(1,3);
