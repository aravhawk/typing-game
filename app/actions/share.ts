"use server";

import { db } from "@/lib/db";
import { gameResults, shareableResults } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-server";

/**
 * Save a game result to the database
 * This is called automatically when a game finishes
 */
export async function saveGameResult(data: {
  wpm: number;
  accuracy: number;
  duration: number;
  textExcerpt: string;
  wpmHistory?: Array<{ time: number; wpm: number }>;
}) {
  try {
    if (data.accuracy < 0 || data.accuracy > 100) {
      throw new Error("Invalid accuracy value");
    }
    if (data.wpm < 0 || data.wpm > 350) {
      throw new Error("Invalid WPM value");
    }
    if (data.duration < 0 || data.duration > 300) {
      throw new Error("Invalid duration value");
    }

    const session = await getSession();
    const userId = session?.user?.id;

    // Only save results for authenticated users
    if (!userId) {
      return { success: false, gameResultId: null };
    }

    const [gameResult] = await db
      .insert(gameResults)
      .values({
        userId,
        wpm: data.wpm,
        accuracy: data.accuracy,
        duration: data.duration,
        textExcerpt: data.textExcerpt,
        wpmHistory: data.wpmHistory || null,
      })
      .returning();

    return { success: true, gameResultId: gameResult.id };
  } catch (error) {
    console.error("Error saving game result:", error);
    throw new Error("Failed to save game result");
  }
}

/**
 * Create a shareable link for an existing game result
 */
export async function createShareableLink(data: {
  shortId: string;
  gameResultId: string;
}) {
  try {
    await db.insert(shareableResults).values({
      shortId: data.shortId,
      gameResultId: data.gameResultId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating shareable link:", error);
    throw new Error("Failed to create shareable link");
  }
}

/**
 * Legacy function - kept for backwards compatibility
 * Creates both a game result and shareable link in one action
 */
export async function shareGameResult(data: {
  shortId: string;
  wpm: number;
  accuracy: number;
  duration: number;
  wpmHistory?: Array<{ time: number; wpm: number }>;
}) {
  try {
    const saveResult = await saveGameResult({
      wpm: data.wpm,
      accuracy: data.accuracy,
      duration: data.duration,
      textExcerpt: "",
      wpmHistory: data.wpmHistory,
    });

    await createShareableLink({
      shortId: data.shortId,
      gameResultId: saveResult.gameResultId!,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sharing game result:", error);
    throw new Error("Failed to share game result");
  }
}

