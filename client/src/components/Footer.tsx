import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { SiteContent } from "@/shared/schema";

export function Footer() {
  const { data: siteContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return (
    <footer className="w-full border-t bg-card mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-footer-about">About the Project</h3>
            <p className="text-sm text-muted-foreground">
              {siteContent?.aboutText || "Created by a TechGirls alum to help students discover life-changing opportunities."}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-footer-links">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(siteContent?.quickLinks || [
                { id: "1", label: "Home", url: "/" },
                { id: "2", label: "View Ecuador Opportunities", url: "/?search=Ecuador" },
                { id: "3", label: "Contact", url: "mailto:contact@insight.com" }
              ]).map((link) => (
                <li key={link.id}>
                  {link.url.startsWith('/') ? (
                    <Link href={link.url} className="hover:text-foreground" data-testid={`link-${link.label.toLowerCase()}`}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.url} className="hover:text-foreground" data-testid={`link-${link.label.toLowerCase()}`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-footer-resources">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(siteContent?.resourceLinks || [
                { id: "1", label: "How to Apply", url: "/how-to-apply" },
                { id: "2", label: "Scholarship Tips", url: "/tips" }
              ]).map((link) => (
                <li key={link.id}>
                  {link.url.startsWith('/') ? (
                    <Link href={link.url} className="hover:text-foreground" data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.url} className="hover:text-foreground" data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-footer-language">Language</h3>
            <p className="text-sm text-muted-foreground mb-2">English / Español</p>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer-update">Deadlines update automatically - Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2" data-testid="text-footer-copyright">© 2025 INSIGHT. Community Action Project.</p>
        </div>
      </div>
    </footer>
  );
}
