"use client";

import React from "react";
import { motion } from "framer-motion";

interface MatchProps {
  battingTeam: string;
  bowlingTeam: string;
  score: string;
  overs: string;
  winProb: {
    teamA: number;
    teamB: number;
  };
  lastSix: string[];
  status?: string;
}

export default function MatchCard({ battingTeam, bowlingTeam, score, overs, winProb, lastSix, status }: MatchProps) {
  return (
    <div className="glass p-6 rounded-3xl border-l-4 border-l-neon-green relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-block px-2 py-0.5 bg-neon-green text-black text-[10px] font-black uppercase rounded mb-2">
            {status || "Live Now"}
          </span>
          <h2 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
            {battingTeam} <span className="text-xl text-white/30 not-italic font-medium">vs</span> {bowlingTeam}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-neon-green italic">{score}</div>
          <div className="text-sm font-mono text-white/50">{overs} Overs</div>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {(lastSix.length > 0 ? lastSix : ["-", "-", "-", "-", "-", "-"]).map((ball, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border ${
              ball === "W" ? "bg-neon-red border-neon-red text-white" :
              ball === "4" || ball === "6" ? "bg-neon-green border-neon-green text-black" :
              "border-white/20 text-white/60"
            }`}
          >
            {ball === "-" ? "" : ball}
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
          <span>Win Probability</span>
          <span className="text-neon-green">Live Feed Updated</span>
        </div>
        <div className="h-4 bg-white/5 rounded-full flex overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${winProb.teamA}%` }}
            className="h-full bg-neon-green shadow-[0_0_15px_rgba(204,255,0,0.5)]"
          />
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${winProb.teamB}%` }}
            className="h-full bg-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.5)]"
          />
        </div>
        <div className="flex justify-between font-black italic text-sm">
          <span className="text-neon-green">{winProb.teamA}% {battingTeam}</span>
          <span className="text-neon-blue">{winProb.teamB}% {bowlingTeam}</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-white/5 rounded-tr-3xl pointer-events-none" />
    </div>
  );
}
