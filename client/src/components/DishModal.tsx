import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DishModalProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    images?: string[];
    tags?: string[];
    dietary?: string[];
    healthTags?: string[];
    calories?: number;
    sugar?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    ingredients?: string[];
    available: boolean;
  };
  open: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, open, onClose }: DishModalProps) {
  const allImages = [dish.imageUrl, ...(dish.images || [])];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { userData } = useAuth();
  const { toast } = useToast();

  // Reset image index when dish changes or modal opens
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [dish.id, open]);

  const handleAddToCart = () => {
    if (!userData) {
      toast({
        title: "✨ Premium Access Required",
        description: "Please sign in to add exquisite dishes to your collection.",
        className: "border-[#D4AF37] bg-gradient-to-br from-[#FAF7F2] to-white dark:from-card dark:to-card border-2 shadow-2xl shadow-[#D4AF37]/20",
      });
      return;
    }
    
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-[#d4af37]/20">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all border border-gray-200/50 dark:border-gray-700/50"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5 text-[#333] dark:text-white" />
          </button>
          
          {/* Main Image */}
          <div className="relative h-64 md:h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            <img
              src={allImages[currentImageIndex]}
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
              }}
            />
            
            {/* Navigation arrows for main image */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all border border-[#d4af37]/30"
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-5 h-5 text-[#333] dark:text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all border border-[#d4af37]/30"
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-5 h-5 text-[#333] dark:text-white" />
                </button>
              </>
            )}
          </div>
          
          {/* Small Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="px-6 pt-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all transform hover:scale-105 ${
                      index === currentImageIndex 
                        ? 'border-[#d4af37] shadow-lg shadow-[#d4af37]/30 ring-2 ring-[#d4af37]/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-[#d4af37]/50'
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${dish.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif font-bold text-[#333] mb-2" data-testid="text-dish-name">
                {dish.name}
              </DialogTitle>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-[#d4af37]" data-testid="text-dish-price">
                  ${dish.price.toFixed(2)}
                </span>
                {dish.calories && (
                  <span className="text-sm text-gray-600" data-testid="text-dish-calories">
                    {dish.calories} kcal
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dish.healthTags?.map((tag) => (
                <Badge key={tag} className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200" data-testid={`badge-health-${tag}`}>
                  {tag}
                </Badge>
              ))}
              {dish.dietary?.map((tag) => (
                <Badge key={tag} className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" data-testid={`badge-dietary-${tag}`}>
                  {tag}
                </Badge>
              ))}
              {dish.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="border-[#d4af37] text-[#d4af37]" data-testid={`badge-tag-${tag}`}>
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#333] dark:text-white mb-3">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base" data-testid="text-dish-description">
                {dish.description}
              </p>
            </div>

            {/* Nutrition Breakdown */}
            {(dish.protein || dish.carbs || dish.fat || dish.sugar) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#333] mb-3">Nutrition Facts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dish.protein !== undefined && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-700" data-testid="text-protein">{dish.protein}g</div>
                      <div className="text-xs text-orange-600 font-medium">Protein</div>
                    </div>
                  )}
                  {dish.carbs !== undefined && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700" data-testid="text-carbs">{dish.carbs}g</div>
                      <div className="text-xs text-blue-600 font-medium">Carbs</div>
                    </div>
                  )}
                  {dish.fat !== undefined && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700" data-testid="text-fat">{dish.fat}g</div>
                      <div className="text-xs text-purple-600 font-medium">Fat</div>
                    </div>
                  )}
                  {dish.sugar !== undefined && (
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 p-4 rounded-xl border border-pink-200">
                      <div className="text-2xl font-bold text-pink-700" data-testid="text-sugar">{dish.sugar}g</div>
                      <div className="text-xs text-pink-600 font-medium">Sugar</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#333] dark:text-white mb-3">Ingredients</h3>
                <div className="bg-gradient-to-br from-[#FAF7F2] to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border-2 border-[#d4af37]/20 shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base" data-testid="text-ingredients">
                    {dish.ingredients.join(" • ")}
                  </p>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleAddToCart}
                disabled={!dish.available}
                className="px-12 py-3 bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] hover:from-[#b89b2f] hover:via-[#d4af37] hover:to-[#b89b2f] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/40 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-add-to-cart-modal"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {dish.available ? `Add to Cart - $${dish.price.toFixed(2)}` : 'Currently Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
