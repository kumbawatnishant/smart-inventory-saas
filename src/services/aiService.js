const Groq = require('groq-sdk');
require('dotenv').config();

// Initialize Groq with a fallback to prevent server crash on startup if key is missing
const apiKey = process.env.GROQ_API_KEY || 'dummy_key';
if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️  WARNING: GROQ_API_KEY is missing. AI features will not work.');
}
const groq = new Groq({ apiKey });

class AIService {
  /**
   * Generates a stock strategy based on current metrics.
   */
  async generateStockStrategy(productName, currentStock, dailyRunRate) {
    const prompt = `
      Analyze inventory for: ${productName}.
      Current Stock: ${currentStock}.
      Avg Daily Sales: ${dailyRunRate.toFixed(2)}.
      
      Return a JSON object ONLY with these keys:
      - "status": "Healthy", "Critical", or "Overstocked"
      - "recommendation": A short strategic action (max 15 words).
      - "reorder_urgency": 1-10 scale.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an inventory AI expert. Output valid JSON only." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" } 
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("AI Service Error:", error);
      return { status: "Unknown", recommendation: "AI Unavailable", reorder_urgency: 0 };
    }
  }

  /**
   * Generates SEO content for a product.
   */
  async generateSeoDescription(productName, description) {
    const prompt = `
      Generate an SEO-optimized product description for: ${productName}.
      Base details: ${description}.
      
      Return a JSON object ONLY with:
      - "seo_text": A compelling 1-sentence marketing hook.
      - "keywords": A comma-separated string of 5 keywords.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a marketing expert. Output valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

module.exports = new AIService();