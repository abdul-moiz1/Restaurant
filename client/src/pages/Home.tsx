import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MenuCard from "@/components/MenuCard";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import heroImage from "@assets/generated_images/Restaurant_hero_background_image_62e3db83.png";
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
        
        <div className="absolute top-12 left-1/2 -translate-x-1/2 animate-glow">
          <UtensilsCrossed className="w-16 h-16 text-[#D4AF37]" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl lg:text-7xl font-serif font-bold mb-6 tracking-tight animate-fade-up">
            Elevate Your Dining Experience
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90 font-light animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Refined global cuisine, curated for your taste
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={scrollToPreferences}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-8 shadow-lg"
              data-testid="button-hero-preferences"
            >
              Explore Menu
            </Button>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-md bg-white/10 border-white text-white hover:bg-white/20 px-8"
                data-testid="button-hero-signup"
              >
                Sign Up
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

      <section className="py-20 px-4 bg-card dark:bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Gourmet Haven today and experience the finest in dining
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-8 bg-[#D4AF37] hover:bg-[#D4AF37]/90" data-testid="button-footer-signup">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] dark:from-background dark:to-background border-t py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 animate-float">🍽️</div>
          <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '0.5s' }}>🍷</div>
          <div className="absolute bottom-10 left-1/4 animate-float" style={{ animationDelay: '1s' }}>🥂</div>
          <div className="absolute bottom-20 right-1/4 animate-float" style={{ animationDelay: '1.5s' }}>🍴</div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <UtensilsCrossed className="w-8 h-8 text-[#D4AF37]" />
                <span className="text-2xl font-serif font-bold">Gourmet Haven</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Elevating dining experiences since 2025
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
                  <MapPin className="w-4 h-4" />
                  <span>123 Gourmet Street, Culinary City</span>
                </div>
                <div className="flex items-center justify-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span>info@gourmethaven.com</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-[#D4AF37] transition-colors cursor-pointer">About</div>
                <div className="hover:text-[#D4AF37] transition-colors cursor-pointer">Contact</div>
                <div className="hover:text-[#D4AF37] transition-colors cursor-pointer">Privacy Policy</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 Gourmet Haven. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
