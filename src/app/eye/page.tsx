"use client";

import { useEffect, useState } from "react";

interface Target {
  x: number;
  y: number;
  id: number;
}

interface Summary {
  averageTime: number;
  accuracy: number;
  feedback: string;
  level: string;
  driftClicks: number;
}

export default function EyeFocusBehaviorTest() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [driftClicks, setDriftClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const totalTargets = 10;

  // Generate targets with minimum distance between them
  const generateTargets = () => {
    const arr: Target[] = [];
    const minDistance = 20; // minimum distance in %

    const isFarEnough = (x: number, y: number) => {
      return arr.every((t) => {
        const dx = t.x - x;
        const dy = t.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance >= minDistance;
      });
    };

    let i = 0;
    while (i < totalTargets) {
      const x = Math.random() * 70 + 15; // leave some edge margin
      const y = Math.random() * 70 + 15;

      if (isFarEnough(x, y)) {
        arr.push({ x, y, id: i });
        i++;
      }
    }

    setTargets(arr);
  };

  useEffect(() => {
    generateTargets();
  }, []);

  // Timer countdown per target
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      handleMiss();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  // Detect clicks outside the target area
  useEffect(() => {
    if (!isRunning) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.classList.contains("target-dot")) return;
      setDriftClicks((prev) => prev + 1);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isRunning]);

  const startTest = () => {
    setIsRunning(true);
    setCurrent(0);
    setTimeLeft(10);
    setScore(0);
    setHits(0);
    setMisses(0);
    setDriftClicks(0);
    setReactionTimes([]);
    setFinished(false);
    setSummary(null);
    generateTargets(); // regenerate targets on each start
  };

  const handleClick = () => {
    const reactionTime = 10 - timeLeft;
    setReactionTimes((prev) => [...prev, reactionTime]);
    setHits((h) => h + 1);
    setScore((s) => s + Math.max(0, Math.round((10 - reactionTime) * 10)));
    nextTarget();
  };

  const handleMiss = () => {
    setMisses((m) => m + 1);
    setReactionTimes((prev) => [...prev, 10]);
    nextTarget();
  };

  const nextTarget = () => {
    if (current + 1 >= totalTargets) {
      finishTest();
    } else {
      setCurrent(current + 1);
      setTimeLeft(10);
    }
  };

  const finishTest = async () => {
    setIsRunning(false);
    setFinished(true);

    const res = await fetch("/api/eye", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hits,
        misses,
        driftClicks,
        reactionTimes,
        score,
      }),
    });

    const data = await res.json();
    setSummary(data);
  };

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-white text-center drop-shadow-lg">
        👁️ Eye & Focus Behavior Test
      </h1>

      {!isRunning && !finished && (
        <button
          onClick={startTest}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transition transform hover:scale-105"
        >
          Start Test
        </button>
      )}

      {isRunning && targets[current] && (
        <>
          <p className="text-lg mb-2 text-white">
            Target {current + 1} / {totalTargets}
          </p>
          <p className="text-gray-300 mb-3">⏱️ Time Left: {timeLeft}s</p>
          <p className="text-gray-200 mb-5">Score: {score}</p>

          <div
            onClick={handleClick}
            className="target-dot absolute w-16 h-16 bg-red-500 rounded-full cursor-pointer transition-transform shadow-2xl hover:scale-125"
            style={{
              top: `${targets[current].y}%`,
              left: `${targets[current].x}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}

      {finished && summary && (
        <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md text-center mt-4 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-3 text-green-400">
            ✅ Test Completed
          </h2>
          <p className="text-lg text-white mb-1">
            Final Score: <b>{score}</b>
          </p>
          <p className="text-white mb-1">
            Average Reaction Time: <b>{summary.averageTime.toFixed(2)}s</b>
          </p>
          <p className="text-white mb-1">
            Accuracy: <b>{summary.accuracy}%</b>
          </p>
          <p className="text-white mb-2">
            Distraction Clicks: <b>{summary.driftClicks}</b>
          </p>

          <div
            className={`mt-4 px-4 py-2 rounded-lg font-medium ${
              summary.level === "excellent"
                ? "bg-green-200 text-green-800"
                : summary.level === "good"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {summary.feedback}
          </div>

          <button
            onClick={startTest}
            className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
          >
            Retry Test
          </button>
        </div>
      )}
    </main>
  );
}
