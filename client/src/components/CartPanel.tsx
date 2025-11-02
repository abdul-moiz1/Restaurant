import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-2xl font-serif">Your Cart</SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-6 rounded-full bg-muted/50">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Your Cart is Empty</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add some delicious dishes from our menu!
              </p>
              <Button
                onClick={onClose}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
              >
                Browse Menu
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg border bg-card"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-serif font-semibold" data-testid={`text-cart-item-${item.id}`}>
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-[#D4AF37] font-semibold text-sm mb-2">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-7 w-7 p-0"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold min-w-[2rem] text-center text-sm" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="ml-auto font-semibold text-sm" data-testid={`text-item-total-${item.id}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t px-6 py-4 space-y-4">
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-destructive hover:bg-destructive/10"
                  size="sm"
                  data-testid="button-clear-cart"
                >
                  Clear Cart
                </Button>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span data-testid="text-tax">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#D4AF37]" data-testid="text-total">
                    ${(total * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                size="lg"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
