import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuCard from "@/components/MenuCard";
import DishForm from "@/components/DishForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Plus, Utensils, CheckCircle, XCircle, Star } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export default function OwnerDashboard() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDishes();
    console.log("✨ Owner Dashboard upgraded — menu management and design enhanced successfully!");
  }, [userData]);

  const loadDishes = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const q = query(collection(db, "menu"), where("ownerId", "==", userData.uid));
      const querySnapshot = await getDocs(q);
      const dishesData: Dish[] = [];
      querySnapshot.forEach((doc) => {
        dishesData.push({ id: doc.id, ...doc.data() } as Dish);
      });
      setDishes(dishesData);
    } catch (error) {
      console.error("Error loading dishes:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = () => {
    setEditingDish(null);
    setShowForm(true);
  };

  const handleEditDish = (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    setEditingDish(dish || null);
    setShowForm(true);
  };

  const handleDeleteDish = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu", id));
      setDishes(dishes.filter((d) => d.id !== id));
      toast({
        title: "Dish Deleted",
        description: "The dish has been removed from your menu.",
      });
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast({
        title: "Error",
        description: "Failed to delete the dish.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitDish = async (dishData: any) => {
    if (!userData) return;

    try {
      if (editingDish) {
        const updateData = {
          ...dishData,
          ownerId: editingDish.ownerId,
        };
        await updateDoc(doc(db, "menu", editingDish.id), updateData);
        setDishes(dishes.map((d) => (d.id === editingDish.id ? { ...updateData, id: editingDish.id } : d)));
        toast({
          title: "Dish Updated",
          description: "Your menu item has been updated successfully.",
        });
      } else {
        const newDishData = {
          ...dishData,
          ownerId: userData.uid,
        };
        const docRef = await addDoc(collection(db, "menu"), newDishData);
        setDishes([...dishes, { ...newDishData, id: docRef.id }]);
        toast({
          title: "Dish Added",
          description: "New dish has been added to your menu.",
        });
      }
      setShowForm(false);
      setEditingDish(null);
    } catch (error) {
      console.error("Error saving dish:", error);
      toast({
        title: "Error",
        description: "Failed to save the dish.",
        variant: "destructive",
      });
    }
  };

  const handlePublishAll = async () => {
    try {
      const updatePromises = dishes
        .filter(d => !d.available)
        .map(d => updateDoc(doc(db, "menu", d.id), { available: true }));
      
      await Promise.all(updatePromises);
      setDishes(dishes.map(d => ({ ...d, available: true })));
      toast({
        title: "All Dishes Published",
        description: "All your menu items are now available to customers.",
      });
    } catch (error) {
      console.error("Error publishing dishes:", error);
      toast({
        title: "Error",
        description: "Failed to publish all dishes.",
        variant: "destructive",
      });
    }
  };

  const topRatedCount = dishes.filter((d) => d.available && (d as any).rating >= 4).length;
  
  const stats = [
    { label: "Total Dishes", value: dishes.length, icon: Utensils, color: "text-[#D4AF37]", bgColor: "bg-[#D4AF37]/10" },
    { label: "Available", value: dishes.filter((d) => d.available).length, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
    { label: "Out of Stock", value: dishes.filter((d) => !d.available).length, icon: XCircle, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20" },
    { label: "Premium Items", value: dishes.filter((d) => (d as any).tags?.includes("Premium")).length, icon: Star, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading your menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-2 text-gray-900 dark:text-white">Owner Dashboard</h1>
            <p className="text-lg text-muted-foreground font-sans">Manage your restaurant menu with elegance</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleAddDish} 
              data-testid="button-add-dish" 
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Dish
            </Button>
            <Button 
              onClick={handlePublishAll} 
              variant="outline"
              data-testid="button-publish-all"
              disabled={dishes.filter(d => !d.available).length === 0}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
            >
              Publish All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="shadow-md hover:shadow-xl transition-all duration-300 border-gray-200/50 dark:border-gray-700/50 hover:border-[#D4AF37]/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2 font-sans">
                        {stat.label}
                      </p>
                      <div className={`text-3xl lg:text-4xl font-bold ${stat.color} font-serif`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                        {stat.value}
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
                      <Icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <h2 className="text-3xl lg:text-4xl font-serif font-semibold mb-8 text-gray-900 dark:text-white">Your Menu</h2>
          {dishes.length === 0 ? (
            <Card className="p-16 text-center shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <div className="max-w-md mx-auto">
                <Utensils className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
                <p className="text-muted-foreground text-lg mb-6 font-sans">No dishes yet. Start by adding your first menu item!</p>
                <Button 
                  onClick={handleAddDish} 
                  size="lg" 
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Dish
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dishes.map((dish) => (
                <MenuCard
                  key={dish.id}
                  dish={dish}
                  isOwner={true}
                  onEdit={handleEditDish}
                  onDelete={handleDeleteDish}
                />
              ))}
            </div>
          )}
        </div>

        <DishForm
          dish={editingDish || undefined}
          isOpen={showForm}
          onSubmit={handleSubmitDish}
          onCancel={() => {
            setShowForm(false);
            setEditingDish(null);
          }}
        />
      </div>
      <Footer />
    </div>
  );
}
