"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handle = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen text-gray-800 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #e0f2fe, #ede9fe, #fdf2f8)`,
      }}
    >
      <div className="bg-white/20 backdrop-blur-xl shadow-xl rounded-2xl p-12 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
          🚀 Welcome to Learning AI
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your AI-enabled disability detection assistant
        </p>
        <a
          href="/chat"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
        >
          Go to Chatbot 💬
        </a>
      </div>
    </main>
  );
}
