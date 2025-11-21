import React from "react";
import { X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileNav({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-30 transform ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-black/90 to-black/80 p-6 backdrop-blur-md border-l border-white/6">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold">MusicLane</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white/6">
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <LogIn /> Login
          </Link>
          <Link
            to="/signup"
            onClick={onClose}
            className="px-3 py-2 bg-indigo-600 rounded-md text-center"
          >
            Get Started
          </Link>
        </nav>
      </aside>
    </div>
  );
}
