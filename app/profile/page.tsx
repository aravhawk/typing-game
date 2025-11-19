import { requireAuth } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { gameResults } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navigation } from "@/components/navigation";
import { BackButton } from "@/components/back-button";

async function getUserStats(userId: string) {
  const allResults = await db.query.gameResults.findMany({
    where: eq(gameResults.userId, userId),
    orderBy: (gameResults, { desc }) => [desc(gameResults.createdAt)],
  });

  if (allResults.length === 0) {
    return {
      totalGames: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
    };
  }

  const totalWpm = allResults.reduce((sum, result) => sum + result.wpm, 0);
  const totalAccuracy = allResults.reduce(
    (sum, result) => sum + result.accuracy,
    0
  );
  const bestWpm = Math.max(...allResults.map((r) => r.wpm));

  return {
    totalGames: allResults.length,
    averageWpm: Math.round(totalWpm / allResults.length),
    bestWpm,
    averageAccuracy: Math.round(totalAccuracy / allResults.length),
  };
}

async function StatsCard() {
  const session = await requireAuth();
  const stats = await getUserStats(session.userId);

  return (
    <div className="flex flex-col items-start mb-16 gap-4">
      <div className="text-6xl md:text-[120px] font-normal leading-none tracking-tighter">
        <span className="text-orange-500">{stats.bestWpm}</span>
        <span className="text-gray-500"> BEST</span>
      </div>
      <div className="text-6xl md:text-[120px] font-normal leading-none tracking-tighter">
        <span className="text-orange-500">{stats.averageWpm}</span>
        <span className="text-gray-500"> AVG</span>
      </div>
    </div>
  );
}

async function GameHistory() {
  const session = await requireAuth();
  const allResults = await db.query.gameResults.findMany({
    where: eq(gameResults.userId, session.userId),
    orderBy: (gameResults, { desc }) => [desc(gameResults.createdAt)],
    limit: 20,
  });

  if (allResults.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No games played yet. Start typing to see your history!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allResults.map((result) => (
        <div
          key={result.id}
          className="flex items-center justify-between py-0 text-lg"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 tabular-nums text-right w-10">{result.wpm}</span>
              <span className="text-gray-500">WPM</span>
            </div>
            <span className="text-orange-500 tabular-nums text-right w-16">{result.accuracy}%</span>
          </div>
          <div className="text-gray-400">
            {new Date(result.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProfilePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <BackButton />
      <Navigation />
      <div className="max-w-4xl mx-auto p-8 pt-24">
        <StatsCard />
        <div className="mt-12">
        <GameHistory />
        </div>
      </div>
    </div>
  );
}

