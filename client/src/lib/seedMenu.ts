import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const sampleDishes = [
  {
    id: "sample-1",
    name: "Grilled Salmon",
    price: 25,
    description: "Fresh Atlantic salmon with lemon butter sauce",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
    available: true,
    cuisineType: "American",
    dietary: ["Keto", "Gluten-Free"],
  },
  {
    id: "sample-2",
    name: "Truffle Pasta",
    price: 18,
    description: "Creamy pasta with white truffle oil",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    available: true,
    cuisineType: "Italian",
    dietary: [],
  },
  {
    id: "sample-3",
    name: "Caesar Salad",
    price: 10,
    description: "Crisp romaine with parmesan and dressing",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    available: true,
    cuisineType: "American",
    dietary: ["Vegetarian"],
  },
  {
    id: "sample-4",
    name: "Chocolate Lava Cake",
    price: 12,
    description: "Rich molten chocolate dessert",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800",
    available: true,
    cuisineType: "Desserts",
    dietary: ["Vegetarian"],
  },
];

export async function seedSampleDishes() {
  try {
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    
    if (snapshot.empty) {
      console.log("Seeding sample menu items...");
      
      for (const dish of sampleDishes) {
        await setDoc(doc(db, "menu", dish.id), dish);
      }
      
      console.log("Sample menu items added successfully!");
      return true;
    } else {
      console.log("Menu already has items, skipping seed.");
      return false;
    }
  } catch (error) {
    console.error("Error seeding sample dishes:", error);
    return false;
  }
}
