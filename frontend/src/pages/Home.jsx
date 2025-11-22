import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Search,
  Library,
  Plus,
  Heart,
  LogOut,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Music,
  ArrowLeft,
  Clock,
  MoreHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import GradientMesh from "../components/GradientMesh";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    myPlaylists: [],
    recommended: [],
    trending: [],
    likedSongsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  //view states
  const [view, setView] = useState("dashboard");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [likedSongsIds, setLikedSongsIds] = useState(new Set());

  //ui states
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);

  //player states
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState([]);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
      return;
    }
    if (storedUser) setUser(JSON.parse(storedUser));

    //Lading dashboard
    const loadData = async () => {
      await Promise.all([fetchData(token), fetchLikedSongsIds(token)]);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  //audio logic
  const togglePlay = () => {
    if (!currentSong) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playSong = (song, newQueue = []) => {
    if (newQueue.length > 0) setQueue(newQueue);
    setCurrentSong(song);
    setIsPlaying(true);
    audioRef.current.src = song.file_path;
    audioRef.current.play().catch((e) => console.error("Playback error:", e));
  };

  const playNext = () => {
    if (queue.length === 0 || !currentSong) return;
    const idx = queue.findIndex((s) => s.song_id === currentSong.song_id);
    playSong(queue[(idx + 1) % queue.length], queue);
  };

  const playPrev = () => {
    if (queue.length === 0 || !currentSong) return;
    const idx = queue.findIndex((s) => s.song_id === currentSong.song_id);
    playSong(queue[(idx - 1 + queue.length) % queue.length], queue);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [queue, currentSong]);

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };

  //api calls

  const fetchData = async (token) => {
    try {
      const res = await fetch("http://localhost:5001/api/playlists/dashboard", {
        headers: { "x-auth-token": token },
      });
      if (res.ok) setData(await res.json());
      else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  //update ui for liked songs
  const fetchLikedSongsIds = async (token) => {
    try {
      const res = await fetch("http://localhost:5001/api/playlists/likes", {
        headers: { "x-auth-token": token },
      });
      if (res.ok) {
        const songs = await res.json();
        setLikedSongsIds(new Set(songs.map((s) => s.song_id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    setView("playlist");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5001/api/playlists/${playlist.playlist_id}/songs`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setPlaylistSongs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  //function to Open Liked songs
  const openLikedSongs = async () => {
    setView("likes");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/playlists/likes`, {
        headers: { "x-auth-token": token },
      });
      setPlaylistSongs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (e, song) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const newLikedIds = new Set(likedSongsIds);
    let isLiked = false;

    if (newLikedIds.has(song.song_id)) {
      newLikedIds.delete(song.song_id);
      isLiked = false;
    } else {
      newLikedIds.add(song.song_id);
      isLiked = true;
    }
    setLikedSongsIds(newLikedIds);

    setData((prev) => ({
      ...prev,
      likedSongsCount: isLiked
        ? prev.likedSongsCount + 1
        : Math.max(0, prev.likedSongsCount - 1),
    }));

    //backend call
    try {
      await fetch(`http://localhost:5001/api/playlists/like/${song.song_id}`, {
        method: "POST",
        headers: { "x-auth-token": token },
      });

      // If we are in the "Likes" view, refreshing the list to remove/add the song
      if (view === "likes") {
        openLikedSongs();
      }
    } catch (err) {
      console.error(err);
      fetchLikedSongsIds(token);
      fetchData(token);
    }
  };

  const addToPlaylist = async (targetPlaylistId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5001/api/playlists/${targetPlaylistId}/songs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ songId: songToAdd.song_id }),
        }
      );
      if (res.ok) {
        setShowAddModal(false);
        alert("Added to playlist!");
      } else {
        alert("Could not add song.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createPlaylist = async () => {
    const name = prompt("Enter playlist name:");
    if (!name) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5001/api/playlists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ name }),
      });
      if (res.ok) fetchData(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    audioRef.current.pause();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div
      className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30 relative"
      onClick={() => setShowProfileMenu(false)}
    >
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <GradientMesh />
      </div>

      <nav className="flex items-center justify-between px-8 py-6 z-20 bg-transparent">
        <div className="flex items-center gap-8">
          <div
            onClick={() => setView("dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition">
              <Music size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">MusicLane</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <button
              onClick={() => setView("dashboard")}
              className={`hover:text-white transition ${
                view === "dashboard" ? "text-white" : ""
              }`}
            >
              Dashboard
            </button>
            <button className="hover:text-white transition">Browse</button>
            <button className="hover:text-white transition">Radio</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={createPlaylist}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-md border border-white/5 transition"
          >
            <Plus size={16} /> <span>New Playlist</span>
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                {user?.name?.[0]}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown
                size={14}
                className={`text-white/50 transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-32 z-10">
        {view === "dashboard" && (
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            <div className="mb-10 mt-4">
              <h1 className="text-5xl font-bold mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                {greeting}, {user?.name}
              </h1>
              <p className="text-white/50">
                Your daily mix of energy and focus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div
                onClick={openLikedSongs}
                className="col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition group relative overflow-hidden shadow-2xl shadow-indigo-900/20"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <Heart className="w-10 h-10 text-white fill-white mb-4" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-1">Liked Songs</h3>
                    <p className="text-white/80 font-medium">
                      {data.likedSongsCount || 0} songs liked
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition"></div>
              </div>

              <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md hover:bg-white/[0.07] transition">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Play size={16} fill="white" /> Trending Now
                  </h3>
                  <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                    Global Top 6
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.trending.slice(0, 6).map((song) => (
                    <div
                      key={song.song_id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition"
                      onClick={() => playSong(song)}
                    >
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500 transition shadow-lg relative overflow-hidden">
                        {currentSong?.song_id === song.song_id && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3">
                            <span className="w-1 bg-white animate-[bounce_1s_infinite]"></span>
                            <span className="w-1 bg-white animate-[bounce_1.2s_infinite] delay-75"></span>
                            <span className="w-1 bg-white animate-[bounce_0.8s_infinite] delay-150"></span>
                          </div>
                        ) : (
                          <Music
                            size={18}
                            className="text-white/50 group-hover:text-white"
                          />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div
                          className={`font-medium truncate text-sm ${
                            currentSong?.song_id === song.song_id
                              ? "text-indigo-400"
                              : "text-white"
                          }`}
                        >
                          {song.title}
                        </div>
                        <div className="text-xs text-white/40 truncate">
                          Unknown Artist
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => toggleLike(e, song)}
                          className={`p-2 rounded-full hover:bg-white/10 transition ${
                            likedSongsIds.has(song.song_id)
                              ? "text-green-500"
                              : "text-zinc-500 hover:text-white"
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={
                              likedSongsIds.has(song.song_id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSongToAdd(song);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SectionHeader title="Your Library" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {data.myPlaylists.map((pl, i) => (
                <PlaylistCard
                  key={pl.playlist_id}
                  title={pl.name}
                  subtitle="Private Playlist"
                  onClick={() => openPlaylist(pl)}
                  idx={i}
                />
              ))}
              {data.myPlaylists.length === 0 && (
                <div className="text-zinc-500 text-sm col-span-full bg-white/5 p-4 rounded-xl border border-dashed border-white/10">
                  No playlists yet. Create one to get started!
                </div>
              )}
            </div>

            <SectionHeader title="Curated For You" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
              {data.recommended.map((pl, i) => (
                <PlaylistCard
                  key={pl.playlist_id}
                  title={pl.name}
                  subtitle="System Mix"
                  onClick={() => openPlaylist(pl)}
                  idx={i + 5}
                />
              ))}
            </div>
          </div>
        )}

        {(view === "playlist" || view === "likes") && (
          <div className="max-w-5xl mx-auto mt-8 animate-fade-in-up">
            <button
              onClick={() => setView("dashboard")}
              className="group flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition px-4 py-2 rounded-full hover:bg-white/5 w-fit"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10 px-4">
              <div
                className={`w-52 h-52 rounded-3xl shadow-2xl flex items-center justify-center bg-gradient-to-br ${
                  view === "likes"
                    ? "from-indigo-600 to-purple-700"
                    : "from-zinc-800 to-zinc-900 shadow-zinc-900/50"
                }`}
              >
                {view === "likes" ? (
                  <Heart size={80} fill="white" />
                ) : (
                  <Music size={80} className="text-white/20" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2 block">
                  {view === "likes" ? "Collection" : "Playlist"}
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
                  {view === "likes" ? "Liked Songs" : selectedPlaylist?.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-white/60 font-medium">
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-white">
                    {user?.name?.[0]}
                  </div>
                  <span className="text-white">{user?.name}</span>
                  <span>•</span>
                  <span>{playlistSongs.length} songs</span>
                </div>
              </div>
              {playlistSongs.length > 0 && (
                <button
                  onClick={() => {
                    setQueue(playlistSongs);
                    playSong(playlistSongs[0], playlistSongs);
                  }}
                  className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center shadow-xl hover:scale-105 transition mb-2"
                >
                  <Play size={28} fill="black" className="ml-1 text-black" />
                </button>
              )}
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 text-xs font-bold text-white/30 uppercase tracking-wider border-b border-white/5">
                <div className="w-8 text-center">#</div>
                <div>Title</div>
                <div></div>
                <div className="pr-4 text-right">
                  <Clock size={14} />
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {playlistSongs.length > 0 ? (
                  playlistSongs.map((song, i) => (
                    <div
                      key={song.song_id}
                      onClick={() => playSong(song, playlistSongs)}
                      className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-3 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer transition"
                    >
                      <div className="w-8 text-center text-white/40 text-sm font-mono group-hover:hidden">
                        {i + 1}
                      </div>
                      <div className="w-8 hidden group-hover:flex justify-center text-indigo-400">
                        <Play size={14} fill="currentColor" />
                      </div>

                      <div className="flex flex-col">
                        <span
                          className={`font-medium text-base ${
                            currentSong?.song_id === song.song_id
                              ? "text-indigo-400"
                              : "text-white"
                          }`}
                        >
                          {song.title}
                        </span>
                        <span className="text-xs text-white/40">
                          Unknown Artist
                        </span>
                      </div>

                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => toggleLike(e, song)}
                          className={`hover:scale-110 transition ${
                            likedSongsIds.has(song.song_id)
                              ? "text-green-500"
                              : "text-white/40 hover:text-white"
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={
                              likedSongsIds.has(song.song_id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSongToAdd(song);
                            setShowAddModal(true);
                          }}
                          className="text-white/40 hover:text-white transition hover:scale-110"
                          title="Add to playlist"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <div className="text-sm text-white/30 font-mono w-12 text-right pr-4">
                        {song.duration}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Music size={32} className="text-white/20" />
                    </div>
                    <p className="text-white/40">No songs found here yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-3 px-6 shadow-2xl z-50 hover:border-white/20 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
            {currentSong ? (
              <>
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                >
                  <Music size={20} className="text-white" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-sm text-white truncate">
                    {currentSong.title}
                  </div>
                  <div className="text-xs text-indigo-300 truncate font-medium">
                    Now Playing
                  </div>
                </div>
                <button
                  onClick={(e) => toggleLike(e, currentSong)}
                  className={`ml-2 transition hover:scale-110 ${
                    likedSongsIds.has(currentSong.song_id)
                      ? "text-green-500"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={
                      likedSongsIds.has(currentSong.song_id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Music size={16} />
                </div>
                <span className="text-xs">Select a song to play...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-6">
              <button
                onClick={playPrev}
                className="text-white/60 hover:text-white transition hover:scale-110"
              >
                <SkipBack size={22} fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg hover:shadow-white/20"
              >
                {isPlaying ? (
                  <Pause size={22} fill="black" />
                ) : (
                  <Play size={22} fill="black" className="ml-1" />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-white/60 hover:text-white transition hover:scale-110"
              >
                <SkipForward size={22} fill="currentColor" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 w-1/3 hidden sm:flex">
            <Volume2 size={18} className="text-white/50" />
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer relative">
              <div
                className="h-full bg-white/80 group-hover:bg-indigo-400 transition-colors"
                style={{ width: `${volume * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {currentSong && (
          <div className="mt-2 flex items-center gap-2 text-xs text-white/40 font-mono w-full">
            <span>{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1 bg-white/10 rounded-full group">
              <div
                className="absolute h-full bg-indigo-500 rounded-full"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Add to Playlist</h3>
                <p className="text-sm text-white/50">
                  Choose a playlist for this song
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <button
                onClick={createPlaylist}
                className="w-full flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-indigo-400">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-white/70 group-hover:text-indigo-300">
                  Create New Playlist
                </span>
              </button>

              {data.myPlaylists.length > 0
                ? data.myPlaylists.map((pl) => (
                    <button
                      key={pl.playlist_id}
                      onClick={() => addToPlaylist(pl.playlist_id)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400">
                        <Music size={18} />
                      </div>
                      <span className="font-medium">{pl.name}</span>
                    </button>
                  ))
                : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function SectionHeader({ title }) {
  return (
    <div className="flex items-end justify-between mb-6 px-2">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function PlaylistCard({ title, subtitle, onClick, idx }) {
  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-pink-600 to-rose-600",
    "from-blue-600 to-cyan-600",
    "from-amber-600 to-orange-700",
    "from-emerald-600 to-teal-700",
  ];
  return (
    <div
      onClick={onClick}
      className="bg-white/5 border border-white/5 p-4 rounded-3xl hover:bg-white/10 transition duration-300 cursor-pointer group relative overflow-hidden hover:-translate-y-1"
    >
      <div
        className={`relative w-full aspect-square bg-gradient-to-br ${
          gradients[idx % gradients.length]
        } rounded-2xl mb-4 shadow-lg flex items-center justify-center group-hover:shadow-indigo-500/20`}
      >
        <Music className="text-white/40 w-1/2 h-1/2" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="bg-white text-black rounded-full p-3 shadow-xl scale-90 group-hover:scale-100 transition transform">
            <Play size={24} fill="black" className="ml-1" />
          </div>
        </div>
      </div>
      <div className="font-bold truncate px-1">{title}</div>
      <div className="text-sm text-white/40 px-1">{subtitle}</div>
    </div>
  );
}
