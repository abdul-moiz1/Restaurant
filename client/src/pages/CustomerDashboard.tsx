import { useState } from "react";
import MenuCard from "@/components/MenuCard";
import PreferencesForm from "@/components/PreferencesForm";
import { useToast } from "@/hooks/use-toast";
import pastaImage from "@assets/generated_images/Gourmet_pasta_dish_photo_bdc1e780.png";
import salmonImage from "@assets/generated_images/Grilled_salmon_dish_photo_e47f8711.png";
import pizzaImage from "@assets/generated_images/Artisan_pizza_photo_79500d48.png";
import burgerImage from "@assets/generated_images/Gourmet_burger_photo_b4cbe826.png";
import dessertImage from "@assets/generated_images/Chocolate_dessert_photo_be94ea81.png";
import saladImage from "@assets/generated_images/Fresh_salad_photo_0fb29148.png";

export default function CustomerDashboard() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    vegan: false,
    halal: false,
    glutenFree: false,
    spiceLevel: 3,
  });

  const menuItems = [
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
      available: true,
    },
    {
      id: "4",
      name: "Gourmet Wagyu Burger",
      description: "Premium wagyu beef with aged cheddar, caramelized onions, and truffle aioli",
      price: 26.99,
      imageUrl: burgerImage,
      tags: ["American"],
      available: true,
    },
    {
      id: "5",
      name: "Molten Chocolate Lava Cake",
      description: "Decadent chocolate cake with a molten center, vanilla ice cream, and berry compote",
      price: 12.99,
      imageUrl: dessertImage,
      tags: ["Dessert", "Vegetarian"],
      available: true,
    },
    {
      id: "6",
      name: "Mediterranean Garden Salad",
      description: "Fresh mixed greens with feta, olives, cherry tomatoes, and balsamic vinaigrette",
      price: 14.99,
      imageUrl: saladImage,
      tags: ["Healthy", "Vegan", "Gluten-Free"],
      available: true,
    },
  ];

  const handleSavePreferences = (newPreferences: any) => {
    setPreferences(newPreferences);
    toast({
      title: "Preferences Saved",
      description: "Your dietary preferences have been updated successfully.",
    });
    console.log("Saved preferences:", newPreferences);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((dish) => (
                <MenuCard key={dish.id} dish={dish} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
