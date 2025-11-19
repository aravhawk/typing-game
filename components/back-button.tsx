"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>
  );
}
