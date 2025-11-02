import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleDishes = [
  {
    id: "sample-1",
    name: "Grilled Salmon Bowl",
    price: 18.99,
    description: "Pan-seared salmon fillet with crispy skin, served over quinoa with roasted vegetables and lemon herb sauce.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800"
    ],
    available: true,
    cuisineType: "Healthy",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Low Sugar"],
    calories: 420,
    protein: 38,
    carbs: 32,
    fat: 16,
    sugar: 4,
    ingredients: ["Salmon", "Quinoa", "Broccoli", "Carrots", "Lemon", "Olive Oil", "Fresh Herbs"],
    tags: ["Seafood", "Healthy", "Premium"],
  },
  {
    id: "sample-2",
    name: "Avocado Chicken Salad",
    price: 14.99,
    description: "Fresh mixed greens with grilled chicken breast, ripe avocado, cherry tomatoes, and tangy citrus vinaigrette.",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800"
    ],
    available: true,
    cuisineType: "Healthy",
    dietary: ["Keto", "Low Carb"],
    healthTags: ["Low Sugar", "Low Carb", "High Protein"],
    calories: 380,
    protein: 36,
    carbs: 14,
    fat: 22,
    sugar: 6,
    ingredients: ["Chicken Breast", "Avocado", "Mixed Greens", "Cherry Tomatoes", "Red Onion", "Citrus Dressing"],
    tags: ["Salad", "Keto", "Fresh"],
  },
  {
    id: "sample-3",
    name: "Chocolate Lava Cake",
    price: 12.99,
    description: "Decadent warm chocolate cake with a molten center, topped with premium vanilla ice cream and chocolate drizzle.",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"
    ],
    available: true,
    cuisineType: "Dessert",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 620,
    protein: 8,
    carbs: 72,
    fat: 36,
    sugar: 52,
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla Ice Cream"],
    tags: ["Dessert", "Chocolate", "Premium"],
  },
  {
    id: "sample-4",
    name: "Truffle Mushroom Risotto",
    price: 26.99,
    description: "Creamy arborio rice slow-cooked with wild mushrooms, parmesan cheese, and finished with black truffle oil.",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-a5bf9d9f821a?w=800",
    images: [
      "https://images.unsplash.com/photo-1637806930600-37fa8892069d?w=800",
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800"
    ],
    available: true,
    cuisineType: "Italian",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 580,
    protein: 18,
    carbs: 68,
    fat: 28,
    sugar: 3,
    ingredients: ["Arborio Rice", "Porcini Mushrooms", "Parmesan", "White Wine", "Truffle Oil", "Butter"],
    tags: ["Italian", "Luxury", "Premium"],
  },
  {
    id: "sample-5",
    name: "Wagyu Beef Burger",
    price: 24.99,
    description: "Premium wagyu beef patty with aged cheddar, caramelized onions, truffle aioli, and crispy bacon on brioche bun.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    images: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800"
    ],
    available: true,
    cuisineType: "American",
    dietary: [],
    healthTags: ["High Protein"],
    calories: 850,
    protein: 52,
    carbs: 48,
    fat: 54,
    sugar: 8,
    ingredients: ["Wagyu Beef", "Aged Cheddar", "Brioche Bun", "Bacon", "Truffle Aioli", "Caramelized Onions"],
    tags: ["Burger", "Premium", "Comfort Food"],
  },
  {
    id: "sample-6",
    name: "Poke Bowl",
    price: 19.99,
    description: "Fresh ahi tuna cubes marinated in soy-sesame dressing with edamame, avocado, seaweed salad over sushi rice.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    images: [
      "https://images.unsplash.com/photo-1623587227202-4d0d5a0a3d1f?w=800",
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800"
    ],
    available: true,
    cuisineType: "Asian",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Heart Healthy"],
    calories: 480,
    protein: 42,
    carbs: 52,
    fat: 14,
    sugar: 6,
    ingredients: ["Ahi Tuna", "Sushi Rice", "Avocado", "Edamame", "Seaweed", "Sesame Seeds", "Soy Sauce"],
    tags: ["Hawaiian", "Fresh", "Seafood"],
  },
  {
    id: "sample-7",
    name: "Lobster Linguine",
    price: 38.99,
    description: "Fresh Maine lobster tail over al dente linguine in white wine garlic butter sauce with cherry tomatoes.",
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
    images: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
      "https://images.unsplash.com/photo-1612926653547-4c0191e4ea3e?w=800"
    ],
    available: true,
    cuisineType: "Italian",
    dietary: [],
    healthTags: ["High Protein"],
    calories: 680,
    protein: 48,
    carbs: 62,
    fat: 24,
    sugar: 4,
    ingredients: ["Maine Lobster", "Linguine", "Cherry Tomatoes", "White Wine", "Garlic", "Butter", "Parsley"],
    tags: ["Seafood", "Premium", "Luxury"],
  },
  {
    id: "sample-8",
    name: "Thai Green Curry",
    price: 17.99,
    description: "Aromatic coconut green curry with vegetables, tofu, Thai basil and bamboo shoots over jasmine rice.",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
    images: [
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800"
    ],
    available: true,
    cuisineType: "Asian",
    dietary: ["Vegan", "Gluten-Free"],
    healthTags: ["Low Fat", "High Fiber"],
    calories: 420,
    protein: 16,
    carbs: 58,
    fat: 14,
    sugar: 8,
    ingredients: ["Tofu", "Green Curry Paste", "Coconut Milk", "Thai Basil", "Bamboo Shoots", "Bell Peppers"],
    tags: ["Thai", "Spicy", "Vegan"],
  },
  {
    id: "sample-9",
    name: "Grilled Ribeye Steak",
    price: 42.99,
    description: "12oz prime ribeye with herb butter, roasted fingerling potatoes, asparagus and red wine reduction.",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=800",
    images: [
      "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800",
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800"
    ],
    available: true,
    cuisineType: "American",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein"],
    calories: 820,
    protein: 68,
    carbs: 28,
    fat: 52,
    sugar: 3,
    ingredients: ["Prime Ribeye", "Herb Butter", "Fingerling Potatoes", "Asparagus", "Red Wine"],
    tags: ["Steakhouse", "Premium", "Grilled"],
  },
  {
    id: "sample-10",
    name: "Quinoa Power Bowl",
    price: 16.99,
    description: "Nutritious quinoa bowl with roasted chickpeas, kale, sweet potato, tahini dressing and pumpkin seeds.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    images: [
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800",
      "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=800"
    ],
    available: true,
    cuisineType: "Healthy",
    dietary: ["Vegan", "Gluten-Free"],
    healthTags: ["High Fiber", "High Protein", "Heart Healthy"],
    calories: 520,
    protein: 24,
    carbs: 68,
    fat: 18,
    sugar: 8,
    ingredients: ["Quinoa", "Chickpeas", "Kale", "Sweet Potato", "Tahini", "Pumpkin Seeds"],
    tags: ["Healthy", "Vegan", "Superfood"],
  },
  {
    id: "sample-11",
    name: "Pan-Seared Sea Bass",
    price: 34.99,
    description: "Chilean sea bass with lemon beurre blanc sauce, sautéed spinach and roasted fingerling potatoes.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
    images: [
      "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=800",
      "https://images.unsplash.com/photo-1580959375944-0d05b5639548?w=800"
    ],
    available: true,
    cuisineType: "French",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Heart Healthy"],
    calories: 480,
    protein: 52,
    carbs: 24,
    fat: 22,
    sugar: 2,
    ingredients: ["Chilean Sea Bass", "Lemon", "Butter", "White Wine", "Spinach", "Fingerling Potatoes"],
    tags: ["Seafood", "French", "Elegant"],
  },
  {
    id: "sample-12",
    name: "Margherita Pizza",
    price: 16.99,
    description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil and extra virgin olive oil.",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"
    ],
    available: true,
    cuisineType: "Italian",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 620,
    protein: 28,
    carbs: 72,
    fat: 24,
    sugar: 6,
    ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil"],
    tags: ["Italian", "Classic", "Wood-Fired"],
  },
  {
    id: "sample-13",
    name: "Caesar Salad with Shrimp",
    price: 18.99,
    description: "Crisp romaine hearts with grilled jumbo shrimp, parmesan crisps, house croutons and creamy Caesar dressing.",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    images: [
      "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=800",
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800"
    ],
    available: true,
    cuisineType: "American",
    dietary: [],
    healthTags: ["High Protein", "Low Carb"],
    calories: 420,
    protein: 42,
    carbs: 18,
    fat: 24,
    sugar: 2,
    ingredients: ["Romaine Lettuce", "Jumbo Shrimp", "Parmesan", "Caesar Dressing", "Croutons"],
    tags: ["Salad", "Classic", "Seafood"],
  },
  {
    id: "sample-14",
    name: "Herb-Crusted Rack of Lamb",
    price: 46.99,
    description: "New Zealand lamb rack with Dijon herb crust, rosemary jus, roasted root vegetables and garlic mash.",
    imageUrl: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800",
    images: [
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800"
    ],
    available: true,
    cuisineType: "French",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein"],
    calories: 720,
    protein: 58,
    carbs: 32,
    fat: 42,
    sugar: 4,
    ingredients: ["New Zealand Lamb", "Dijon Mustard", "Fresh Herbs", "Rosemary", "Root Vegetables"],
    tags: ["Premium", "French", "Elegant"],
  },
  {
    id: "sample-15",
    name: "Tiramisu",
    price: 11.99,
    description: "Traditional Italian dessert with espresso-soaked ladyfingers, mascarpone cream and cocoa powder.",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
    images: [
      "https://images.unsplash.com/photo-1534760177226-a6ca97c1d2f7?w=800",
      "https://images.unsplash.com/photo-1606312619070-d48b4ceb6b90?w=800"
    ],
    available: true,
    cuisineType: "Dessert",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 480,
    protein: 9,
    carbs: 52,
    fat: 28,
    sugar: 38,
    ingredients: ["Ladyfingers", "Espresso", "Mascarpone", "Eggs", "Sugar", "Cocoa Powder"],
    tags: ["Dessert", "Italian", "Coffee"],
  },
  {
    id: "sample-16",
    name: "Mediterranean Mezze Platter",
    price: 22.99,
    description: "Assorted mezze with hummus, baba ganoush, falafel, tabbouleh, olives and warm pita bread.",
    imageUrl: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=800",
    images: [
      "https://images.unsplash.com/photo-1593252719532-1e0b3e7e9c95?w=800",
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800"
    ],
    available: true,
    cuisineType: "Mediterranean",
    dietary: ["Vegan"],
    healthTags: ["High Fiber", "Heart Healthy"],
    calories: 580,
    protein: 22,
    carbs: 74,
    fat: 24,
    sugar: 6,
    ingredients: ["Chickpeas", "Eggplant", "Tahini", "Parsley", "Bulgur", "Olives", "Pita Bread"],
    tags: ["Mediterranean", "Sharing", "Vegan"],
  },
  {
    id: "sample-17",
    name: "New York Cheesecake",
    price: 10.99,
    description: "Classic creamy New York-style cheesecake with graham cracker crust and fresh berry compote.",
    imageUrl: "https://images.unsplash.com/photo-1533134242148-b4d2e8d4e99c?w=800",
    images: [
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800",
      "https://images.unsplash.com/photo-1567327684449-4c2f895e04b7?w=800"
    ],
    available: true,
    cuisineType: "Dessert",
    dietary: ["Vegetarian"],
    healthTags: [],
    calories: 540,
    protein: 10,
    carbs: 48,
    fat: 36,
    sugar: 42,
    ingredients: ["Cream Cheese", "Graham Crackers", "Butter", "Sugar", "Eggs", "Mixed Berries"],
    tags: ["Dessert", "Classic", "Creamy"],
  },
  {
    id: "sample-18",
    name: "Grilled Portobello Burger",
    price: 15.99,
    description: "Marinated portobello mushroom cap with roasted peppers, arugula, balsamic glaze on whole wheat bun.",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    images: [
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800",
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800"
    ],
    available: true,
    cuisineType: "American",
    dietary: ["Vegan"],
    healthTags: ["Low Fat", "High Fiber"],
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 12,
    sugar: 10,
    ingredients: ["Portobello Mushroom", "Whole Wheat Bun", "Roasted Peppers", "Arugula", "Balsamic Glaze"],
    tags: ["Vegan", "Burger", "Healthy"],
  },
  {
    id: "sample-19",
    name: "Açaí Superfood Bowl",
    price: 14.99,
    description: "Organic açaí blend topped with granola, fresh berries, sliced banana, chia seeds and honey drizzle.",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    images: [
      "https://images.unsplash.com/photo-1511067960412-0436d00bb75e?w=800",
      "https://images.unsplash.com/photo-1613509399-8fe4c8f01e37?w=800"
    ],
    available: true,
    cuisineType: "Healthy",
    dietary: ["Vegan", "Gluten-Free"],
    healthTags: ["High Fiber", "Heart Healthy"],
    calories: 380,
    protein: 8,
    carbs: 62,
    fat: 12,
    sugar: 32,
    ingredients: ["Açaí Berries", "Banana", "Granola", "Strawberries", "Blueberries", "Chia Seeds", "Honey"],
    tags: ["Healthy", "Breakfast", "Superfood"],
  },
  {
    id: "sample-20",
    name: "Miso-Glazed Cod",
    price: 28.99,
    description: "Black cod marinated in sweet miso glaze, served with jasmine rice, bok choy and sesame seeds.",
    imageUrl: "https://images.unsplash.com/photo-1580959375944-0d05b5639548?w=800",
    images: [
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800",
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800"
    ],
    available: true,
    cuisineType: "Asian",
    dietary: ["Gluten-Free"],
    healthTags: ["High Protein", "Heart Healthy"],
    calories: 460,
    protein: 42,
    carbs: 48,
    fat: 12,
    sugar: 8,
    ingredients: ["Black Cod", "Miso Paste", "Jasmine Rice", "Bok Choy", "Sesame Seeds", "Ginger"],
    tags: ["Asian", "Seafood", "Premium"],
  },
];

async function clearAndReseedMenu() {
  try {
    console.log("🔥 Clearing existing menu items...");
    
    // Get all existing menu items
    const menuRef = collection(db, "menu");
    const snapshot = await getDocs(menuRef);
    
    // Delete all existing items
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, "menu", docSnapshot.id))
    );
    await Promise.all(deletePromises);
    
    console.log(`✅ Deleted ${snapshot.size} existing items`);
    console.log("🌱 Seeding 20 premium dishes...");
    
    // Add new dishes
    for (const dish of sampleDishes) {
      await setDoc(doc(db, "menu", dish.id), dish);
    }
    
    console.log(`✅ Successfully added ${sampleDishes.length} premium dishes!`);
    console.log("🎉 Menu has been cleared and re-seeded with 20 dishes, each with 2-3 images!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing and reseeding menu:", error);
    process.exit(1);
  }
}

clearAndReseedMenu();
