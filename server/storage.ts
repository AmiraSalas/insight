import { type Opportunity, type InsertOpportunity, type SiteContent, type InsertSiteContent, opportunities } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: string, opportunity: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  deleteOpportunity(id: string): Promise<boolean>;
  getVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<number>;
  getSiteContent(): Promise<SiteContent>;
  updateSiteContent(content: InsertSiteContent): Promise<SiteContent>;
}

const defaultSiteContent: SiteContent = {
  id: "site-content",
  aboutText: "Created by a TechGirls alum to help students discover life-changing opportunities.",
  quickLinks: [
    { id: "1", label: "Home", url: "/" },
    { id: "2", label: "View Ecuador Opportunities", url: "/?search=Ecuador" },
    { id: "3", label: "Contact", url: "mailto:contact@insight.com" }
  ],
  resourceLinks: [
    { id: "1", label: "How to Apply", url: "/how-to-apply" },
    { id: "2", label: "Scholarship Tips", url: "/tips" }
  ],
  howToApplyTitle: "How to Apply for Opportunities",
  howToApplyContent: `## Step-by-Step Application Guide

Follow these steps to successfully apply for opportunities on INSIGHT.

### Step 1: Find the Right Opportunity

- Use the filters on the homepage to narrow down options
- Check if you meet the eligibility requirements (age, location, language)
- Look at the deadline and funding type

### Step 2: Prepare Your Materials

- **Resume/CV** - Keep it updated with your latest experiences
- **Personal statement** - Write about your goals and motivations
- **Recommendation letters** - Ask teachers or mentors in advance
- **Transcripts** - Request official copies if needed

### Step 3: Start Your Application Early

- Don't wait until the deadline
- Give yourself time to review and revise
- Ask someone to proofread your application

### Step 4: Submit and Follow Up

- Double-check all required documents are attached
- Save a copy of your submitted application
- Note any follow-up deadlines or interviews

### Common Mistakes to Avoid

- Missing deadlines
- Not following instructions carefully
- Submitting incomplete applications
- Generic essays that don't answer the prompt

### Need Help?

Contact us or reach out to a mentor for guidance on your applications.`,
  tipsTitle: "Scholarship Tips & Success Strategies",
  tipsContent: `## Winning Scholarship Strategies

Get tips to make your scholarship applications stand out!

### Before You Apply

1. **Research thoroughly** - Understand what the organization is looking for
2. **Check eligibility** - Make sure you meet all requirements before spending time on an application
3. **Note deadlines** - Create a calendar with all important dates

### Writing Strong Applications

- **Be authentic** - Share your genuine story and motivations
- **Be specific** - Use concrete examples from your experiences
- **Proofread** - Always have someone else review your application
- **Follow instructions** - Read all guidelines carefully

### Interview Tips

- Practice common questions beforehand
- Prepare thoughtful questions to ask them
- Dress appropriately and be punctual
- Follow up with a thank you note

### Dealing with Rejection

Rejection is normal! Many successful students applied to multiple opportunities before being accepted. Keep trying and learning from each experience.

### Financial Aid Tips

- Apply for multiple scholarships to increase your chances
- Look for local and community-based opportunities
- Check if the opportunity covers travel and living expenses

### Need More Help?

Reach out to mentors, teachers, or counselors who can guide you through the process.`,
  lastUpdated: new Date().toISOString()
};

export class DatabaseStorage implements IStorage {
  private visitorCount: number = 0;
  private siteContent: SiteContent = { ...defaultSiteContent };

  async getAllOpportunities(): Promise<Opportunity[]> {
    return await db.select().from(opportunities);
  }

  async getOpportunityById(id: string): Promise<Opportunity | undefined> {
    const result = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return result[0];
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const result = await db.insert(opportunities).values(insertOpportunity).returning();
    return result[0];
  }

  async updateOpportunity(id: string, updates: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const result = await db.update(opportunities).set(updates).where(eq(opportunities.id, id)).returning();
    return result[0];
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    const result = await db.delete(opportunities).where(eq(opportunities.id, id)).returning();
    return result.length > 0;
  }

  async getVisitorCount(): Promise<number> {
    return this.visitorCount;
  }

  async incrementVisitorCount(): Promise<number> {
    this.visitorCount++;
    return this.visitorCount;
  }

  async getSiteContent(): Promise<SiteContent> {
    return this.siteContent;
  }

  async updateSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    if (content.aboutText !== undefined) {
      this.siteContent.aboutText = content.aboutText;
    }
    if (content.quickLinks !== undefined) {
      this.siteContent.quickLinks = content.quickLinks;
    }
    if (content.resourceLinks !== undefined) {
      this.siteContent.resourceLinks = content.resourceLinks;
    }
    if (content.howToApplyTitle !== undefined) {
      this.siteContent.howToApplyTitle = content.howToApplyTitle;
    }
    if (content.howToApplyContent !== undefined) {
      this.siteContent.howToApplyContent = content.howToApplyContent;
    }
    if (content.tipsTitle !== undefined) {
      this.siteContent.tipsTitle = content.tipsTitle;
    }
    if (content.tipsContent !== undefined) {
      this.siteContent.tipsContent = content.tipsContent;
    }
    this.siteContent.lastUpdated = new Date().toISOString();
    return this.siteContent;
  }
}

export const storage = new DatabaseStorage();
