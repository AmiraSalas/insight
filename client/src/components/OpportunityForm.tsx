import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertOpportunitySchema, type Opportunity } from "@/shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const formSchema = insertOpportunitySchema.extend({
  language: z.string().transform((val) => val.split(",").map((v) => v.trim())),
  careerArea: z.string().transform((val) => val.split(",").map((v) => v.trim())),
});

interface OpportunityFormProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export function OpportunityForm({ opportunity, onClose }: OpportunityFormProps) {
  const { toast } = useToast();
  const isEditing = !!opportunity;

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: opportunity
      ? ({
          ...opportunity,
          language: opportunity.language.join(", "),
          careerArea: opportunity.careerArea.join(", "),
        } as z.input<typeof formSchema>)
      : {
          title: "",
          organization: "",
          description: "",
          location: "",
          country: "",
          deadline: "",
          reopenDate: "",
          deadlineStatus: "open",
          competitiveness: "medium",
          funding: "free",
          language: "English",
          careerArea: "",
          duration: "",
          ageRange: "",
          url: "",
          isEcuador: false,
        },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: z.output<typeof formSchema>) => {
      const url = isEditing
        ? `/api/opportunities/${opportunity.id}`
        : "/api/opportunities";
      const method = isEditing ? "PATCH" : "POST";

      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      toast({
        title: isEditing ? "Opportunity updated" : "Opportunity created",
        description: isEditing
          ? "The opportunity has been updated successfully"
          : "New opportunity has been added successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save the opportunity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.input<typeof formSchema>) => {
    saveMutation.mutate(data as unknown as z.output<typeof formSchema>);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Opportunity" : "Add New Opportunity"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Global Youth Leadership Summit"
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., United Nations Foundation"
                      {...field}
                      data-testid="input-organization"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the opportunity..."
                      rows={3}
                      {...field}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, USA" {...field} data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USA" {...field} data-testid="input-country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isEcuador"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-primary/5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-ecuador"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      Show in Ecuador Opportunities Section
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this box to feature this opportunity in the special Ecuador section on the homepage
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/apply"
                      {...field}
                      data-testid="input-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., March 15, 2025" {...field} data-testid="input-deadline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadlineStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-deadline-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="reopening">Reopening</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reopenDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reopen Date (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., June 1, 2025"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-reopen-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="funding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-funding">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partially-funded">Partially Funded</SelectItem>
                        <SelectItem value="fully-funded">Fully Funded</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="competitiveness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitiveness *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-competitiveness">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="low-medium">Low-Medium</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="medium-high">Medium-High</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages * (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., English, Spanish"
                      {...field}
                      data-testid="input-language"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Areas * (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., STEM, Leadership, Social Impact"
                      {...field}
                      data-testid="input-career-area"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 weeks" {...field} data-testid="input-duration" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 16-24" {...field} data-testid="input-age-range" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel-form"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save-opportunity"
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Opportunity"
                  : "Add Opportunity"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
