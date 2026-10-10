import { z } from "zod";

export const DomainSchema = z.string().url("Invalid domain URL").refine((url) => url.startsWith("https://"), {
  message: "Only HTTPS domains are allowed",
});

export const ServiceRequestSchema = z.object({
  domen: DomainSchema,
});

export const ProductUpdateSchema = z.object({
  domen: DomainSchema,
  productId: z.string().min(1, "Product ID is required"),
  updates: z.record(z.string(), z.any()),
});

export const NewProductSchema = z.object({
  domen: DomainSchema,
  name: z.string().min(1, "Name is required"),
  price: z.union([z.string(), z.number()]).transform((val) => String(val)),
  category: z.string().optional(),
  attributes: z.array(z.any()).optional(),
});

export const ImageUploadSchema = z.object({
  domen: DomainSchema,
  productId: z.string().min(1, "Product ID is required"),
  fileName: z.string().optional(),
});
