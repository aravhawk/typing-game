"use server";

import { getSession } from "@/lib/auth-server";
import { getRandomExcerpt } from "@/lib/excerpts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const topics = [
  "the history of a specific musical instrument",
  "an unusual animal adaptation or behavior",
  "a lesser-known scientific discovery",
  "how a particular food or spice traveled the world",
  "the origin of a common everyday object",
  "a notable moment in space exploration",
  "how weather patterns shape human culture",
  "the psychology behind habits and routines",
  "an interesting fact about ocean life",
  "the evolution of a particular art form",
  "how bridges or tunnels are engineered",
  "a surprising connection between two unrelated fields",
  "the craft of bookbinding or papermaking",
  "how maps changed our understanding of the world",
  "the science behind sleep and dreams",
  "a forgotten civilization or ancient city",
  "the mechanics of how birds fly or fish swim",
  "the role of fungi in ecosystems",
  "how color perception works in the brain",
  "the history of timekeeping and clocks",
  "volcanic islands and how they form",
  "the mathematics found in nature",
  "an unusual tradition from a specific culture",
  "the chemistry of cooking or baking",
  "how trees communicate through root networks",
  "the engineering behind roller coasters",
  "migration patterns of a specific animal",
  "the invention of a writing system or alphabet",
  "how glass is made and its many uses",
  "the physics of sound and music",
  "an unexpected use of technology in agriculture",
  "the architecture of ancient temples or cathedrals",
  "how rivers shape landscapes over time",
  "the biology of bioluminescent creatures",
  "a pivotal moment in the history of medicine",
  "the craft of pottery or ceramics across cultures",
  "how memory works in the human brain",
  "the ecology of coral reefs",
  "the origins of a popular sport or game",
  "how silk, wool, or cotton becomes fabric",
];

const tones = [
  "matter-of-fact and informative",
  "gently humorous and lighthearted",
  "contemplative and reflective",
  "vivid and descriptive, painting a picture",
  "conversational, as if explaining to a friend",
  "enthusiastic and energetic",
  "calm and understated",
  "storytelling, with a narrative arc",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a typing test paragraph using AI for signed-in users
 * For anonymous users, returns a random excerpt from the hardcoded list
 */
export async function generateParagraph(): Promise<string> {
  try {
    const session = await getSession();

    // For anonymous users, use hardcoded excerpts
    if (!session?.user) {
      return getRandomExcerpt();
    }

    const topic = pick(topics);
    const tone = pick(tones);

    // For signed-in users, generate AI paragraph
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `You generate short paragraphs for a typing test game. Rules:
- Exactly 2-3 sentences, 150-250 characters total
- Perfect grammar and punctuation
- Use common vocabulary — no jargon
- Declarative sentences only (no questions)
- No quotes, dialogue, lists, or meta-commentary
- Return ONLY the paragraph text, nothing else`,
        },
        {
          role: "user",
          content: `Write a paragraph about: ${topic}. Tone: ${tone}.`,
        },
      ],
      temperature: 1.3,
      max_tokens: 200,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim();

    // Fallback to hardcoded excerpt if generation fails or is empty
    if (!generatedText || generatedText.length < 50) {
      console.warn("AI generated text too short or empty, using fallback");
      return getRandomExcerpt();
    }

    // Ensure the text is within reasonable length bounds
    if (generatedText.length > 350) {
      console.warn("AI generated text too long, using fallback");
      return getRandomExcerpt();
    }

    return generatedText;
  } catch (error) {
    console.error("Error generating paragraph:", error);
    // Fallback to hardcoded excerpt on any error
    return getRandomExcerpt();
  }
}
