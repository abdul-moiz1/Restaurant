import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CustomerDashboard from "@/pages/CustomerDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ email: string; role: "owner" | "customer" } | null>(null);

  const handleLogout = () => {
    setUser(null);
    setLocation("/");
    console.log("User logged out");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/customer" component={CustomerDashboard} />
        <Route path="/owner" component={OwnerDashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
