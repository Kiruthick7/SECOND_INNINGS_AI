"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Star, Award, Shield, Zap, TrendingUp, ChevronRight } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-green to-neon-blue p-1">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-3xl font-black italic">K</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-neon-green text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-lg">
            PRO
          </div>
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter">KIRUTHICK</h2>
        <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase tracking-widest mt-1">
          <span>Level 14</span>
          <span>•</span>
          <span>Elite Predictor</span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-3xl border-l-4 border-l-orange-500">
          <Flame className="w-6 h-6 text-orange-500 mb-2" />
          <div className="text-2xl font-black italic">15</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Day Streak</div>
        </div>
        <div className="glass p-6 rounded-3xl border-l-4 border-l-neon-green">
          <Zap className="w-6 h-6 text-neon-green mb-2" />
          <div className="text-2xl font-black italic">9,850</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total XP</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Achievements</h3>
        <div className="space-y-3">
          {[
            { icon: Award, title: "Momentum Seer", desc: "Predicted 5 momentum shifts correctly", color: "text-yellow-400" },
            { icon: Shield, title: "Loyal Fan", desc: "Maintained a 10-day streak", color: "text-neon-blue" },
            { icon: Star, title: "Six Sense", desc: "Predicted a boundary over", color: "text-neon-green" },
          ].map((badge, i) => (
            <motion.div 
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-4 rounded-2xl flex items-center gap-4 border border-white/5"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${badge.color}`}>
                <badge.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm italic">{badge.title}</h4>
                <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{badge.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-neon-green/10 to-transparent">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-black italic text-lg text-neon-green">XP BOOSTER</h4>
            <p className="text-xs text-white/60">Invite friends to earn 2x XP for 1 hour</p>
          </div>
          <TrendingUp className="w-6 h-6 text-neon-green" />
        </div>
        <button className="w-full py-3 bg-neon-green text-black font-black uppercase text-xs rounded-xl tracking-widest">
          Share Referral Link
        </button>
      </div>
    </div>
  );
}
