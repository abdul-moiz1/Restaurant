import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MenuCard from "@/components/MenuCard";
import { Search, Filter } from "lucide-react";

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
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [searchTerm, dietaryFilter, dishes]);

  const loadDishes = async () => {
    try {
      const q = query(collection(db, "menu"), where("available", "==", true));
      const querySnapshot = await getDocs(q);
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
    let filtered = dishes;

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
        (dish) => dish.dietaryType === dietaryFilter || dish.dietaryType === "All"
      );
    }

    setFilteredDishes(filtered);
  };

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-16 px-4">
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

            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading menu...</div>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm || dietaryFilter !== "all"
                ? "No dishes match your filters."
                : "No dishes available yet."}
            </p>
            {(searchTerm || dietaryFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setDietaryFilter("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <MenuCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
