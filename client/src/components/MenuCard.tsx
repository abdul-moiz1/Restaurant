import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DishModal from "./DishModal";

interface MenuCardProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    images?: string[];
    tags?: string[];
    available: boolean;
    cuisineType?: string;
    dietary?: string[];
    healthTags?: string[];
    calories?: number;
    sugar?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    ingredients?: string[];
  };
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MenuCard({ dish, isOwner, onEdit, onDelete }: MenuCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();
  const { userData } = useAuth();
  const { toast } = useToast();
  const isCustomer = userData?.role === "customer";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (dish.available) {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        imageUrl: dish.imageUrl,
      });
      toast({
        title: "Added to Cart",
        description: `${dish.name} has been added to your cart.`,
      });
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Card 
        onClick={handleCardClick}
        className="group overflow-hidden cursor-pointer bg-white dark:bg-card backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 hover:border-[#d4af37]/70 shadow-md hover:shadow-xl hover:shadow-[#d4af37]/20 transition-all duration-500 hover:-translate-y-1 rounded-xl" 
        data-testid={`card-dish-${dish.id}`}
      >
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
            }}
          />
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Hover hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg px-6 py-2.5 rounded-full shadow-xl border border-[#d4af37]/30">
              <span className="text-sm text-gray-700 dark:text-gray-200 font-medium tracking-wide">Click to view details</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title and Price */}
          <div className="mb-3">
            <h3 
              className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-1" 
              data-testid={`text-dish-name-${dish.id}`}
            >
              {dish.name}
            </h3>
            <div className="flex items-center justify-between">
              <span 
                className="text-xl font-bold text-[#d4af37]"
                data-testid={`text-price-${dish.id}`}
              >
                ${dish.price.toFixed(2)}
              </span>
              {dish.calories && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400" data-testid={`text-calories-${dish.id}`}>
                  {dish.calories} kcal
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dish.healthTags?.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/40 px-2.5 py-0.5 text-xs font-medium rounded-full"
                data-testid={`badge-health-${tag}`}
              >
                {tag}
              </Badge>
            ))}
            {dish.dietary?.slice(0, 2).map((tag) => (
              <Badge 
                key={tag} 
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium rounded-full"
                data-testid={`badge-dietary-${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          {isOwner ? (
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(dish.id);
                }}
                variant="outline"
                size="sm"
                className="flex-1 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all duration-300"
                data-testid={`button-edit-${dish.id}`}
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(dish.id);
                }}
                variant="outline"
                size="sm"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                data-testid={`button-delete-${dish.id}`}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={!dish.available}
              className="w-full bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] hover:from-[#b89b2f] hover:via-[#d4af37] hover:to-[#b89b2f] text-white font-semibold py-2.5 text-sm rounded-lg shadow-md hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
              data-testid={`button-add-to-cart-${dish.id}`}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              {dish.available ? 'Add to Cart' : 'Unavailable'}
            </Button>
          )}
        </div>
      </Card>

      {/* Dish Details Modal */}
      <DishModal 
        dish={dish} 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
