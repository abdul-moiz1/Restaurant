import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface MenuCardProps {
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    tags: string[];
    available: boolean;
  };
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function MenuCard({ dish, isOwner, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`card-dish-${dish.id}`}>
      <div className="relative h-56 overflow-hidden">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        {!dish.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">
              Unavailable
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-serif font-semibold mb-2" data-testid={`text-dish-name-${dish.id}`}>
          {dish.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {dish.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-2xl font-bold text-primary" data-testid={`text-price-${dish.id}`}>
          ${dish.price.toFixed(2)}
        </div>
      </CardContent>
      {isOwner && (
        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(dish.id)}
            data-testid={`button-edit-${dish.id}`}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(dish.id)}
            data-testid={`button-delete-${dish.id}`}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
