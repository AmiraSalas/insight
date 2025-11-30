import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Valid values for filters
export const COMPETITIVENESS_LEVELS = ["low", "low-medium", "medium", "medium-high", "high"] as const;
export const FUNDING_TYPES = ["free", "paid", "partially-funded", "fully-funded"] as const;
export const CAREER_AREAS = ["STEM", "Arts", "Healthcare", "Business", "Education", "Social Impact", "Sports"] as const;

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  deadline: text("deadline").notNull(),
  reopenDate: text("reopen_date"),
  deadlineStatus: text("deadline_status").notNull(),
  competitiveness: text("competitiveness").notNull(),
  funding: text("funding").notNull(),
  language: text("language").array().notNull(),
  duration: text("duration").notNull(),
  ageRange: text("age_range").notNull(),
  careerArea: text("career_area").array().notNull(),
  url: text("url").notNull(),
  isEcuador: boolean("is_ecuador").default(false).notNull(),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
});

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

// Site Content Schema for editable footer, quick links, and tips
export interface QuickLink {
  id: string;
  label: string;
  url: string;
}

export interface SiteContent {
  id: string;
  aboutText: string;
  quickLinks: QuickLink[];
  resourceLinks: QuickLink[];
  howToApplyTitle: string;
  howToApplyContent: string;
  tipsTitle: string;
  tipsContent: string;
  lastUpdated: string;
}

export const insertSiteContentSchema = z.object({
  aboutText: z.string().optional(),
  quickLinks: z.array(z.object({
    id: z.string(),
    label: z.string(),
    url: z.string()
  })).optional(),
  resourceLinks: z.array(z.object({
    id: z.string(),
    label: z.string(),
    url: z.string()
  })).optional(),
  howToApplyTitle: z.string().optional(),
  howToApplyContent: z.string().optional(),
  tipsTitle: z.string().optional(),
  tipsContent: z.string().optional(),
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
