import { storage } from "./storage";
import type { InsertOpportunity } from "@shared/schema";

const seedOpportunities: InsertOpportunity[] = [
  {
    title: "Global Youth Leadership Summit 2025",
    organization: "United Nations Foundation",
    description: "An intensive leadership program bringing together young changemakers from around the world to develop solutions for global challenges.",
    location: "New York, USA",
    country: "USA",
    deadline: "March 15, 2025",
    reopenDate: null,
    deadlineStatus: "open",
    competitiveness: "high",
    funding: "fully-funded",
    language: ["English"],
    duration: "2 weeks",
    ageRange: "16-24",
    careerArea: ["Leadership", "International Relations"],
    url: "https://example.com"
  },
  {
    title: "Women in STEM Summer Program",
    organization: "MIT TechWomen Initiative",
    description: "Hands-on coding and engineering workshops designed to empower young women pursuing STEM careers.",
    location: "Boston, USA",
    country: "USA",
    deadline: "April 1, 2025",
    reopenDate: null,
    deadlineStatus: "open",
    competitiveness: "medium",
    funding: "fully-funded",
    language: ["English"],
    duration: "6 weeks",
    ageRange: "15-18",
    careerArea: ["STEM", "Education"],
    url: "https://example.com"
  },
  {
    title: "Community Health Volunteer Program",
    organization: "Global Health Corps",
    description: "Work with local healthcare providers to improve community health outcomes in underserved areas.",
    location: "Various locations",
    country: "Multiple",
    deadline: "May 30, 2025",
    reopenDate: null,
    deadlineStatus: "open",
    competitiveness: "low",
    funding: "free",
    language: ["English", "Spanish"],
    duration: "3 months",
    ageRange: "18-25",
    careerArea: ["Healthcare", "Social Impact"],
    url: "https://example.com"
  },
  {
    title: "Creative Arts Intensive Workshop",
    organization: "International Arts Foundation",
    description: "Explore various artistic mediums under the guidance of renowned international artists.",
    location: "Barcelona, Spain",
    country: "Spain",
    deadline: "Closed",
    reopenDate: "June 1, 2025",
    deadlineStatus: "reopening",
    competitiveness: "medium",
    funding: "paid",
    language: ["English"],
    duration: "4 weeks",
    ageRange: "16-22",
    careerArea: ["Arts"],
    url: "https://example.com"
  },
  {
    title: "Tech for Good Hackathon",
    organization: "Code for All",
    description: "Build technology solutions for social good in an intense 48-hour collaborative hackathon.",
    location: "Virtual",
    country: "Global",
    deadline: "February 20, 2025",
    reopenDate: null,
    deadlineStatus: "open",
    competitiveness: "low",
    funding: "free",
    language: ["English"],
    duration: "2 days",
    ageRange: "14-30",
    careerArea: ["STEM", "Social Impact"],
    url: "https://example.com"
  },
  {
    title: "Business Leadership Academy",
    organization: "Future Entrepreneurs Network",
    description: "Learn entrepreneurship fundamentals and develop your own business plan with mentorship from industry leaders.",
    location: "London, UK",
    country: "UK",
    deadline: "March 30, 2025",
    reopenDate: null,
    deadlineStatus: "closed",
    competitiveness: "high",
    funding: "fully-funded",
    language: ["English"],
    duration: "5 weeks",
    ageRange: "17-23",
    careerArea: ["Business", "Leadership"],
    url: "https://example.com"
  }
];

export async function seedDatabase() {
  const existingOpportunities = await storage.getAllOpportunities();
  
  if (existingOpportunities.length === 0) {
    console.log("Seeding database with initial opportunities...");
    
    for (const opportunity of seedOpportunities) {
      await storage.createOpportunity(opportunity);
    }
    
    console.log(`Seeded ${seedOpportunities.length} opportunities`);
  } else {
    console.log(`Database already contains ${existingOpportunities.length} opportunities, skipping seed`);
  }
}
