"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate?: string;
  isMatchFinished: boolean;
}

export default function CountdownTimer({ targetDate, isMatchFinished }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let target: Date;

      if (isMatchFinished) {
        const matchDateObj = new Date(targetDate || "");
        const isTodayMatch = matchDateObj.toDateString() === now.toDateString();

        if (isTodayMatch) {
          setTimeLeft(null);
          return;
        }

        const startOfTimer = new Date();
        startOfTimer.setHours(0, 30, 0, 0);

        const endOfTimer = new Date();
        endOfTimer.setHours(8, 0, 0, 0);

        if (now < startOfTimer || now > endOfTimer) {
          setTimeLeft(null);
          return;
        }

        target = endOfTimer;
        setLabel("Next Schedule Update");
      } else if (targetDate) {
        target = new Date(targetDate);

        if (now > target) {
          setTimeLeft(null);
          return;
        }

        setLabel("Match Starts In");
      } else {
        setTimeLeft(null);
        return;
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isMatchFinished]);

  if (!timeLeft) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{label}</div>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black italic text-white leading-none">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-[8px] font-bold text-white/20 uppercase mt-1">Hrs</span>
          </div>
          <span className="text-xl font-black text-white/20 mb-2">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black italic text-white leading-none">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-[8px] font-bold text-white/20 uppercase mt-1">Min</span>
          </div>
          <span className="text-xl font-black text-white/20 mb-2">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black italic text-neon-green leading-none animate-pulse">{timeLeft.s.toString().padStart(2, '0')}</span>
            <span className="text-[8px] font-bold text-white/20 uppercase mt-1">Sec</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-right">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-neon-green animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
