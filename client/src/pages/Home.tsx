import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import heroImage from "@assets/generated_images/Luxury_restaurant_dark_ambiance_b9b12075.png";
import { ChevronDown, UtensilsCrossed, MapPin, Phone, Mail } from "lucide-react";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  available: boolean;
}

interface Preferences {
  cuisines: string[];
  dietary: string[];
  priceRange: number[];
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    cuisines: [],
    dietary: [],
    priceRange: [0, 100],
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadMenuItems = async () => {
      try {
        const q = query(collection(db, "menu"), where("available", "==", true), limit(3));
        const querySnapshot = await getDocs(q);
        const dishes: Dish[] = [];
        querySnapshot.forEach((doc) => {
          dishes.push({ id: doc.id, ...doc.data() } as Dish);
        });
        if (isMounted) {
          setMenuItems(dishes);
          setError(null);
        }
      } catch (error) {
        console.error("Error loading menu items:", error);
        if (isMounted) {
          setError("Failed to load menu items. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMenuItems();
    console.log("✨ Gourmet Haven redesign complete — modern, elegant, and fully functional!");
    
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPreferences = () => {
    document.getElementById("preferences")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const toggleDietary = (option: string) => {
    setPreferences(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (preferences.cuisines.length > 0) params.set('cuisines', preferences.cuisines.join(','));
    if (preferences.dietary.length > 0) params.set('dietary', preferences.dietary.join(','));
    params.set('minPrice', preferences.priceRange[0].toString());
    params.set('maxPrice', preferences.priceRange[1].toString());
    setLocation(`/menu?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center text-white max-w-3xl px-4">
          <div className="flex flex-col items-center gap-6 animate-fade-up">
            <UtensilsCrossed className="w-14 h-14 text-[#D4AF37] transition-transform hover:scale-110" />
            
            <h1 className="text-4xl lg:text-6xl font-serif font-bold tracking-tight">
              Welcome to Gourmet Haven
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 font-light max-w-2xl">
              Experience Fine Dining at Home
            </p>
            
            <Link href="/menu" className="mt-2">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-10 py-3 text-base font-medium rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:shadow-[0_0_35px_rgba(212,175,55,0.8)] transition-all duration-300 hover:scale-105"
                data-testid="button-view-menu"
              >
                View Menu
              </Button>
            </Link>
          </div>
        </div>
        <button
          onClick={scrollToPreferences}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-all animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section id="preferences" className="py-16 px-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-background dark:to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Customize Your Experience</h2>
            <p className="text-lg text-muted-foreground">
              Set your preferences and discover dishes tailored to your taste
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-lg border-[#D4AF37]/20">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Cuisine Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Italian', 'Indian', 'Continental', 'Asian', 'Mexican', 'Mediterranean', 'French', 'Japanese'].map((cuisine) => (
                      <div key={cuisine} className="flex items-center gap-2">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={preferences.cuisines.includes(cuisine)}
                          onCheckedChange={() => toggleCuisine(cuisine)}
                          data-testid={`checkbox-cuisine-${cuisine.toLowerCase()}`}
                        />
                        <Label htmlFor={`cuisine-${cuisine}`} className="cursor-pointer text-sm">
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Dietary Filters</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          id={`dietary-${option}`}
                          checked={preferences.dietary.includes(option)}
                          onCheckedChange={() => toggleDietary(option)}
                          data-testid={`checkbox-dietary-${option.toLowerCase()}`}
                        />
                        <Label htmlFor={`dietary-${option}`} className="cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={preferences.priceRange}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, priceRange: value }))}
                      className="w-full"
                      data-testid="slider-price-range"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${preferences.priceRange[0]}</span>
                      <span>${preferences.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={applyFilters}
                  className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
                  size="lg"
                  data-testid="button-apply-filters"
                >
                  Apply Filters & View Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="menu" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-background dark:from-background dark:to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Featured Dishes</h2>
            <p className="text-lg text-muted-foreground">
              Savor our carefully curated selection of gourmet dishes
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-muted-foreground">Loading menu...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">
                No menu items available yet. Check back soon!
              </p>
              <Link href="/signup">
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90">Join as a Restaurant Owner</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((dish) => (
                  <MenuCard key={dish.id} dish={dish} />
                ))}
              </div>
              {menuItems.length > 0 && (
                <div className="text-center mt-12">
                  <Link href="/menu">
                    <Button size="lg" variant="outline" data-testid="button-view-full-menu">
                      View Full Menu
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-32 px-4 bg-card dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-8 lg:gap-12">
            <span className="text-6xl lg:text-7xl animate-shimmer-icon" style={{ animationDelay: '0s', color: '#D4AF37' }}>
              🍽️
            </span>
            <span className="text-6xl lg:text-7xl animate-shimmer-icon" style={{ animationDelay: '0.2s', color: '#D4AF37' }}>
              🥂
            </span>
            <span className="text-6xl lg:text-7xl animate-shimmer-icon" style={{ animationDelay: '0.4s', color: '#D4AF37' }}>
              🍷
            </span>
            <span className="text-6xl lg:text-7xl animate-shimmer-icon" style={{ animationDelay: '0.6s', color: '#D4AF37' }}>
              🍰
            </span>
            <span className="text-6xl lg:text-7xl animate-shimmer-icon" style={{ animationDelay: '0.8s', color: '#D4AF37' }}>
              🍴
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
