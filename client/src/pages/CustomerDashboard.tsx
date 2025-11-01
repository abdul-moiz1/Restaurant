import { useState, useEffect } from "react";
import MenuCard from "@/components/MenuCard";
import PreferencesForm from "@/components/PreferencesForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  available: boolean;
  ownerId: string;
}

export default function CustomerDashboard() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [preferences, setPreferences] = useState({
    diet: "none",
    vegetarian: false,
    excludeGluten: false,
    excludeNuts: false,
    excludeDairy: false,
    spiceLevel: 2,
  });
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      if (!userData) return;

      try {
        const prefsDoc = await getDoc(doc(db, "users", userData.uid, "preferences", "dietary"));
        if (prefsDoc.exists() && isMounted) {
          setPreferences(prefsDoc.data() as any);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load your preferences.",
            variant: "destructive",
          });
        }
      }
    };

    const loadDishes = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const dishesData: Dish[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.available) {
            dishesData.push({ id: doc.id, ...data } as Dish);
          }
        });
        if (isMounted) {
          setDishes(dishesData);
          setError(null);
        }
      } catch (error) {
        console.error("Error loading dishes:", error);
        if (isMounted) {
          setError("Failed to load menu items. Please try again.");
          toast({
            title: "Error",
            description: "Failed to load menu items.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPreferences();
    loadDishes();

    return () => {
      isMounted = false;
    };
  }, [userData, toast]);

  const handleSavePreferences = async (newPreferences: any) => {
    if (!userData) return;

    try {
      await setDoc(doc(db, "users", userData.uid, "preferences", "dietary"), newPreferences);
      setPreferences(newPreferences);
      toast({
        title: "Preferences Saved",
        description: "Your dietary preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Customer Dashboard</h1>
          <p className="text-muted-foreground">Browse our menu and customize your preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <PreferencesForm preferences={preferences} onSubmit={handleSavePreferences} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-2">Available Dishes</h2>
              <p className="text-muted-foreground">
                Discover our curated selection of gourmet dishes
              </p>
            </div>
            {error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : dishes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No dishes available at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dishes.map((dish) => (
                  <MenuCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
