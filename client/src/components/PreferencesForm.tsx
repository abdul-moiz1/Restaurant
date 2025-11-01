import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreferencesFormProps {
  preferences?: {
    diet?: string;
    vegetarian: boolean;
    excludeGluten: boolean;
    excludeNuts: boolean;
    excludeDairy: boolean;
    spiceLevel: number;
  };
  onSubmit: (preferences: any) => void;
}

export default function PreferencesForm({ preferences, onSubmit }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    diet: preferences?.diet || "none",
    vegetarian: preferences?.vegetarian || false,
    excludeGluten: preferences?.excludeGluten || false,
    excludeNuts: preferences?.excludeNuts || false,
    excludeDairy: preferences?.excludeDairy || false,
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
            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Select
                value={formData.diet}
                onValueChange={(value) => setFormData({ ...formData, diet: value })}
              >
                <SelectTrigger id="diet" data-testid="select-diet">
                  <SelectValue placeholder="Select diet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="halal">Halal</SelectItem>
                  <SelectItem value="kosher">Kosher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="vegetarian" className="cursor-pointer">
                Vegetarian (quick toggle)
              </Label>
              <Switch
                id="vegetarian"
                data-testid="switch-vegetarian"
                checked={formData.vegetarian}
                onCheckedChange={(checked) => setFormData({ ...formData, vegetarian: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Allergens to exclude</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="excludeGluten"
                  data-testid="checkbox-exclude-gluten"
                  checked={formData.excludeGluten}
                  onCheckedChange={(checked) => setFormData({ ...formData, excludeGluten: checked as boolean })}
                />
                <Label htmlFor="excludeGluten" className="cursor-pointer">
                  Gluten
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="excludeNuts"
                  data-testid="checkbox-exclude-nuts"
                  checked={formData.excludeNuts}
                  onCheckedChange={(checked) => setFormData({ ...formData, excludeNuts: checked as boolean })}
                />
                <Label htmlFor="excludeNuts" className="cursor-pointer">
                  Nuts
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="excludeDairy"
                  data-testid="checkbox-exclude-dairy"
                  checked={formData.excludeDairy}
                  onCheckedChange={(checked) => setFormData({ ...formData, excludeDairy: checked as boolean })}
                />
                <Label htmlFor="excludeDairy" className="cursor-pointer">
                  Dairy
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="spiceLevel">Maximum spice level</Label>
            <Slider
              id="spiceLevel"
              data-testid="slider-spice-level"
              min={1}
              max={3}
              step={1}
              value={[formData.spiceLevel]}
              onValueChange={(value) => setFormData({ ...formData, spiceLevel: value[0] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Medium</span>
              <span>Hot</span>
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
