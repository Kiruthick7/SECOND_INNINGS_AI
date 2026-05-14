"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import MomentumMeter from "@/components/MomentumMeter";
import PredictionModal from "@/components/PredictionModal";
import EventChronology from "@/components/EventChronology";
import CountdownTimer from "@/components/CountdownTimer";
import { motion } from "framer-motion";
import { fetchIPLData, MatchData } from "@/lib/api";

export default function Dashboard() {
  const [matchData, setMatchData] = useState<MatchData>({
    teamA: { name: "TEAM", score: "0/0", overs: "0.0", isBatting: false, isWinner: false },
    teamB: { name: "TEAM", score: "0/0", overs: "0.0", isBatting: false, isWinner: false },
    winProb: { teamA: 50, teamB: 50 },
    lastSix: ["-", "-", "-", "-", "-", "-"],
    status: "Loading...",
    eventId: "1529301",
    period: 1,
    date: new Date().toISOString()
  });

  const hasWicket = matchData.lastSix.includes("W");
  const currentTrend = hasWicket ? "down" as const : "up" as const;
  const battingTeam = matchData.teamA.isBatting ? matchData.teamA : matchData.teamB;

  const momentum = {
    teamA: matchData.winProb.teamA,
    teamB: matchData.winProb.teamB,
    trend: currentTrend
  };

  const explanation = matchData.result
    ? `${matchData.result}. The momentum engine has finalized the performance analytics.`
    : `${battingTeam.name}'s momentum ${currentTrend === "down" ? "shifted significantly after the loss of a wicket (W)" : "is surging with consistent run flow"}. They are now at ${battingTeam.score}.`;

  useEffect(() => {
    async function loadMatchData() {
      const data = await fetchIPLData();
      if (data) {
        setMatchData(data);
      }
    }

    loadMatchData();
    const timer = setInterval(loadMatchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CountdownTimer 
          targetDate={matchData.date} 
          isMatchFinished={matchData.status.toLowerCase() === "result" || !!matchData.result} 
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MatchCard {...matchData} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MomentumMeter data={{
          teamA: momentum.teamA,
          teamB: momentum.teamB,
          teamAName: matchData.teamA.name,
          teamBName: matchData.teamB.name,
          explanation: explanation,
          trend: momentum.trend
        }} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <EventChronology
          eventId={matchData.eventId}
          period={matchData.period}
          teamA={matchData.teamA.name}
          teamB={matchData.teamB.name}
        />

        {(matchData.status.toLowerCase().includes("live") || matchData.status.toLowerCase().includes("progress")) ? (
          <>
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
          </>
        ) : (
          <div className="glass p-8 rounded-3xl border border-white/5 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 group">
              <svg className="w-8 h-8 text-white/20 group-hover:text-neon-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Challenges Locked</h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-[200px] mx-auto italic">
              Predictions and fan events will be open to attend once the next match starts.
            </p>
          </div>
        )}
      </motion.section>

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
