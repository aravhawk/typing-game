"use server";

import { getSession } from "@/lib/auth-server";
import { getRandomExcerpt } from "@/lib/excerpts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // For signed-in users, generate AI paragraph
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `You are a typing test paragraph generator. Generate a single paragraph for typing practice with these strict requirements:

REQUIREMENTS:
- Length: Exactly 2-3 sentences, totaling 150-250 characters
- Style: Motivational, educational, philosophical, or technology-focused
- Tone: Inspirational, thoughtful, and clear
- Topics: Choose from technology, typing, productivity, learning, nature, coding, personal development, innovation, or creativity
- Grammar: Perfect grammar and punctuation
- Structure: Each sentence should flow naturally into the next
- Accessibility: Use common vocabulary, avoid jargon or overly complex words
- No quotes or dialogue
- No questions (use declarative sentences only)
- No lists or bullet points

OUTPUT:
Return ONLY the paragraph text, nothing else. No explanations, no metadata, no quotation marks around the text.`,
        },
        {
          role: "user",
          content: "Generate a typing test paragraph.",
        },
      ],
      temperature: 0.9,
      max_tokens: 150,
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
