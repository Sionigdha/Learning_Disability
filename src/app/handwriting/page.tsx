"use client";
import { useState } from "react";

export default function HandwritingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload a handwriting sample first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/handwriting", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("📩 API response:", data);
      setAnalysis(data);
    } catch (err) {
      console.error("🚨 Upload failed:", err);
      setAnalysis({ error: "❌ Error analyzing handwriting" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-2xl text-center border border-white/20">
        <h1 className="text-3xl font-extrabold text-white mb-6">✍️ Handwriting Analysis</h1>
        <p className="text-gray-300 mb-6">Upload a handwriting sample (JPG/PNG, ≤10MB) for AI analysis.</p>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                     file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white 
                     hover:file:bg-green-700 mb-6"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto mb-6 max-h-64 rounded-lg shadow-lg border border-white/20"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 
                     hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {analysis && (
  <div className="mt-8 text-left bg-black/30 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-inner text-gray-200 space-y-3">
    <h2 className="text-xl font-bold text-green-400 mb-3">📊 Analysis Results</h2>
    {analysis.error ? (
      <p>{analysis.error}</p>
    ) : (
      <>
        <p>📝 <b>Transcription:</b> {analysis.transcription || "N/A"}</p>
        <p>🏷 <b>Issue Category:</b> {analysis.issue_category}</p>
        <p>⚠️ <b>Risk Level:</b> {analysis.risk_level}</p>
        <p>🛠 <b>Improvement Areas:</b> {analysis.improvement_areas?.join(", ") || "None"}</p>
        <p>📌 <b>Summary:</b> {analysis.summary}</p>
      </>
    )}
  </div>
)}

         
      </div>
    </main>
  );
}
