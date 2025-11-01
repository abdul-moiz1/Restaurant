import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  user?: {
    email: string;
    role: "owner" | "customer";
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [location] = useLocation();
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            data-testid="link-home"
            className="text-xl font-serif font-bold text-foreground hover:text-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <UtensilsCrossed className="w-6 h-6 text-[#D4AF37]" />
            Gourmet Haven
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/"
              data-testid="link-nav-home"
              className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${location === "/" ? "text-[#D4AF37]" : "text-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/menu"
              data-testid="link-nav-menu"
              className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${location === "/menu" ? "text-[#D4AF37]" : "text-foreground"}`}
            >
              Menu
            </Link>
            
            {user ? (
              <>
                {user.role === "customer" && (
                  <Link 
                    href="/cart"
                    data-testid="link-nav-cart"
                    className="relative"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-2 ${location === "/cart" ? "text-[#D4AF37]" : ""}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                      {itemCount > 0 && (
                        <Badge className="ml-1 bg-[#D4AF37] text-white px-2 py-0.5 text-xs" data-testid="badge-cart-count">
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}
                {user.role === "owner" && (
                  <Link 
                    href="/owner"
                    data-testid="link-nav-dashboard"
                    className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${location === "/owner" ? "text-[#D4AF37]" : "text-foreground"}`}
                  >
                    Dashboard
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                  className="flex items-center gap-2 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" data-testid="link-login">
                <Button size="sm" className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
