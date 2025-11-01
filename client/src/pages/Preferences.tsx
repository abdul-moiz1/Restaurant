import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import toast from "react-hot-toast";

const allergenOptions = [
  "Gluten",
  "Dairy",
  "Nuts",
  "Shellfish",
  "Eggs",
  "Soy",
  "Fish",
];

export default function Preferences() {
  const [dietaryType, setDietaryType] = useState("all");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState([2]);

  const toggleAllergen = (allergen: string) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "preferences",
      JSON.stringify({ dietaryType, allergens, spiceLevel: spiceLevel[0] })
    );
    toast.success("Preferences saved successfully!");
  };

  const handleClearPreferences = () => {
    setDietaryType("all");
    setAllergens([]);
    setSpiceLevel([2]);
    localStorage.removeItem("preferences");
    toast.success("Preferences cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4" data-testid="text-preferences-title">
            Dining Preferences
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize your menu based on your dietary needs and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Preferences</CardTitle>
            <CardDescription>
              Filter the menu to show dishes that match your dietary requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="dietary-type">Dietary Type</Label>
              <Select value={dietaryType} onValueChange={setDietaryType}>
                <SelectTrigger id="dietary-type" data-testid="select-dietary-type">
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">No Restriction</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Allergens to Avoid</Label>
              <div className="grid grid-cols-2 gap-4">
                {allergenOptions.map((allergen) => (
                  <div key={allergen} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergen}
                      checked={allergens.includes(allergen)}
                      onCheckedChange={() => toggleAllergen(allergen)}
                      data-testid={`checkbox-allergen-${allergen.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={allergen}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {allergen}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Spice Level Tolerance</Label>
                <span className="text-sm font-medium" data-testid="text-spice-level">
                  Level {spiceLevel[0]} / 5
                </span>
              </div>
              <Slider
                value={spiceLevel}
                onValueChange={setSpiceLevel}
                max={5}
                min={0}
                step={1}
                className="w-full"
                data-testid="slider-spice-level"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Hot</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSavePreferences}
                className="flex-1"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
              <Button
                variant="outline"
                onClick={handleClearPreferences}
                data-testid="button-clear-preferences"
              >
                Clear
              </Button>
            </div>

            <div className="pt-4 text-center">
              <Link href="/menu">
                <Button variant="ghost" data-testid="link-view-menu">
                  View Menu with Preferences →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
