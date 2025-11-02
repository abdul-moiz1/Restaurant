import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShoppingBag, MapPin, Phone, Mail, User, CheckCircle2, ArrowLeft, Plus, Minus } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Delivery address is required"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { userData } = useAuth();
  const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    subtotal: number;
    tax: number;
    total: number;
  } | null>(null);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: userData?.displayName || "",
      email: userData?.email || "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  // Redirect if cart is empty
  if (cart.length === 0 && !orderPlaced) {
    setLocation("/menu");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    try {
      // Capture totals before clearing cart
      const orderSubtotal = total;
      const orderTax = total * 0.1;
      const orderTotal = total * 1.1;
      
      // Create order object
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        customerInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          notes: data.notes || "",
        },
        // Link to user if authenticated
        userId: userData?.uid || null,
        isGuest: !userData,
        subtotal: orderSubtotal,
        tax: orderTax,
        total: orderTotal,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      // Save order to Firestore
      const ordersCollection = collection(db, "orders");
      const docRef = await addDoc(ordersCollection, orderData);
      
      setOrderId(docRef.id);
      setCompletedOrder({
        subtotal: orderSubtotal,
        tax: orderTax,
        total: orderTotal,
      });
      setOrderPlaced(true);
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order #${docRef.id.slice(0, 8)} has been confirmed.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order confirmation screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-[#D4AF37]/20">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-6 rounded-full bg-green-100">
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground mb-2">
                Thank you for your order, {form.getValues("fullName")}!
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Order ID: <span className="font-mono font-semibold text-[#D4AF37]">#{orderId.slice(0, 8).toUpperCase()}</span>
              </p>
              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground mb-2">Order Total</p>
                <p className="text-3xl font-bold text-[#D4AF37]">
                  ${completedOrder ? completedOrder.total.toFixed(2) : "0.00"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation email has been sent to <span className="font-semibold">{form.getValues("email")}</span>.
                <br />
                Your order will be delivered to the address provided.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setLocation("/menu")}
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                  data-testid="button-browse-menu"
                >
                  Browse Menu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-home"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-white dark:from-background dark:to-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/menu">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-back-to-menu">
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your delivery details to place your order</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <User className="w-5 h-5 text-[#D4AF37]" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              data-testid="input-fullname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="john@example.com"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="123 Main St, Apt 4B, New York, NY 10001"
                              rows={3}
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add any special delivery instructions..."
                              rows={2}
                              data-testid="input-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                      size="lg"
                      data-testid="button-place-order"
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded bg-gray-50 dark:bg-gray-800"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-sm mb-1 truncate" data-testid={`text-checkout-item-${item.id}`}>{item.name}</h4>
                        <div className="flex items-center gap-2 mb-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0"
                            data-testid={`button-decrease-checkout-${item.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-medium min-w-[1.5rem] text-center" data-testid={`text-quantity-checkout-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                            data-testid={`button-increase-checkout-${item.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold text-[#D4AF37]" data-testid={`text-item-total-checkout-${item.id}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span data-testid="text-tax">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-[#D4AF37]" data-testid="text-total">
                      ${(total * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
