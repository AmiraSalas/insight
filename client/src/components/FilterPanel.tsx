import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface FilterState {
  funding: string[];
  competitiveness: string[];
  languages: string[];
  countries: string[];
  careerAreas: string[];
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    funding: [],
    competitiveness: [],
    languages: [],
    countries: [],
    careerAreas: []
  });

  const updateFilter = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = {
      ...filters,
      [category]: checked
        ? [...filters[category], value]
        : filters[category].filter(v => v !== value)
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      funding: [],
      competitiveness: [],
      languages: [],
      countries: [],
      careerAreas: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" data-testid="text-filter-title">Filters</h2>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).flatMap(([category, values]) =>
            values.map((value: string) => (
              <Badge 
                key={`${category}-${value}`} 
                variant="secondary"
                className="gap-1"
                data-testid={`badge-active-filter-${value}`}
              >
                {value}
                <X 
                  className="w-3 h-3 cursor-pointer hover-elevate" 
                  onClick={() => updateFilter(category as keyof FilterState, value, false)}
                />
              </Badge>
            ))
          )}
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-3 block">Cost</Label>
          <div className="space-y-2">
            {["Free", "Paid", "Partially Funded", "Fully Funded"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox 
                  id={`funding-${option}`}
                  checked={filters.funding.includes(option)}
                  onCheckedChange={(checked) => updateFilter("funding", option, checked as boolean)}
                  data-testid={`checkbox-funding-${option.toLowerCase().replace(' ', '-')}`}
                />
                <label htmlFor={`funding-${option}`} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-semibold mb-3 block">Competitiveness</Label>
          <div className="space-y-2">
            {["Low", "Low-Medium", "Medium", "Medium-High", "High"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox 
                  id={`comp-${option}`}
                  checked={filters.competitiveness.includes(option)}
                  onCheckedChange={(checked) => updateFilter("competitiveness", option, checked as boolean)}
                  data-testid={`checkbox-competitiveness-${option.toLowerCase()}`}
                />
                <label htmlFor={`comp-${option}`} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-semibold mb-3 block">Language</Label>
          <div className="space-y-2">
            {["English", "Spanish", "Both"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox 
                  id={`lang-${option}`}
                  checked={filters.languages.includes(option)}
                  onCheckedChange={(checked) => updateFilter("languages", option, checked as boolean)}
                  data-testid={`checkbox-language-${option.toLowerCase()}`}
                />
                <label htmlFor={`lang-${option}`} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-semibold mb-3 block">Career Area</Label>
          <div className="space-y-2">
            {["STEM", "Arts", "Healthcare", "Business", "Education", "Social Impact", "Sports"].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox 
                  id={`career-${option}`}
                  checked={filters.careerAreas.includes(option)}
                  onCheckedChange={(checked) => updateFilter("careerAreas", option, checked as boolean)}
                  data-testid={`checkbox-career-${option.toLowerCase().replace(' ', '-')}`}
                />
                <label htmlFor={`career-${option}`} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
