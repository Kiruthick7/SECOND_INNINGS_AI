"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

interface LeaderboardProps {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardItem({ rank, name, xp, streak, isCurrentUser }: LeaderboardProps) {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: rank * 0.1 }}
      className={`glass flex items-center p-4 rounded-2xl border transition-all ${
        isCurrentUser ? "border-neon-green/50 bg-neon-green/5" : "border-white/5"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center font-black text-xl italic text-white/20 mr-4">
        #{rank}
      </div>
      
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mr-4 overflow-hidden">
        {rank === 1 ? <Award className="w-6 h-6 text-yellow-400" /> : <div className="text-white/40 font-bold">{name[0]}</div>}
      </div>

      <div className="flex-1">
        <h4 className={`font-black italic ${isCurrentUser ? "text-neon-green" : "text-white"}`}>
          {name} {isCurrentUser && "(You)"}
        </h4>
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-white/40">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-neon-green" />
            {streak} Streak
          </span>
          <span>•</span>
          <span>Level {Math.floor(xp / 1000) + 1}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xl font-black italic">{xp.toLocaleString()}</div>
        <div className="text-[10px] font-bold text-white/30 uppercase">Total XP</div>
      </div>
    </motion.div>
  );
}
