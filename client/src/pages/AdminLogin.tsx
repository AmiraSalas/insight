import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Lightbulb } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if already logged in
  const { data: authCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
  });

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (authCheck?.isAdmin) {
      setLocation("/admin");
    }
  }, [authCheck?.isAdmin, setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Login failed");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
      setPassword("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      loginMutation.mutate(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="w-10 h-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold text-primary">INSIGHT</h1>
          </div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">
            Enter your password to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                data-testid="input-admin-password"
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending || !password}
            data-testid="button-admin-login"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="pt-4 border-t text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="link-back-home"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
