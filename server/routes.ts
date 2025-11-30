import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOpportunitySchema, insertSiteContentSchema } from "@shared/schema";

// Middleware to check if user is authenticated as admin
function requireAdmin(req: any, res: any, next: any) {
  if (req.session?.isAdmin) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Authentication Routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password === adminPassword) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  // Visitor counter routes
  app.post("/api/visitor/increment", async (req, res) => {
    try {
      const count = await storage.incrementVisitorCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment visitor count" });
    }
  });

  app.get("/api/visitor/count", async (req, res) => {
    try {
      const count = await storage.getVisitorCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get visitor count" });
    }
  });

  // Site Content routes (public for reading, admin for updating)
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to get site content" });
    }
  });

  app.put("/api/site-content", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSiteContentSchema.parse(req.body);
      const content = await storage.updateSiteContent(validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ error: "Failed to update site content" });
    }
  });

  // Get all opportunities with optional filtering
  app.get("/api/opportunities", async (req, res) => {
    try {
      let opportunities = await storage.getAllOpportunities();
      
      // Apply filters from query parameters
      const { funding, competitiveness, language, country, careerArea } = req.query;
      
      if (funding) {
        const fundingFilters = Array.isArray(funding) ? funding : [funding];
        opportunities = opportunities.filter(opp => 
          fundingFilters.includes(opp.funding)
        );
      }
      
      if (competitiveness) {
        const compFilters = Array.isArray(competitiveness) ? competitiveness : [competitiveness];
        opportunities = opportunities.filter(opp => 
          compFilters.includes(opp.competitiveness)
        );
      }
      
      if (language) {
        const langFilters = Array.isArray(language) ? language : [language];
        opportunities = opportunities.filter(opp => 
          langFilters.some(lang => opp.language.includes(lang as string))
        );
      }
      
      if (country) {
        const countryFilters = Array.isArray(country) ? country : [country];
        opportunities = opportunities.filter(opp => 
          countryFilters.includes(opp.country)
        );
      }
      
      if (careerArea) {
        const careerFilters = Array.isArray(careerArea) ? careerArea : [careerArea];
        opportunities = opportunities.filter(opp => 
          careerFilters.some(area => opp.careerArea.includes(area as string))
        );
      }
      
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // Get a single opportunity by ID
  app.get("/api/opportunities/:id", async (req, res) => {
    try {
      const opportunity = await storage.getOpportunityById(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(opportunity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch opportunity" });
    }
  });

  // Create a new opportunity (ADMIN ONLY)
  app.post("/api/opportunities", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity(validatedData);
      res.status(201).json(opportunity);
    } catch (error) {
      res.status(400).json({ error: "Invalid opportunity data" });
    }
  });

  // Update an opportunity (ADMIN ONLY)
  app.patch("/api/opportunities/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertOpportunitySchema.partial().parse(req.body);
      const opportunity = await storage.updateOpportunity(req.params.id, validatedData);
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(opportunity);
    } catch (error) {
      res.status(400).json({ error: "Failed to update opportunity" });
    }
  });

  // Delete an opportunity (ADMIN ONLY)
  app.delete("/api/opportunities/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteOpportunity(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete opportunity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
