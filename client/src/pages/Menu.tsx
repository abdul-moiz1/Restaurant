import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MenuCard from "@/components/MenuCard";
import { Search, Filter, Utensils } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  available: boolean;
  dietaryType?: string;
  allergens?: string[];
  spiceLevel?: number;
}

export default function Menu() {
  const { userData } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cuisines = params.get('cuisines');
    const dietary = params.get('dietary');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    if (cuisines) {
      setCuisineFilters(cuisines.split(',').filter(c => c));
      setShowFilters(true);
    }
    if (dietary) {
      const dietaryOptions = dietary.split(',').filter(d => d);
      if (dietaryOptions.length > 0) {
        setDietaryFilter(dietaryOptions[0]);
        setShowFilters(true);
      }
    }
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 1000,
      });
      setShowFilters(true);
    }

    loadDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [searchTerm, dietaryFilter, dishes, priceRange, cuisineFilters]);

  const loadDishes = async () => {
    try {
      const dishesRef = collection(db, "menu");
      const querySnapshot = await getDocs(dishesRef);
      const dishesData: Dish[] = [];
      querySnapshot.forEach((doc) => {
        dishesData.push({ id: doc.id, ...doc.data() } as Dish);
      });
      setDishes(dishesData);
    } catch (error) {
      console.error("Error loading dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDishes = () => {
    let filtered = dishes.filter(dish => dish.available || userData?.role === "owner");

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(term) ||
          dish.description.toLowerCase().includes(term) ||
          dish.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (dietaryFilter && dietaryFilter !== "all") {
      filtered = filtered.filter(
        (dish) => dish.dietaryType === dietaryFilter || dish.dietaryType === "All" || !dish.dietaryType
      );
    }

    if (cuisineFilters.length > 0) {
      filtered = filtered.filter((dish) =>
        dish.tags?.some((tag) => cuisineFilters.some((cuisine) => tag.toLowerCase().includes(cuisine.toLowerCase())))
      );
    }

    filtered = filtered.filter(
      (dish) => dish.price >= priceRange.min && dish.price <= priceRange.max
    );

    setFilteredDishes(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDietaryFilter("all");
    setCuisineFilters([]);
    setPriceRange({ min: 0, max: 1000 });
    window.history.pushState({}, '', '/menu');
  };

  const hasActiveFilters = searchTerm || dietaryFilter !== "all" || cuisineFilters.length > 0 || priceRange.min > 0 || priceRange.max < 1000;

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-[#FAF7F2] to-white dark:from-background dark:to-background py-16 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-center mb-4" data-testid="text-menu-title">
            Our Menu
          </h1>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Refined global cuisine, curated for your taste
          </p>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
                className="border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              {showFilters && (
                <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                  <SelectTrigger className="w-[200px]" data-testid="select-dietary">
                    <SelectValue placeholder="Dietary Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dishes</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                  className="text-[#D4AF37] hover:text-[#D4AF37]/90 hover:bg-[#D4AF37]/10"
                >
                  Clear All Filters
                </Button>
              )}
            </div>

            {cuisineFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Cuisines:</span>
                {cuisineFilters.map((cuisine) => (
                  <span
                    key={cuisine}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading menu...</div>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-muted/50">
                <Utensils className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">
              {hasActiveFilters
                ? "No dishes match your preferences"
                : "No dishes available yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try a different flavor! Adjust your filters or explore our full menu."
                : "Check back soon for delicious new additions to our menu."}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                data-testid="button-clear-all-filters"
              >
                Clear Filters & Browse All
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Showing {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDishes.map((dish) => (
                <MenuCard 
                  key={dish.id} 
                  dish={dish}
                  isOwner={userData?.role === "owner"}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
