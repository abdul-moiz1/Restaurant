import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface DishFormProps {
  dish?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    tags: string[];
    available: boolean;
  };
  onSubmit: (dish: any) => void;
  onCancel?: () => void;
}

export default function DishForm({ dish, onSubmit, onCancel }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: dish?.name || "",
    description: dish?.description || "",
    price: dish?.price || 0,
    imageUrl: dish?.imageUrl || "",
    tags: dish?.tags?.join(", ") || "",
    available: dish?.available ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      price: Number(formData.price),
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">
          {dish?.id ? "Edit Dish" : "Add New Dish"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Dish Name *</Label>
            <Input
              id="name"
              data-testid="input-dish-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Truffle Risotto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              data-testid="input-dish-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the dish in detail..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              data-testid="input-dish-price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              data-testid="input-dish-image"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              data-testid="input-dish-tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Italian, Vegetarian, Gluten-Free"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="available">Available</Label>
              <Switch
                id="available"
                data-testid="switch-dish-available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" data-testid="button-submit-dish">
              {dish?.id ? "Update Dish" : "Add Dish"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
