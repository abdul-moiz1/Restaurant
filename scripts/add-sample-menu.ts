import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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
    name: "Paneer Tikka",
    description: "Grilled cottage cheese cubes marinated in yogurt and aromatic spices",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID", // You'll need to replace this
  },
  {
    name: "Chicken Karahi",
    description: "Tender chicken in rich tomato-based curry with fresh ginger and green chilies",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
    tags: ["halal"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Falafel Bowl",
    description: "Crispy chickpea fritters with hummus, tahini, and fresh vegetables",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=800",
    tags: ["vegan", "vegetarian", "halal"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Beef Biryani",
    description: "Fragrant basmati rice layered with spiced beef and saffron",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    tags: ["halal"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Veggie Stir-Fry",
    description: "Seasonal vegetables tossed in ginger-garlic sauce",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    tags: ["vegan", "vegetarian"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Lamb Rogan Josh",
    description: "Slow-cooked lamb in aromatic curry with Kashmiri spices",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    tags: ["halal"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Palak Paneer",
    description: "Cottage cheese cubes in creamy spinach curry",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato cream sauce with aromatic spices",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
    tags: ["halal", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Chana Masala",
    description: "Chickpeas cooked in tangy tomato and onion gravy",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    tags: ["vegan", "vegetarian", "halal", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Fish Curry",
    description: "Fresh fish cooked in coconut-based curry with curry leaves",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1580959375944-0cc28e34b66d?w=800",
    tags: ["gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Aloo Gobi",
    description: "Cauliflower and potatoes sautéed with turmeric and cumin",
    price: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    tags: ["vegan", "vegetarian", "halal", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Tandoori Salmon",
    description: "Grilled salmon marinated in tandoori spices and yogurt",
    price: 26.99,
    imageUrl: "https://images.unsplash.com/photo-1580959375944-0cc28e34b66d?w=800",
    tags: ["gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked with butter and cream",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
    tags: ["vegetarian", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
  {
    name: "Seekh Kebab",
    description: "Grilled minced lamb skewers with fresh herbs and spices",
    price: 17.99,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
    tags: ["halal", "gluten-free"],
    available: true,
    ownerId: "REPLACE_WITH_YOUR_UID",
  },
];

async function addSampleMenu() {
  console.log("Starting to add sample menu items...");
  
  try {
    for (const dish of sampleDishes) {
      const docRef = await addDoc(collection(db, "menu"), dish);
      console.log(`Added: ${dish.name} with ID: ${docRef.id}`);
    }
    console.log("\n✅ Successfully added all 14 dishes to your menu!");
    console.log("\n⚠️  Important: Replace 'REPLACE_WITH_YOUR_UID' with your actual user ID");
    console.log("You can find your UID in Firebase Console > Authentication > Users");
  } catch (error) {
    console.error("Error adding dishes:", error);
  }
}

addSampleMenu();
