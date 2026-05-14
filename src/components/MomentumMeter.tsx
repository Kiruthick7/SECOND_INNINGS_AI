"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

interface MomentumData {
  teamA: number;
  teamB: number;
  teamAName?: string;
  teamBName?: string;
  explanation: string;
  trend: "up" | "down" | "neutral";
}

export default function MomentumMeter({ data }: { data: MomentumData }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass p-6 rounded-3xl relative overflow-hidden">
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Match Momentum</span>
          <h3 className="text-2xl font-black italic flex items-center gap-2">
            AI MOMENTUM ENGINE
            <Zap className={`w-5 h-5 text-neon-green ${pulse ? 'animate-pulse' : ''}`} />
          </h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-neon-green font-mono text-xl">
            {data.trend === "up" ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6 text-neon-red" />}
            <span className={data.trend === "up" ? "text-neon-green" : "text-neon-red"}>
              {data.trend === "up" ? "+" : "-"}{Math.abs(data.teamA - data.teamB)}% Shift
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-24 flex items-center gap-1 mb-6">
        <div className="flex-1 h-12 bg-white/5 rounded-full relative overflow-hidden flex items-center px-4">
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${data.teamA}%` }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-green/80 to-neon-green shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            transition={{ type: "spring", stiffness: 50 }}
          />
          <span className="relative z-10 font-black italic text-lg mix-blend-difference">{data.teamAName || "TEAM A"}</span>
        </div>

        <div className="flex-1 h-12 bg-white/5 rounded-full relative overflow-hidden flex items-center justify-end px-4">
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${data.teamB}%` }}
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-neon-blue/80 to-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            transition={{ type: "spring", stiffness: 50 }}
          />
          <span className="relative z-10 font-black italic text-lg mix-blend-difference text-right">{data.teamBName || "TEAM B"}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={data.explanation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/5 p-4 rounded-xl border border-white/10"
        >
          <p className="text-sm text-white/80 leading-relaxed italic">
            &quot; {data.explanation} &quot;
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-green/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-blue/10 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
}
