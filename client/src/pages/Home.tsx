import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/MenuCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import heroImage from "@assets/generated_images/Restaurant_hero_background_image_62e3db83.png";

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
        const querySnapshot = await getDocs(collection(db, "menu"));
        const dishes: Dish[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.available) {
            dishes.push({ id: doc.id, ...data } as Dish);
          }
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
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
            Elevate Your Dining Experience
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90">
            Discover exquisite culinary creations crafted by expert chefs
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <a>
                <Button
                  size="lg"
                  className="backdrop-blur-md bg-primary/90 hover:bg-primary"
                  data-testid="button-hero-signup"
                >
                  Get Started
                </Button>
              </a>
            </Link>
            <Link href="#menu">
              <a>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-md bg-white/10 border-white text-white hover:bg-white/20"
                  data-testid="button-hero-menu"
                >
                  Browse Menu
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Our Menu</h2>
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
                <a>
                  <Button>Join as a Restaurant Owner</Button>
                </a>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((dish) => (
                <MenuCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Gourmet Haven today and experience the finest in dining
          </p>
          <Link href="/signup">
            <a>
              <Button size="lg" data-testid="button-footer-signup">
                Sign Up Now
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
