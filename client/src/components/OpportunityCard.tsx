import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Clock, Users, ExternalLink, Globe, Briefcase, GraduationCap } from "lucide-react";
import type { Opportunity } from "@/shared/schema";

export type DeadlineStatus = "open" | "reopening" | "closed";
export type CompetitivenessLevel = "low" | "medium" | "high";
export type FundingType = "free" | "paid" | "fully-funded";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDeadlineBadge = () => {
    const status = opportunity.deadlineStatus as DeadlineStatus;
    switch (status) {
      case "open":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-500/20" data-testid={`badge-deadline-${opportunity.id}`}>
            <Calendar className="w-3 h-3 mr-1" />
            Apply by {opportunity.deadline}
          </Badge>
        );
      case "reopening":
        return (
          <Badge className="bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20" data-testid={`badge-deadline-${opportunity.id}`}>
            <Calendar className="w-3 h-3 mr-1" />
            Reopens {opportunity.reopenDate || 'TBD'}
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" data-testid={`badge-deadline-${opportunity.id}`}>
            <Calendar className="w-3 h-3 mr-1" />
            Closed
          </Badge>
        );
    }
  };

  const getFundingBadge = () => {
    const funding = opportunity.funding as FundingType;
    switch (funding) {
      case "fully-funded":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20" data-testid={`badge-funding-${opportunity.id}`}>
            Fully Funded
          </Badge>
        );
      case "free":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20" data-testid={`badge-funding-${opportunity.id}`}>
            Free
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="secondary" data-testid={`badge-funding-${opportunity.id}`}>
            Paid
          </Badge>
        );
    }
  };

  const getCompetitivenessBadge = () => {
    const competitiveness = opportunity.competitiveness as CompetitivenessLevel;
    const labels: Record<CompetitivenessLevel, string> = {
      low: "Low Competition",
      medium: "Medium Competition",
      high: "High Competition"
    };
    return (
      <Badge variant="outline" data-testid={`badge-competitiveness-${opportunity.id}`}>
        {labels[competitiveness] || opportunity.competitiveness}
      </Badge>
    );
  };

  return (
    <>
      <Card 
        className="p-6 hover-elevate active-elevate-2 transition-shadow cursor-pointer" 
        data-testid={`card-opportunity-${opportunity.id}`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 line-clamp-2" data-testid={`text-title-${opportunity.id}`}>
                {opportunity.title}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-organization-${opportunity.id}`}>
                {opportunity.organization}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {getDeadlineBadge()}
            {getFundingBadge()}
            {getCompetitivenessBadge()}
            {opportunity.language.map((lang) => (
              <Badge key={lang} variant="secondary" data-testid={`badge-language-${lang}-${opportunity.id}`}>
                {lang}
              </Badge>
            ))}
          </div>

          <p className="text-sm line-clamp-3 text-muted-foreground" data-testid={`text-description-${opportunity.id}`}>
            {opportunity.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" data-testid={`text-location-${opportunity.id}`}>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" data-testid={`text-duration-${opportunity.id}`}>{opportunity.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" data-testid={`text-age-${opportunity.id}`}>{opportunity.ageRange}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-2">
            {opportunity.careerArea.map((area) => (
              <Badge key={area} variant="outline" className="text-xs" data-testid={`badge-career-${area}-${opportunity.id}`}>
                {area}
              </Badge>
            ))}
          </div>

          <Button className="w-full" data-testid={`button-view-${opportunity.id}`} onClick={(e) => {
            e.stopPropagation();
            window.open(opportunity.url, '_blank');
          }}>
            View Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Full Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid={`modal-opportunity-${opportunity.id}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold pr-8" data-testid={`modal-title-${opportunity.id}`}>
              {opportunity.title}
            </DialogTitle>
            <DialogDescription data-testid={`modal-organization-${opportunity.id}`}>
              {opportunity.organization}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {getDeadlineBadge()}
              {getFundingBadge()}
              {getCompetitivenessBadge()}
              {opportunity.language.map((lang) => (
                <Badge key={lang} variant="secondary">
                  {lang}
                </Badge>
              ))}
            </div>

            {/* Full Description */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                About This Opportunity
              </h4>
              <p className="text-muted-foreground whitespace-pre-wrap" data-testid={`modal-description-${opportunity.id}`}>
                {opportunity.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{opportunity.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Country</p>
                  <p className="text-sm text-muted-foreground">{opportunity.country}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{opportunity.duration}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Age Range</p>
                  <p className="text-sm text-muted-foreground">{opportunity.ageRange}</p>
                </div>
              </div>
            </div>

            {/* Career Areas */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Career Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.careerArea.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button 
              className="w-full" 
              size="lg"
              data-testid={`modal-apply-${opportunity.id}`} 
              onClick={() => window.open(opportunity.url, '_blank')}
            >
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
