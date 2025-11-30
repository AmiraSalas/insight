import { OpportunityCard } from '../OpportunityCard';
import type { Opportunity } from '@/shared/schema';

export default function OpportunityCardExample() {
  const mockOpportunity: Opportunity = {
    id: "1",
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
    url: "https://example.com",
    isEcuador: false
  };

  return (
    <div className="max-w-md">
      <OpportunityCard opportunity={mockOpportunity} />
    </div>
  );
}
