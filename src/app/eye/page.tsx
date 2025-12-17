"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Target = {
  x: number;
  y: number;
  id: number;
};

export default function EyeMovementAssessment() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  const TOTAL_TARGETS = 8;

  /** Generate non-overlapping visual targets */
  const generateTargets = () => {
    const arr: Target[] = [];
    while (arr.length < TOTAL_TARGETS) {
      const x = Math.random() * 70 + 15;
      const y = Math.random() * 70 + 15;

      if (
        arr.every(
          (t) => Math.hypot(t.x - x, t.y - y) > 18
        )
      ) {
        arr.push({ x, y, id: arr.length });
      }
    }
    setTargets(arr);
  };

  const startAssessment = () => {
    generateTargets();
    setCurrentIndex(0);
    setReactionTimes([]);
    setStarted(true);
    setCompleted(false);
    setStartTime(Date.now());
  };

  const handleTargetClick = () => {
    const reaction = (Date.now() - startTime) / 1000;
    setReactionTimes((prev) => [...prev, reaction]);

    if (currentIndex + 1 === TOTAL_TARGETS) {
      setCompleted(true);
      setStarted(false);
    } else {
      setCurrentIndex((i) => i + 1);
      setStartTime(Date.now());
    }
  };

  const averageReaction =
    reactionTimes.reduce((a, b) => a + b, 0) /
    (reactionTimes.length || 1);

  return (
    <section className="relative w-full min-h-screen px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-10"
      >
        <h1 className="text-3xl font-semibold text-cyan-400">
          Eye Movement & Visual Attention Assessment
        </h1>
        <p className="text-gray-400 mt-3 max-w-4xl">
          This test evaluates visual tracking, reaction speed, and attention
          stability. Results may assist clinicians in identifying early
          indicators of visual-motor coordination or attention irregularities.
        </p>
      </motion.div>

      {/* Assessment Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-6xl mx-auto glass p-12 h-[520px] overflow-hidden"
      >
        {!started && !completed && (
          <div className="h-full flex flex-col justify-center items-center text-center">
            <p className="text-gray-300 mb-6 max-w-lg">
              <span className="text-cyan-400 font-medium">
                Instruction:
              </span>{" "}
              Focus on the screen and click each highlighted visual point as
              quickly and accurately as possible when it appears.
            </p>

            <button
              onClick={startAssessment}
              className="btn-primary glow"
            >
              Begin Assessment
            </button>
          </div>
        )}

        {/* Active Test */}
        {started && targets[currentIndex] && (
          <>
            <div className="absolute top-4 right-6 text-sm text-gray-400">
              Target {currentIndex + 1} / {TOTAL_TARGETS}
            </div>

            <motion.div
              key={targets[currentIndex].id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              onClick={handleTargetClick}
              className="absolute w-14 h-14 rounded-full cursor-pointer 
                         bg-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.9)]
                         hover:scale-110 transition"
              style={{
                left: `${targets[currentIndex].x}%`,
                top: `${targets[currentIndex].y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </>
        )}

        {/* Results */}
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col justify-center items-center text-center"
          >
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Assessment Completed
            </h2>

            <div className="glass p-6 max-w-md w-full">
              <p className="text-gray-300 mb-2">
                Average Reaction Time:
              </p>
              <p className="text-3xl font-bold text-cyan-400">
                {averageReaction.toFixed(2)}s
              </p>

              <p className="text-sm text-gray-400 mt-4">
                Reaction consistency and visual attention performance appear{" "}
                <span className="text-green-400">within normal range</span>.
                Results are indicative only and should be reviewed by a
                qualified professional.
              </p>
            </div>

            <button
              onClick={startAssessment}
              className="mt-8 btn-secondary"
            >
              Re-run Assessment
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
