import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SiGoogle } from "react-icons/si";
import RoleSelector from "@/components/RoleSelector";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Email signup:", { email, password });
    setTimeout(() => {
      setLoading(false);
      setShowRoleSelector(true);
    }, 1000);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    setTimeout(() => {
      setShowRoleSelector(true);
    }, 1000);
  };

  const handleRoleSelect = (role: "owner" | "customer") => {
    console.log("Role selected:", role);
    setShowRoleSelector(false);
    setLocation(role === "owner" ? "/owner" : "/customer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-serif">Join Gourmet Haven</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
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

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-primary font-medium hover:underline" data-testid="link-login">
                Sign in
              </a>
            </Link>
          </p>
        </CardContent>
      </Card>

      <RoleSelector isOpen={showRoleSelector} onSelect={handleRoleSelect} />
    </div>
  );
}
