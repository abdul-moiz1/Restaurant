import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DishFormProps {
  dish?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    images?: string[];
    tags?: string[];
    available: boolean;
    cuisineType?: string;
    dietary?: string[];
    healthTags?: string[];
    calories?: number;
    sugar?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    ingredients?: string[];
  };
  isOpen: boolean;
  onSubmit: (dish: any) => void;
  onCancel: () => void;
}

export default function DishForm({ dish, isOpen, onSubmit, onCancel }: DishFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    images: "",
    tags: "",
    available: true,
    cuisineType: "",
    dietary: [] as string[],
    healthTags: [] as string[],
    calories: undefined as number | undefined,
    sugar: undefined as number | undefined,
    protein: undefined as number | undefined,
    carbs: undefined as number | undefined,
    fat: undefined as number | undefined,
    ingredients: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: dish?.name || "",
        description: dish?.description || "",
        price: dish?.price || 0,
        imageUrl: dish?.imageUrl || "",
        images: dish?.images?.join(", ") || "",
        tags: dish?.tags?.join(", ") || "",
        available: dish?.available ?? true,
        cuisineType: dish?.cuisineType || "",
        dietary: dish?.dietary || [],
        healthTags: dish?.healthTags || [],
        calories: dish?.calories,
        sugar: dish?.sugar,
        protein: dish?.protein,
        carbs: dish?.carbs,
        fat: dish?.fat,
        ingredients: dish?.ingredients?.join(", ") || "",
      });
      setSelectedFile(null);
      setUploadProgress(0);
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        images: "",
        tags: "",
        available: true,
        cuisineType: "",
        dietary: [],
        healthTags: [],
        calories: undefined,
        sugar: undefined,
        protein: undefined,
        carbs: undefined,
        fat: undefined,
        ingredients: "",
      });
      setSelectedFile(null);
      setUploadProgress(0);
    }
  }, [isOpen, dish?.id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.imageUrl;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const fileName = `dishes/${timestamp}_${selectedFile.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            setUploading(false);
            toast({
              title: "Upload failed",
              description: "Failed to upload image. Please try again.",
              variant: "destructive",
            });
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (selectedFile) {
        finalImageUrl = await uploadImage();
      }

      if (!finalImageUrl) {
        toast({
          title: "Image required",
          description: "Please upload an image or provide an image URL",
          variant: "destructive",
        });
        return;
      }

      const dishData: any = {
        name: formData.name,
        description: formData.description,
        imageUrl: finalImageUrl,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        price: Number(formData.price),
        available: formData.available,
        dietary: formData.dietary,
        healthTags: formData.healthTags,
      };
      
      if (formData.cuisineType) {
        dishData.cuisineType = formData.cuisineType;
      }
      
      if (formData.images) {
        dishData.images = formData.images.split(",").map((img) => img.trim()).filter(Boolean);
      }
      
      if (formData.ingredients) {
        dishData.ingredients = formData.ingredients.split(",").map((ing) => ing.trim()).filter(Boolean);
      }
      
      if (formData.calories !== undefined && formData.calories !== null && !isNaN(formData.calories)) {
        dishData.calories = Number(formData.calories);
      }
      
      if (formData.protein !== undefined && formData.protein !== null && !isNaN(formData.protein)) {
        dishData.protein = Number(formData.protein);
      }
      
      if (formData.carbs !== undefined && formData.carbs !== null && !isNaN(formData.carbs)) {
        dishData.carbs = Number(formData.carbs);
      }
      
      if (formData.fat !== undefined && formData.fat !== null && !isNaN(formData.fat)) {
        dishData.fat = Number(formData.fat);
      }
      
      if (formData.sugar !== undefined && formData.sugar !== null && !isNaN(formData.sugar)) {
        dishData.sugar = Number(formData.sugar);
      }
      
      onSubmit(dishData);
      
      setFormData({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        images: "",
        tags: "",
        cuisineType: "",
        dietary: [],
        healthTags: [],
        calories: undefined,
        sugar: undefined,
        protein: undefined,
        carbs: undefined,
        fat: undefined,
        ingredients: "",
        available: true,
      });
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {dish?.id ? "Edit Dish" : "Add New Dish"}
          </DialogTitle>
          <DialogDescription>
            {dish?.id ? "Update the details of your menu item" : "Add a new dish to your restaurant menu"}
          </DialogDescription>
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
            <Label>Dish Image *</Label>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Use URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <>
                          <Loader2 className="w-10 h-10 mb-3 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            Uploading... {Math.round(uploadProgress)}%
                          </p>
                        </>
                      ) : selectedFile ? (
                        <>
                          <Upload className="w-10 h-10 mb-3 text-primary" />
                          <p className="mb-2 text-sm text-foreground">
                            <span className="font-semibold">{selectedFile.name}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </label>
                </div>
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
              </TabsContent>
              
              <TabsContent value="url" className="space-y-3">
                <Input
                  id="imageUrl"
                  type="url"
                  data-testid="input-dish-image"
                  value={selectedFile ? "" : formData.imageUrl}
                  onChange={(e) => {
                    setSelectedFile(null);
                    setFormData({ ...formData, imageUrl: e.target.value });
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && !selectedFile && (
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
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Select value={formData.cuisineType} onValueChange={(value) => setFormData({ ...formData, cuisineType: value })}>
                <SelectTrigger data-testid="select-cuisine-type">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="American">American</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Vegan', 'Keto', 'Gluten-Free', 'Vegetarian'].map((dietary) => (
                  <div key={dietary} className="flex items-center gap-2">
                    <Checkbox
                      id={`dietary-${dietary}`}
                      checked={formData.dietary.includes(dietary)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, dietary: [...formData.dietary, dietary] });
                        } else {
                          setFormData({ ...formData, dietary: formData.dietary.filter(d => d !== dietary) });
                        }
                      }}
                      data-testid={`checkbox-dietary-${dietary.toLowerCase()}`}
                    />
                    <Label htmlFor={`dietary-${dietary}`} className="cursor-pointer text-sm">
                      {dietary}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Health Tags</Label>
            <div className="grid grid-cols-2 gap-2">
              {['High Protein', 'Heart Healthy', 'Low Carb', 'Low Sugar', 'Low Fat', 'High Fiber'].map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox
                    id={`health-${tag}`}
                    checked={formData.healthTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({ ...formData, healthTags: [...formData.healthTags, tag] });
                      } else {
                        setFormData({ ...formData, healthTags: formData.healthTags.filter(t => t !== tag) });
                      }
                    }}
                    data-testid={`checkbox-health-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={`health-${tag}`} className="cursor-pointer text-sm">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
            <Textarea
              id="ingredients"
              data-testid="input-dish-ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="e.g., Salmon, Miso Paste, Rice, Bok Choy"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Nutrition Information (per serving)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  data-testid="input-dish-calories"
                  value={formData.calories ?? ""}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  data-testid="input-dish-protein"
                  value={formData.protein ?? ""}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  data-testid="input-dish-carbs"
                  value={formData.carbs ?? ""}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  data-testid="input-dish-fat"
                  value={formData.fat ?? ""}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  type="number"
                  data-testid="input-dish-sugar"
                  value={formData.sugar ?? ""}
                  onChange={(e) => setFormData({ ...formData, sugar: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              data-testid="input-dish-tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Spicy, Popular, Chef's Special, Premium"
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
            <p className="text-xs text-muted-foreground">
              Add "Premium" to mark this dish as a premium item
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Additional Images (comma-separated URLs)</Label>
            <Textarea
              id="images"
              data-testid="input-dish-images"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              data-testid="button-submit-dish"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                dish?.id ? "Update Dish" : "Add Dish"
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              data-testid="button-cancel"
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
