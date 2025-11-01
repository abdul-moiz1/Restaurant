import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuCard from "@/components/MenuCard";
import DishForm from "@/components/DishForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
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
  tags: string[];
  available: boolean;
  ownerId: string;
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
        await updateDoc(doc(db, "menu", editingDish.id), dishData);
        setDishes(dishes.map((d) => (d.id === editingDish.id ? { ...dishData, id: editingDish.id, ownerId: userData.uid } : d)));
        toast({
          title: "Dish Updated",
          description: "Your menu item has been updated successfully.",
        });
      } else {
        const docRef = await addDoc(collection(db, "menu"), {
          ...dishData,
          ownerId: userData.uid,
        });
        setDishes([...dishes, { ...dishData, id: docRef.id, ownerId: userData.uid }]);
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

  const stats = [
    { label: "Total Dishes", value: dishes.length },
    { label: "Available", value: dishes.filter((d) => d.available).length },
    { label: "Unavailable", value: dishes.filter((d) => !d.available).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading your menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your restaurant menu</p>
          </div>
          <Button onClick={handleAddDish} data-testid="button-add-dish">
            <Plus className="w-4 h-4 mr-2" />
            Add New Dish
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showForm ? (
          <div className="mb-8">
            <DishForm
              dish={editingDish || undefined}
              onSubmit={handleSubmitDish}
              onCancel={() => {
                setShowForm(false);
                setEditingDish(null);
              }}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-6">Your Menu</h2>
            {dishes.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No dishes yet. Start by adding your first menu item!</p>
                <Button onClick={handleAddDish}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Dish
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </div>
    </div>
  );
}
