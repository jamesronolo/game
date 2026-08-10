import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Question Set Generator Endpoint
  app.post("/api/ai/generate-set", async (req, res) => {
    try {
      const { topic, gradeLevel, count = 5, subject = "General" } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured.",
          useFallback: true,
        });
      }

      const prompt = `Create an educational question set about "${topic}" for grade level "${gradeLevel || "Grade 3"}". Subject: "${subject}". Generate ${count} high-quality, engaging questions. Each question must have promptText, 4 distinct options (multiple choice), correct answer (which must match one of the options), and a helpful hint.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert K-12 educator creating interactive learning question sets. Provide strictly valid JSON conforming to the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              subject: { type: Type.STRING },
              gradeLevel: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    promptText: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    answer: { type: Type.STRING },
                    hint: { type: Type.STRING },
                  },
                  required: ["promptText", "options", "answer", "hint"],
                },
              },
            },
            required: ["title", "subject", "gradeLevel", "questions"],
          },
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("No response text received from Gemini API");
      }

      const parsedData = JSON.parse(jsonText);
      res.json({ success: true, data: parsedData });
    } catch (err: unknown) {
      console.error("AI Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ error: errorMessage, useFallback: true });
    }
  });

  // Serve static assets in production or use Vite middleware in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`EduPlay server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
