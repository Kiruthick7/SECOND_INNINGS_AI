"use client";

import React, { useEffect, useState } from "react";
import LeaderboardItem from "@/components/LeaderboardItem";
import { motion } from "framer-motion";
import { Trophy, Users, Loader2 } from "lucide-react";
import { fetchLeaderboard, LeaderboardUser } from "@/lib/db";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await fetchLeaderboard();
        setLeaders(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            LEADERBOARD
            <Trophy className="w-6 h-6 text-yellow-400" />
          </h2>
          <p className="text-sm text-white/40 font-bold uppercase tracking-widest mt-1">Global Rankings</p>
        </div>
        <div className="flex items-center gap-2 text-white/60 font-bold text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <Users className="w-4 h-4" />
          {loading ? "..." : `${(leaders.length * 1.2).toFixed(1)}k`} Fans
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-[10px]">Syncing Rankings...</p>
          </div>
        ) : (
          <>
            {leaders.length > 0 ? (
              leaders.map((leader) => (
                <LeaderboardItem key={leader.rank} {...leader} />
              ))
            ) : (
              <div className="text-center py-20 text-white/20 italic">
                No predictors found. Be the first!
              </div>
            )}
          </>
        )}
      </div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Viewing Top Predictors</p>
        </motion.div>
      )}
    </div>
  );
}
