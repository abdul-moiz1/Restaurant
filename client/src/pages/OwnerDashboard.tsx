import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuCard from "@/components/MenuCard";
import DishForm from "@/components/DishForm";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import pastaImage from "@assets/generated_images/Gourmet_pasta_dish_photo_bdc1e780.png";
import salmonImage from "@assets/generated_images/Grilled_salmon_dish_photo_e47f8711.png";
import pizzaImage from "@assets/generated_images/Artisan_pizza_photo_79500d48.png";

export default function OwnerDashboard() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [dishes, setDishes] = useState([
    {
      id: "1",
      name: "Truffle Mushroom Pasta",
      description: "Hand-made pasta with wild mushrooms, truffle oil, and parmesan",
      price: 28.99,
      imageUrl: pastaImage,
      tags: ["Italian", "Vegetarian"],
      available: true,
    },
    {
      id: "2",
      name: "Grilled Atlantic Salmon",
      description: "Fresh Atlantic salmon with roasted vegetables and lemon butter sauce",
      price: 34.99,
      imageUrl: salmonImage,
      tags: ["Seafood", "Gluten-Free"],
      available: true,
    },
    {
      id: "3",
      name: "Artisan Wood-Fired Pizza",
      description: "Classic Margherita with fresh mozzarella, basil, and San Marzano tomatoes",
      price: 22.99,
      imageUrl: pizzaImage,
      tags: ["Italian", "Vegetarian"],
      available: false,
    },
  ]);

  const handleAddDish = () => {
    setEditingDish(null);
    setShowForm(true);
  };

  const handleEditDish = (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    setEditingDish(dish);
    setShowForm(true);
  };

  const handleDeleteDish = (id: string) => {
    setDishes(dishes.filter((d) => d.id !== id));
    toast({
      title: "Dish Deleted",
      description: "The dish has been removed from your menu.",
    });
    console.log("Deleted dish:", id);
  };

  const handleSubmitDish = (dishData: any) => {
    if (editingDish) {
      setDishes(dishes.map((d) => (d.id === editingDish.id ? { ...dishData, id: editingDish.id } : d)));
      toast({
        title: "Dish Updated",
        description: "Your menu item has been updated successfully.",
      });
    } else {
      const newDish = { ...dishData, id: String(Date.now()) };
      setDishes([...dishes, newDish]);
      toast({
        title: "Dish Added",
        description: "New dish has been added to your menu.",
      });
    }
    console.log("Submitted dish:", dishData);
    setShowForm(false);
    setEditingDish(null);
  };

  const stats = [
    { label: "Total Dishes", value: dishes.length },
    { label: "Available", value: dishes.filter((d) => d.available).length },
    { label: "Unavailable", value: dishes.filter((d) => !d.available).length },
  ];

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
              dish={editingDish}
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
          </div>
        )}
      </div>
    </div>
  );
}
