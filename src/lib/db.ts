import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, orderBy("xp", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    const leaders = querySnapshot.docs.map((doc, index) => ({
      ...doc.data(),
      rank: index + 1,
    })) as LeaderboardUser[];

    return leaders;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function recordPrediction(userId: string, predictionData: {
  question: string;
  selectedOptionId: string;
  xpReward: number;
}) {
  try {
    const predictionRef = collection(db, "users", userId, "predictions");
    await addDoc(predictionRef, {
      ...predictionData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error recording prediction:", error);
    throw error;
  }
}

export async function incrementUserXP(userId: string, amount: number) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      xp: increment(amount),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating XP:", error);
    throw error;
  }
}

export async function seedInitialData() {
  const users = [
    { name: "Virat_Fan_88", xp: 12540, streak: 12 },
    { name: "CricketMaster", xp: 10200, streak: 8 },
    { name: "Kiruthick", xp: 9850, streak: 15 },
    { name: "BoundaryKing", xp: 8700, streak: 5 },
  ];

  try {
    for (const user of users) {
      await addDoc(collection(db, "users"), user);
    }
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}
