import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";
import { Search, Filter, Utensils } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags?: string[];
  available: boolean;
  cuisineType?: string;
  dietary?: string[];
  ownerId?: string;
}

export default function Menu() {
  const { userData } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineType, setCuisineType] = useState<string>("all");
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dietary = params.get('dietary');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    if (dietary) {
      const dietaryOptions = dietary.split(',').filter(d => d);
      if (dietaryOptions.length > 0) {
        setDietaryFilters(dietaryOptions);
      }
    }
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 100,
      ]);
    }

    loadDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [searchTerm, cuisineType, dietaryFilters, dishes, priceRange]);

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
          dish.description.toLowerCase().includes(term)
      );
    }

    if (cuisineType && cuisineType !== "all") {
      filtered = filtered.filter((dish) => dish.cuisineType === cuisineType);
    }

    if (dietaryFilters.length > 0) {
      filtered = filtered.filter((dish) =>
        dish.dietary?.some((d) => dietaryFilters.includes(d))
      );
    }

    filtered = filtered.filter(
      (dish) => dish.price >= priceRange[0] && dish.price <= priceRange[1]
    );

    setFilteredDishes(filtered);
  };

  const toggleDietary = (dietary: string) => {
    setDietaryFilters(prev =>
      prev.includes(dietary)
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCuisineType("all");
    setDietaryFilters([]);
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = searchTerm || cuisineType !== "all" || dietaryFilters.length > 0 || priceRange[0] > 0 || priceRange[1] < 100;

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

          <div className="max-w-5xl mx-auto space-y-4">
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

            <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border-[#D4AF37]/20 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#D4AF37]" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                      className="text-[#D4AF37] hover:text-[#D4AF37]/90 hover:bg-[#D4AF37]/10"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Cuisine Type</Label>
                    <Select value={cuisineType} onValueChange={setCuisineType}>
                      <SelectTrigger data-testid="select-cuisine">
                        <SelectValue placeholder="All Cuisines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="Desserts">Desserts</SelectItem>
                        <SelectItem value="American">American</SelectItem>
                        <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Dietary Preferences</Label>
                    <div className="space-y-2">
                      {['Vegetarian', 'Vegan', 'Keto', 'Gluten-Free'].map((dietary) => (
                        <div key={dietary} className="flex items-center gap-2">
                          <Checkbox
                            id={`dietary-${dietary}`}
                            checked={dietaryFilters.includes(dietary)}
                            onCheckedChange={() => toggleDietary(dietary)}
                            data-testid={`checkbox-dietary-${dietary.toLowerCase()}`}
                          />
                          <Label htmlFor={`dietary-${dietary}`} className="cursor-pointer text-sm">
                            {dietary}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price Range per Dish</Label>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        data-testid="slider-price-range"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Min</span>
                          <span className="text-sm font-semibold text-[#D4AF37]" data-testid="text-price-min">${priceRange[0]}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">to</span>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-muted-foreground">Max</span>
                          <span className="text-sm font-semibold text-[#D4AF37]" data-testid="text-price-max">${priceRange[1]}{priceRange[1] === 100 ? '+' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
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
      <Footer />
    </div>
  );
}
