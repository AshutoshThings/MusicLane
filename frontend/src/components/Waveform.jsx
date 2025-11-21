import React from "react";

export default function Waveform({ color = "255, 99, 255" }) {
  return (
    <div className="w-full h-full pointer-events-none">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-20"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(139,92,246,0.12)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.08)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.12)" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        {/* multiple waved paths with animation */}
        <g filter="url(#blur)">
          <path
            fill="none"
            stroke="url(#g1)"
            strokeWidth="4"
            strokeLinecap="round"
            d="M0,500 C200,420 400,580 600,520 C800,460 1000,580 1200,520 C1400,460 1600,520"
            className="wave-anim1"
          />
          <path
            fill="none"
            stroke="rgba(99,102,241,0.06)"
            strokeWidth="6"
            d="M0,540 C200,480 400,620 600,560 C800,500 1000,620 1200,560 C1400,500 1600,560"
            className="wave-anim2"
          />
        </g>
      </svg>
    </div>
  );
}
