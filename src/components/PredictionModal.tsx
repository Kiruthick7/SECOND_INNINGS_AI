"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, ChevronRight, Zap, Loader2 } from "lucide-react";
import { recordPrediction } from "@/lib/db";

interface PredictionOption {
  id: string;
  label: string;
  odds: string;
}

interface PredictionProps {
  question: string;
  options: PredictionOption[];
  xpReward: number;
}

export default function PredictionModal({ question, options, xpReward }: PredictionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const userId = "demo_fan_123";
      await recordPrediction(userId, {
        question,
        selectedOptionId: selected,
        xpReward,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to lock in prediction. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-neon-green/20 rounded-lg">
          <Zap className="w-5 h-5 text-neon-green" />
        </div>
        <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Live Prediction</span>
      </div>

      <h3 className="text-xl font-black italic mb-6 leading-tight">
        {question}
      </h3>

      <div className="grid gap-3 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => !submitted && !loading && setSelected(option.id)}
            disabled={submitted || loading}
            className={`flex justify-between items-center p-4 rounded-2xl transition-all border ${
              selected === option.id
                ? "bg-neon-green border-neon-green text-black"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            } ${submitted && selected !== option.id ? "opacity-50" : ""}`}
          >
            <span className="font-bold">{option.label}</span>
            <span className={`font-mono text-xs ${selected === option.id ? "text-black/60" : "text-white/40"}`}>
              {option.odds}
            </span>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-neon-green transition-colors disabled:opacity-30"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Prediction"}
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full py-4 bg-neon-green/10 border border-neon-green/30 text-neon-green font-bold rounded-2xl flex items-center justify-center gap-3"
        >
          <Coins className="w-5 h-5" />
          Locked In! Potential +{xpReward} XP
        </motion.div>
      )}

      {/* Hover Background Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
