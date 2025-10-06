"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(token);
      const email = parsed.email || parsed.user || parsed.username || "";
      setUser(getFirstName(email));
    } catch {
      setUser(getFirstName(token));
    }
  }, [router]);

  function getFirstName(identifier: string) {
    if (!identifier) return "User";
    if (identifier.includes("@")) return identifier.split("@")[0];
    return identifier.split(" ")[0];
  }

  const quickActions = [
    {
      label: "✍️ Handwriting Test",
      href: "/handwriting",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "🎤 Speech Test",
      href: "/speech",
      color: "from-green-400 to-green-600",
    },
    {
      label: "👁 Eye Test",
      href: "/eye",
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "🎨 Color Blindness Test",
      href: "/color",
      color: "from-pink-400 to-pink-600",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-3xl text-center border border-white/20">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-3 drop-shadow-lg">
          📊 Dashboard
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          Welcome, <span className="text-green-400 font-semibold">{user || "Loading..."}</span> 🎉
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {quickActions.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className={`relative group overflow-hidden p-6 text-lg font-semibold text-white rounded-xl bg-gradient-to-r ${item.color} transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl`}
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-10 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 shadow-md hover:shadow-xl transition-all hover:scale-105"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
