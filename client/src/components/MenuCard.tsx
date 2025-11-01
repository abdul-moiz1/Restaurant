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
    <Card className="overflow-hidden hover:shadow-lg transition-all border" data-testid={`card-dish-${dish.id}`}>
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
          }}
        />
        {!dish.available && isOwner && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Hidden</Badge>
          </div>
        )}
        {dish.available && !isOwner && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-serif font-semibold" data-testid={`text-dish-name-${dish.id}`}>
            {dish.name}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap" data-testid={`text-price-${dish.id}`}>
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {dish.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      {isOwner && (
        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(dish.id)}
            data-testid={`button-edit-${dish.id}`}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(dish.id)}
            data-testid={`button-delete-${dish.id}`}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
