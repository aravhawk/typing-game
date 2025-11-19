import Link from "next/link";
import { Keyboard } from "lucide-react";

export function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Back to typing game"
    >
      <Keyboard className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </Link>
  );
}
