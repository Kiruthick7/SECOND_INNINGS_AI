"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CommentaryItem {
  id: string;
  text: string;
  shortText: string;
  scoreValue: number;
  over: {
    actual: number;
    runs: number;
  };
  dismissal: {
    dismissal: boolean;
  };
  bbbTimestamp: number;
}

export default function EventChronology() {
  const [events, setEvents] = useState<CommentaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommentary() {
      try {
        const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/cricket/8048/playbyplay?event=1529301");
        const data = await response.json();

        if (data?.commentary?.items) {
          const sortedEvents = data.commentary.items.sort(
            (a: CommentaryItem, b: CommentaryItem) => b.bbbTimestamp - a.bbbTimestamp
          );
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch commentary:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommentary();
    const timer = setInterval(fetchCommentary, 15000);
    return () => clearInterval(timer);
  }, []);

  if (loading && events.length === 0) {
    return (
      <div className="glass p-4 rounded-2xl border border-white/5 animate-pulse h-64 flex items-center justify-center">
        <span className="text-white/40 text-sm tracking-widest uppercase">Connecting to Live Feed...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Live Event Chronology</h2>
        <span className="text-neon-green text-[10px] font-bold animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green"></div>
          LIVE
        </span>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {events.map((event, index) => {
              const isWicket = event.dismissal?.dismissal;
              const isBoundary = event.scoreValue === 4 || event.scoreValue === 6;
              const isDot = event.scoreValue === 0 && !isWicket;

              let badgeColor = "bg-white/5 text-white/50 border-white/10";
              let badgeText = event.scoreValue.toString();

              if (isWicket) {
                badgeColor = "bg-red-500/20 text-red-500 border-red-500/30";
                badgeText = "W";
              } else if (event.scoreValue === 6) {
                badgeColor = "bg-neon-purple/20 text-neon-purple border-neon-purple/30";
              } else if (event.scoreValue === 4) {
                badgeColor = "bg-neon-blue/20 text-neon-blue border-neon-blue/30";
              } else if (isDot) {
                badgeColor = "bg-white/5 text-white/30 border-white/5";
                badgeText = "•";
              }

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="text-[10px] font-mono text-white/40">{event.over.actual}</div>
                    <div className={"w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black " + badgeColor}>
                      {badgeText}
                    </div>
                  </div>

                  <div className={"flex-1 p-3 rounded-xl border transition-colors duration-300 " +
                    (isWicket ? "bg-red-500/5 border-red-500/20" :
                     isBoundary ? "bg-white/5 border-white/10" : "bg-transparent border-transparent group-hover:bg-white/5")}>
                    <p className={"text-sm " + (isWicket || isBoundary ? "text-white font-medium" : "text-white/70")}>
                      {event.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
