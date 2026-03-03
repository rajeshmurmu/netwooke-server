import OpenAI from "openai";
import { BadRequestError } from "@src/utils/error";

class GenAIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Content Moderation (Hybrid: OpenAI moderation + GPT reasoning)
  static async moderateContent(
    text: string,
  ): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      // Step 1: Basic safety check (fast + cheap)
      const moderation = await this.openai.moderations.create({
        model: "omni-moderation-latest",
        input: text,
      });

      const flagged = moderation.results[0].flagged;

      // Step 2: If clearly unsafe → reject immediately
      if (flagged) {
        return {
          isSafe: false,
          reason: "Content violates platform safety guidelines",
        };
      }

      // 🔹 Step 3: Use GPT for nuanced platform-specific moderation
      const response = await this.openai.chat.completions.create({
        model: "gpt-5-mini", // fast + cheap
        messages: [
          {
            role: "system",
            content:
              "You are a strict content moderator for a positive growth-focused platform for young men.",
          },
          {
            role: "user",
            content: `
Analyze the following content:

Rules:
- Detect bullying, hate speech, toxic roasting, or negativity
- Allow motivational, neutral, and constructive content
- If text is random characters or nonsensical → ask to rephrase
- Reject meaningless, random, or irrelevant content
- Reject programming code, symbols, or non-social text
- If not meaningful human language → mark unsafe

Return ONLY JSON:
{
  "isSafe": boolean,
  "reason": "optional reason"
}

Content: "${text}"
            `,
          },
        ],
        response_format: { type: "json_object" },
      });

      const output = response.choices[0].message.content;
      if (!output) return { isSafe: true };

      return JSON.parse(output);
    } catch (error) {
      console.error("Moderation error:", error);
      throw new BadRequestError(
        "Failed to process content!. Please try again later.",
      );
    }
  }

  // Reflection Prompt Generator
  static async generateReflectionPrompt(): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "user",
            content:
              "Generate one short, powerful reflection question for a young man (16-30) about growth, mindset, or discipline. One sentence only.",
          },
        ],
      });

      return (
        response.choices[0].message.content?.trim() ||
        "What challenged you today and how did you respond?"
      );
    } catch (error) {
      console.error("Reflection prompt error:", error);
      return "What challenged you today and how did you respond?";
    }
  }
}

export default GenAIService;
