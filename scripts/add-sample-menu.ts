import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

const sampleDishes = [
  {
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with black truffle shavings and Parmesan",
    price: 32.99,
    imageUrl: "https://images.unsplash.com/photo-1476124369491-b79d7c8c7011?w=800",
    tags: ["vegetarian"],
    cuisineType: "Italian",
    dietary: ["Vegetarian"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 28.99,
    imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800",
    tags: ["gluten-free"],
    cuisineType: "Mediterranean",
    dietary: ["Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Margherita Pizza",
    description: "Classic wood-fired pizza with fresh mozzarella, basil, and tomato sauce",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    tags: ["vegetarian"],
    cuisineType: "Italian",
    dietary: ["Vegetarian"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Beef Wellington",
    description: "Tender beef fillet wrapped in puff pastry with mushroom duxelles",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800",
    tags: [],
    cuisineType: "French",
    dietary: [],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    tags: ["vegetarian"],
    cuisineType: "American",
    dietary: ["Vegetarian"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Pad Thai",
    description: "Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800",
    tags: [],
    cuisineType: "Asian",
    dietary: [],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Vegan Buddha Bowl",
    description: "Quinoa, roasted vegetables, avocado, and tahini dressing",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    tags: ["vegan", "vegetarian", "gluten-free"],
    cuisineType: "Mediterranean",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Chicken Tikka Masala",
    description: "Tender chicken in rich tomato cream sauce with aromatic spices",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
    tags: ["gluten-free"],
    cuisineType: "Asian",
    dietary: ["Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800",
    tags: ["vegetarian"],
    cuisineType: "Desserts",
    dietary: ["Vegetarian"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Filet Mignon",
    description: "8oz premium beef tenderloin with red wine reduction",
    price: 48.99,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800",
    tags: ["gluten-free"],
    cuisineType: "American",
    dietary: ["Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Vegetable Sushi Roll",
    description: "Fresh cucumber, avocado, and carrot wrapped in seasoned rice and nori",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    tags: ["vegan", "vegetarian"],
    cuisineType: "Asian",
    dietary: ["Vegan", "Vegetarian"],
    available: true,
    ownerId: "sample-owner",
  },
  {
    name: "Lobster Thermidor",
    description: "Succulent lobster in creamy cognac sauce, baked to perfection",
    price: 52.99,
    imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=800",
    tags: [],
    cuisineType: "French",
    dietary: [],
    available: true,
    ownerId: "sample-owner",
  },
];

async function addSampleMenu() {
  console.log("🍽️  Starting to add sample menu items...\n");
  
  try {
    const menuSnapshot = await getDocs(collection(db, "menu"));
    console.log(`📋 Current menu has ${menuSnapshot.size} items.\n`);

    for (const dish of sampleDishes) {
      const docRef = await addDoc(collection(db, "menu"), dish);
      console.log(`✅ Added: ${dish.name} ($${dish.price}) - ${dish.cuisineType}`);
    }
    console.log(`\n🎉 Successfully added all ${sampleDishes.length} gourmet dishes to your menu!`);
  } catch (error) {
    console.error("❌ Error adding dishes:", error);
  }
}

addSampleMenu();
