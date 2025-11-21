import React, { useEffect, useRef } from "react";

export default function Stats({ label, value = 0, suffix = "" }) {
  const ref = useRef();

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end)) || 20;
    let current = start;

    const timer = setInterval(() => {
      current += Math.max(1, Math.round(end / (duration / stepTime)));
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      if (ref.current)
        ref.current.textContent = `${current.toLocaleString()}${suffix}`;
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, suffix]);

  return (
    <div className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-center backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
      <div
        className="text-3xl font-bold tracking-tight text-white mb-1"
        ref={ref}
      >
        0{suffix}
      </div>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
