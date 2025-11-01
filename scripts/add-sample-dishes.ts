import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const sampleDishes = [
  {
    name: "Truffle Risotto",
    description: "Creamy Arborio rice infused with black truffle, topped with Parmesan and fresh herbs. A luxurious Italian classic.",
    price: 28.50,
    imageUrl: "https://images.unsplash.com/photo-1476124369491-a5bf9d9f821a?w=800",
    tags: ["Italian", "Vegetarian", "Premium"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Vegetarian",
  },
  {
    name: "Wagyu Beef Steak",
    description: "8oz premium Wagyu sirloin, perfectly grilled and served with roasted vegetables and red wine reduction.",
    price: 65.00,
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800",
    tags: ["American", "Premium", "Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "All",
  },
  {
    name: "Mediterranean Salmon",
    description: "Pan-seared Norwegian salmon with lemon butter sauce, capers, and seasonal vegetables.",
    price: 32.00,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    tags: ["Mediterranean", "Seafood", "Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Pescatarian",
  },
  {
    name: "Vegan Buddha Bowl",
    description: "Quinoa, roasted chickpeas, avocado, kale, and tahini dressing. A nutritious plant-based delight.",
    price: 18.50,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    tags: ["Vegan", "Healthy", "Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Vegan",
  },
  {
    name: "Lobster Linguine",
    description: "Fresh Maine lobster tossed with linguine in a white wine garlic sauce with cherry tomatoes.",
    price: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
    tags: ["Italian", "Seafood", "Premium"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Pescatarian",
  },
  {
    name: "Chicken Tikka Masala",
    description: "Tender chicken in a creamy tomato-based curry sauce, served with basmati rice and naan bread.",
    price: 22.00,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    tags: ["Indian", "Spicy", "Gluten-Free"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "All",
    spiceLevel: 2,
  },
  {
    name: "Margherita Pizza",
    description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
    price: 16.00,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    tags: ["Italian", "Vegetarian"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Vegetarian",
  },
  {
    name: "Miso-Glazed Sea Bass",
    description: "Chilean sea bass with sweet miso glaze, served with bok choy and jasmine rice.",
    price: 38.00,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
    tags: ["Japanese", "Seafood", "Asian"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Pescatarian",
  },
  {
    name: "Mushroom Wellington",
    description: "Portobello mushrooms and spinach wrapped in golden puff pastry with herb cream sauce.",
    price: 26.00,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    tags: ["Vegetarian", "British", "Premium"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Vegetarian",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
    price: 12.00,
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800",
    tags: ["Dessert", "Chocolate"],
    available: true,
    ownerId: "sample-owner",
    dietaryType: "Vegetarian",
  },
];

async function addSampleDishes() {
  console.log("Adding sample dishes to Firestore...");
  
  try {
    for (const dish of sampleDishes) {
      await addDoc(collection(db, "menu"), dish);
      console.log(`✓ Added: ${dish.name}`);
    }
    
    console.log("\n✨ Successfully added all sample dishes!");
    console.log(`Total dishes added: ${sampleDishes.length}`);
  } catch (error) {
    console.error("Error adding dishes:", error);
  }
}

addSampleDishes();
