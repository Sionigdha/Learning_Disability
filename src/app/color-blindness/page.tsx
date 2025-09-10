"use client";
import { useEffect, useState } from "react";

export default function ColorBlindnessTest() {
  const [plates, setPlates] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(7);
  const [finished, setFinished] = useState(false);

  // Fetch plates from API
  useEffect(() => {
    fetch("/api/color-blindness")
      .then((res) => res.json())
      .then((data) => setPlates(data.plates));
  }, []);

  // Timer
  useEffect(() => {
    if (!plates.length || finished) return;
    if (timeLeft === 0) handleNext();

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, plates]);

  // Save response + move to next
  const handleNext = () => {
    setResponses((prev) => [...prev, { plate: plates[current], answer }]);
    setAnswer("");
    setTimeLeft(7);

    if (current + 1 < plates.length) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  // Calculate result
  const getResult = () => {
    let correct = 0;
    let protanFails = 0,
      deutanFails = 0,
      tritanFails = 0;

    responses.forEach((r) => {
      if (r.answer.trim() === r.plate.answer) {
        correct++;
      } else {
        if (r.plate.answer === "29") protanFails++;
        if (["8", "5"].includes(r.plate.answer)) deutanFails++;
        if (r.plate.answer === "42") tritanFails++;
      }
    });

    const score = (correct / plates.length) * 100;

    let result = "Normal Color Vision";
    let type = "None";

    if (score < 80) {
      if (protanFails > deutanFails && protanFails > tritanFails) type = "Protan (Red)";
      else if (deutanFails > protanFails && deutanFails > tritanFails) type = "Deutan (Green)";
      else if (tritanFails > 0) type = "Tritan (Blue-Yellow)";
      result = `Possible ${type} Color Vision Deficiency`;
    }

    return { score: Math.round(score), result, type };
  };

  if (!plates.length) return <p className="text-white">Loading plates...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white p-6">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-gray-700">
        <h1 className="text-3xl font-extrabold text-green-400 mb-4 drop-shadow-lg">
          🎨 Color Blindness Test
        </h1>

        {!finished ? (
          <>
            <p className="mb-2 text-lg text-gray-300">
              Time left: <span className="text-yellow-400">{timeLeft}s</span>
            </p>

            <img
              src={plates[current].img}
              alt={`Plate ${current + 1}`}
              className="w-72 h-72 object-contain mx-auto rounded-xl shadow-lg border-2 border-gray-600 mb-4"
            />

            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter number"
              className="px-4 py-2 rounded-lg text-black w-40 text-center border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="mt-4">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg hover:shadow-green-500/50 transition transform hover:scale-105"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-400">✅ Test Finished</h2>
            <p className="text-lg">Score: {getResult().score}%</p>
            <p className="text-xl font-semibold text-yellow-300">
              Result: {getResult().result}
            </p>
            <p className="text-md text-gray-400">Type Detected: {getResult().type}</p>

            <button
              onClick={() => {
                setCurrent(0);
                setResponses([]);
                setFinished(false);
                setTimeLeft(7);
              }}
              className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 shadow-lg hover:shadow-purple-400/50 transition transform hover:scale-105"
            >
              🔄 Restart Test
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
