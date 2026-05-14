import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Second Innings AI | Cricket Fan Engagement",
  description: "Experience the game like never before with AI-powered predictions and real-time momentum tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white overflow-x-hidden pb-24`}
      >
        <main className="max-w-2xl mx-auto px-4 pt-8">
          <header className="flex justify-between items-center mb-8 px-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black italic tracking-tighter text-neon-green">
                SECOND <span className="text-white">INNINGS AI</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">GCP Hackathon Edition</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
          </header>
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
