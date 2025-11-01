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
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 group" 
      data-testid={`card-dish-${dish.id}`}
    >
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
          }}
        />
        {!dish.available && isOwner && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white border-0">Unavailable</Badge>
          </div>
        )}
        {dish.available && isOwner && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white border-0">Available</Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-serif font-bold text-foreground" data-testid={`text-dish-name-${dish.id}`}>
            {dish.name}
          </h3>
          <span 
            className="text-xl font-bold whitespace-nowrap" 
            style={{ color: '#c9a348' }}
            data-testid={`text-price-${dish.id}`}
          >
            ${dish.price.toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {dish.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded-full text-xs font-medium shadow-sm"
              style={{ backgroundColor: '#c9a348', color: '#fff' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      {isOwner && (
        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(dish.id)}
            data-testid={`button-edit-${dish.id}`}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(dish.id)}
            data-testid={`button-delete-${dish.id}`}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
