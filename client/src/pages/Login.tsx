import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SiGoogle } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import OwnerPinModal from "@/components/OwnerPinModal";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, userData, logout } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"owner" | "customer" | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("selectedRole") as "owner" | "customer" | null;
    if (role) {
      setSelectedRole(role);
    } else if (!userData && !loading) {
      setLocation("/");
      toast({
        title: "Please select a role",
        description: "Click Login button to select your role first.",
        variant: "destructive",
      });
    }
  }, [setLocation, toast, userData, loading]);

  useEffect(() => {
    if (userData && !loading) {
      if (userData.role === "owner" && !pinVerified) {
        setShowPinModal(true);
      } else if (userData.role === "customer") {
        setLocation("/menu");
      } else if (userData.role === "owner" && pinVerified) {
        setLocation("/dashboard");
      }
    }
  }, [userData, pinVerified, setLocation, loading]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      await login(email, password);
      localStorage.removeItem("selectedRole");
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      const resultUserData = await loginWithGoogle(selectedRole);
      if (resultUserData) {
        localStorage.removeItem("selectedRole");
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in with Google.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Google sign-in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinSuccess = () => {
    setPinVerified(true);
    setShowPinModal(false);
    toast({
      title: "Access granted",
      description: "Welcome to the Owner Dashboard.",
    });
  };

  const handlePinCancel = async () => {
    setShowPinModal(false);
    await logout();
    setLocation("/");
    toast({
      title: "Login cancelled",
      description: "PIN verification was cancelled.",
      variant: "destructive",
    });
  };

  if (!selectedRole) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Gourmet Haven account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-login">
              {loading ? "Signing in..." : "Sign In"}
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
            onClick={handleGoogleLogin}
            data-testid="button-google-login"
          >
            <SiGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
      <OwnerPinModal
        isOpen={showPinModal}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    </div>
  );
}
