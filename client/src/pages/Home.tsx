import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/MenuCard";
import heroImage from "@assets/generated_images/Restaurant_hero_background_image_62e3db83.png";
import pastaImage from "@assets/generated_images/Gourmet_pasta_dish_photo_bdc1e780.png";
import salmonImage from "@assets/generated_images/Grilled_salmon_dish_photo_e47f8711.png";
import pizzaImage from "@assets/generated_images/Artisan_pizza_photo_79500d48.png";
import burgerImage from "@assets/generated_images/Gourmet_burger_photo_b4cbe826.png";
import dessertImage from "@assets/generated_images/Chocolate_dessert_photo_be94ea81.png";
import saladImage from "@assets/generated_images/Fresh_salad_photo_0fb29148.png";

export default function Home() {
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

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6">
            Elevate Your Dining Experience
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90">
            Discover exquisite culinary creations crafted by expert chefs
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <a>
                <Button
                  size="lg"
                  className="backdrop-blur-md bg-primary/90 hover:bg-primary"
                  data-testid="button-hero-signup"
                >
                  Get Started
                </Button>
              </a>
            </Link>
            <Link href="#menu">
              <a>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-md bg-white/10 border-white text-white hover:bg-white/20"
                  data-testid="button-hero-menu"
                >
                  Browse Menu
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Our Menu</h2>
            <p className="text-lg text-muted-foreground">
              Savor our carefully curated selection of gourmet dishes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((dish) => (
              <MenuCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Gourmet Haven today and experience the finest in dining
          </p>
          <Link href="/signup">
            <a>
              <Button size="lg" data-testid="button-footer-signup">
                Sign Up Now
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
