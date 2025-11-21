// src/components/GradientMesh.jsx
import React from "react";

export default function GradientMesh() {
  return (
    <div className="mesh-container pointer-events-none">
      <div className="mesh-blob mesh-1" />
      <div className="mesh-blob mesh-2" />
      <div className="mesh-blob mesh-3" />
      {}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
}
