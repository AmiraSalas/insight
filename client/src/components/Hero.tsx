import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  onSearch: (query: string) => void;
  onQuickFilter: (filter: string) => void;
  searchValue?: string;
}

export function Hero({ onSearch, onQuickFilter, searchValue = "" }: HeroProps) {
  const quickFilters = [
    "Fully Funded",
    "Ecuador Only",
    "Closing Soon",
    "No Experience Required"
  ];

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
          Find Your Perfect Opportunity
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
          Free programs, internships, and volunteering opportunities filtered for students like you
        </p>
        
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar onSearch={onSearch} defaultValue={searchValue} />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {quickFilters.map((filter) => (
            <Badge 
              key={filter}
              className="cursor-pointer bg-white/20 backdrop-blur-md text-white border-white/30 hover-elevate active-elevate-2"
              onClick={() => onQuickFilter(filter)}
              data-testid={`badge-quick-filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {filter}
            </Badge>
          ))}
        </div>

        <Button 
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
          onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
          data-testid="button-explore"
        >
          Explore Opportunities
        </Button>

        <p className="text-sm text-white/70 mt-8" data-testid="text-opportunity-count">
          500+ verified opportunities
        </p>
      </div>
    </div>
  );
}
