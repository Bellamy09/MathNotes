
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const convertSpeechToMath = async (audioBase64: string): Promise<string> => {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are a specialized mathematical transcription assistant.
    Your task is to convert spoken mathematical descriptions into valid LaTeX.
    
    Rules:
    1. Output ONLY the LaTeX code.
    2. Wrap complex block formulas in $$ ... $$.
    3. Wrap inline simple variables or expressions in $ ... $.
    4. If the description is a complete theorem or identity (like "probability of A union B"), provide the full equation.
    5. Be precise with LaTeX symbols (e.g., \\cup, \\cap, \\sum, \\int, \\alpha, \\beta).
    6. If you cannot determine the math, return the spoken words as plain text.
    
    Example input: "the probability of A union B equals probability of A plus probability of B minus probability of A and B"
    Example output: $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Convert this spoken math into LaTeX:" },
            {
              inlineData: {
                mimeType: 'audio/wav',
                data: audioBase64
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Conversion Error:", error);
    throw new Error("Failed to convert speech to math. Please try again.");
  }
};
