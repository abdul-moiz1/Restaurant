import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import RoleSelectionModal from "./RoleSelectionModal";

interface NavbarProps {
  user?: {
    email: string;
    displayName?: string;
    role: "owner" | "customer";
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const { itemCount } = useCart();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowRoleModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode("signup");
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: "owner" | "customer") => {
    setShowRoleModal(false);
    setLocation(authMode === "login" ? "/login" : "/signup");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#D4AF37] after:to-transparent">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            data-testid="link-home"
            className="text-xl font-serif font-bold flex items-center gap-2 group"
          >
            <UtensilsCrossed className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent animate-shimmer-text">
              Gourmet Haven
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground" data-testid="text-welcome-user">
                  Welcome, <span className="text-[#D4AF37] font-medium">{user.displayName || user.email.split('@')[0]}</span>
                </span>
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
                    href="/dashboard"
                    data-testid="link-nav-dashboard"
                    className={`text-sm font-medium hover:text-[#D4AF37] transition-colors ${location === "/dashboard" ? "text-[#D4AF37]" : "text-foreground"}`}
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
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:text-[#D4AF37]"
                  onClick={handleLoginClick}
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:shadow-[0_0_35px_rgba(212,175,55,0.8)] transition-all duration-300"
                  onClick={handleSignupClick}
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectRole={handleRoleSelect}
        mode={authMode}
      />
    </nav>
  );
}
