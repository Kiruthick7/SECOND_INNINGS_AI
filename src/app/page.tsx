"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import MomentumMeter from "@/components/MomentumMeter";
import PredictionModal from "@/components/PredictionModal";
import { motion } from "framer-motion";
import { fetchIPLData, MatchData } from "@/lib/api";

export default function Dashboard() {
  const [matchData, setMatchData] = useState<MatchData>({
    battingTeam: "IPL",
    bowlingTeam: "T20",
    score: "0/0",
    overs: "0.0",
    winProb: { teamA: 50, teamB: 50 },
    lastSix: ["-", "-", "-", "-", "-", "-"],
    status: "Loading..."
  });

  const [momentum] = useState({
    teamA: 45,
    teamB: 55,
    trend: "up" as "up" | "down" | "neutral"
  });

  const hasWicket = matchData.lastSix.includes("W");
  const currentTrend = hasWicket ? "down" as const : "up" as const;
  const explanation = `${matchData.battingTeam}'s momentum shifted significantly after the loss of Priyansh Arya (W). They are now rebuilding at ${matchData.score}.`;

  useEffect(() => {
    async function loadMatchData() {
      const data = await fetchIPLData();
      if (data) {
        setMatchData(data);
      }
    }

    loadMatchData();
    const timer = setInterval(loadMatchData, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Match Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MatchCard {...matchData} />
      </motion.section>

      {/* AI Momentum Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MomentumMeter data={{
          teamA: momentum.teamA,
          teamB: momentum.teamB,
          teamAName: matchData.battingTeam,
          teamBName: matchData.bowlingTeam,
          explanation: explanation,
          trend: currentTrend
        }} />
      </motion.section>

      {/* Predictions Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center px-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Active Challenges</h2>
          <span className="text-neon-green text-[10px] font-bold animate-pulse">2 NEW</span>
        </div>

        <PredictionModal
          question="How many runs in the next over?"
          xpReward={250}
          options={[
            { id: "1", label: "0-5 Runs", odds: "1.5x" },
            { id: "2", label: "6-10 Runs", odds: "2.8x" },
            { id: "3", label: "11+ Runs", odds: "5.2x" },
          ]}
        />

        <PredictionModal
          question="Next Wicket Method?"
          xpReward={500}
          options={[
            { id: "c", label: "Caught", odds: "1.2x" },
            { id: "b", label: "Bowled", odds: "4.5x" },
            { id: "l", label: "LBW", odds: "6.0x" },
          ]}
        />
      </motion.section>

      {/* Quick Stats Grid - Only show if in 2nd innings / target exists */}
      {(matchData.target || matchData.requiredRR) && (
        <div className="grid grid-cols-2 gap-4 pb-8">
          {matchData.target && (
            <div className="glass p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Target</div>
              <div className="text-xl font-black italic">{matchData.target} Runs</div>
            </div>
          )}
          {matchData.requiredRR && (
            <div className="glass p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Required RR</div>
              <div className="text-xl font-black italic">{matchData.requiredRR}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
