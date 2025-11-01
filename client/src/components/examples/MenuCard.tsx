import MenuCard from "../MenuCard";

export default function MenuCardExample() {
  const sampleDish = {
    id: "1",
    name: "Truffle Risotto",
    description: "Creamy arborio rice with wild mushrooms and black truffle oil",
    price: 28.99,
    imageUrl: "https://images.unsplash.com/photo-1476124369491-c2f2e6a82d31?w=800",
    tags: ["Italian", "Vegetarian", "Gluten-Free"],
    available: true,
  };

  const unavailableDish = {
    ...sampleDish,
    id: "2",
    name: "Seasonal Special",
    available: false,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <MenuCard
        dish={sampleDish}
        onEdit={(id) => console.log("Edit dish:", id)}
        onDelete={(id) => console.log("Delete dish:", id)}
      />
      <MenuCard
        dish={sampleDish}
        isOwner={true}
        onEdit={(id) => console.log("Edit dish:", id)}
        onDelete={(id) => console.log("Delete dish:", id)}
      />
    </div>
  );
}
