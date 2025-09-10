"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const router = useRouter();

  useEffect(() => {
    const handle = (e: MouseEvent) =>
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("✅ Registered successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else setError(data.message || "Registration failed");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen relative"
      style={{
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, #dbeafe, #f3e8ff, #fae8ff)`,
      }}
    >
      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text mb-6">
          📝 Register for Learning AI
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition"
          >
            Register
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-3">{success}</p>}
      </div>
    </main>
  );
}
