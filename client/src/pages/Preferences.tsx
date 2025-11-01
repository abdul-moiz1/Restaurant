import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import toast from "react-hot-toast";

const healthOptions = [
  "Low Sugar",
  "High Protein",
  "Low Carb",
  "Low Sodium",
  "Heart Healthy",
  "High Fiber",
  "Diabetic Friendly",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "Gluten-Free",
];

export default function Preferences() {
  const [healthFilters, setHealthFilters] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [calorieRange, setCalorieRange] = useState([100, 1000]);

  const toggleHealth = (health: string) => {
    setHealthFilters((prev) =>
      prev.includes(health)
        ? prev.filter((h) => h !== health)
        : [...prev, health]
    );
  };

  const toggleDietary = (dietary: string) => {
    setDietaryFilters((prev) =>
      prev.includes(dietary)
        ? prev.filter((d) => d !== dietary)
        : [...prev, dietary]
    );
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "preferences",
      JSON.stringify({ healthFilters, dietaryFilters, calorieRange })
    );
    toast.success("Health preferences saved successfully!");
  };

  const handleClearPreferences = () => {
    setHealthFilters([]);
    setDietaryFilters([]);
    setCalorieRange([100, 1000]);
    localStorage.removeItem("preferences");
    toast.success("Preferences cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4" data-testid="text-preferences-title">
            Health & Nutrition Preferences
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize your menu based on your health and dietary needs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Set Your Preferences</CardTitle>
            <CardDescription>
              Filter the menu to show dishes that match your health and dietary requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-serif font-bold text-[#D4AF37]">Health & Nutrition Filters</Label>
              <div className="grid grid-cols-2 gap-4">
                {healthOptions.map((health) => (
                  <div key={health} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pref-health-${health}`}
                      checked={healthFilters.includes(health)}
                      onCheckedChange={() => toggleHealth(health)}
                      data-testid={`checkbox-health-${health.toLowerCase().replace(/\s+/g, '-')}`}
                      className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                    />
                    <Label
                      htmlFor={`pref-health-${health}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {health}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Dietary Filters</Label>
              <div className="grid grid-cols-2 gap-4">
                {dietaryOptions.map((dietary) => (
                  <div key={dietary} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pref-dietary-${dietary}`}
                      checked={dietaryFilters.includes(dietary)}
                      onCheckedChange={() => toggleDietary(dietary)}
                      data-testid={`checkbox-dietary-${dietary.toLowerCase()}`}
                      className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                    />
                    <Label
                      htmlFor={`pref-dietary-${dietary}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {dietary}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Calorie Range per Dish</Label>
                <span className="text-sm font-medium text-[#D4AF37]" data-testid="text-calorie-range">
                  {calorieRange[0]} - {calorieRange[1] >= 1000 ? '1000+' : calorieRange[1]} kcal
                </span>
              </div>
              <Slider
                value={calorieRange}
                onValueChange={setCalorieRange}
                max={1000}
                min={100}
                step={50}
                className="w-full [&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37]"
                data-testid="slider-calorie-range"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 kcal</span>
                <span>1000+ kcal</span>
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
