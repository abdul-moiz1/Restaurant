import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiGoogle } from "react-icons/si";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"owner" | "customer" | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("selectedRole") as "owner" | "customer" | null;
    if (role === "customer") {
      setSelectedRole(role);
    } else {
      setLocation("/");
      toast({
        title: "Customer signup only",
        description: "Only customers can create new accounts. Owner accounts are pre-configured.",
        variant: "destructive",
      });
    }
  }, [setLocation, toast]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    setError(null);
    try {
      await signup(email, password, displayName, selectedRole);
      localStorage.removeItem("selectedRole");
      toast({
        title: "Account created!",
        description: "Welcome to Gourmet Haven.",
      });
      setLocation(selectedRole === "owner" ? "/dashboard" : "/menu");
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during signup.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    setError(null);
    try {
      const resultUserData = await loginWithGoogle(selectedRole);
      if (resultUserData) {
        localStorage.removeItem("selectedRole");
        toast({
          title: "Account created!",
          description: "Welcome to Gourmet Haven.",
        });
        setLocation(resultUserData.role === "owner" ? "/dashboard" : "/menu");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during signup.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif">Join Gourmet Haven</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-[#D4AF37]/50 bg-[#FAF7F2] dark:bg-[#D4AF37]/10 dark:border-[#D4AF37] text-center" data-testid="alert-error">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#D4AF37]" />
                <AlertDescription className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                  {error}
                </AlertDescription>
              </div>
            </Alert>
          )}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                type="text"
                data-testid="input-displayname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-signup">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            data-testid="button-google-signup"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
