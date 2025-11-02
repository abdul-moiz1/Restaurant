import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2MAEUXX-R9eQKEMLUophsyC-_OniuThc",
  authDomain: "newrestaurant-25f8c.firebaseapp.com",
  projectId: "newrestaurant-25f8c",
  storageBucket: "newrestaurant-25f8c.firebasestorage.app",
  messagingSenderId: "869805725923",
  appId: "1:869805725923:web:a7a7646d5e26ed27e80dd6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import sample dishes directly
const sampleDishes = [
  // Asian Cuisine
  {
    id: "sample-1",
    name: "Miso-Glazed Salmon",
    price: 28.99,
    description: "Wild-caught salmon with sweet miso glaze, served with jasmine rice and bok choy.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800"
    ],
    available: true,
    cuisineType: "Asian",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Heart Healthy", "Low Sugar"],
    calories: 485,
    protein: 42,
    carbs: 38,
    fat: 18,
    sugar: 6,
    ingredients: ["Wild Salmon", "Miso Paste", "Jasmine Rice", "Bok Choy", "Sesame Oil", "Ginger", "Garlic"],
    tags: ["Asian", "Seafood", "Premium"],
  },
  {
    id: "sample-2",
    name: "Thai Green Curry Bowl",
    price: 22.99,
    description: "Aromatic green curry with vegetables, tofu, and coconut milk over fragrant Thai rice.",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
    images: ["https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800"],
    available: true,
    cuisineType: "Asian",
    dietary: ["Vegan", "Gluten-Free"],
    healthTags: ["Low Fat", "High Fiber"],
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 14,
    sugar: 8,
    ingredients: ["Tofu", "Green Curry Paste", "Coconut Milk", "Thai Basil", "Bamboo Shoots", "Bell Peppers", "Thai Rice"],
    tags: ["Thai", "Spicy", "Plant-Based"],
  },
  {
    id: "sample-3",
    name: "Poke Bowl",
    price: 24.99,
    description: "Fresh ahi tuna poke with edamame, avocado, seaweed salad, and sushi rice.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    images: ["https://images.unsplash.com/photo-1623587227202-4d0d5a0a3d1f?w=800"],
    available: true,
    cuisineType: "Asian",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Heart Healthy", "Low Carb"],
    calories: 520,
    protein: 38,
    carbs: 45,
    fat: 20,
    sugar: 4,
    ingredients: ["Ahi Tuna", "Sushi Rice", "Avocado", "Edamame", "Seaweed", "Sesame Seeds", "Soy Sauce"],
    tags: ["Hawaiian", "Raw", "Fresh"],
  },
  // Italian
  {
    id: "sample-4",
    name: "Truffle Mushroom Risotto",
    price: 32.99,
    description: "Creamy arborio rice with wild mushrooms, parmesan, and black truffle oil.",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-a5bf9d9f821a?w=800",
    images: ["https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=800"],
    available: true,
    cuisineType: "Italian",
    dietary: ["Vegetarian", "Gluten-Free"],
    healthTags: [],
    calories: 680,
    protein: 22,
    carbs: 78,
    fat: 32,
    sugar: 3,
    ingredients: ["Arborio Rice", "Porcini Mushrooms", "Shiitake", "Parmesan", "White Wine", "Black Truffle Oil", "Butter"],
    tags: ["Italian", "Luxury", "Premium"],
  },
  {
    id: "sample-5",
    name: "Margherita Flatbread",
    price: 18.99,
    description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"],
    available: true,
    cuisineType: "Italian",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 580,
    protein: 26,
    carbs: 65,
    fat: 24,
    sugar: 5,
    ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil", "Sea Salt"],
    tags: ["Italian", "Classic", "Wood-Fired"],
  },
];

async function populatePremiumMenu() {
  console.log("🔄 Clearing existing menu items...");
  
  try {
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, "menu", docSnapshot.id));
      console.log(`✓ Deleted: ${docSnapshot.data().name || docSnapshot.id}`);
    }
    
    console.log(`\n✨ Adding ${sampleDishes.length} premium menu items...\n`);
    
    for (const dish of sampleDishes) {
      await setDoc(doc(db, "menu", dish.id), dish);
      console.log(`✓ Added: ${dish.name} (${dish.calories} kcal) - $${dish.price}`);
    }
    
    console.log(`\n🎉 Successfully populated menu with ${sampleDishes.length} premium dishes!`);
  } catch (error) {
    console.error("❌ Error updating menu:", error);
  }
}

populatePremiumMenu();
