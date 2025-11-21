import React, { useState, useRef, useEffect } from "react";
import GradientMesh from "../components/GradientMesh";
import {
  Music,
  ArrowRight,
  Menu,
  Sparkles,
  Headphones,
  ShieldCheck,
  Globe,
  Code,
  Download,
  Earth,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import MobileNav from "../components/MobileNav";
import Stats from "../components/Stats";
import ThemeToggle from "../components/ThemeToggle";

const uploadedPdfPath = "/home/ubuntu/MusicLane-print.pdf";

//dummy data will fetch this through api.
const DEMO_SONGS = [
  {
    id: 1,
    title: "Midnight",
    artist: "Lunar Drift",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    title: "Cyberpunk",
    artist: "Neon Grid",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Focus",
    artist: "Mindset",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-orange-500 to-pink-500",
  },
  {
    id: 4,
    title: "Solar",
    artist: "Orbit",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    color: "from-blue-500 to-teal-500",
  },
  {
    id: 5,
    title: "Lost",
    artist: "Analog Soul",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    color: "from-rose-500 to-red-500",
  },
  {
    id: 6,
    title: "Void",
    artist: "Null Pointer",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    color: "from-slate-500 to-zinc-500",
  },
];

export default function Landing() {
  const [open, setOpen] = useState(false);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((e) => console.log("Playback failed", e));
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current.src = song.url;
      audioRef.current.play().catch((e) => console.log("Playback failed", e));
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white selection:bg-indigo-500/30">
      <GradientMesh />
      <MobileNav open={open} onClose={() => setOpen(false)} />

      {}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-10 py-4 border-b border-white/[0.05] bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
              <Music className="text-indigo-400" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">MusicLane</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-transform hover:scale-105"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setOpen(true)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {}
      <header className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide uppercase mb-4">
            <Earth size={12} /> The Project is Open Source.
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Your Music. <br />
            <span className="text-gradient-primary">Unbounded.</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Experience a blazing-fast, ad-free, community-powered platform.
            Beautiful UI, instant playback, and purely legal sourcing.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Start Listening <ArrowRight size={18} />
            </Link>
            <a
              href={encodeURI(uploadedPdfPath)}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 glass glass-hover rounded-full text-zinc-300 font-medium flex items-center justify-center gap-2"
            >
              View Brief
            </a>
          </div>
        </div>

        {}
        <div className="mt-24 w-full max-w-6xl animate-fade-in-up delay-300 px-4">
          <div className="flex items-center justify-center mb-12">
            <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-200">
              <BarChart3 className="text-indigo-400" size={18} /> Trending Now
            </h3>
          </div>

          {}
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 pb-12">
            {DEMO_SONGS.map((song, index) => (
              <div
                key={song.id}
                className={`transition-transform duration-500 ${
                  index % 2 !== 0 ? "translate-y-8" : ""
                }`}
              >
                <MusicTile
                  song={song}
                  isPlaying={isPlaying && currentSong?.id === song.id}
                  onPlay={() => handlePlay(song)}
                />
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mt-24 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          <FeaturePill
            icon={<Sparkles />}
            title="Free Music"
            desc="Freely available music all over the internet."
          />
          <FeaturePill
            icon={<Headphones />}
            title="Instant Play"
            desc="Zero buffering, 320kbps audio"
          />
          <FeaturePill
            icon={<ShieldCheck />}
            title="Ad-Free"
            desc="No interruptions, ever."
          />
        </div>
      </header>

      {}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Engineered for Sound
            </h2>
            <p className="text-zinc-400 max-w-xl">
              We stripped away the clutter to focus on what matters: the music
              and the code behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <BentoCard
              icon={<Globe className="text-indigo-400" />}
              title="Global Sourcing"
              content="Automated scrapers aggregate free & legal audio from public domain libraries worldwide."
              delay="delay-100"
            />
            <BentoCard
              icon={<Download className="text-indigo-400" />}
              title="Smart Caching"
              content="Intelligent pre-fetching validates and normalizes URLs so you never hit a dead link."
              delay="delay-200"
            />
            <BentoCard
              icon={<Code className="text-indigo-400" />}
              title="Open API"
              content="Built for developers. Interact with our modular React & Express architecture easily."
              delay="delay-300"
            />
          </div>
        </div>
      </section>

      {}
      <section className="py-24 border-t border-white/[0.05] bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold">Scale & Performance</h3>
            <p className="text-zinc-400 leading-relaxed">
              Real-time metrics showing our platform's growth. MusicLane is
              optimized for high concurrency and low latency.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Stats label="Tracks" value={5234} suffix="+" />
              <Stats label="Playlists" value={1240} />
              <Stats label="Users" value={892} />
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="glass p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-zinc-400 text-sm font-medium mb-1">
                    Current Load
                  </div>
                  <div className="text-2xl font-bold font-mono">98.2%</div>
                </div>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-green-400 font-medium">
                    System Operational
                  </span>
                </div>
              </div>

              <div className="h-32 w-full flex items-end gap-1">
                {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95, 55, 80].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 bg-gradient-to-t from-indigo-500/50 to-indigo-400/80 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    ></div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <footer className="py-12 border-t border-white/[0.05] text-center">
        <div className="text-zinc-500 text-sm mb-4">
          Built by <span className="text-zinc-300">Ashutosh Vishwakarma</span>
        </div>
        <div className="flex justify-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

//Additional helper components

function FeaturePill({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 glass p-4 rounded-2xl transition-transform hover:scale-[1.02]">
      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="text-left">
        <div className="font-semibold text-sm text-zinc-200">{title}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}

function MusicTile({ song, isPlaying, onPlay }) {
  return (
    <div
      onClick={onPlay}
      className="group relative w-full aspect-square rounded-2xl cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 ring-1 ring-white/10 hover:ring-white/30"
    >
      {}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${song.color} opacity-70 group-hover:opacity-90 transition-opacity duration-500`}
      ></div>

      {}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

      {}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        {}
        <div className="self-end h-4">
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-full">
              <span
                className="w-0.5 bg-white animate-[bounce_1s_infinite] rounded-full"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-0.5 bg-white animate-[bounce_1.2s_infinite] rounded-full"
                style={{ animationDelay: "100ms" }}
              ></span>
              <span
                className="w-0.5 bg-white animate-[bounce_0.8s_infinite] rounded-full"
                style={{ animationDelay: "200ms" }}
              ></span>
            </div>
          )}
        </div>

        {}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          }`}
        >
          {}
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg">
            {isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
          </button>
        </div>

        {}
        <div className="z-10">
          <h4 className="font-bold text-sm leading-tight mb-0.5 drop-shadow-md truncate">
            {song.title}
          </h4>
          <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider truncate">
            {song.artist}
          </p>
        </div>
      </div>
    </div>
  );
}

function BentoCard({ icon, title, content, delay }) {
  return (
    <div
      className={`glass glass-hover p-8 rounded-3xl flex flex-col gap-4 animate-fade-in-up ${delay}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-indigo-300 mb-2">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{content}</p>
    </div>
  );
}
