import { z } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

// Authentication schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Property schema
export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().url("Image must be a valid URL").or(z.string().length(0)),
  city: z.string().min(2, "City must be at least 2 characters long"),
  bedrooms: z.number().int().nonnegative("Bedrooms must be a non-negative integer"),
  bathrooms: z.number().int().nonnegative("Bathrooms must be a non-negative integer"),
  parkings: z.number().int().nonnegative("Parkings must be a non-negative integer"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
