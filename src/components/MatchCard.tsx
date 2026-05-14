"use client";

import React from "react";
import { motion } from "framer-motion";

interface TeamProps {
  name: string;
  score: string;
  overs: string;
  isBatting: boolean;
  isWinner: boolean;
}

interface MatchProps {
  teamA: TeamProps;
  teamB: TeamProps;
  winProb: {
    teamA: number;
    teamB: number;
  };
  lastSix: string[];
  status?: string;
  result?: string | null;
}

export default function MatchCard({ teamA, teamB, winProb, lastSix, status, result }: MatchProps) {
  const isPost = status?.toLowerCase() === "result" || !!result;

  return (
    <div className="glass p-6 rounded-3xl border-l-4 border-l-neon-green relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <span className={`px-2 py-0.5 text-black text-[10px] font-black uppercase rounded ${isPost ? "bg-neon-blue" : "bg-neon-green"}`}>
          {status || (isPost ? "Result" : "Live Now")}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-4">
        <div className={`flex-1 flex flex-col items-start ${teamA.isBatting ? "opacity-100 scale-105" : "opacity-60"} transition-all duration-500`}>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">
              {teamA.name}
            </h2>
            {teamA.isBatting && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-neon-green"
              />
            )}
          </div>
          <div className="text-3xl font-black text-neon-green italic leading-none mb-1">{teamA.score}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase">{teamA.overs} Overs</div>
        </div>

        <div className="px-8 text-xl font-black italic text-white/10 select-none">VS</div>

        <div className={`flex-1 flex flex-col items-end text-right ${teamB.isBatting ? "opacity-100 scale-105" : "opacity-60"} transition-all duration-500`}>
          <div className="flex items-center gap-3 mb-2">
            {teamB.isBatting && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-neon-blue"
              />
            )}
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">
              {teamB.name}
            </h2>
          </div>
          <div className="text-3xl font-black text-neon-blue italic leading-none mb-1">{teamB.score}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase">{teamB.overs} Overs</div>
        </div>
      </div>

      {result && (
        <div className="mb-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-center relative group">
          <div className="absolute inset-0 bg-neon-green/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs font-black italic text-neon-green tracking-[0.2em] uppercase relative z-10">
            {result}
          </span>
        </div>
      )}

      {!isPost && (
        <div className="flex justify-center gap-2 mb-8">
          {(lastSix.length > 0 ? lastSix : ["-", "-", "-", "-", "-", "-"]).map((ball, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${
                ball === "W" ? "bg-neon-red border-neon-red text-white shadow-[0_0_10px_rgba(255,50,50,0.3)]" :
                ball === "4" || ball === "6" ? "bg-neon-green border-neon-green text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]" :
                "border-white/10 bg-white/5 text-white/40"
              }`}
            >
              {ball === "-" ? "" : ball}
            </motion.div>
          ))}
        </div>
      )}

      <div className="space-y-3 px-2">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40">
          <span>{isPost ? "Final Probability Outcome" : "Live Win Probability"}</span>
          <span className="text-neon-green">Neural Engine Sync</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full flex overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${winProb.teamA}%` }}
            className="h-full bg-neon-green shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          />
          <motion.div
            initial={{ width: "50%" }}
            animate={{ width: `${winProb.teamB}%` }}
            className="h-full bg-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          />
        </div>
        <div className="flex justify-between font-black italic text-[11px] tracking-tight">
          <span className="text-neon-green">{winProb.teamA}% {teamA.name}</span>
          <span className="text-neon-blue">{winProb.teamB}% {teamB.name}</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-3xl pointer-events-none" />
    </div>
  );
}
