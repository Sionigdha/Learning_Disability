"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setUser("test@example.com"); // dummy user
    }

    // mouse move effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [router]);

  const quickActions = [
    { label: "💬 Chatbot", href: "/chat", color: "from-blue-400 to-blue-600" },
    { label: "✍️ Handwriting Test", href: "/handwriting", color: "from-yellow-400 to-yellow-600" },
    { label: "🎤 Speech Test", href: "/speech", color: "from-green-400 to-green-600" },
    { label: "👁 Eye Test", href: "/eye", color: "from-purple-400 to-purple-600" },
    {
      label: "🎨 Color Blindness Test",
      href: "/color",
      color: "from-pink-400 to-pink-600",
      wide: true,
    },
  ];

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden"
      style={{
        background: `radial-gradient(
          circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
          #e0f2fe,
          #ede9fe,
          #fdf2f8
        )`,
        transition: "background 0.2s ease-out",
      }}
    >
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-3xl text-center relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          📊 Dashboard
        </h1>
        <p className="mt-3 text-gray-600">
          Welcome, <span className="font-semibold">{user}</span> 🎉
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mt-10">
          {quickActions.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className={`p-6 text-lg font-medium text-white rounded-xl bg-gradient-to-r ${item.color} shadow-md hover:shadow-2xl transform transition-all ${item.wide ? "col-span-2" : ""}`}
              style={{
                transform: `perspective(800px) rotateX(${(mousePos.y - 0.5) * 10}deg) rotateY(${(mousePos.x - 0.5) * -10}deg)`,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-10 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md hover:shadow-xl transition-all"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
