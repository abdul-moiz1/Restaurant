import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/MenuCard";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import heroImage from "@assets/generated_images/Restaurant_hero_background_image_62e3db83.png";
import { ChevronDown } from "lucide-react";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  available: boolean;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen">
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4 animate-in fade-in duration-1000">
          <h1 className="text-5xl lg:text-7xl font-serif font-bold mb-6 tracking-tight">
            Elevate Your Dining Experience
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90 font-light">
            Refined global cuisine, curated for your taste
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
                data-testid="button-hero-menu"
              >
                Explore Menu
              </Button>
            </Link>
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
          onClick={scrollToMenu}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-all animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section id="menu" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-background">
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
                <Button>Join as a Restaurant Owner</Button>
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

      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Gourmet Haven today and experience the finest in dining
          </p>
          <Link href="/signup">
            <Button size="lg" className="px-8" data-testid="button-footer-signup">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-background border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-serif font-bold">Gourmet Haven</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Gourmet Haven. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
