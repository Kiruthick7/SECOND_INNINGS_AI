"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, User, Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Live", href: "/", icon: Zap },
    { name: "Global", href: "/leaderboard", icon: Trophy },
    { name: "Me", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass rounded-full p-2 flex items-center justify-around z-50 shadow-2xl border-white/10">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              isActive 
                ? "bg-neon-green text-black font-black italic scale-105 shadow-[0_0_20px_rgba(204,255,0,0.4)]" 
                : "text-white/40 hover:text-white/80"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isActive && <span className="text-sm uppercase tracking-tighter">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
