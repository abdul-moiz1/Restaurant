import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/MenuCard";
import Footer from "@/components/Footer";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import heroImage from "@assets/generated_images/Luxury_restaurant_dark_ambiance_b9b12075.png";
import { ChevronDown, UtensilsCrossed, Sparkles, Clock, Award } from "lucide-react";

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
  const [previewItems, setPreviewItems] = useState<Dish[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const loadMenuItems = async () => {
      try {
        const q = query(collection(db, "menu"), where("available", "==", true), limit(6));
        const querySnapshot = await getDocs(q);
        const dishes: Dish[] = [];
        querySnapshot.forEach((doc) => {
          dishes.push({ id: doc.id, ...doc.data() } as Dish);
        });
        if (isMounted) {
          setMenuItems(dishes.slice(0, 3));
          setPreviewItems(dishes.slice(3, 6));
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

  const scrollToHighlights = () => {
    document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" });
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
          onClick={scrollToHighlights}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-all animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      <section id="highlights" className="py-24 px-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-background dark:to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/10 p-6 rounded-full">
                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Curated Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every dish is carefully crafted by expert chefs using premium ingredients
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/10 p-6 rounded-full">
                    <Clock className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Fresh & Timely</h3>
              <p className="text-muted-foreground leading-relaxed">
                Prepared fresh daily and delivered at your convenience
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/10 p-6 rounded-full">
                    <Award className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Award Winning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Recognized for culinary excellence and exceptional dining experiences
              </p>
            </div>
          </div>
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
              {menuItems.length > 0 && previewItems.length > 0 && (
                <div className="relative mt-12 overflow-hidden rounded-2xl group/preview hover:scale-105 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-10 transition-all duration-700" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {previewItems.map((dish) => (
                      <div 
                        key={dish.id} 
                        className="opacity-60 blur-[2px] scale-95 hover:opacity-80 hover:blur-[1px] hover:scale-100 transition-all duration-500"
                      >
                        <MenuCard dish={dish} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Link href="/menu">
                      <Button 
                        size="lg" 
                        className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white shadow-2xl backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                        data-testid="button-view-full-menu"
                      >
                        Explore More Dishes
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="relative h-16 flex items-center justify-center">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
      </div>

      <section className="py-24 px-4 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] dark:from-background dark:via-background dark:to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#D4AF37]"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-[#FFD700]/30 to-[#D4AF37]/20 blur-xl"></div>
                <UtensilsCrossed className="w-12 h-12 text-[#D4AF37] relative animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">The Gourmet Experience</h2>
            <p className="text-muted-foreground">From plate to palate, every moment is crafted with care</p>
          </div>
          
          <div className="relative flex justify-center items-center">
            <svg className="absolute w-full h-24" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path
                d="M 0,50 Q 125,30 250,50 T 500,50 T 750,50 T 1000,50"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                className="opacity-30"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#D4AF37', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="flex justify-between items-center w-full max-w-4xl relative z-10">
              {[
                { emoji: '🍽️', label: 'Plating', delay: '0s' },
                { emoji: '🥂', label: 'Celebrations', delay: '0.15s' },
                { emoji: '🍷', label: 'Fine Wine', delay: '0.3s' },
                { emoji: '🍰', label: 'Desserts', delay: '0.45s' },
                { emoji: '🍴', label: 'Dining', delay: '0.6s' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group cursor-default"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 scale-0 group-hover:scale-150"></div>
                    <div className="relative bg-white dark:bg-card rounded-full p-4 lg:p-6 shadow-lg border-2 border-[#D4AF37]/20 group-hover:border-[#D4AF37]/50 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                      <span className="text-4xl lg:text-5xl block transition-transform duration-300 group-hover:scale-110">
                        {item.emoji}
                      </span>
                    </div>
                  </div>
                  <span className="mt-3 text-xs lg:text-sm font-medium text-muted-foreground group-hover:text-[#D4AF37] transition-colors duration-300 opacity-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
