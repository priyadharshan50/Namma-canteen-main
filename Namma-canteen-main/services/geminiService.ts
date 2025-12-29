
import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

export const getFoodPairingSuggestion = async (items: CartItem[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const itemsList = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I just ordered ${itemsList} in a Tamil Nadu canteen. Suggest one traditional drink or dessert (like Jigarthanda, Payasam, or Filter Coffee) that pairs perfectly with it. Keep it short.`,
    });

    return response.text || "We suggest pairing your meal with a classic Filter Coffee!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Chef's special suggestion: Try this with a chilled Madurai Jigarthanda!";
  }
};
