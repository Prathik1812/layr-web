import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message, StructuredStory } from "../store/useLayrStore";
import { STORY_SYSTEM_PROMPT } from "../lib/ai/prompts";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY;

// Initialize Gemini
let genAI: GoogleGenerativeAI | null = null;
let modelFlash: any = null;

if (API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        modelFlash = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // safer model
    } catch (e) {
        console.warn("Failed to initialize Google AI:", e);
    }
} else {
    console.warn("VITE_GOOGLE_AI_KEY not found. AI disabled.");
}

export const aiService = {
    isAvailable: () => !!genAI && !!modelFlash,

    /**
     * ✅ ONLY AI CALL IN THE ENTIRE APP
     */
    async generateStory(history: Message[]): Promise<StructuredStory> {
        if (!this.isAvailable()) {
            throw new Error("AI Service Unavailable: Missing API Key");
        }

        try {
            const context = history
                .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
                .join("\n");

            const prompt = `${STORY_SYSTEM_PROMPT}

CONVERSATION HISTORY:
${context}

Generate STRICT JSON only:
`;

            const result = await modelFlash.generateContent(prompt);
            const text = result.response.text();

            // 🔥 Clean markdown safely
            const clean = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            let data: StructuredStory;

            try {
                data = JSON.parse(clean);
            } catch (e) {
                console.error("JSON Parse Failed:", clean);
                throw new Error("Invalid JSON from AI");
            }

            // ✅ Basic validation (prevents crashes later)
            if (!data || typeof data !== "object") {
                throw new Error("Invalid AI response structure");
            }

            // ✅ Strict Array Enforcement Protection
            const ensureArray = (val: any) => Array.isArray(val) ? val : (val ? [val] : []);

            return {
                productName: data.productName || "Untitled Product",
                description: data.description || "",
                targetUsers: ensureArray(data.targetUsers),
                userRoles: ensureArray(data.userRoles),
                keyFeatures: ensureArray(data.keyFeatures),
                primaryUserActions: ensureArray(data.primaryUserActions),
                systemModules: ensureArray(data.systemModules)
            };
        } catch (error) {
            console.error("AI Story Generation Error:", error);
            throw error;
        }
    }
};