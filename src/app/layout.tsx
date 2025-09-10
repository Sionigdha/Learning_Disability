import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 text-white p-4 flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/chat">Chatbot</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Login</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
