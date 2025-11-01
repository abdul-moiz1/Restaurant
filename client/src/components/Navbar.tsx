import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Home, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  user?: {
    email: string;
    role: "owner" | "customer";
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            data-testid="link-home"
            className="text-xl font-serif font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="text-2xl">🍽️</span>
            Gourmet Haven
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Signed in as a <span className="font-medium text-foreground">({user.role})</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/"
                  data-testid="link-nav-home"
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup" data-testid="link-signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
