export interface MatchData {
  battingTeam: string;
  bowlingTeam: string;
  score: string;
  overs: string;
  winProb: { teamA: number; teamB: number };
  lastSix: string[];
  status: string;
  target?: string | null;
  requiredRR?: string | null;
}

export async function fetchIPLData(): Promise<MatchData | null> {
  try {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard");
    const data = await response.json();

    if (!data.events || data.events.length === 0) return null;

    const event = data.events.find((e: { status: { type: { state: string } } }) => e.status.type.state === "in") ||
                  data.events.find((e: { status: { type: { state: string } } }) => e.status.type.state === "pre") ||
                  data.events[0];

    const competition = event.competitions[0];
    const competitors = competition.competitors;

    const battingSide = competitors.find((c: { linescores?: { isBatting: boolean }[] }) => c.linescores?.[0]?.isBatting) || competitors[0];
    const bowlingSide = competitors.find((c: { id: string }) => c.id !== battingSide.id) || competitors[1];

    let score = battingSide.score || "0/0";
    let overs = "0.0";

    const oversMatch = score.match(/\((.*?)\//);
    if (oversMatch) {
      overs = oversMatch[1];
      score = score.split(" (")[0];
    } else if (battingSide.linescores?.[0]?.overs) {
      overs = battingSide.linescores[0].overs.toString();
    }

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

      if (lastScore && lastOvers && (score !== lastScore || overs !== lastOvers)) {
        const runsDiff = parseInt(score.split("/")[0]) - parseInt(lastScore.split("/")[0]);
        const wicketsDiff = parseInt(score.split("/")[1]) - parseInt(lastScore.split("/")[1]);

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
      }

      localStorage.setItem("ipl_last_score", score);
      localStorage.setItem("ipl_last_overs", overs);
    }

    if (lastSix.length === 0) {
      lastSix = ["-", "-", "-", "-", "-", "-"];
    }

    return {
      battingTeam: battingSide.team.abbreviation,
      bowlingTeam: bowlingSide.team.abbreviation,
      score: score,
      overs: overs,
      winProb: { teamA: 50, teamB: 50 },
      lastSix: lastSix,
      status: event.status.type.description,
      target: target,
      requiredRR: requiredRR
    };
  } catch (error) {
    console.error("Error fetching IPL data:", error);
    return null;
  }
}
