"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Plate = {
  src: string;
  answer: string;
};

const plates: Plate[] = [
  { src: "/plates/5.png", answer: "5" },
  { src: "/plates/8.png", answer: "8" },
  { src: "/plates/12.png", answer: "12" },
  { src: "/plates/29.png", answer: "29" },
  { src: "/plates/42.png", answer: "42" },
];

export default function ColorBlindnessTest(): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [finished, setFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(7);

  // 🕓 Countdown logic
  useEffect(() => {
    if (finished) return;

    if (timeLeft === 0) {
      handleNext(); // auto-submit when timer runs out
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const handleNext = (): void => {
    const correct = plates[step].answer === input.trim();
    setResults((prev) => [...prev, correct ? "✅ Correct" : "❌ Wrong"]);
    setInput("");

    if (step + 1 < plates.length) {
      setStep((prev) => prev + 1);
      setTimeLeft(7);
    } else {
      setFinished(true);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
          🎨 Color Blindness Test
        </h1>

        {!finished ? (
          <>
            {/* ⏳ Timer Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-pink-500 to-blue-500 transition-all"
                style={{ width: `${(timeLeft / 7) * 100}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">⏳ Time left: {timeLeft}s</p>

            {/* 🖼️ Ishihara Plate */}
            <Image
              src={plates[step].src}
              alt={`Plate ${step + 1}`}
              width={300}
              height={300}
              className="mx-auto rounded-lg shadow-lg border border-gray-200 mb-6"
            />

            {/* ✏️ Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter the number you see"
              className="w-full px-4 py-2 border rounded-lg text-center focus:ring-2 focus:ring-pink-400 outline-none mb-4"
            />

            {/* 🖱️ Buttons */}
            <button
              onClick={handleNext}
              disabled={!input && timeLeft > 0}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {step === plates.length - 1 ? "Finish" : "Next"}
            </button>
          </>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              ✅ Test Completed
            </h2>
            <ul className="space-y-2">
              {results.map((res, i) => (
                <li key={i} className="text-gray-700">
                  Plate {i + 1}: {res}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
