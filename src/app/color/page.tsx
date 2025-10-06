"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type Plate = { src: string; answer: string };

const plates: Plate[] = [
  { src: "/plates/5.png", answer: "5" },
  { src: "/plates/8.png", answer: "8" },
  { src: "/plates/12.png", answer: "12" },
  { src: "/plates/29.png", answer: "29" },
  { src: "/plates/42.png", answer: "42" },
];

export default function ColorBlindnessTest(): JSX.Element {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);

  // Countdown logic
  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const handleNext = (): void => {
    const correct = plates[step].answer === input.trim();
    const resultText = correct ? "✅ Correct" : "❌ Wrong";
    setResults((r) => [...r, resultText]);

    setFeedback(
      correct
        ? "🌈 Great job! Your color perception seems normal for this plate."
        : "👀 Hmm, you might be having difficulty distinguishing certain colors here."
    );

    setInput("");
    if (step + 1 < plates.length) {
      setStep((s) => s + 1);
      setTimeLeft(7);
    } else {
      setFinished(true);
    }
  };

  const computeSummary = () => {
    const wrongCount = results.filter((r) => r.includes("❌")).length;
    if (wrongCount === 0) return "✅ Excellent! No color vision issues detected.";
    if (wrongCount <= 2) return "⚠️ Slight inconsistency found. Possibly mild color confusion.";
    return "🚨 Multiple mistakes detected. A detailed color vision test is recommended.";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-xl text-center border border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-blue-500/20 blur-3xl -z-10" />

        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-6 drop-shadow-lg">
          🎨 AI Color Blindness Test
        </h1>

        {!finished ? (
          <>
            {/* Progress Timer Bar */}
            <div className="w-full bg-gray-800 h-2 rounded-full mb-4 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-pink-500 to-blue-500 transition-all"
                style={{ width: `${(timeLeft / 7) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">⏳ Time left: {timeLeft}s</p>

            {/* Ishihara Plate */}
            <Image
              src={plates[step].src}
              alt={`Plate ${step + 1}`}
              width={300}
              height={300}
              className="mx-auto rounded-lg shadow-lg border border-gray-700 mb-6"
            />

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter the number you see"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg text-center bg-gray-800 text-white focus:ring-2 focus:ring-pink-500 outline-none mb-4"
            />

            {/* Buttons */}
            <button
              onClick={handleNext}
              disabled={!input && timeLeft > 0}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 shadow-lg transition disabled:opacity-50"
            >
              {step === plates.length - 1 ? "Finish" : "Next"}
            </button>

            {/* Feedback */}
            {feedback && (
              <p className="mt-4 text-sm font-medium text-gray-300 animate-fade-in">{feedback}</p>
            )}

            <p className="mt-4 text-center text-sm text-gray-500">
              Plate {step + 1} of {plates.length}
            </p>
          </>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <h2 className="text-xl font-bold text-green-400 mb-2">✅ Test Completed</h2>

            {/* Results List */}
            <ul className="space-y-2 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-gray-700 text-gray-300">
              {results.map((res, i) => (
                <li key={i}>
                  Plate {i + 1}: {res}
                </li>
              ))}
            </ul>

            {/* Summary Report */}
            <div className="p-5 mt-4 bg-gray-800/40 rounded-xl shadow-inner border border-gray-700 text-gray-200">
              <h3 className="text-lg font-semibold mb-2">🧠 Test Report</h3>
              <p className="text-sm leading-relaxed">{computeSummary()}</p>
            </div>

            <button
              onClick={() => {
                setStep(0);
                setInput("");
                setResults([]);
                setFinished(false);
                setFeedback("");
                setTimeLeft(7);
              }}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:scale-105 shadow-lg transition"
            >
              🔄 Restart Test
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
