import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PreferencesFormProps {
  preferences?: {
    vegan: boolean;
    halal: boolean;
    glutenFree: boolean;
    spiceLevel: number;
  };
  onSubmit: (preferences: any) => void;
}

export default function PreferencesForm({ preferences, onSubmit }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    vegan: preferences?.vegan || false,
    halal: preferences?.halal || false,
    glutenFree: preferences?.glutenFree || false,
    spiceLevel: preferences?.spiceLevel || 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Dietary Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="vegan"
                data-testid="checkbox-vegan"
                checked={formData.vegan}
                onCheckedChange={(checked) => setFormData({ ...formData, vegan: checked as boolean })}
              />
              <Label htmlFor="vegan" className="cursor-pointer">
                Vegan
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="halal"
                data-testid="checkbox-halal"
                checked={formData.halal}
                onCheckedChange={(checked) => setFormData({ ...formData, halal: checked as boolean })}
              />
              <Label htmlFor="halal" className="cursor-pointer">
                Halal
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="glutenFree"
                data-testid="checkbox-gluten-free"
                checked={formData.glutenFree}
                onCheckedChange={(checked) => setFormData({ ...formData, glutenFree: checked as boolean })}
              />
              <Label htmlFor="glutenFree" className="cursor-pointer">
                Gluten-Free
              </Label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="spiceLevel">Spice Level</Label>
              <span className="text-sm font-medium text-primary" data-testid="text-spice-level">
                {formData.spiceLevel}/5
              </span>
            </div>
            <Slider
              id="spiceLevel"
              data-testid="slider-spice-level"
              min={1}
              max={5}
              step={1}
              value={[formData.spiceLevel]}
              onValueChange={(value) => setFormData({ ...formData, spiceLevel: value[0] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Very Spicy</span>
            </div>
          </div>

          <Button type="submit" className="w-full" data-testid="button-save-preferences">
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
