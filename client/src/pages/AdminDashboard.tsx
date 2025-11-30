import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Opportunity, SiteContent, QuickLink } from "@/shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Plus, Edit, Trash2, Lightbulb, ExternalLink, Save, X, FileText, BookOpen } from "lucide-react";
import { OpportunityForm } from "@/components/OpportunityForm";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("opportunities");

  // Site content editing state
  const [editedAboutText, setEditedAboutText] = useState("");
  const [editedQuickLinks, setEditedQuickLinks] = useState<QuickLink[]>([]);
  const [editedResourceLinks, setEditedResourceLinks] = useState<QuickLink[]>([]);
  const [editedHowToApplyTitle, setEditedHowToApplyTitle] = useState("");
  const [editedHowToApplyContent, setEditedHowToApplyContent] = useState("");
  const [editedTipsTitle, setEditedTipsTitle] = useState("");
  const [editedTipsContent, setEditedTipsContent] = useState("");
  const [hasFooterChanges, setHasFooterChanges] = useState(false);
  const [hasHowToApplyChanges, setHasHowToApplyChanges] = useState(false);
  const [hasTipsChanges, setHasTipsChanges] = useState(false);
  const [contentInitialized, setContentInitialized] = useState(false);

  // Check authentication
  const { data: authCheck, isLoading: authLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  // Fetch all opportunities with auto-refresh
  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Fetch visitor count
  const { data: visitorData } = useQuery<{ count: number }>({
    queryKey: ["/api/visitor/count"],
  });

  // Fetch site content with auto-refresh
  const { data: siteContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Initialize edited content when site content loads
  useEffect(() => {
    if (siteContent && !contentInitialized) {
      setEditedAboutText(siteContent.aboutText);
      setEditedQuickLinks([...siteContent.quickLinks]);
      setEditedResourceLinks([...siteContent.resourceLinks]);
      setEditedHowToApplyTitle(siteContent.howToApplyTitle);
      setEditedHowToApplyContent(siteContent.howToApplyContent);
      setEditedTipsTitle(siteContent.tipsTitle);
      setEditedTipsContent(siteContent.tipsContent);
      setContentInitialized(true);
    }
  }, [siteContent, contentInitialized]);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin-login");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/opportunities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      toast({
        title: "Opportunity deleted",
        description: "The opportunity has been removed",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete the opportunity",
        variant: "destructive",
      });
    },
  });

  // Save footer content mutation
  const saveFooterMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/site-content", {
        aboutText: editedAboutText,
        quickLinks: editedQuickLinks,
        resourceLinks: editedResourceLinks,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      toast({
        title: "Footer saved",
        description: "Footer content has been updated successfully",
      });
      setHasFooterChanges(false);
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save footer content",
        variant: "destructive",
      });
    },
  });

  // Save How to Apply page mutation
  const saveHowToApplyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/site-content", {
        howToApplyTitle: editedHowToApplyTitle,
        howToApplyContent: editedHowToApplyContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      toast({
        title: "How to Apply page saved",
        description: "Page content has been updated successfully",
      });
      setHasHowToApplyChanges(false);
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save page content",
        variant: "destructive",
      });
    },
  });

  // Save Tips page mutation
  const saveTipsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/site-content", {
        tipsTitle: editedTipsTitle,
        tipsContent: editedTipsContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      toast({
        title: "Scholarship Tips page saved",
        description: "Page content has been updated successfully",
      });
      setHasTipsChanges(false);
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save page content",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  if (!authLoading && !authCheck?.isAdmin) {
    setLocation("/admin-login");
    return null;
  }

  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingOpportunity(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOpportunity(null);
  };

  const addQuickLink = () => {
    setEditedQuickLinks([...editedQuickLinks, { id: Date.now().toString(), label: "", url: "" }]);
    setHasFooterChanges(true);
  };

  const removeQuickLink = (id: string) => {
    setEditedQuickLinks(editedQuickLinks.filter(link => link.id !== id));
    setHasFooterChanges(true);
  };

  const updateQuickLink = (id: string, field: "label" | "url", value: string) => {
    setEditedQuickLinks(editedQuickLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
    setHasFooterChanges(true);
  };

  const addResourceLink = () => {
    setEditedResourceLinks([...editedResourceLinks, { id: Date.now().toString(), label: "", url: "" }]);
    setHasFooterChanges(true);
  };

  const removeResourceLink = (id: string) => {
    setEditedResourceLinks(editedResourceLinks.filter(link => link.id !== id));
    setHasFooterChanges(true);
  };

  const updateResourceLink = (id: string, field: "label" | "url", value: string) => {
    setEditedResourceLinks(editedResourceLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
    setHasFooterChanges(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-primary fill-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">INSIGHT Admin</h1>
                <p className="text-sm text-muted-foreground">Manage Your Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open("/", "_blank")}
                data-testid="button-view-site"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Visitor Counter */}
        <Card className="mb-6 p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg bg-primary/10">
              <svg 
                className="w-8 h-8 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Website Visitors</p>
              <p className="text-4xl font-bold text-primary" data-testid="text-visitor-count">
                {visitorData?.count ?? 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="opportunities" data-testid="tab-opportunities">
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="footer" data-testid="tab-footer">
              Footer
            </TabsTrigger>
            <TabsTrigger value="how-to-apply" data-testid="tab-how-to-apply">
              How to Apply Page
            </TabsTrigger>
            <TabsTrigger value="tips" data-testid="tab-tips">
              Scholarship Tips Page
            </TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">All Opportunities</h2>
                <p className="text-muted-foreground mt-1">
                  {opportunities.length} total opportunities
                </p>
              </div>
              <Button onClick={handleAdd} data-testid="button-add-opportunity">
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </div>

            {isLoading ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading opportunities...</p>
              </Card>
            ) : opportunities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No opportunities yet. Add your first one!</p>
              </Card>
            ) : (
              <Card className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id} data-testid={`row-opportunity-${opp.id}`}>
                        <TableCell className="font-medium">{opp.title}</TableCell>
                        <TableCell>{opp.organization}</TableCell>
                        <TableCell>{opp.country}</TableCell>
                        <TableCell>{opp.deadline}</TableCell>
                        <TableCell className="capitalize">{opp.funding.replace('-', ' ')}</TableCell>
                        <TableCell className="capitalize">{opp.deadlineStatus}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(opp)}
                              data-testid={`button-edit-${opp.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(opp.id)}
                              data-testid={`button-delete-${opp.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">Footer Content</h2>
                <p className="text-muted-foreground mt-1">
                  Edit the About section and navigation links
                </p>
              </div>
              <Button 
                onClick={() => saveFooterMutation.mutate()}
                disabled={!hasFooterChanges || saveFooterMutation.isPending}
                data-testid="button-save-footer"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveFooterMutation.isPending ? "Saving..." : "Save Footer"}
              </Button>
            </div>

            <div className="space-y-6">
              {/* About Text */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">About the Project</h3>
                <Textarea
                  value={editedAboutText}
                  onChange={(e) => {
                    setEditedAboutText(e.target.value);
                    setHasFooterChanges(true);
                  }}
                  placeholder="About text for the footer..."
                  rows={3}
                  data-testid="input-about-text"
                />
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-semibold">Quick Links</h3>
                  <Button variant="outline" size="sm" onClick={addQuickLink} data-testid="button-add-quick-link">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-3">
                  {editedQuickLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center gap-3 flex-wrap">
                      <Input
                        value={link.label}
                        onChange={(e) => updateQuickLink(link.id, "label", e.target.value)}
                        placeholder="Label (e.g., Home)"
                        className="flex-1 min-w-[150px]"
                        data-testid={`input-quick-link-label-${index}`}
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateQuickLink(link.id, "url", e.target.value)}
                        placeholder="URL (e.g., / or /?search=Ecuador)"
                        className="flex-1 min-w-[150px]"
                        data-testid={`input-quick-link-url-${index}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuickLink(link.id)}
                        data-testid={`button-remove-quick-link-${index}`}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {editedQuickLinks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No quick links. Add one above.</p>
                  )}
                </div>
              </Card>

              {/* Resource Links */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-semibold">Resources Links</h3>
                  <Button variant="outline" size="sm" onClick={addResourceLink} data-testid="button-add-resource-link">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-3">
                  {editedResourceLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center gap-3 flex-wrap">
                      <Input
                        value={link.label}
                        onChange={(e) => updateResourceLink(link.id, "label", e.target.value)}
                        placeholder="Label (e.g., How to Apply)"
                        className="flex-1 min-w-[150px]"
                        data-testid={`input-resource-link-label-${index}`}
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateResourceLink(link.id, "url", e.target.value)}
                        placeholder="URL (e.g., /how-to-apply)"
                        className="flex-1 min-w-[150px]"
                        data-testid={`input-resource-link-url-${index}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeResourceLink(link.id)}
                        data-testid={`button-remove-resource-link-${index}`}
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {editedResourceLinks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No resource links. Add one above.</p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* How to Apply Tab */}
          <TabsContent value="how-to-apply">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">How to Apply Page</h2>
                  <p className="text-muted-foreground mt-1">
                    Edit the content shown on /how-to-apply
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open("/how-to-apply", "_blank")}
                  data-testid="button-preview-how-to-apply"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview Page
                </Button>
                <Button 
                  onClick={() => saveHowToApplyMutation.mutate()}
                  disabled={!hasHowToApplyChanges || saveHowToApplyMutation.isPending}
                  data-testid="button-save-how-to-apply"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveHowToApplyMutation.isPending ? "Saving..." : "Save Page"}
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="how-to-apply-title">Page Title</Label>
                  <Input
                    id="how-to-apply-title"
                    value={editedHowToApplyTitle}
                    onChange={(e) => {
                      setEditedHowToApplyTitle(e.target.value);
                      setHasHowToApplyChanges(true);
                    }}
                    placeholder="How to Apply for Opportunities"
                    data-testid="input-how-to-apply-title"
                  />
                </div>
                <div>
                  <Label htmlFor="how-to-apply-content">
                    Page Content (Use ## for headings, ### for subheadings, - for bullet lists)
                  </Label>
                  <Textarea
                    id="how-to-apply-content"
                    value={editedHowToApplyContent}
                    onChange={(e) => {
                      setEditedHowToApplyContent(e.target.value);
                      setHasHowToApplyChanges(true);
                    }}
                    placeholder="## Main Heading&#10;&#10;Some content...&#10;&#10;### Subheading&#10;&#10;- List item 1&#10;- List item 2"
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="input-how-to-apply-content"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Scholarship Tips Tab */}
          <TabsContent value="tips">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Scholarship Tips Page</h2>
                  <p className="text-muted-foreground mt-1">
                    Edit the content shown on /tips
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open("/tips", "_blank")}
                  data-testid="button-preview-tips"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview Page
                </Button>
                <Button 
                  onClick={() => saveTipsMutation.mutate()}
                  disabled={!hasTipsChanges || saveTipsMutation.isPending}
                  data-testid="button-save-tips"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveTipsMutation.isPending ? "Saving..." : "Save Page"}
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tips-title">Page Title</Label>
                  <Input
                    id="tips-title"
                    value={editedTipsTitle}
                    onChange={(e) => {
                      setEditedTipsTitle(e.target.value);
                      setHasTipsChanges(true);
                    }}
                    placeholder="Scholarship Tips & Success Strategies"
                    data-testid="input-tips-title"
                  />
                </div>
                <div>
                  <Label htmlFor="tips-content">
                    Page Content (Use ## for headings, ### for subheadings, - for bullet lists)
                  </Label>
                  <Textarea
                    id="tips-content"
                    value={editedTipsContent}
                    onChange={(e) => {
                      setEditedTipsContent(e.target.value);
                      setHasTipsChanges(true);
                    }}
                    placeholder="## Main Heading&#10;&#10;Some content...&#10;&#10;### Subheading&#10;&#10;- List item 1&#10;- List item 2"
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="input-tips-content"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Opportunity Form Dialog */}
      {showForm && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={handleFormClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
