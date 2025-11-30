import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { SiteContent } from "@/shared/schema";

export default function HowToApplyPage() {
  const { data: siteContent, isLoading } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
        if (match) {
          return (
            <li key={index} className="ml-6 mb-2 list-disc">
              <strong>{match[1]}</strong> - {match[2]}
            </li>
          );
        }
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2 list-disc">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. \*\*/)) {
        const match = line.match(/^\d+\. \*\*(.+?)\*\* - (.+)/);
        if (match) {
          return (
            <li key={index} className="ml-6 mb-2 list-decimal">
              <strong>{match[1]}</strong> - {match[2]}
            </li>
          );
        }
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2 text-muted-foreground">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>
          </Link>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-primary" data-testid="text-how-to-apply-title">
                {isLoading ? "Loading..." : siteContent?.howToApplyTitle || "How to Apply for Opportunities"}
              </h1>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none" data-testid="text-how-to-apply-content">
                {renderMarkdown(siteContent?.howToApplyContent || "")}
              </div>
            )}

            {siteContent?.lastUpdated && (
              <p className="mt-8 text-sm text-muted-foreground border-t pt-4" data-testid="text-how-to-apply-updated">
                Last updated: {new Date(siteContent.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
