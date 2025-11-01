import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingCart, CheckCircle } from "lucide-react";

export default function Checkout() {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-serif">Checkout</CardTitle>
            <CardDescription>Complete your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2" data-testid="text-welcome">
                Welcome, {userData?.displayName}!
              </h2>
              <p className="text-muted-foreground mb-6">
                You're authenticated as a customer and can now proceed with checkout.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                This is a demo checkout page. In a production app, you would add:
              </p>
              <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Shopping cart functionality</li>
                <li>• Payment processing (Stripe, PayPal, etc.)</li>
                <li>• Delivery address collection</li>
                <li>• Order confirmation and tracking</li>
              </ul>
              <div className="flex gap-3 justify-center">
                <Link href="/menu">
                  <Button data-testid="button-back-to-menu">
                    Back to Menu
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" data-testid="button-home">
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
