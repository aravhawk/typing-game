import { db } from "@/lib/db";
import { gameResults, user } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db
      .select({
        wpm: gameResults.wpm,
        accuracy: gameResults.accuracy,
        duration: gameResults.duration,
        playerName: user.name,
        createdAt: gameResults.createdAt,
      })
      .from(gameResults)
      .innerJoin(user, eq(gameResults.userId, user.id))
      .orderBy(desc(gameResults.wpm))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ wpm: 0, playerName: null });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching top player:", error);
    return NextResponse.json({ wpm: 0, playerName: null }, { status: 500 });
  }
}

