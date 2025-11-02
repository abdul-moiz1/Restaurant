import { z } from "zod";

// Firebase User Schema
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.enum(["customer", "owner"]),
  createdAt: z.any(), // Firebase Timestamp
});

export type User = z.infer<typeof userSchema>;

// Dish Schema
export const dishSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string(),
  images: z.array(z.string()).optional(),
  available: z.boolean(),
  cuisineType: z.string().optional(),
  dietary: z.array(z.string()).optional(),
  healthTags: z.array(z.string()).optional(),
  calories: z.number().optional(),
  sugar: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  ingredients: z.array(z.string()).optional(),
  ownerId: z.string().optional(),
});

export type Dish = z.infer<typeof dishSchema>;

// Insert Schemas (for forms)
export const insertDishSchema = dishSchema.omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["customer", "owner"]),
});

export type SignupData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Preferences Schema
export const preferencesSchema = z.object({
  healthFilters: z.array(z.string()).optional(),
  dietaryFilters: z.array(z.string()).optional(),
  calorieRange: z.array(z.number()).optional(),
});

export type Preferences = z.infer<typeof preferencesSchema>;
