import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface MenuCardProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    tags: string[];
    available: boolean;
  };
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MenuCard({ dish, isOwner, onEdit, onDelete }: MenuCardProps) {
  const { addToCart } = useCart();
  const { userData } = useAuth();
  const isCustomer = userData?.role === "customer";

  const handleAddToCart = () => {
    if (dish.available) {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        imageUrl: dish.imageUrl,
      });
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 hover:shadow-[#D4AF37]/20 group" 
      data-testid={`card-dish-${dish.id}`}
    >
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
          }}
        />
        {dish.available ? (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white border-0 shadow-md">Available</Badge>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white border-0 shadow-md">Out of Stock</Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-serif font-bold text-foreground" data-testid={`text-dish-name-${dish.id}`}>
            {dish.name}
          </h3>
          <span 
            className="text-xl font-bold whitespace-nowrap text-[#D4AF37]"
            data-testid={`text-price-${dish.id}`}
          >
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {dish.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded-full text-xs font-medium shadow-sm bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        {isOwner ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(dish.id)}
              data-testid={`button-edit-${dish.id}`}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(dish.id)}
              data-testid={`button-delete-${dish.id}`}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={!dish.available}
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid={`button-add-to-cart-${dish.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {dish.available ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
