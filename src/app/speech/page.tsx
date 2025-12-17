"use client";
import { useState, useRef } from "react";

export default function SpeechPage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // 🎙 Start recording
  const startRecording = async () => {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      alert("⚠ Your browser does not support microphone recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        chunks.current = [];

        setAudioURL(URL.createObjectURL(blob));

        const formData = new FormData();
        formData.append("file", blob, "speech.wav");

        try {
          const res = await fetch("/api/speech", { method: "POST", body: formData });
          const data = await res.json();

          console.log("📩 Gemini API response:", data);

          if (data.success) {
            setAnalysis({
              transcription: data.transcription,
              fluency_score: data.fluency_score,
              pronunciation_issues: data.pronunciation_issues,
              speed: data.speed,
              estimated_verbal_age: data.estimated_verbal_age,
              summary: data.summary,
              model: data.model,
            });
          } else {
            setAnalysis({ summary: "❌ Error analyzing speech" });
          }
        } catch (err) {
          console.error("🚨 API Error:", err);
          setAnalysis({ summary: "❌ Network or server error" });
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("🚨 Microphone error:", err);
      alert("🚨 Could not access microphone. Please check permissions and try again.");
    }
  };

  // ⏹ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-2xl text-center border border-white/20">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-6 drop-shadow-lg">
          🎤 AI Child Speech Analyzer
        </h1>
        <p className="text-gray-300 mb-8">
          Record your child’s voice and let AI detect fluency, clarity, and potential speech issues.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={startRecording}
            disabled={recording}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all transform 
              ${recording
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:scale-105 shadow-lg shadow-green-500/50 hover:shadow-green-400/70"}`}
          >
            ⏺ Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!recording}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all transform 
              ${!recording
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 hover:scale-105 shadow-lg shadow-red-500/50 hover:shadow-red-400/70"}`}
          >
            ⏹ Stop
          </button>
        </div>

        {/* Audio preview */}
        {audioURL && (
          <div className="mt-6">
            <audio
              controls
              src={audioURL}
              className="w-full rounded-lg shadow-md border border-white/20"
            />
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-8 text-left bg-black/30 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-inner text-gray-200 space-y-3">
            <h2 className="text-xl font-bold text-green-400 mb-3">📊 Speech Analysis Results</h2>
            <p>📝 <b>Transcription:</b> {analysis.transcription || "N/A"}</p>
            <p>🧠 <b>Fluency:</b> {analysis.fluency_score || "N/A"}</p>
            <p>🔊 <b>Pronunciation Issues:</b> {analysis.pronunciation_issues?.join(", ") || "None detected"}</p>
            <p>⚡ <b>Speed:</b> {analysis.speed || "N/A"}</p>
            <p>👶 <b>Estimated Verbal Age:</b> {analysis.estimated_verbal_age || "N/A"}</p>
            <p>🤖 <b>AI Model Used:</b> {analysis.model || "gemini-2.5-pro"}</p>
            <div className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-white/10 shadow-md">
              <p className="text-gray-100 leading-relaxed">
                📌 <b>Summary:</b> {analysis.summary || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
