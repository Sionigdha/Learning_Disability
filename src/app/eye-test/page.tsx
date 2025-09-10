"use client";
import { useEffect, useState } from "react";

type Result = {
  trackingAccuracy: number;
  fixationSpeed: number;
  summary: string;
};

export default function EyeTestPage() {
  const [phase, setPhase] = useState<"menu" | "tracking" | "fixation" | "result">("menu");
  const [dotPos, setDotPos] = useState({ x: 100, y: 100 });
  const [mouseDist, setMouseDist] = useState<number[]>([]);
  const [fixationTimes, setFixationTimes] = useState<number[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [results, setResults] = useState<Result | null>(null);

  // Dot moves randomly
  useEffect(() => {
    if (phase !== "tracking") return;
    const interval = setInterval(() => {
      setDotPos({
        x: Math.random() * window.innerWidth * 0.8 + 50,
        y: Math.random() * window.innerHeight * 0.6 + 50,
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [phase]);

  // Mouse tracking for accuracy
  const handleMouseMove = (e: React.MouseEvent) => {
    if (phase === "tracking") {
      const dist = Math.sqrt(
        Math.pow(e.clientX - dotPos.x, 2) + Math.pow(e.clientY - dotPos.y, 2)
      );
      setMouseDist((prev) => [...prev, dist]);
    }
  };

  // Fixation test
  const startFixation = () => {
    let idx = 0;
    const letters = ["A", "B", "C", "D"];
    const run = () => {
      if (idx >= 5) {
        setPhase("result");
        return;
      }
      const chosen = letters[Math.floor(Math.random() * letters.length)];
      setTarget(chosen);
      const start = Date.now();

      setTimeout(() => {
        if (target) {
          setFixationTimes((prev) => [...prev, Date.now() - start]);
          setTarget(null);
          idx++;
          setTimeout(run, 1000);
        }
      }, 1200);
    };
    run();
  };

  const computeResults = () => {
    const avgDist = mouseDist.length
      ? mouseDist.reduce((a, b) => a + b, 0) / mouseDist.length
      : 0;
    const avgFix = fixationTimes.length
      ? fixationTimes.reduce((a, b) => a + b, 0) / fixationTimes.length
      : 0;

    let summary = "✅ Normal eye coordination.";
    if (avgDist > 150 || avgFix > 1200) {
      summary =
        "⚠️ Possible focus or tracking issue. Recommend further eye evaluation.";
    }

    setResults({
      trackingAccuracy: Math.round(100 - avgDist / 10),
      fixationSpeed: avgFix,
      summary,
    });
  };

  useEffect(() => {
    if (phase === "result") computeResults();
  }, [phase]);

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white"
      onMouseMove={handleMouseMove}
    >
      {phase === "menu" && (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-green-400">👁 Eye Testing Module</h1>
          <p className="text-gray-300">Check tracking, fixation, and coordination</p>
          <button
            onClick={() => setPhase("tracking")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg hover:shadow-green-500/50 transition"
          >
            ▶ Start Test
          </button>
        </div>
      )}

      {phase === "tracking" && (
        <div>
          <p className="mb-4 text-gray-300">Follow the glowing dot with your mouse (or eyes 👀)</p>
          <div
            className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg animate-pulse"
            style={{ position: "absolute", top: dotPos.y, left: dotPos.x }}
          />
          <button
            onClick={() => setPhase("fixation")}
            className="mt-20 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            ➡ Continue
          </button>
        </div>
      )}

      {phase === "fixation" && (
        <div className="text-center">
          <p className="text-gray-300">Tap the letter when it appears!</p>
          {target && (
            <button
              onClick={() => setTarget(null)}
              className="mt-8 px-8 py-6 text-3xl font-bold bg-purple-600 rounded-full hover:bg-purple-700"
            >
              {target}
            </button>
          )}
          {!target && (
            <button
              onClick={startFixation}
              className="mt-8 px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600"
            >
              ▶ Start Fixation Test
            </button>
          )}
        </div>
      )}

      {phase === "result" && results && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-blue-400">📊 Results</h2>
          <p>🎯 Tracking Accuracy: {results.trackingAccuracy}%</p>
          <p>⚡ Avg Fixation Speed: {Math.round(results.fixationSpeed)} ms</p>
          <p>{results.summary}</p>

          <button
            onClick={() => {
              setPhase("menu");
              setMouseDist([]);
              setFixationTimes([]);
            }}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl"
          >
            🔄 Restart
          </button>
        </div>
      )}
    </main>
  );
}
