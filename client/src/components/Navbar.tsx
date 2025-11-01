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
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-background/95 border-b">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <a
              data-testid="link-home"
              className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="text-3xl">🍽️</span>
              Gourmet Haven
            </a>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <a
                data-testid="link-nav-home"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  location === "/" ? "text-primary font-medium" : "text-foreground hover:text-primary"
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </a>
            </Link>

            {user ? (
              <>
                <Link href={user.role === "owner" ? "/owner" : "/customer"}>
                  <a
                    data-testid="link-dashboard"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      location.includes(user.role) ? "text-primary font-medium" : "text-foreground hover:text-primary"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </a>
                </Link>
                <Button
                  variant="outline"
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
                <Link href="/login">
                  <a data-testid="link-login">
                    <Button variant="outline">Login</Button>
                  </a>
                </Link>
                <Link href="/signup">
                  <a data-testid="link-signup">
                    <Button variant="default">Sign Up</Button>
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
