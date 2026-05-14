export interface TeamData {
  name: string;
  score: string;
  overs: string;
  isBatting: boolean;
  isWinner: boolean;
}

export interface MatchData {
  teamA: TeamData;
  teamB: TeamData;
  winProb: { teamA: number; teamB: number };
  lastSix: string[];
  status: string;
  result?: string | null;
  target?: string | null;
  requiredRR?: string | null;
  eventId: string;
  period: number;
  date: string;
}

interface LineScore {
  runs?: number;
  wickets?: number;
  overs?: number;
  isBatting?: boolean;
  isCurrent?: boolean;
}

interface Competitor {
  score?: string;
  linescores?: LineScore[];
  team: { abbreviation: string };
  winner?: boolean | string;
}

export async function fetchIPLData(): Promise<MatchData | null> {
  try {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard");
    const data = await response.json();

    if (!data.events || data.events.length === 0) return null;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const event = data.events.find((e: { status: { type: { state: string } }; date: string }) => e.status.type.state === "in") ||
                  data.events.find((e: { status: { type: { state: string } }; date: string }) => e.status.type.state === "pre") ||
                  data.events.find((e: { status: { type: { state: string } }; date: string }) => e.date.startsWith(todayStr)) ||
                  data.events[0];

    const competition = event.competitions[0];
    const competitors = competition.competitors;

    const parseScore = (competitor: Competitor) => {
      let score = competitor.score || "0/0";
      let overs = "0.0";

      const oversMatch = score.match(/\((.*?)\//);
      if (oversMatch) {
        overs = oversMatch[1];
        score = score.split(" (")[0];
      } else if (competitor.linescores?.[0]?.overs) {
        overs = competitor.linescores[0].overs.toString();
      } else if (competitor.linescores) {
        const currentLine = competitor.linescores.find((l: LineScore) => l.isCurrent) || competitor.linescores[competitor.linescores.length - 1];
        if (currentLine?.overs) overs = currentLine.overs.toString();
        if (currentLine?.runs !== undefined) {
          score = `${currentLine.runs}/${currentLine.wickets || 0}`;
        }
      }
      return { score, overs };
    };

    const team1 = competitors[0];
    const team2 = competitors[1];

    const t1Info = parseScore(team1);
    const t2Info = parseScore(team2);

    const battingSide = competitors.find((c: Competitor) => c.linescores?.some((l: LineScore) => l.isBatting)) || competitors[0];

    const currentBattingScore = parseScore(battingSide).score;
    const currentBattingOvers = parseScore(battingSide).overs;

    const situation = event.status?.type?.state === "in" ? event.situation : null;
    let target: string | null = null;
    const requiredRR: string | null = null;

    if (situation) {
      if (situation.lastAction?.target) target = situation.lastAction.target.toString();
    }

    let lastSix: string[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ipl_last_six");
      const lastScore = localStorage.getItem("ipl_last_score");
      const lastOvers = localStorage.getItem("ipl_last_overs");

      if (stored) lastSix = JSON.parse(stored);

      if (lastScore && lastOvers && (currentBattingScore !== lastScore || currentBattingOvers !== lastOvers)) {
        try {
          const runsDiff = parseInt(currentBattingScore.split("/")[0]) - parseInt(lastScore.split("/")[0]);
          const wicketsDiff = parseInt(currentBattingScore.split("/")[1]) - parseInt(lastScore.split("/")[1]);

          let ball = "0";
          if (wicketsDiff > 0) ball = "W";
          else if (runsDiff === 1) ball = "1";
          else if (runsDiff === 2) ball = "2";
          else if (runsDiff === 4) ball = "4";
          else if (runsDiff === 6) ball = "6";
          else if (runsDiff > 0) ball = runsDiff.toString();

          lastSix.push(ball);
          if (lastSix.length > 6) lastSix.shift();

          localStorage.setItem("ipl_last_six", JSON.stringify(lastSix));
        } catch (e) {
          console.error("Error parsing score for lastSix:", e);
        }
      }

      localStorage.setItem("ipl_last_score", currentBattingScore);
      localStorage.setItem("ipl_last_overs", currentBattingOvers);
    }

    if (lastSix.length === 0) {
      lastSix = ["-", "-", "-", "-", "-", "-"];
    }

    let teamAProb = 50;
    let teamBProb = 50;

    if (team1.winner === "true" || team1.winner === true) {
      teamAProb = 100;
      teamBProb = 0;
    } else if (team2.winner === "true" || team2.winner === true) {
      teamAProb = 0;
      teamBProb = 100;
    } else if (situation?.lastAction?.winProbability) {
      teamAProb = Math.round(parseFloat(situation.lastAction.winProbability) * 100);
      teamBProb = 100 - teamAProb;
    }

    return {
      teamA: {
        name: team1.team.abbreviation,
        score: t1Info.score,
        overs: t1Info.overs,
        isBatting: team1.linescores?.some((l: LineScore) => l.isBatting) || false,
        isWinner: team1.winner === "true" || team1.winner === true
      },
      teamB: {
        name: team2.team.abbreviation,
        score: t2Info.score,
        overs: t2Info.overs,
        isBatting: team2.linescores?.some((l: LineScore) => l.isBatting) || false,
        isWinner: team2.winner === "true" || team2.winner === true
      },
      winProb: { teamA: teamAProb, teamB: teamBProb },
      lastSix: lastSix,
      status: event.status.type.description,
      result: event.status.type.state === "post" ? event.status.summary : null,
      target: target,
      requiredRR: requiredRR,
      eventId: event.id,
      period: Math.max(event.status.period || 1, ...competitors.map((c: Competitor) => c.linescores?.length || 0)),
      date: event.date
    };
  } catch (error) {
    console.error("Error fetching IPL data:", error);
    return null;
  }
}
