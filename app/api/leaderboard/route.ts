import { db } from "@/lib/db";
import { gameResults, user } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db
      .select({
        wpm: gameResults.wpm,
        accuracy: gameResults.accuracy,
        duration: gameResults.duration,
        playerName: user.name,
        createdAt: gameResults.createdAt,
      })
      .from(gameResults)
      .leftJoin(user, eq(gameResults.userId, user.id))
      .orderBy(desc(gameResults.wpm))
      .limit(10);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json([], { status: 500 });
  }
}
