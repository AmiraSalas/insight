import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FilterPanel, type FilterState } from "@/components/FilterPanel";
import { OpportunityCard } from "@/components/OpportunityCard";
import { EcuadorSection } from "@/components/EcuadorSection";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import type { Opportunity } from "@/shared/schema";

export default function HomePage() {
  // Get search parameter from URL
  const searchParams = useSearch();
  const urlSearchParam = new URLSearchParams(searchParams).get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlSearchParam);
  const [filters, setFilters] = useState<FilterState>({
    funding: [],
    competitiveness: [],
    languages: [],
    countries: [],
    careerAreas: []
  });

  // Update search query when URL param changes
  useEffect(() => {
    if (urlSearchParam) {
      setSearchQuery(urlSearchParam);
    }
  }, [urlSearchParam]);

  // Fetch opportunities from API - refetchOnWindowFocus ensures data syncs when switching tabs
  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Increment visitor count when page loads
  useEffect(() => {
    fetch("/api/visitor/increment", { method: "POST" })
      .catch(err => console.error("Failed to increment visitor count:", err));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const handleQuickFilter = (filter: string) => {
    console.log("Quick filter:", filter);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      funding: [],
      competitiveness: [],
      languages: [],
      countries: [],
      careerAreas: []
    });
    setSearchQuery("");
  };

  // Filter opportunities based on search and filters
  const filteredOpportunities = opportunities.filter(opp => {
    // Search filter - searches across many fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      // Special case: if searching for "ecuador", also include opportunities with isEcuador checked
      const isEcuadorSearch = query === "ecuador" || query.includes("ecuador");
      if (isEcuadorSearch && opp.isEcuador) {
        return true; // Include this opportunity
      }
      
      const matchesSearch = 
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.location.toLowerCase().includes(query) ||
        opp.country.toLowerCase().includes(query) ||
        opp.careerArea.some(area => area.toLowerCase().includes(query)) ||
        opp.language.some(lang => lang.toLowerCase().includes(query)) ||
        opp.funding.toLowerCase().replace('-', ' ').includes(query) ||
        opp.competitiveness.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Funding filter
    if (filters.funding.length > 0) {
      const fundingMatch = filters.funding.some(f => 
        f.toLowerCase().replace(' ', '-') === opp.funding
      );
      if (!fundingMatch) return false;
    }

    // Competitiveness filter
    if (filters.competitiveness.length > 0) {
      const compMatch = filters.competitiveness.some(c =>
        c.toLowerCase() === opp.competitiveness
      );
      if (!compMatch) return false;
    }

    // Language filter
    if (filters.languages.length > 0) {
      const langMatch = filters.languages.some(l => {
        if (l === "Both") return opp.language.length > 1;
        return opp.language.includes(l);
      });
      if (!langMatch) return false;
    }

    // Career area filter
    if (filters.careerAreas.length > 0) {
      const careerMatch = filters.careerAreas.some(c =>
        opp.careerArea.includes(c)
      );
      if (!careerMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero onSearch={handleSearch} onQuickFilter={handleQuickFilter} searchValue={searchQuery} />
        
        <div id="opportunities" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-20">
                <FilterPanel onFilterChange={handleFilterChange} />
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="rounded-full shadow-lg" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterPanel onFilterChange={handleFilterChange} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Opportunities Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" data-testid="text-results-title">
                  {isLoading 
                    ? "Loading..." 
                    : filteredOpportunities.length === 0 
                      ? "No Opportunities Found" 
                      : `${filteredOpportunities.length} ${filteredOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'} Found`
                  }
                </h2>
                <p className="text-muted-foreground">
                  Discover programs that match your interests and goals
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-muted-foreground">Loading opportunities...</p>
                </div>
              ) : filteredOpportunities.length === 0 ? (
                <EmptyState onClearFilters={clearAllFilters} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOpportunities.map(opportunity => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <EcuadorSection />
      </main>

      <Footer />
    </div>
  );
}
