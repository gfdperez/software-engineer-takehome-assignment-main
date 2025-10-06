import { z } from 'zod'

// Product creation schema
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  price: z.number('Price is required').positive('Price must be a positive number'),
  barcode: z.string().optional(),
})

// Product update schema (all fields optional except id)
export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Product name is required').optional(),
  sku: z.string().min(1, 'SKU is required').optional(), 
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  barcode: z.string().optional(),
})

// Product query schemas
export const getProductByIdSchema = z.object({ 
  id: z.string() 
})

export const getProductsSchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().optional(),
})

// TypeScript types from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>
export type GetProductsInput = z.infer<typeof getProductsSchema>