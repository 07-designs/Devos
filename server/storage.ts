import { db } from "./db";
import { 
  platforms, 
  type Platform, 
  type InsertPlatform,
  users 
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth";
import { chatStorage } from "./replit_integrations/chat";

export interface IStorage {
  // Platforms
  getPlatforms(userId: string): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatformStats(id: number, stats: any): Promise<Platform>;
  deletePlatform(id: number): Promise<void>;
  
  // Auth & Chat (Re-exported for convenience if needed, but they have their own modules)
}

export class DatabaseStorage implements IStorage {
  async getPlatforms(userId: string): Promise<Platform[]> {
    return await db.select().from(platforms).where(eq(platforms.userId, userId));
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));
    return platform;
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db.insert(platforms).values(insertPlatform).returning();
    return platform;
  }

  async updatePlatformStats(id: number, stats: any): Promise<Platform> {
    const [platform] = await db
      .update(platforms)
      .set({ 
        stats, 
        lastUpdated: new Date() 
      })
      .where(eq(platforms.id, id))
      .returning();
    return platform;
  }

  async deletePlatform(id: number): Promise<void> {
    await db.delete(platforms).where(eq(platforms.id, id));
  }
}

export const storage = new DatabaseStorage();
