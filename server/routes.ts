import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Integrations
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes, chatStorage } from "./replit_integrations/chat";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for "The Mirror"
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // 2. Setup Chat
  registerChatRoutes(app);

  // 3. Application Routes
  
  // LIST Platforms
  app.get(api.platforms.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const platforms = await storage.getPlatforms(userId);
    res.json(platforms);
  });

  // CONNECT Platform
  app.post(api.platforms.connect.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.platforms.connect.input.parse(req.body);
      
      // Basic simulation of "fetching stats" on connect
      // In a real app, you'd call GitHub/LeetCode APIs here
      const initialStats = await simulateFetchStats(input.name, input.username);
      
      const platform = await storage.createPlatform({
        userId,
        name: input.name,
        username: input.username,
        config: input.apiKey ? { apiKey: input.apiKey } : {},
        stats: initialStats
      });
      
      res.status(201).json(platform);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // DELETE Platform
  app.delete(api.platforms.delete.path, isAuthenticated, async (req: any, res) => {
    const id = Number(req.params.id);
    const platform = await storage.getPlatform(id);
    
    if (!platform) return res.status(404).json({ message: "Not found" });
    if (platform.userId !== req.user.claims.sub) return res.status(401).json({ message: "Unauthorized" });
    
    await storage.deletePlatform(id);
    res.status(204).send();
  });

  // SYNC Platform (Update Stats)
  app.post(api.platforms.sync.path, isAuthenticated, async (req: any, res) => {
    const id = Number(req.params.id);
    const platform = await storage.getPlatform(id);
    
    if (!platform) return res.status(404).json({ message: "Not found" });
    if (platform.userId !== req.user.claims.sub) return res.status(401).json({ message: "Unauthorized" });

    const newStats = await simulateFetchStats(platform.name, platform.username);
    const updated = await storage.updatePlatformStats(id, newStats);
    
    res.json(updated);
  });

  // AI "The Mirror" Analysis
  app.post(api.ai.analyze.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const platforms = await storage.getPlatforms(userId);
      
      if (platforms.length === 0) {
         return res.json({ analysis: "Connect some platforms first, rookie. I can't judge you if you don't show me your work." });
      }

      // Construct the prompt context
      const statsSummary = platforms.map(p => 
        `${p.name} (${p.username}): ${JSON.stringify(p.stats)}`
      ).join("\n");

      const prompt = `
        You are "The Mirror", a ruthless senior engineer and career coach. 
        Your goal is to critique this developer's stats brutally but constructively.
        Identify gaps, weakness, and tell them the "Brutal Reality" of their hireability.
        Finally, give a 30-day roadmap in Markdown.
        
        Developer Stats:
        ${statsSummary}
        
        Output Format:
        Markdown with sections: "The Verdict", "Weaknesses", "The Brutal Reality", "30-Day Redemption Plan".
      `;

      // Use Gemini to generate response
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      const analysis = response.response.text();
      
      // Optionally save this as a chat message if we want history
      // await chatStorage.createConversation("The Mirror Analysis"); ...

      res.json({ analysis });

    } catch (error) {
      console.error("AI Analysis failed:", error);
      res.status(500).json({ message: "AI Analysis failed" });
    }
  });

  return httpServer;
}

// Helper to simulate fetching data (since we don't have real keys for everything in MVP)
async function simulateFetchStats(platform: string, username: string) {
  // Add some randomness to make it feel real
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  switch (platform.toLowerCase()) {
    case 'leetcode':
      return {
        ranking: random(10000, 500000),
        solved: {
          easy: random(10, 50),
          medium: random(5, 30),
          hard: random(0, 5)
        },
        contestRating: random(1400, 1800)
      };
    case 'github':
      return {
        followers: random(0, 100),
        publicRepos: random(5, 50),
        totalCommits: random(10, 1000), // Last year
        streak: random(0, 14)
      };
    default:
      return { status: "Connected", lastCheck: new Date().toISOString() };
  }
}
