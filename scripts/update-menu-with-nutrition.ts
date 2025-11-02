import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA2MAEUXX-R9eQKEMLUophsyC-_OniuThc",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "newrestaurant-25f8c.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "newrestaurant-25f8c",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "newrestaurant-25f8c.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "869805725923",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:869805725923:web:a7a7646d5e26ed27e80dd6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nutritionRichDishes = [
  {
    id: "sample-1",
    name: "Grilled Salmon Bowl",
    price: 18.99,
    description: "Tender grilled salmon served with quinoa and roasted veggies.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    available: true,
    tags: ["Gluten-Free", "Dairy-Free"],
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Low Sugar", "Heart Healthy"],
    calories: 420,
  },
  {
    id: "sample-2",
    name: "Avocado Chicken Salad",
    price: 14.99,
    description: "A creamy mix of grilled chicken, avocado, and crisp greens.",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    available: true,
    tags: ["Keto", "Low-Carb"],
    dietary: ["Keto"],
    healthTags: ["Low Sugar", "Low Carb", "High Protein"],
    calories: 380,
  },
  {
    id: "sample-3",
    name: "Chocolate Lava Cake",
    price: 12.99,
    description: "Warm chocolate cake with a molten center and vanilla ice cream.",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800",
    available: true,
    tags: ["Vegetarian"],
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 620,
  },
  {
    id: "sample-4",
    name: "Quinoa Power Bowl",
    price: 15.49,
    description: "Loaded with quinoa, chickpeas, kale, and a zesty tahini dressing.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    available: true,
    tags: ["Vegan", "Gluten-Free"],
    dietary: ["Vegan", "Gluten-Free"],
    healthTags: ["High Fiber", "Low Fat", "Heart Healthy"],
    calories: 390,
  },
  {
    id: "sample-5",
    name: "Turkey Wrap",
    price: 12.49,
    description: "Whole-grain wrap filled with roasted turkey and crisp veggies.",
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
    available: true,
    tags: ["Nut-Free"],
    dietary: [],
    healthTags: ["High Protein", "Low Sugar", "Low Fat"],
    calories: 410,
  },
];

async function updateMenuWithNutrition() {
  console.log("🔄 Clearing existing menu items...");
  
  try {
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, "menu", docSnapshot.id));
      console.log(`✓ Deleted: ${docSnapshot.data().name || docSnapshot.id}`);
    }
    
    console.log("\n✨ Adding nutrition-rich menu items...");
    
    for (const dish of nutritionRichDishes) {
      await setDoc(doc(db, "menu", dish.id), dish);
      console.log(`✓ Added: ${dish.name} (${dish.calories} kcal)`);
    }
    
    console.log("\n🎉 Successfully updated menu with nutrition data!");
    console.log(`Total dishes: ${nutritionRichDishes.length}`);
  } catch (error) {
    console.error("❌ Error updating menu:", error);
  }
}

updateMenuWithNutrition();
