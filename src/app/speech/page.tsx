"use client";
import { useState, useRef } from "react";

export default function SpeechPage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    // ✅ Browser + API check
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      alert("⚠️ Your browser does not support microphone recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        chunks.current = [];

        setAudioURL(URL.createObjectURL(blob));

        const formData = new FormData();
        formData.append("file", blob, "speech.wav");

        fetch("/api/speech", { method: "POST", body: formData })
          .then(async (res) => {
            const data = await res.json();
            console.log("📩 API raw response:", data);

            if (data.success) {
              let parsedAnalysis: any = {};
              try {
                parsedAnalysis = JSON.parse(data.analysis);
              } catch {
                parsedAnalysis = { summary: data.analysis };
              }
              setAnalysis({
                transcription: data.transcription,
                ...parsedAnalysis,
                model: data.model || "unknown",
              });
            } else {
              setAnalysis({ summary: "❌ Error analyzing speech" });
            }
          })
          .catch((err) => {
            console.error("🚨 Fetch /api/speech failed:", err);
            setAnalysis({ summary: "❌ Network or server error" });
          });
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("🚨 Error accessing microphone:", err);
      alert("🚨 Could not access microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-2xl text-center border border-white/20">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-6 drop-shadow-lg">
          🎤 AI Speech Analysis
        </h1>
        <p className="text-gray-300 mb-8">
          Record your voice and let AI analyze fluency, pronunciation, and speed.
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
            ⏺ Start
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

        {/* Audio player */}
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
            <h2 className="text-xl font-bold text-green-400 mb-3">📊 Analysis Results</h2>
            <p>📝 <b>Transcription:</b> {analysis.transcription || "N/A"}</p>
            <p>🧠 <b>Fluency:</b> {analysis.fluency_score || "N/A"}</p>
            <p>🔊 <b>Pronunciation Issues:</b> {analysis.pronunciation_issues?.join(", ") || "None"}</p>
            <p>⚡ <b>Speed:</b> {analysis.speed || "N/A"}</p>
            <p>👶 <b>Estimated Verbal Age:</b> {analysis.estimated_verbal_age || "N/A"}</p>
            <p>🤖 <b>Model Used:</b> {analysis.model}</p>
            <p className="mt-2">📌 <b>Summary:</b> {analysis.summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
