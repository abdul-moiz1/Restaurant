import DishForm from "../DishForm";

export default function DishFormExample() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">New dish form:</p>
        <DishForm
          onSubmit={(dish) => console.log("New dish:", dish)}
          onCancel={() => console.log("Cancel clicked")}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Edit existing dish:</p>
        <DishForm
          dish={{
            id: "1",
            name: "Truffle Risotto",
            description: "Creamy arborio rice with wild mushrooms",
            price: 28.99,
            imageUrl: "https://example.com/risotto.jpg",
            tags: ["Italian", "Vegetarian"],
            available: true,
          }}
          onSubmit={(dish) => console.log("Updated dish:", dish)}
        />
      </div>
    </div>
  );
}
