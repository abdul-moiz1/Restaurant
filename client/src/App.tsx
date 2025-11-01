import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Menu from "@/pages/Menu";
import Preferences from "@/pages/Preferences";
import Checkout from "@/pages/Checkout";
import Cart from "@/pages/Cart";
import OwnerDashboard from "@/pages/OwnerDashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, requiredRole }: { component: any; requiredRole?: "owner" | "customer" }) {
  const { userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && userData.role !== requiredRole) {
    return <Redirect to={userData.role === "owner" ? "/owner" : "/customer"} />;
  }

  return <Component />;
}

function Router() {
  const [, setLocation] = useLocation();
  const { userData, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <>
      <Navbar 
        user={userData ? { email: userData.email, role: userData.role } : null} 
        onLogout={handleLogout} 
      />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/menu" component={Menu} />
        <Route path="/preferences" component={Preferences} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout">
          {() => <ProtectedRoute component={Checkout} requiredRole="customer" />}
        </Route>
        <Route path="/owner">
          {() => <ProtectedRoute component={OwnerDashboard} requiredRole="owner" />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <HotToaster position="top-right" />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
