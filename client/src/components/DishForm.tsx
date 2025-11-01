import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  isOpen: boolean;
  onSubmit: (dish: any) => void;
  onCancel: () => void;
}

export default function DishForm({ dish, isOpen, onSubmit, onCancel }: DishFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    tags: "",
    available: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: dish?.name || "",
        description: dish?.description || "",
        price: dish?.price || 0,
        imageUrl: dish?.imageUrl || "",
        tags: dish?.tags?.join(", ") || "",
        available: dish?.available ?? true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        tags: "",
        available: true,
      });
    }
  }, [isOpen, dish?.id, dish?.name, dish?.description, dish?.price, dish?.imageUrl, dish?.tags, dish?.available]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      price: Number(formData.price),
    });
    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      tags: "",
      available: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {dish?.id ? "Edit Dish" : "Add New Dish"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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

          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-end">
              <div className="flex items-center gap-3 h-10">
                <Label htmlFor="available">Available</Label>
                <Switch
                  id="available"
                  data-testid="switch-dish-available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
              </div>
            </div>
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
            {formData.imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden border-2 border-primary/20">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              data-testid="input-dish-tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Vegan, Spicy, Italian"
            />
            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags.split(",").map((tag, index) => (
                  tag.trim() && (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#c9a348', color: '#fff' }}
                    >
                      {tag.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" data-testid="button-submit-dish">
              {dish?.id ? "Update Dish" : "Add Dish"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
