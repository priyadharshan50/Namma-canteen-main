import { GoogleGenAI } from "@google/genai";

// Safely initialize AI - handle missing API key gracefully
const apiKey = process.env.API_KEY || "";
let ai = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Gemini API Key not set. AI features will use fallback responses.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
}

export const getFoodPairingSuggestion = async (cartItems) => {
  // Return fallback if AI not available
  if (!ai) {
    const fallbackSuggestions = [
      "Try our classic filter coffee! ☕ Perfect with any meal.",
      "Add some crispy papad for the perfect crunch! 🥙",
      "Pair with traditional buttermilk for a refreshing finish! 🥛",
      "Complete your meal with our sweet payasam! 🍮",
      "A hot rasam would complement this beautifully! 🍲",
    ];
    return fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
  }

  const itemNames = cartItems.map(item => item.name).join(', ');
  const prompt = `You are a friendly South Indian canteen assistant. A student just ordered: ${itemNames}. 
  Suggest ONE perfect drink or dessert pairing in a short, fun sentence (max 20 words). Be specific to Tamil Nadu cuisine. 
  Make it sound conversational like a canteen staff recommendation. Include an emoji.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Try our classic filter coffee! ☕ Perfect with any meal.";
  }
};

export const getBudgetAdvice = async (balance, limit, cartTotal, availableCredit) => {
  // Return fallback if AI not available
  if (!ai) {
    if (cartTotal > availableCredit) {
      return "Anna, this order exceeds your credit limit. Maybe try paying some balance first? 💳";
    }
    if (limit > 0 && (balance / limit) > 0.8) {
      return "Careful da! You're using most of your credit. Save some for later! 🎯";
    }
    return "Looking good! Keep tracking your spending for stress-free end of month. 👍";
  }

  const usagePercent = limit > 0 ? ((balance / limit) * 100).toFixed(0) : 0;
  
  const prompt = `You are a friendly financial advisor for a college canteen credit system in Tamil Nadu.
  
  Student's credit status:
  - Current balance owed: ₹${balance}
  - Credit limit: ₹${limit}  
  - Usage: ${usagePercent}%
  - Available credit: ₹${availableCredit}
  - Cart total: ₹${cartTotal}
  
  ${cartTotal > availableCredit ? 'They cannot afford this order with credit!' : ''}
  ${usagePercent > 80 ? 'They are near their credit limit!' : ''}
  
  Give a brief, friendly advice in 1-2 sentences (max 30 words). Be encouraging but financially responsible.
  Use casual Tamil Nadu style English. Include an emoji.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Budget API error:", error);
    if (cartTotal > availableCredit) {
      return "Anna, this order exceeds your credit limit. Maybe try paying some balance first? 💳";
    }
    if (usagePercent > 80) {
      return "Careful da! You're using most of your credit. Save some for later! 🎯";
    }
    return "Looking good! Keep tracking your spending for stress-free end of month. 👍";
  }
};

export const getFinancialTip = async (monthlySpending, tier) => {
  const tierName = tier === 3 ? 'Gold' : tier === 2 ? 'Silver' : tier === 1 ? 'Bronze' : 'No credit';
  
  // Return fallback if AI not available
  if (!ai) {
    return "Pro tip: Track your daily spending and try to keep credit payments on time! 📊";
  }
  
  const prompt = `You are a friendly financial advisor for college students in Tamil Nadu.
  
  Student info:
  - Monthly canteen spending: ₹${monthlySpending}
  - Credit tier: ${tierName}
  
  Give ONE quick tip about managing their canteen budget wisely (max 25 words).
  Be friendly, use casual Tamil Nadu English style. Include an emoji at the end.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Financial Tip error:", error);
    return "Pro tip: Track your daily spending and try to keep credit payments on time! 📊";
  }
};
