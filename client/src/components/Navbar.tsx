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

          <div className="flex items-center gap-4">
            <Link 
              href="/"
              data-testid="link-nav-home"
              className={`text-sm hover:text-primary transition-colors ${location === "/" ? "text-primary font-medium" : "text-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/menu"
              data-testid="link-nav-menu"
              className={`text-sm hover:text-primary transition-colors ${location === "/menu" ? "text-primary font-medium" : "text-foreground"}`}
            >
              Menu
            </Link>
            <Link 
              href="/preferences"
              data-testid="link-nav-preferences"
              className={`text-sm hover:text-primary transition-colors ${location === "/preferences" ? "text-primary font-medium" : "text-foreground"}`}
            >
              Preferences
            </Link>
            
            {user ? (
              <>
                <Link 
                  href={user.role === "owner" ? "/owner" : "/checkout"}
                  data-testid="link-nav-dashboard"
                  className={`text-sm hover:text-primary transition-colors ${location === (user.role === "owner" ? "/owner" : "/checkout") ? "text-primary font-medium" : "text-foreground"}`}
                >
                  {user.role === "owner" ? "Dashboard" : "Checkout"}
                </Link>
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
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup" data-testid="link-signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
