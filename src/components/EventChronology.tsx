"use client";

import { useState, useEffect, useRef } from "react";
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

export default function EventChronology({
  eventId,
  period,
  teamA,
  teamB
}: {
  eventId?: string;
  period?: number;
  teamA?: string;
  teamB?: string;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(period || 1);
  const [events, setEvents] = useState<CommentaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const lastPeriodRef = useRef(period);

  useEffect(() => {
    if (period && period !== lastPeriodRef.current) {
      setSelectedPeriod(period);
      lastPeriodRef.current = period;
    }
  }, [period]);

  useEffect(() => {
    if (!eventId) return;

    let ignore = false;

    async function fetchCommentary() {
      setLoading(true);
      if (!ignore) setEvents([]); 
      
      try {
        const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/cricket/8048/playbyplay?event=${eventId}&period=${selectedPeriod}&limit=100`);
        const data = await response.json();

        if (data?.commentary?.items && !ignore) {
          let items = data.commentary.items;

          if (data.commentary.pageCount > 1) {
            const lastPageResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/cricket/8048/playbyplay?event=${eventId}&period=${selectedPeriod}&page=${data.commentary.pageCount}&limit=100`);
            const lastPageData = await lastPageResponse.json();
            if (lastPageData?.commentary?.items && !ignore) {
              items = lastPageData.commentary.items;
            }
          }

          const sortedEvents = items.sort(
            (a: CommentaryItem, b: CommentaryItem) => {
              if (b.over.actual !== a.over.actual) {
                return b.over.actual - a.over.actual;
              }
              return b.bbbTimestamp - a.bbbTimestamp;
            }
          );
          setEvents(sortedEvents);
        }
      } catch (error) {
        if (!ignore) console.error("Failed to fetch commentary:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchCommentary();
    const timer = setInterval(fetchCommentary, 15000);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [eventId, selectedPeriod]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Live Event Chronology</h2>
        <div className="flex gap-4 border-b border-white/5 pb-2">
          <button
            onClick={() => setSelectedPeriod(1)}
            className={`text-xs font-black uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${
              selectedPeriod === 1 ? "bg-neon-green text-black" : "text-white/40 hover:bg-white/5 hover:text-white"
            }`}
          >
            {teamA || "Innings 1"}
          </button>
          <button
            onClick={() => setSelectedPeriod(2)}
            className={`text-xs font-black uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${
              selectedPeriod === 2 ? "bg-neon-blue text-black" : "text-white/40 hover:bg-white/5 hover:text-white"
            }`}
          >
            {teamB || "Innings 2"}
          </button>
        </div>
        <span className="text-neon-green text-[10px] font-bold animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green"></div>
          {selectedPeriod === period ? "LIVE" : "ARCHIVE"}
        </span>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[400px]">
        {loading && events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/40 text-sm tracking-widest uppercase animate-pulse">Syncing Play-by-Play...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {events.length > 0 ? (
                events.map((event, index) => {
                  const isWicket = event.dismissal?.dismissal;
                  const isBoundary = event.scoreValue === 4 || event.scoreValue === 6;
                  const isDot = event.scoreValue === 0 && !isWicket;

                  let badgeColor = "bg-white/5 text-white/50 border-white/10";
                  let badgeText = event.scoreValue.toString();

                  if (isWicket) {
                    badgeColor = "bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="flex gap-4 items-start group"
                    >
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="text-[10px] font-mono text-white/40">{event.over.actual}</div>
                        <div className={"w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black transition-all duration-300 group-hover:scale-110 " + badgeColor}>
                          {badgeText}
                        </div>
                      </div>

                      <div className={"flex-1 p-3 rounded-xl border transition-all duration-300 " +
                        (isWicket ? "bg-red-500/5 border-red-500/20" :
                         isBoundary ? "bg-white/5 border-white/10" : "bg-transparent border-transparent group-hover:bg-white/5 group-hover:border-white/5")}>
                        <div
                          className={"text-sm leading-relaxed " + (isWicket || isBoundary ? "text-white font-medium" : "text-white/70")}
                          dangerouslySetInnerHTML={{ __html: event.text }}
                        />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/10 text-center px-8">
                  <div className="text-4xl mb-4 opacity-20">🏏</div>
                  <p className="text-sm font-bold uppercase tracking-widest italic">Waiting for Innings to start</p>
                  <p className="text-[10px] opacity-40 mt-2">The AI momentum engine is warming up...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
