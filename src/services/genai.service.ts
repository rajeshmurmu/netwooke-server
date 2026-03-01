import { GoogleGenAI, Type } from "@google/genai";
import { BadRequestError } from "@src/utils/error";

class GenAIService {
  private static ai = new GoogleGenAI({ apiKey: process.env.GEMNI_API_KEY });

  static async moderateContent(
    text: string,
  ): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following content for a positive growth-focused social platform. Detect bullying, hate speech, toxic roasting, or inappropriate content for young men. If the user input is random characters, non-sensical, or keyboard mash, ignore it and respond with: 'Could you please rephrase your question?
      Content: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isSafe: { type: Type.BOOLEAN },
              reason: {
                type: Type.STRING,
                description: "Reason for rejection if not safe",
              },
            },
            required: ["isSafe"],
          },
        },
      });

      const textOutput = response.text?.trim();
      if (!textOutput) return { isSafe: true };

      return JSON.parse(textOutput);
    } catch (error) {
      console.error("Moderation error:", error);
      // return { isSafe: true }; // Graceful failure
      throw new BadRequestError(
        "Failed to process content!. Please try again later. If the issue persists, please contact support. Thank you for your patience and understanding.",
      );
    }
  }

  static async generateReflectionPrompt(): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:
          "Generate a single, thoughtful reflection prompt for a young man (16-30) focused on personal growth, mindset, or resilience. One sentence only.",
      });
      // Fix: Access the .text property directly.
      return (
        response.text?.trim() ||
        "What challenged you today and how did you respond?"
      );
    } catch (error) {
      console.error("Reflection prompt error:", error);
      return "What challenged you today and how did you respond?";
    }
  }
}

export default GenAIService;
