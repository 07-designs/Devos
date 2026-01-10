import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import models from integrations
import * as auth from "./models/auth";
import * as chat from "./models/chat";

export * from "./models/auth";
export * from "./models/chat";

// === PLATFORMS TABLE ===
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // References auth.users.id manually as it's in another file
  name: text("name").notNull(), // 'leetcode', 'github', 'codeforces', etc.
  username: text("username").notNull(),
  // For MVP, we might not store full API keys if not needed, but good to have a place.
  // In a real app, encrypt this!
  config: jsonb("config").default({}), 
  stats: jsonb("stats").default({}), // Cached stats
  lastUpdated: timestamp("last_updated").defaultNow(),
});






// shared/schema.ts

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Add these lines:
  displayName: text("display_name"), 
  email: text("email"),
  imageProfile: text("image_profile"), // You mentioned this already exists
  // ... any other existing fields
});

// Update the insert schema to include these fields
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true, // Add this
  email: true,       // Add this
});

// Define relations for platforms
export const insertPlatformSchema = createInsertSchema(platforms).omit({ 
  id: true, 
  lastUpdated: true,
  stats: true // stats are updated by backend only
});

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;




// === API CONTRACT TYPES ===

// Platform connection request
export type ConnectPlatformRequest = {
  name: string;
  username: string;
  apiKey?: string; // Optional, might be in config
};

// Dashboard Stats Aggregation
export interface DashboardStats {
  platforms: Platform[];
  totalSolved?: number; // Aggregate if possible
  totalCommits?: number;
}

// AI Analysis Request
export interface AnalyzeProfileRequest {
  platformIds: number[]; // Which platforms to include in analysis
}

export interface AnalysisResponse {
  markdown: string;
  roadmap: string; // Extracted roadmap part
}

// === RELATIONS (Optional, but good for Drizzle queries if we merge files) ===
// Since users is in another file, we might not be able to define foreign key relations easily 
// without strict ordering, but for simple MVP usage we can just query by userId.
